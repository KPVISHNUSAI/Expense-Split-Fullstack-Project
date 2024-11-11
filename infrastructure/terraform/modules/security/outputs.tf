# infrastructure/terraform/modules/security/outputs.tf

output "web_acl_arn" {
  description = "ARN of the WAF Web ACL"
  value       = aws_wafv2_web_acl.main.arn
}

output "alb_security_group_id" {
  description = "ID of the ALB security group"
  value       = aws_security_group.alb.id
}

output "ecs_security_group_id" {
  description = "ID of the ECS tasks security group"
  value       = aws_security_group.ecs_tasks.id
}

output "rds_security_group_id" {
  description = "ID of the RDS security group"
  value       = aws_security_group.rds.id
}

output "certificate_arn" {
  description = "ARN of the SSL certificate"
  value       = aws_acm_certificate.main.arn
}

output "certificate_validation_options" {
  description = "Certificate validation options"
  value       = aws_acm_certificate.main.domain_validation_options
}