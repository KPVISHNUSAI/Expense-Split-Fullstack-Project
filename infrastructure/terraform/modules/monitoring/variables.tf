# infrastructure/terraform/modules/monitoring/variables.tf

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., development, production)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 30
}

variable "alert_email_addresses" {
  description = "List of email addresses to receive alerts"
  type        = list(string)
  default     = []
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

variable "error_threshold" {
  description = "Threshold for error log alerts"
  type        = number
  default     = 10
}

variable "enable_xray" {
  description = "Enable X-Ray tracing"
  type        = bool
  default     = true
}

variable "enable_container_insights" {
  description = "Enable Container Insights for ECS"
  type        = bool
  default     = true
}

variable "alarm_evaluation_periods" {
  description = "Number of periods to evaluate for alarms"
  type        = number
  default     = 2
}

variable "alarm_period_seconds" {
  description = "Period in seconds for alarm evaluation"
  type        = number
  default     = 300
}