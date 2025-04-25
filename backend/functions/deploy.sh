#!/bin/bash

# Azure Functions deployment script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function App name (edit this)
FUNCTION_APP_NAME="dottie-api"

# Resource group (edit this)
RESOURCE_GROUP="dottie-resources"

# Region (edit this)
LOCATION="eastus"

# Check if Azure CLI is installed
echo -e "${YELLOW}Checking Azure CLI installation...${NC}"
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI not found. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in
echo -e "${YELLOW}Checking Azure login status...${NC}"
az account show &> /dev/null
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Not logged in. Starting login process...${NC}"
    az login
fi

# Check if Function Core Tools is installed
echo -e "${YELLOW}Checking Azure Functions Core Tools installation...${NC}"
if ! command -v func &> /dev/null; then
    echo -e "${RED}Azure Functions Core Tools not found. Please install it first.${NC}"
    echo "Visit: https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local"
    exit 1
fi

# Create resource group if it doesn't exist
echo -e "${YELLOW}Checking resource group...${NC}"
if ! az group show --name "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}Creating resource group: $RESOURCE_GROUP in $LOCATION...${NC}"
    az group create --name "$RESOURCE_GROUP" --location "$LOCATION"
fi

# Check if Function App exists, create if it doesn't
echo -e "${YELLOW}Checking Function App...${NC}"
if ! az functionapp show --name "$FUNCTION_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${YELLOW}Function App doesn't exist. Creating...${NC}"
    
    # Create a storage account
    STORAGE_ACCOUNT="dottiestg$(date +%s)"
    echo -e "${YELLOW}Creating storage account: $STORAGE_ACCOUNT...${NC}"
    az storage account create \
        --name "$STORAGE_ACCOUNT" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Standard_LRS

    # Create App Service Plan (consumption plan)
    PLAN_NAME="dottie-plan"
    echo -e "${YELLOW}Creating App Service Plan: $PLAN_NAME...${NC}"
    az functionapp plan create \
        --name "$PLAN_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --location "$LOCATION" \
        --sku Y1 \
        --is-linux false

    # Create Function App
    echo -e "${YELLOW}Creating Function App: $FUNCTION_APP_NAME...${NC}"
    az functionapp create \
        --name "$FUNCTION_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --plan "$PLAN_NAME" \
        --storage-account "$STORAGE_ACCOUNT" \
        --runtime node \
        --runtime-version 18 \
        --functions-version 4
    
    # Configure application settings from local.settings.json
    echo -e "${YELLOW}Configuring Function App settings...${NC}"
    if [ -f "local.settings.json" ]; then
        echo -e "${YELLOW}Reading settings from local.settings.json...${NC}"
        # Extract settings from local.settings.json and apply to Function App
        jq -r '.Values | to_entries[] | "\(.key)=\(.value)"' local.settings.json | while read -r line; do
            if [[ "$line" != "AzureWebJobsStorage="* ]]; then
                key="${line%%=*}"
                value="${line#*=}"
                echo "Setting $key"
                az functionapp config appsettings set \
                    --name "$FUNCTION_APP_NAME" \
                    --resource-group "$RESOURCE_GROUP" \
                    --settings "$key=$value" > /dev/null
            fi
        done
    else
        echo -e "${RED}local.settings.json not found. Skipping app settings configuration.${NC}"
    fi
else
    echo -e "${GREEN}Function App $FUNCTION_APP_NAME already exists.${NC}"
fi

# Deploy function app
echo -e "${YELLOW}Deploying function app to Azure...${NC}"
func azure functionapp publish "$FUNCTION_APP_NAME" --build remote

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    echo -e "${GREEN}Function App URL: https://$FUNCTION_APP_NAME.azurewebsites.net${NC}"
else
    echo -e "${RED}Deployment failed.${NC}"
    exit 1
fi 