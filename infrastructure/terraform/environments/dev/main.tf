# infrastructure/terraform/environments/dev/main.tf

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket         = "expense-split-app-terraform-state-dev"
    key            = "dev/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "expense-split-app-terraform-lock-dev"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# 1. Networking Module
module "networking" {
  source = "../../modules/networking"

  project_name       = var.project_name
  environment        = var.environment
  aws_region        = var.aws_region
  vpc_cidr          = var.vpc_cidr
  availability_zones = var.availability_zones
}

# 2. Security Module
module "security" {
  source = "../../modules/security"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id           = module.networking.vpc_id
  domain_name      = var.domain_name
}

# 3. Database Module
module "database" {
  source = "../../../modules/database"

  project_name            = var.project_name
  environment            = var.environment
  vpc_id                 = module.networking.vpc_id
  private_subnet_ids     = module.networking.private_subnet_ids
  
  # Database settings
  db_name                = "expense_split_dev"
  db_username            = "postgres"
  db_password            = "postgres"
  
  # For development, we can use smaller instance sizes
  db_instance_class      = "db.t3.micro"
  
  # Development specific settings
  backup_retention_days  = 1
  multi_az              = false
  
  rds_security_group_id  = module.security.rds_security_group_id
  redis_security_group_id = module.security.redis_security_group_id
}

# 4. Load Balancer Module
module "load_balancer" {
  source = "../../../modules/load_balancer"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id             = module.networking.vpc_id
  public_subnet_ids   = module.networking.public_subnet_ids
  alb_security_group_id = module.security.alb_security_group_id
  certificate_arn     = module.security.certificate_arn
  domain_name         = var.domain_name
  frontend_domain     = "app.${var.domain_name}"
  backend_domain      = "api.${var.domain_name}"
}

# 5. ECS Module
module "ecs" {
  source = "../../../modules/ecs"

  project_name              = var.project_name
  environment              = var.environment
  vpc_id                   = module.networking.vpc_id
  private_subnet_ids       = module.networking.private_subnet_ids
  ecs_security_group_id    = module.security.ecs_security_group_id
  frontend_target_group_arn = module.load_balancer.frontend_target_group_arn
  backend_target_group_arn  = module.load_balancer.backend_target_group_arn
  database_secret_arn      = module.database.database_secret_arn
  ecr_repository_url_frontend = var.ecr_repository_url_frontend
  ecr_repository_url_backend  = var.ecr_repository_url_backend
}

# 6. CDN Module
module "cdn" {
  source = "../../../modules/cdn"

  project_name        = var.project_name
  environment        = var.environment
  domain_name        = var.domain_name
  alb_domain_name    = module.load_balancer.alb_dns_name
  certificate_arn    = module.security.certificate_arn
  waf_web_acl_arn    = module.security.web_acl_arn
}

# 7. Monitoring Module
module "monitoring" {
  source = "../../../modules/monitoring"

  project_name         = var.project_name
  environment         = var.environment
  aws_region         = var.aws_region
  ecs_cluster_name    = module.ecs.cluster_name
  alert_email_addresses = var.alert_email_addresses
}