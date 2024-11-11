# infrastructure/terraform/environments/prod/variables.tf

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "expense-split-app"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
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
  default     = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
}

# Database Variables
variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "expense_split_prod"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "admin"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.small"
}

# ECS Variables
variable "frontend_container_port" {
  description = "Port number for frontend container"
  type        = number
  default     = 3000
}

variable "backend_container_port" {
  description = "Port number for backend container"
  type        = number
  default     = 9000
}

variable "frontend_instance_count" {
  description = "Number of frontend instances"
  type        = number
  default     = 2
}

variable "backend_instance_count" {
  description = "Number of backend instances"
  type        = number
  default     = 2
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
}