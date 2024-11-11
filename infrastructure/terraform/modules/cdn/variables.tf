# infrastructure/terraform/modules/cdn/variables.tf

variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment (e.g., development, production)"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the CDN distribution"
  type        = string
}

variable "alb_domain_name" {
  description = "Domain name of the Application Load Balancer"
  type        = string
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate in ACM"
  type        = string
}

variable "min_ttl" {
  description = "Minimum TTL for cached objects"
  type        = number
  default     = 0
}

variable "default_ttl" {
  description = "Default TTL for cached objects"
  type        = number
  default     = 3600 # 1 hour
}

variable "max_ttl" {
  description = "Maximum TTL for cached objects"
  type        = number
  default     = 86400 # 24 hours
}

variable "cloudfront_price_class" {
  description = "CloudFront distribution price class"
  type        = string
  default     = "PriceClass_100" # Use PriceClass_All for production
}

variable "enable_waf" {
  description = "Enable WAF for CloudFront"
  type        = bool
  default     = true
}

variable "waf_web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  type        = string
  default     = ""
}

variable "cors_allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

variable "enable_compression" {
  description = "Enable compression for CloudFront distribution"
  type        = bool
  default     = true
}