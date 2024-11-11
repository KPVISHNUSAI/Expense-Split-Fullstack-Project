# infrastructure/terraform/modules/database/outputs.tf

output "rds_cluster_endpoint" {
  description = "Endpoint of the RDS cluster"
  value       = aws_rds_cluster.main.endpoint
}

output "rds_cluster_reader_endpoint" {
  description = "Reader endpoint of the RDS cluster"
  value       = aws_rds_cluster.main.reader_endpoint
}

output "rds_cluster_id" {
  description = "ID of the RDS cluster"
  value       = aws_rds_cluster.main.id
}

output "redis_endpoint" {
  description = "Endpoint of the Redis cluster"
  value       = aws_elasticache_cluster.main.cache_nodes[0].address
}

output "redis_port" {
  description = "Port of the Redis cluster"
  value       = aws_elasticache_cluster.main.cache_nodes[0].port
}

output "database_secret_arn" {
  description = "ARN of the secret containing database credentials"
  value       = aws_secretsmanager_secret.rds_credentials.arn
}

output "rds_cluster_resource_id" {
  description = "Resource ID of the RDS cluster"
  value       = aws_rds_cluster.main.cluster_resource_id
}