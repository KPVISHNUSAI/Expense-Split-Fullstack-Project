# infrastructure/terraform/modules/load_balancer/variables.tf

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., development, production)"
  type        = string
}

variable "vpc_id" {
  description = "ID of the VPC"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID for the ALB"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate"
  type        = string
}

variable "frontend_domain" {
  description = "Domain name for frontend application"
  type        = string
}

variable "backend_domain" {
  description = "Domain name for backend API"
  type        = string
}

variable "frontend_port" {
  description = "Port for frontend application"
  type        = number
  default     = 3000
}

variable "backend_port" {
  description = "Port for backend application"
  type        = number
  default     = 9000
}

variable "frontend_health_check_path" {
  description = "Health check path for frontend"
  type        = string
  default     = "/"
}

variable "backend_health_check_path" {
  description = "Health check path for backend"
  type        = string
  default     = "/health"
}

variable "idle_timeout" {
  description = "The time in seconds that the connection is allowed to be idle"
  type        = number
  default     = 60
}