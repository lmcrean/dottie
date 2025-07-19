#!/bin/bash

# GCP Service Account Key Validation Script
# Usage: ./validate-sa-key.sh path/to/service-account-key.json

set -e

echo "🔍 GCP Service Account Key Validation"
echo "===================================="

# Check if key file path provided
if [ $# -eq 0 ]; then
    echo "❌ Please provide the path to your service account key JSON file"
    echo "Usage: $0 path/to/service-account-key.json"
    exit 1
fi

KEY_FILE="$1"

# Check if file exists
if [ ! -f "$KEY_FILE" ]; then
    echo "❌ Service account key file not found: $KEY_FILE"
    exit 1
fi

echo "📁 Key file: $KEY_FILE"

# Validate JSON format
echo "🔧 Validating JSON format..."
if ! python3 -m json.tool "$KEY_FILE" > /dev/null 2>&1; then
    echo "❌ Invalid JSON format in key file"
    exit 1
fi
echo "✅ JSON format is valid"

# Extract key information
echo "📋 Extracting key information..."
PROJECT_ID=$(python3 -c "import json; print(json.load(open('$KEY_FILE'))['project_id'])")
CLIENT_EMAIL=$(python3 -c "import json; print(json.load(open('$KEY_FILE'))['client_email'])")
KEY_ID=$(python3 -c "import json; print(json.load(open('$KEY_FILE'))['private_key_id'])")

echo "  📂 Project ID: $PROJECT_ID"
echo "  📧 Service Account: $CLIENT_EMAIL"
echo "  🔑 Key ID: $KEY_ID"

# Activate service account
echo "🔐 Activating service account..."
if gcloud auth activate-service-account --key-file="$KEY_FILE"; then
    echo "✅ Service account activated successfully"
else
    echo "❌ Failed to activate service account"
    exit 1
fi

# Set project
echo "🏗️ Setting project..."
gcloud config set project "$PROJECT_ID"

# Test basic authentication
echo "🧪 Testing authentication..."
ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)")
if [ "$ACTIVE_ACCOUNT" = "$CLIENT_EMAIL" ]; then
    echo "✅ Authentication successful"
else
    echo "❌ Authentication failed. Active account: $ACTIVE_ACCOUNT"
    exit 1
fi

# Check required APIs
echo "🔌 Checking required APIs..."
REQUIRED_APIS=(
    "artifactregistry.googleapis.com"
    "run.googleapis.com"
    "cloudbuild.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    if gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
        echo "  ✅ $api"
    else
        echo "  ❌ $api (not enabled)"
    fi
done

# Check IAM permissions
echo "🔑 Checking IAM permissions..."
gcloud projects get-iam-policy "$PROJECT_ID" \
    --flatten="bindings[].members" \
    --format="table(bindings.role)" \
    --filter="bindings.members:$CLIENT_EMAIL"

# Test Artifact Registry access
echo "📦 Testing Artifact Registry access..."
if gcloud artifacts repositories list --location=us-central1 > /dev/null 2>&1; then
    echo "✅ Can list Artifact Registry repositories"
    
    # Check if api-images repository exists
    if gcloud artifacts repositories describe api-images --location=us-central1 > /dev/null 2>&1; then
        echo "✅ api-images repository exists"
    else
        echo "⚠️ api-images repository does not exist (will be created during deployment)"
    fi
else
    echo "❌ Cannot access Artifact Registry"
fi

# Test Docker authentication
echo "🐳 Testing Docker authentication..."
if gcloud auth configure-docker us-central1-docker.pkg.dev --quiet; then
    echo "✅ Docker authentication configured"
else
    echo "❌ Docker authentication failed"
fi

echo ""
echo "🎯 VALIDATION SUMMARY"
echo "===================="
echo "✅ Service account key is valid and working"
echo "📋 Project: $PROJECT_ID"
echo "👤 Service Account: $CLIENT_EMAIL"
echo ""
echo "🚀 Next Steps:"
echo "1. Copy the entire JSON content from: $KEY_FILE"
echo "2. Go to GitHub: Settings → Secrets and Variables → Actions"
echo "3. Update the secret: GCP_SA_KEY"
echo "4. Paste the JSON content and save"
echo "5. Re-run your GitHub Actions workflow"
echo ""
echo "💡 The new validation step in GitHub Actions will show detailed diagnostics!" 