#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}Error: $1 is not installed${NC}"
        exit 1
    fi
}

# Function to get user input with default value
get_input() {
    local prompt="$1"
    local default="$2"
    local answer

    # Print prompt and force output flush
    printf "${YELLOW}%s ${NC}[%s]: " "$prompt" "$default" > /dev/tty
    read answer < /dev/tty
    
    # Use default if empty
    [ -z "$answer" ] && answer="$default"
    
    echo "$answer"
}


# Banner
echo -e "${GREEN}=== Docker Environment Setup Script ===${NC}"
echo "This script will help you set up your development environment."

# Check dependencies
echo -e "\n${YELLOW}Checking dependencies...${NC}"
check_command "docker"
echo -e "${GREEN}Docker installed${NC}"
check_command "node"
echo -e "${GREEN}Node installed${NC}"
check_command "yarn"
echo -e "${GREEN}Yarn installed${NC}"
check_command "openssl"
echo -e "${GREEN}OpenSSL installed${NC}"

# Verify Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Error: Node.js version must be 18 or higher${NC}"
    exit 1
fi

# Function to get IP address cross-platform
get_ip_address() {
    if [[ $ENV_TYPE == "yes" ]]; then
        # Local environment, always return localhost
        echo "127.0.0.1"
    else
        case "$(uname -s)" in
            Darwin)
                # macOS
                ipconfig getifaddr en0 || ipconfig getifaddr en1
                ;;
            Linux)
                # Linux
                hostname -I | awk '{print $1}'
                ;;
            *)
                # Default to localhost if we can't determine
                echo "127.0.0.1"
                ;;
        esac
    fi
}

# Determine environment
echo -e "\n${YELLOW}Environment Setup${NC}"
echo "About to ask for environment type..."
ENV_TYPE=$(get_input "Is this a local environment? (yes/no)" "yes")

if [[ "$ENV_TYPE" != "yes" && "$ENV_TYPE" != "no" ]]; then
    echo -e "${RED}Error: Environment type must be 'yes' or 'no'${NC}"
    exit 1
fi

if [ -z "$ENV_TYPE" ]; then
    echo "ERROR: Failed to get environment type, defaulting to 'yes'"
    ENV_TYPE="yes"
fi

echo "Environment type set to: $ENV_TYPE"
BACKEND_PORT=$(get_input "Enter backend port" "1337")
FRONTEND_PORT=$(get_input "Enter frontend port" "3005")

# Set environment-specific variables
if [[ $ENV_TYPE == "yes" ]]; then
    echo "Setting up local environment..."
    IP_ADDRESS=$(get_ip_address)
    echo "Detected IP address: ${IP_ADDRESS}"
    DOMAIN="localhost"
    USE_TRAEFIK="no"
    NODE_ENV="development"
    BACKEND_URL="http://${IP_ADDRESS}:${BACKEND_PORT}"
    FRONTEND_URL="http://${IP_ADDRESS}:${FRONTEND_PORT}"
else
    echo "Setting up server environment..."
    DOMAIN=$(get_input "Enter your domain name" "example.com")
    DOMAIN_NAME=$(get_input "Enter your backend domain name" "api.${DOMAIN}")
    USE_TRAEFIK="yes"
    NODE_ENV="production"
    BACKEND_URL="https://${DOMAIN}"
    FRONTEND_URL="https://${DOMAIN}"
fi

echo "Getting social media details..."
NEXT_PUBLIC_TWITTER_NAME=$(get_input "Enter X.com handle" "@daasboilerplate")
NEXT_PUBLIC_TWITTER_LINK=$(get_input "Enter X.com link" "https://x.com/daasboilerplate")
PROJECT_NAME=$(get_input "Enter project name (use for sign emails and other)" "Daas Boilerplate")

echo "Getting database configuration..."
DB_HOST=$(get_input "Enter database host" "postgres")
DB_PORT=$(get_input "Enter database port" "5555")
DB_NAME=$(get_input "Enter database name" "strapi")
DB_USER=$(get_input "Enter database user" "postgres")
DB_PASSWORD=$(get_input "Enter database password" "postgres")

