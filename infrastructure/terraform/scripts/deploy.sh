# infrastructure/scripts/deploy.sh

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

# Show script usage
usage() {
    echo "Usage: $0 -e <environment> [-a <action>] [-t <target>]"
    echo "  -e: Environment (dev/prod)"
    echo "  -a: Action (plan/apply/destroy) - default: plan"
    echo "  -t: Target module (networking/security/database/etc)"
    exit 1
}

# Deploy infrastructure
deploy_infrastructure() {
    local environment=$1
    local action=$2
    local target=$3
    
    print_message "$YELLOW" "Starting deployment for $environment environment..."
    
    # Change to the correct directory
    cd "$(dirname "$0")/../terraform/environments/$environment" || exit 1
    
    # Initialize Terraform
    print_message "$YELLOW" "Initializing Terraform..."
    terraform init
    check_status "Terraform initialization"
    
    # Validate Terraform configuration
    print_message "$YELLOW" "Validating Terraform configuration..."
    terraform validate
    check_status "Terraform validation"
    
    # Build the terraform command
    cmd="terraform $action"
    if [ -n "$target" ]; then
        cmd="$cmd -target=module.$target"
    fi
    
    # Execute the command
    print_message "$YELLOW" "Executing: $cmd"
    if [ "$action" == "apply" ] || [ "$action" == "destroy" ]; then
        $cmd -auto-approve
    else
        $cmd
    fi
    check_status "Terraform $action"
}

# Build and push Docker images
build_and_push_images() {
    local environment=$1
    local aws_account_id=$(aws sts get-caller-identity --query Account --output text)
    local region=$(aws configure get region)
    
    print_message "$YELLOW" "Building and pushing Docker images..."
    
    # Login to ECR
    aws ecr get-login-password --region $region | docker login --username AWS --password-stdin "$aws_account_id.dkr.ecr.$region.amazonaws.com"
    
    # Build and push frontend
    docker build -t "expense-split-app-frontend-$environment" -f ../../docker/Dockerfile.frontend ../../frontend
    docker tag "expense-split-app-frontend-$environment:latest" "$aws_account_id.dkr.ecr.$region.amazonaws.com/expense-split-app-frontend-$environment:latest"
    docker push "$aws_account_id.dkr.ecr.$region.amazonaws.com/expense-split-app-frontend-$environment:latest"
    
    # Build and push backend
    docker build -t "expense-split-app-backend-$environment" -f ../../docker/Dockerfile.backend ../../backend
    docker tag "expense-split-app-backend-$environment:latest" "$aws_account_id.dkr.ecr.$region.amazonaws.com/expense-split-app-backend-$environment:latest"
    docker push "$aws_account_id.dkr.ecr.$region.amazonaws.com/expense-split-app-backend-$environment:latest"
}

# Main script execution
main() {
    local environment=""
    local action="plan"
    local target=""
    
    # Parse command line arguments
    while getopts ":e:a:t:" opt; do
        case $opt in
            e) environment="$OPTARG" ;;
            a) action="$OPTARG" ;;
            t) target="$OPTARG" ;;
            \?) echo "Invalid option -$OPTARG" >&2; usage ;;
        esac
    done
    
    # Validate environment
    if [ -z "$environment" ] || { [ "$environment" != "dev" ] && [ "$environment" != "prod" ]; }; then
        print_message "$RED" "Please specify a valid environment (dev/prod)"
        usage
    fi
    
    # Validate action
    if { [ "$action" != "plan" ] && [ "$action" != "apply" ] && [ "$action" != "destroy" ]; }; then
        print_message "$RED" "Invalid action. Must be plan, apply, or destroy"
        usage
    fi
    
    # Deploy infrastructure
    deploy_infrastructure "$environment" "$action" "$target"
    
    # Build and push images if applying
    if [ "$action" == "apply" ]; then
        build_and_push_images "$environment"
    fi
    
    print_message "$GREEN" "Deployment completed successfully!"
}

# Run main function with all command line arguments
main "$@"