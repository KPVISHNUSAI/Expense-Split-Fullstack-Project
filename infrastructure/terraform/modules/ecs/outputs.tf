# infrastructure/terraform/modules/ecs/outputs.tf

# Cluster Outputs
output "cluster_id" {
  description = "ID of the ECS cluster"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

# Frontend Service Outputs
output "frontend_service_id" {
  description = "ID of the frontend ECS service"
  value       = aws_ecs_service.frontend.id
}

output "frontend_service_name" {
  description = "Name of the frontend ECS service"
  value       = aws_ecs_service.frontend.name
}

output "frontend_task_definition_arn" {
  description = "ARN of the frontend task definition"
  value       = aws_ecs_task_definition.frontend.arn
}

output "frontend_task_definition_family" {
  description = "Family of the frontend task definition"
  value       = aws_ecs_task_definition.frontend.family
}

# Backend Service Outputs
output "backend_service_id" {
  description = "ID of the backend ECS service"
  value       = aws_ecs_service.backend.id
}

output "backend_service_name" {
  description = "Name of the backend ECS service"
  value       = aws_ecs_service.backend.name
}

output "backend_task_definition_arn" {
  description = "ARN of the backend task definition"
  value       = aws_ecs_task_definition.backend.arn
}

output "backend_task_definition_family" {
  description = "Family of the backend task definition"
  value       = aws_ecs_task_definition.backend.family
}

# IAM Role Outputs
output "execution_role_arn" {
  description = "ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_execution_role.arn
}

output "task_role_arn" {
  description = "ARN of the ECS task role"
  value       = aws_iam_role.ecs_task_role.arn
}

# Auto Scaling Outputs
output "frontend_autoscaling_target_id" {
  description = "ID of the frontend auto scaling target"
  value       = aws_appautoscaling_target.frontend.id
}

output "backend_autoscaling_target_id" {
  description = "ID of the backend auto scaling target"
  value       = aws_appautoscaling_target.backend.id
}

# CloudWatch Log Groups
output "frontend_log_group_name" {
  description = "Name of the frontend CloudWatch log group"
  value       = "/ecs/${var.project_name}-${var.environment}/frontend"
}

output "backend_log_group_name" {
  description = "Name of the backend CloudWatch log group"
  value       = "/ecs/${var.project_name}-${var.environment}/backend"
}

# Service Discovery (if needed for inter-service communication)
output "service_discovery_namespace" {
  description = "Service discovery namespace ID"
  value       = try(aws_service_discovery_private_dns_namespace.main[0].id, null)
}

# Additional Useful Outputs
output "cluster_capacity_providers" {
  description = "List of capacity providers associated with the cluster"
  value       = aws_ecs_cluster_capacity_providers.main.capacity_providers
}

output "frontend_desired_count" {
  description = "Desired count of frontend tasks"
  value       = aws_ecs_service.frontend.desired_count
}

output "backend_desired_count" {
  description = "Desired count of backend tasks"
  value       = aws_ecs_service.backend.desired_count
}