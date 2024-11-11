# infrastructure/terraform/modules/networking/vpc_endpoints.tf

# S3 Gateway Endpoint
resource "aws_vpc_endpoint" "s3" {
  count             = var.enable_vpc_endpoints ? 1 : 0
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  vpc_endpoint_type = "Gateway"
  
  route_table_ids = concat(
    [aws_route_table.public.id],
    aws_route_table.private[*].id
  )

  tags = {
    Name        = "${var.project_name}-s3-endpoint"
    Environment = var.environment
  }
}

# ECR API Endpoint
resource "aws_vpc_endpoint" "ecr_api" {
  count               = var.enable_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.ecr.api"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = {
    Name        = "${var.project_name}-ecr-api-endpoint"
    Environment = var.environment
  }
}

# ECR Docker Endpoint
resource "aws_vpc_endpoint" "ecr_dkr" {
  count               = var.enable_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = {
    Name        = "${var.project_name}-ecr-dkr-endpoint"
    Environment = var.environment
  }
}

# CloudWatch Logs Endpoint
resource "aws_vpc_endpoint" "logs" {
  count               = var.enable_vpc_endpoints ? 1 : 0
  vpc_id              = aws_vpc.main.id
  service_name        = "com.amazonaws.${var.aws_region}.logs"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.private[*].id
  security_group_ids  = [aws_security_group.vpc_endpoints[0].id]
  private_dns_enabled = true

  tags = {
    Name        = "${var.project_name}-logs-endpoint"
    Environment = var.environment
  }
}

# Security Group for VPC Endpoints
resource "aws_security_group" "vpc_endpoints" {
  count       = var.enable_vpc_endpoints ? 1 : 0
  name        = "${var.project_name}-vpc-endpoints-sg"
  description = "Security group for VPC endpoints"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  tags = {
    Name        = "${var.project_name}-vpc-endpoints-sg"
    Environment = var.environment
  }
}