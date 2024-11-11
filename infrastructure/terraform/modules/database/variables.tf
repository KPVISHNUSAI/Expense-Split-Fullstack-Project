# infrastructure/terraform/modules/database/variables.tf

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., development, production)"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group ID for RDS"
  type        = string
}

variable "redis_security_group_id" {
  description = "Security group ID for Redis"
  type        = string
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "expense_split"
}

variable "db_username" {
  description = "Master username for the database"
  type        = string
  default     = "dbadmin"
}

variable "postgres_version" {
  description = "Version of PostgreSQL to use"
  type        = string
  default     = "13.7"
}

variable "backup_retention_days" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "alarm_sns_topic_arns" {
  description = "List of SNS topic ARNs for CloudWatch alarms"
  type        = list(string)
  default     = []
}

variable "enable_performance_insights" {
  description = "Enable Performance Insights"
  type        = bool
  default     = true
}