# Stripe configuration
echo -e "\n${YELLOW}Stripe Configuration${NC}"
STRIPE_PUBLIC_KEY=$(get_input "Enter Stripe public key" "pk_test_")
STRIPE_SECRET_KEY=$(get_input "Enter Stripe secret key" "sk_test_")
STRIPE_WEBHOOK_SECRET=$(get_input "Enter Stripe webhook secret" "whsec_")
PROJECT_SLUG=$(get_input "Enter project slug" "daas-$(openssl rand -hex 3)")
ENVIRONMENT=$(get_input "Enter environment" "production")
FRONTEND_DOMAINNAME=$(get_input "Enter frontend domain name" "${DOMAIN}")
BACKEND_DOMAINNAME=$(get_input "Enter backend domain name" "api.${DOMAIN}")

# Email configuration
echo -e "\n${YELLOW}Email Configuration${NC}"
SUPPORT_EMAIL=$(get_input "Enter support email address" "support@${DOMAIN}")
POSTMARK_API_KEY=$(get_input "Enter Postmark API key" "")
FROM_EMAIL=$(get_input "Enter 'from' email address" "no-reply@${DOMAIN}")
RECAPTCHA_SECRET_KEY=$(get_input "Enter recaptcha secret key" "")

# Create root .env
echo -e "\n${YELLOW}Creating .env files...${NC}"

echo "Creating root .env..."
cat > .env << EOL
NODE_ENV=${NODE_ENV}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
## DB SPECIFICS
POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=${DB_NAME}
POSTGRES_PORT=${DB_PORT}
DOMAIN=${DOMAIN}
USE_TRAEFIK=${USE_TRAEFIK}
PROJECT_SLUG=${PROJECT_SLUG}
ENVIRONMENT=${ENVIRONMENT}
DOMAINNAME=${DOMAIN}
FRONTEND_DOMAINNAME=${FRONTEND_DOMAINNAME}
BACKEND_DOMAINNAME=${BACKEND_DOMAINNAME}
BACKEND_PORT=${BACKEND_PORT}
FRONTEND_PORT=${FRONTEND_PORT}
EOL

echo "Creating frontend .env..."
cat > frontend/.env << EOL
## Frontend Environment Variables
PROJECT_SLUG=${PROJECT_SLUG}
NEXT_PUBLIC_API_URL=${BACKEND_URL}
NEXT_PUBLIC_BACKEND_URL=http://backend:${BACKEND_PORT}
NEXT_PUBLIC_LBACKEND_URL=${BACKEND_URL}
NEXT_PUBLIC_FRONTEND_URL=${FRONTEND_URL}
BACKEND_URL=${BACKEND_URL}
NODE_ENV=${ENVIRONMENT}
## THIRD PARTY
NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY=${RECAPTCHA_SECRET_KEY}
NEXT_PUBLIC_TWITTER_NAME=${NEXT_PUBLIC_TWITTER_NAME}
NEXT_PUBLIC_TWITTER_LINK=${NEXT_PUBLIC_TWITTER_LINK}
## SEO Settings
NEXT_PUBLIC_SEO_TITLE="${PROJECT_NAME} | Build a bootstrapped, profitable database product."
NEXT_PUBLIC_SEO_DESCRIPTION="${PROJECT_NAME} | Build a bootstrapped, profitable database product in 2024."
NEXT_PUBLIC_SEO_KEYWORDS="${PROJECT_NAME}, database, product, bootstrap, profitable, 2024"
NEXT_PUBLIC_PROJECTNAME="${PROJECT_NAME}"
PORT=${FRONTEND_PORT}
EOL

