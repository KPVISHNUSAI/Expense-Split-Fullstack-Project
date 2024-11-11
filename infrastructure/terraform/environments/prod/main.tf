# infrastructure/terraform/environments/prod/main.tf

terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket         = "expense-split-app-terraform-state-prod"
    key            = "prod/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "expense-split-app-terraform-lock-prod"
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

# Networking Module
module "networking" {
  source = "../../modules/networking"

  project_name       = var.project_name
  environment        = var.environment
  aws_region        = var.aws_region
  vpc_cidr          = var.vpc_cidr
  availability_zones = var.availability_zones
}

# Security Module
module "security" {
  source = "../../../modules/security"

  project_name         = var.project_name
  environment          = var.environment
  aws_region          = var.aws_region
  vpc_id              = module.networking.vpc_id
  domain_name         = var.domain_name
  enable_shield       = true
  enable_waf_rules    = true
}

# Database Module
module "database" {
  source = "../../../modules/database"

  project_name          = var.project_name
  environment           = var.environment
  vpc_id               = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  db_name              = var.db_name
  db_username          = var.db_username
  db_password          = var.db_password
  instance_class       = var.db_instance_class
  multi_az             = true
  backup_retention     = 7
}

# Load Balancer Module
module "load_balancer" {
  source = "../../../modules/load_balancer"

  project_name       = var.project_name
  environment        = var.environment
  vpc_id            = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids
  security_groups    = [module.security.alb_security_group_id]
}

# ECS Module
module "ecs" {
  source = "../../../modules/ecs"

  project_name              = var.project_name
  environment              = var.environment
  vpc_id                   = module.networking.vpc_id
  private_subnet_ids       = module.networking.private_subnet_ids
  frontend_target_group_arn = module.load_balancer.frontend_target_group_arn
  backend_target_group_arn  = module.load_balancer.backend_target_group_arn
  enable_auto_scaling      = true
}

# Monitoring Module
module "monitoring" {
  source = "../../../modules/monitoring"

  project_name        = var.project_name
  environment         = var.environment
  vpc_id             = module.networking.vpc_id
  enable_alerting     = true
  alert_email        = var.alert_email
}