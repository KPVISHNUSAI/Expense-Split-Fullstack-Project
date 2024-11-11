# infrastructure/terraform/modules/monitoring/outputs.tf

output "frontend_log_group_name" {
  description = "Name of the frontend CloudWatch log group"
  value       = aws_cloudwatch_log_group.frontend.name
}

output "backend_log_group_name" {
  description = "Name of the backend CloudWatch log group"
  value       = aws_cloudwatch_log_group.backend.name
}

output "dashboard_name" {
  description = "Name of the CloudWatch dashboard"
  value       = aws_cloudwatch_dashboard.main.dashboard_name
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "metric_filter_name" {
  description = "Name of the error logs metric filter"
  value       = aws_cloudwatch_log_metric_filter.error_logs.name
}

output "xray_sampling_rule_name" {
  description = "Name of the X-Ray sampling rule"
  value       = aws_xray_sampling_rule.main.rule_name
}

output "alarm_arns" {
  description = "Map of alarm ARNs"
  value = {
    cpu_high    = aws_cloudwatch_metric_alarm.ecs_cpu_high.arn
    memory_high = aws_cloudwatch_metric_alarm.ecs_memory_high.arn
    error_logs  = aws_cloudwatch_metric_alarm.error_logs.arn
  }
}

output "xray_sampling_rule_arn" {
  description = "ARN of the X-Ray sampling rule"
  value       = aws_xray_sampling_rule.main.arn
}

output "xray_group_arn" {
  description = "ARN of the X-Ray group"
  value       = aws_xray_group.main.arn
}

output "xray_role_arn" {
  description = "ARN of the X-Ray IAM role"
  value       = aws_iam_role.xray.arn
}