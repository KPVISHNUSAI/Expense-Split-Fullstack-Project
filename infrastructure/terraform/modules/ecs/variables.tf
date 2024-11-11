# infrastructure/terraform/modules/ecs/variables.tf

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

variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
}

variable "ecs_security_group_id" {
  description = "Security group ID for ECS tasks"
  type        = string
}

variable "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  type        = string
}

variable "backend_target_group_arn" {
  description = "ARN of the backend target group"
  type        = string
}

variable "ecr_repository_url_frontend" {
  description = "URL of the frontend ECR repository"
  type        = string
}

variable "ecr_repository_url_backend" {
  description = "URL of the backend ECR repository"
  type        = string
}

variable "database_secret_arn" {
  description = "ARN of the database credentials secret"
  type        = string
}

variable "api_domain" {
  description = "Domain name for the API"
  type        = string
}

# Task Configuration Variables
variable "frontend_cpu" {
  description = "CPU units for frontend task"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory for frontend task"
  type        = number
  default     = 512
}

variable "backend_cpu" {
  description = "CPU units for backend task"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Memory for backend task"
  type        = number
  default     = 1024
}

# Service Configuration Variables
variable "frontend_desired_count" {
  description = "Desired count of frontend tasks"
  type        = number
  default     = 2
}

variable "backend_desired_count" {
  description = "Desired count of backend tasks"
  type        = number
  default     = 2
}

variable "frontend_container_port" {
  description = "Container port for frontend"
  type        = number
  default     = 3000
}

variable "backend_container_port" {
  description = "Container port for backend"
  type        = number
  default     = 9000
}

# Auto Scaling Configuration
variable "frontend_min_count" {
  description = "Minimum number of frontend tasks"
  type        = number
  default     = 1
}

variable "frontend_max_count" {
  description = "Maximum number of frontend tasks"
  type        = number
  default     = 4
}

variable "backend_min_count" {
  description = "Minimum number of backend tasks"
  type        = number
  default     = 1
}

variable "backend_max_count" {
  description = "Maximum number of backend tasks"
  type        = number
  default     = 4
}