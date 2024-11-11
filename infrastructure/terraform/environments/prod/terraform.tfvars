# infrastructure/terraform/environments/prod/terraform.tfvars

project_name = "expense-split-app"
environment  = "production"
aws_region   = "ap-south-1"

# Network
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]

# Domain
domain_name = "expense-split-app.com"

# Database
db_name           = "expense_split_prod"
db_username       = "admin"
db_instance_class = "db.t3.small"

# ECS
frontend_instance_count = 2
backend_instance_count  = 2
frontend_container_port = 3000
backend_container_port  = 9000

# Monitoring
alert_email = "alerts@expense-split-app.com"