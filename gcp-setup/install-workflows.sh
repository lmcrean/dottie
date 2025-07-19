#!/bin/bash

# Install GitHub Actions Workflows for GCP Deployment
# This script copies the workflow files to the .github/workflows directory

set -e

echo "📦 Installing GitHub Actions Workflows for GCP Deployment"
echo "========================================================"

# Check if we're in the right directory
if [ ! -f "gcp-setup/workflows/deploy-api.yml" ] || [ ! -f "gcp-setup/workflows/deploy-web.yml" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Create .github/workflows directory if it doesn't exist
mkdir -p .github/workflows

# Copy workflow files
echo "📄 Copying workflow files..."
cp gcp-setup/workflows/deploy-api.yml .github/workflows/
cp gcp-setup/workflows/deploy-web.yml .github/workflows/

# Make deployment scripts executable
chmod +x gcp-setup/*.sh

echo "✅ GitHub Actions workflows installed successfully!"
echo ""
echo "📋 Required GitHub Secrets:"
echo "  GCP_PROJECT_ID: Your Google Cloud Project ID"
echo "  GCP_SA_KEY: Service Account Key JSON"
echo ""
echo "🔧 To create a service account key:"
echo "  1. Run the setup script: ./gcp-setup/setup.sh"
echo "  2. Create service account:"
echo "     gcloud iam service-accounts create github-actions --display-name='GitHub Actions'"
echo "  3. Grant necessary permissions:"
echo "     gcloud projects add-iam-policy-binding PROJECT_ID --member='serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com' --role='roles/cloudbuild.builds.editor'"
echo "     gcloud projects add-iam-policy-binding PROJECT_ID --member='serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com' --role='roles/run.admin'"
echo "     gcloud projects add-iam-policy-binding PROJECT_ID --member='serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com' --role='roles/firebase.admin'"
echo "  4. Create key file:"
echo "     gcloud iam service-accounts keys create key.json --iam-account=github-actions@PROJECT_ID.iam.gserviceaccount.com"
echo "  5. Add the contents of key.json as GCP_SA_KEY secret in GitHub"
echo ""
echo "🚀 Workflows will now:"
echo "  - Deploy API automatically when apps/api changes"
echo "  - Deploy web app automatically when apps/web changes"
echo "  - Stay within Google Cloud free tier limits"
echo "  - Comment deployment URLs on commits"
echo ""
echo "📊 Monitor deployments at: https://github.com/YOUR_USERNAME/YOUR_REPO/actions" 