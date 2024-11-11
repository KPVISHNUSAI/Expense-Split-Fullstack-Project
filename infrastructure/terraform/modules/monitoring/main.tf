# infrastructure/terraform/modules/monitoring/main.tf

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/aws/ecs/${var.project_name}-${var.environment}/frontend"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project_name}-frontend-logs"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_log_group" "backend" {
  name              = "/aws/ecs/${var.project_name}-${var.environment}/backend"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project_name}-backend-logs"
    Environment = var.environment
  }
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", "${var.project_name}-${var.environment}-frontend"],
            [".", ".", ".", "${var.project_name}-${var.environment}-backend"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          period  = 300
          title   = "ECS CPU Utilization"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6

        properties = {
          metrics = [
            ["AWS/ECS", "MemoryUtilization", "ServiceName", "${var.project_name}-${var.environment}-frontend"],
            [".", ".", ".", "${var.project_name}-${var.environment}-backend"]
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          period  = 300
          title   = "ECS Memory Utilization"
        }
      }
    ]
  })
}

# SNS Topic for Alerts
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-${var.environment}-alerts"

  tags = {
    Name        = "${var.project_name}-alerts"
    Environment = var.environment
  }
}

resource "aws_sns_topic_subscription" "alerts_email" {
  count     = length(var.alert_email_addresses)
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email_addresses[count.index]
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "ecs_cpu_high" {
  alarm_name          = "${var.project_name}-${var.environment}-ecs-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "ECS CPU utilization is too high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = "${var.project_name}-${var.environment}"
  }

  tags = {
    Name        = "${var.project_name}-ecs-cpu-alarm"
    Environment = var.environment
  }
}

resource "aws_cloudwatch_metric_alarm" "ecs_memory_high" {
  alarm_name          = "${var.project_name}-${var.environment}-ecs-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "ECS Memory utilization is too high"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = "${var.project_name}-${var.environment}"
  }

  tags = {
    Name        = "${var.project_name}-ecs-memory-alarm"
    Environment = var.environment
  }
}

# X-Ray Configuration
resource "aws_xray_sampling_rule" "main" {
  rule_name      = "${var.project_name}-${var.environment}"
  priority       = 1000
  version        = 1
  reservoir_size = 1
  fixed_rate     = 0.05
  host           = "*"
  http_method    = "*"
  service_name   = "*"
  service_type   = "*"
  url_path       = "*"
  resource_arn   = "*"

  tags = {
    Name        = "${var.project_name}-sampling-rule"
    Environment = var.environment
  }
}

resource "aws_xray_encryption_config" "main" {
  type = "NONE"
}

resource "aws_xray_group" "main" {
  group_name        = "${var.project_name}-${var.environment}"
  filter_expression = "service(\"${var.project_name}\")"

  tags = {
    Name        = "${var.project_name}-xray-group"
    Environment = var.environment
  }
}

# IAM Role for X-Ray
resource "aws_iam_role" "xray" {
  name = "${var.project_name}-${var.environment}-xray-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "xray.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-xray-role"
    Environment = var.environment
  }
}

# X-Ray Policy
resource "aws_iam_role_policy" "xray" {
  name = "${var.project_name}-${var.environment}-xray-policy"
  role = aws_iam_role.xray.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords",
          "xray:GetSamplingRules",
          "xray:GetSamplingTargets",
          "xray:GetSamplingStatisticSummaries"
        ]
        Resource = "*"
      }
    ]
  })
}

# Metric Filters
resource "aws_cloudwatch_log_metric_filter" "error_logs" {
  name           = "${var.project_name}-${var.environment}-error-logs"
  pattern        = "ERROR"
  log_group_name = aws_cloudwatch_log_group.backend.name

  metric_transformation {
    name      = "ErrorCount"
    namespace = "${var.project_name}/${var.environment}"
    value     = "1"
  }
}

# Alarm for Error Logs
resource "aws_cloudwatch_metric_alarm" "error_logs" {
  alarm_name          = "${var.project_name}-${var.environment}-error-logs"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "ErrorCount"
  namespace           = "${var.project_name}/${var.environment}"
  period              = "300"
  statistic           = "Sum"
  threshold           = var.error_threshold
  alarm_description   = "Error logs threshold exceeded"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  tags = {
    Name        = "${var.project_name}-error-logs-alarm"
    Environment = var.environment
  }
}