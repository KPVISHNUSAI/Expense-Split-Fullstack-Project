# infrastructure/terraform/modules/load_balancer/main.tf

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [var.alb_security_group_id]
  subnets           = var.public_subnet_ids
  idle_timeout      = var.idle_timeout

  enable_deletion_protection = var.environment == "production"

  access_logs {
    bucket  = aws_s3_bucket.logs.id
    prefix  = "alb-logs"
    enabled = true
  }

  tags = {
    Name        = "${var.project_name}-alb"
    Environment = var.environment
  }
}

# S3 Bucket for ALB logs
resource "aws_s3_bucket" "logs" {
  bucket = "${var.project_name}-${var.environment}-alb-logs"

  tags = {
    Name        = "${var.project_name}-alb-logs"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_policy" "logs" {
  bucket = aws_s3_bucket.logs.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_elb_service_account.main.id}:root"
        }
        Action = "s3:PutObject"
        Resource = "${aws_s3_bucket.logs.arn}/*"
      }
    ]
  })
}

# Frontend Target Group
resource "aws_lb_target_group" "frontend" {
  name        = "${var.project_name}-frontend-tg"
  port        = var.frontend_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 3
    interval            = 30
    matcher            = "200"
    path               = var.frontend_health_check_path
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 3
  }

  tags = {
    Name        = "${var.project_name}-frontend-tg"
    Environment = var.environment
  }
}

# Backend Target Group
resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-backend-tg"
  port        = var.backend_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 3
    interval            = 30
    matcher            = "200"
    path               = var.backend_health_check_path
    port               = "traffic-port"
    protocol           = "HTTP"
    timeout            = 5
    unhealthy_threshold = 3
  }

  tags = {
    Name        = "${var.project_name}-backend-tg"
    Environment = var.environment
  }
}

# HTTPS Listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = var.certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Invalid request"
      status_code  = "400"
    }
  }
}

# HTTP to HTTPS Redirect
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Frontend Listener Rule
resource "aws_lb_listener_rule" "frontend" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }

  condition {
    host_header {
      values = [var.frontend_domain]
    }
  }
}

# Backend Listener Rule
resource "aws_lb_listener_rule" "backend" {
  listener_arn = aws_lb_listener.https.arn
  priority     = 200

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    host_header {
      values = [var.backend_domain]
    }
  }
}

# Get the AWS ELB service account ID for S3 bucket policy
data "aws_elb_service_account" "main" {}