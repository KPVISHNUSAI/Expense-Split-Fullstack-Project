# infrastructure/terraform/environments/dev/variables.tf

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "expense-split-app"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "development"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "expense_split_dev"
}

variable "db_username" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "ecr_repository_url_frontend" {
  description = "URL of the frontend ECR repository"
  type        = string
}

variable "ecr_repository_url_backend" {
  description = "URL of the backend ECR repository"
  type        = string
}

variable "alert_email_addresses" {
  description = "List of email addresses for alerts"
  type        = list(string)
  default     = []
}