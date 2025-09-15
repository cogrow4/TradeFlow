#!/bin/bash

# TradeFlow Deployment Script
# This script deploys the entire TradeFlow platform

set -e

echo "🚀 Starting TradeFlow deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    print_status "Dependencies check passed ✅"
}

# Deploy backend
deploy_backend() {
    print_status "Deploying backend..."
    cd backend
    
    if [ ! -f "package.json" ]; then
        print_error "Backend package.json not found. Make sure you're in the correct directory."
        exit 1
    fi
    
    npm install
    npx convex deploy
    
    print_status "Backend deployed successfully ✅"
    cd ..
}

# Build and deploy website
deploy_website() {
    print_status "Building website..."
    cd website
    
    if [ ! -f "package.json" ]; then
        print_error "Website package.json not found. Make sure you're in the correct directory."
        exit 1
    fi
    
    npm install
    npm run build
    
    print_status "Website built successfully ✅"
    print_warning "Website build is in website/dist/ - deploy this to your hosting provider"
    cd ..
}

# Build mobile app
build_mobile() {
    print_status "Building mobile app..."
    cd mobile-app
    
    if [ ! -f "package.json" ]; then
        print_error "Mobile app package.json not found. Make sure you're in the correct directory."
        exit 1
    fi
    
    npm install
    npm run build
    
    print_status "Mobile app built successfully ✅"
    print_warning "Mobile app build is in mobile-app/dist/ - use Capacitor to build native apps"
    cd ..
}

# Main deployment function
main() {
    print_status "Starting TradeFlow deployment process..."
    
    # Check dependencies
    check_dependencies
    
    # Deploy backend
    deploy_backend
    
    # Build website
    deploy_website
    
    # Build mobile app
    build_mobile
    
    print_status "🎉 TradeFlow deployment completed successfully!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Deploy website/dist/ to your hosting provider"
    print_status "2. Use Capacitor to build native mobile apps:"
    print_status "   cd mobile-app && npx cap build ios && npx cap build android"
    print_status "3. Configure your environment variables in production"
    print_status "4. Set up your domain and SSL certificates"
    print_status ""
    print_status "For detailed deployment instructions, see docs/deployment.md"
}

# Run main function
main "$@"