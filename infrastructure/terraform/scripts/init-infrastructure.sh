# infrastructure/scripts/init-infrastructure.sh

#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_message() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        print_message "$GREEN" "✅ Success: $1"
    else
        print_message "$RED" "❌ Failed: $1"
        exit 1
    fi
}

# Check required tools
check_requirements() {
    print_message "$YELLOW" "Checking required tools..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_message "$RED" "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check Terraform
    if ! command -v terraform &> /dev/null; then
        print_message "$RED" "Terraform is not installed. Please install it first."
        exit 1
    }
    
    print_message "$GREEN" "All required tools are installed."
}

# Initialize AWS resources
init_aws_resources() {
    local environment=$1
    print_message "$YELLOW" "Initializing AWS resources for $environment environment..."

    # Create S3 bucket for Terraform state
    aws s3api create-bucket \
        --bucket expense-split-app-terraform-state-$environment \
        --region ap-south-1 \
        --create-bucket-configuration LocationConstraint=ap-south-1
    check_status "Created S3 bucket for Terraform state"

    # Enable versioning on the S3 bucket
    aws s3api put-bucket-versioning \
        --bucket expense-split-app-terraform-state-$environment \
        --versioning-configuration Status=Enabled
    check_status "Enabled versioning on S3 bucket"

    # Create DynamoDB table for state locking
    aws dynamodb create-table \
        --table-name expense-split-app-terraform-lock-$environment \
        --attribute-definitions AttributeName=LockID,AttributeType=S \
        --key-schema AttributeName=LockID,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
        --region ap-south-1
    check_status "Created DynamoDB table for state locking"

    # Create ECR repositories
    aws ecr create-repository --repository-name expense-split-app-frontend-$environment
    aws ecr create-repository --repository-name expense-split-app-backend-$environment
    check_status "Created ECR repositories"
}

# Main script execution
main() {
    print_message "$YELLOW" "Starting infrastructure initialization..."
    
    # Check requirements
    check_requirements
    
    # Initialize development environment
    init_aws_resources "dev"
    
    # Initialize production environment if specified
    if [ "$1" == "--with-prod" ]; then
        init_aws_resources "prod"
    fi
    
    print_message "$GREEN" "Infrastructure initialization completed successfully!"
}

# Run main function with command line arguments
main "$@"