# infrastructure/terraform/modules/security/variables.tf

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

variable "domain_name" {
  description = "Domain name for SSL certificate"
  type        = string
}

variable "app_port" {
  description = "Port on which the application runs"
  type        = number
  default     = 9000
}

variable "allowed_cidr_blocks" {
  description = "List of CIDR blocks allowed to access the ALB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "enable_waf" {
  description = "Enable WAF protection"
  type        = bool
  default     = true
}

variable "enable_shield" {
  description = "Enable AWS Shield Advanced"
  type        = bool
  default     = false
}

variable "waf_rate_limit" {
  description = "Number of requests allowed per 5-minute period per IP"
  type        = number
  default     = 2000
}