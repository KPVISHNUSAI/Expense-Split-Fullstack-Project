# infrastructure/terraform/modules/database/main.tf

# Random password generator for RDS
resource "random_password" "rds_password" {
  length           = 16
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Store RDS credentials in Secrets Manager
resource "aws_secretsmanager_secret" "rds_credentials" {
  name        = "${var.project_name}-${var.environment}-rds-credentials"
  description = "RDS credentials for ${var.project_name} ${var.environment}"

  tags = {
    Name        = "${var.project_name}-rds-credentials"
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "rds_credentials" {
  secret_id = aws_secretsmanager_secret.rds_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.rds_password.result
    dbname   = var.db_name
    host     = aws_rds_cluster.main.endpoint
    port     = 5432
  })
}

# RDS Aurora PostgreSQL Cluster
resource "aws_rds_cluster" "main" {
  cluster_identifier     = "${var.project_name}-${var.environment}"
  engine                = "aurora-postgresql"
  engine_version        = var.postgres_version
  database_name         = var.db_name
  master_username       = var.db_username
  master_password       = random_password.rds_password.result
  port                  = 5432
  
  vpc_security_group_ids = [var.rds_security_group_id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  backup_retention_period = var.backup_retention_days
  preferred_backup_window = "03:00-04:00"
  
  skip_final_snapshot     = var.environment != "production"
  final_snapshot_identifier = var.environment == "production" ? "${var.project_name}-${var.environment}-final-snapshot" : null
  
  enabled_cloudwatch_logs_exports = ["postgresql"]

  scaling_configuration {
    auto_pause               = var.environment != "production"
    max_capacity            = var.environment == "production" ? 8 : 2
    min_capacity            = var.environment == "production" ? 2 : 1
    seconds_until_auto_pause = var.environment == "production" ? 0 : 300
  }

  tags = {
    Name        = "${var.project_name}-aurora-cluster"
    Environment = var.environment
  }
}

# RDS Aurora Instances
resource "aws_rds_cluster_instance" "main" {
  count               = var.environment == "production" ? 2 : 1
  identifier          = "${var.project_name}-${var.environment}-${count.index + 1}"
  cluster_identifier  = aws_rds_cluster.main.id
  instance_class     = var.environment == "production" ? "db.r6g.large" : "db.t4g.medium"
  engine             = "aurora-postgresql"
  
  performance_insights_enabled = true
  monitoring_interval         = var.environment == "production" ? 60 : 0

  tags = {
    Name        = "${var.project_name}-aurora-instance-${count.index + 1}"
    Environment = var.environment
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.project_name}-db-subnet-group"
    Environment = var.environment
  }
}

# Redis Elasticache Cluster
resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${var.project_name}-${var.environment}-redis"
  engine              = "redis"
  node_type           = var.environment == "production" ? "cache.t4g.medium" : "cache.t4g.micro"
  num_cache_nodes     = 1
  parameter_group_name = aws_elasticache_parameter_group.main.name
  port                = 6379
  security_group_ids  = [var.redis_security_group_id]
  subnet_group_name   = aws_elasticache_subnet_group.main.name

  snapshot_retention_limit = var.environment == "production" ? 7 : 1
  snapshot_window         = "03:00-04:00"

  tags = {
    Name        = "${var.project_name}-redis"
    Environment = var.environment
  }
}

# Redis Parameter Group
resource "aws_elasticache_parameter_group" "main" {
  family = "redis6.x"
  name   = "${var.project_name}-${var.environment}-redis-params"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  tags = {
    Name        = "${var.project_name}-redis-params"
    Environment = var.environment
  }
}

# Redis Subnet Group
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-redis-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.project_name}-redis-subnet-group"
    Environment = var.environment
  }
}

# CloudWatch Alarms for RDS
resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-database-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Database CPU utilization is too high"
  alarm_actions       = var.environment == "production" ? var.alarm_sns_topic_arns : []

  dimensions = {
    DBClusterIdentifier = aws_rds_cluster.main.cluster_identifier
  }

  tags = {
    Name        = "${var.project_name}-database-cpu-alarm"
    Environment = var.environment
  }
}