echo "Creating backend .env..."
cat > backend/.env << EOL
## BACKEND ENVIRONMENT VARIABLES
PROJECT_SLUG="${PROJECT_SLUG}"
PROJECTNAME="${PROJECT_NAME}"
ENVIRONMENT="${ENVIRONMENT}"
NODE_ENV="${ENVIRONMENT}"
FRONTEND_DOMAINNAME="${FRONTEND_DOMAINNAME}"
BACKEND_DOMAINNAME="${BACKEND_DOMAINNAME}"
HOST="0.0.0.0"
PORT=${BACKEND_PORT}
## SECURITY TOKENS
APP_KEYS="$(openssl rand -base64 32)"
API_TOKEN_SALT="$(openssl rand -base64 32)"
ADMIN_JWT_SECRET="$(openssl rand -base64 32)"
JWT_SECRET="$(openssl rand -base64 32)"
TRANSFER_TOKEN_SALT="$(openssl rand -base64 32)"
STRAPI_ADMIN_SYNC_SECRET="$(openssl rand -base64 32)"
## DATABASE
DATABASE_HOST=${DB_HOST}
DATABASE_PORT=${DB_PORT}
DATABASE_NAME=${DB_NAME}
DATABASE_SSL=false
DATABASE_CLIENT=postgres
DATABASE_USERNAME=${DB_USER}
DATABASE_PASSWORD=${DB_PASSWORD}
## DB SPECIFICS
POSTGRES_USER=${DB_USER}
POSTGRES_PASSWORD=${DB_PASSWORD}
POSTGRES_DB=${DB_NAME}
POSTGRES_PORT=${DB_PORT}
## STRIPE
STRIPE_PUBLIC_KEY="${STRIPE_PUBLIC_KEY}"
STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"
STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET}"
## EMAIL
SUPPORT_EMAIL="${SUPPORT_EMAIL}"
POSTMARK_API_KEY="${POSTMARK_API_KEY}"
FROMEMAIL="${FROM_EMAIL}"
RECAPTCHA_SECRET_KEY="${RECAPTCHA_SECRET_KEY}"
## URLS
BACKEND_URL="${BACKEND_URL}"
FRONTEND_URL="${FRONTEND_URL}"
LOCAL_HOST=""
BACKEND_PORT=${BACKEND_PORT}
FRONTEND_PORT=${FRONTEND_PORT}
EOL

# Ask to continue
read -p "Configuration has been set, continue with installation? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Setup cancelled."
    exit 1
fi

# Install dependencies
echo -e "\n${YELLOW}Installing dependencies...${NC}"
cd backend
yarn install

echo -e "\n${YELLOW}Installing database sync plugin dependencies...${NC}"
cd src/plugins/databasesync
yarn install
yarn build
cd ../../../../

# Create docker-compose override for development
if [[ $ENV_TYPE == "yes" ]]; then
    echo "Creating docker-compose.override.yml..."
    cat > docker-compose.override.yml << EOL
version: '3'
services:
  frontend:
    ports:
      - "${FRONTEND_PORT}:${FRONTEND_PORT}"
  backend:
    ports:
      - "${BACKEND_PORT}:${BACKEND_PORT}"
EOL
fi

# Ask to continue before starting containers
read -p "Dependencies installed. Start containers? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Setup cancelled."
    exit 1
fi

# Clean resource forks on macOS using dot_clean
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "\n${YELLOW}Cleaning resource forks with dot_clean...${NC}"
    dot_clean .
fi


# Start Docker containers
echo -e "\n${YELLOW}Creating Docker containers...${NC}"
if [[ $ENV_TYPE == "yes" ]]; then
    echo "Starting in local mode..."
    docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --force-recreate --remove-orphans --renew-anon-volumes 
else
    echo "Starting in production mode..."
    docker compose build postgres backend
    docker compose up -d postgres backend
    echo "Waiting for backend to be ready..."
    while ! nc -z localhost ${BACKEND_PORT}; do
        echo "Waiting for backend to start..."
        sleep 2
    done
    echo "Backend is ready!"
    docker compose build frontend
    docker compose up -d frontend
fi

echo -e "\n${GREEN}Setup completed successfully!${NC}"
if [[ $ENV_TYPE == "yes" ]]; then
    echo -e "Frontend URL: http://${IP_ADDRESS}:${FRONTEND_PORT}"
    echo -e "Backend URL: http://${IP_ADDRESS}:${BACKEND_PORT}"
else
    echo -e "Frontend URL: https://${FRONTEND_DOMAINNAME}"
    echo -e "Backend URL: https://${BACKEND_DOMAINNAME}"
fi 