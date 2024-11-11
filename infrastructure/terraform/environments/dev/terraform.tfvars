# infrastructure/terraform/environments/dev/terraform.tfvars

project_name = "expense-split-app"
environment  = "development"
aws_region   = "ap-south-1"

# Network Configuration
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["ap-south-1a", "ap-south-1b"]

# Domain Configuration
domain_name = "dev.expense-split-app.com"

# Database Configuration
db_name     = "expense_split_dev"
db_username = "postgres"
db_password = "postgres"

# Alert Configuration
alert_email_addresses = [
  "devteam@expense-split-app.com"
]

# ECR Repositories (these will be created and filled in later)
ecr_repository_url_frontend = ""
ecr_repository_url_backend = ""