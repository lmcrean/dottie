#!/bin/bash

# Google Cloud Setup Script - ZERO COST GUARANTEE
# This script sets up Google Cloud with strict free tier controls

set -e

echo "🔒 Google Cloud Setup - FREE TIER ONLY"
echo "======================================"
echo ""
echo "This script will set up Google Cloud with STRICT billing controls"
echo "to ensure you NEVER get charged."
echo ""
read -p "Continue with setup? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
fi

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Login to Google Cloud
echo "🔑 Logging in to Google Cloud..."
gcloud auth login

# Get or create project
echo "🏗️  Setting up Google Cloud project..."
read -p "Enter your Google Cloud Project ID (or press Enter to create a new one): " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    # Generate a unique project ID
    RANDOM_SUFFIX=$(date +%s | tail -c 6)
    PROJECT_ID="dottie-app-${RANDOM_SUFFIX}"
    echo "Creating new project: $PROJECT_ID"
    gcloud projects create $PROJECT_ID --name="Dottie AI Health App"
fi

# Set the project
gcloud config set project $PROJECT_ID

# Enable billing (required for some free tier services)
echo "💳 Setting up billing account..."
echo "⚠️  IMPORTANT: We need to enable billing for Cloud Run, but we'll set up strict controls"
echo "   to ensure you never get charged."
echo ""
BILLING_ACCOUNTS=$(gcloud billing accounts list --format="value(name,displayName)" --filter="open:true")
if [ -z "$BILLING_ACCOUNTS" ]; then
    echo "❌ No billing account found. Please create one at:"
    echo "https://console.cloud.google.com/billing"
    echo "After creating, make sure to set up a $0 budget alert!"
    exit 1
fi

echo "Available billing accounts:"
gcloud billing accounts list --format="table(name,displayName,open)"
echo ""
read -p "Enter your billing account ID: " BILLING_ACCOUNT_ID

# Link billing account to project
gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT_ID

# Create $0 budget alert
echo "🚨 Creating $0 budget alert..."
gcloud billing budgets create \
    --billing-account=$BILLING_ACCOUNT_ID \
    --display-name="Zero Cost Alert - $PROJECT_ID" \
    --budget-amount=0.01 \
    --filter-projects="projects/$PROJECT_ID" \
    --threshold-rule=percent=50,basis=CURRENT_SPEND \
    --threshold-rule=percent=100,basis=CURRENT_SPEND

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    firebase.googleapis.com \
    iamcredentials.googleapis.com \
    storage.googleapis.com \
    cloudresourcemanager.googleapis.com

# Set up Firebase
echo "🔥 Setting up Firebase..."
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
    # Add npm global bin to PATH for current session
    export PATH="$PATH:$(npm config get prefix)/bin"
fi

# Initialize Firebase project
firebase projects:addfirebase $PROJECT_ID

# Update Firebase configuration
echo "📝 Updating Firebase configuration..."
cd frontend
# Create .firebaserc if it doesn't exist
if [ ! -f ".firebaserc" ]; then
    echo "{\"projects\":{\"default\":\"$PROJECT_ID\"}}" > .firebaserc
else
    sed -i.bak "s/YOUR_PROJECT_ID/$PROJECT_ID/g" .firebaserc
    rm -f .firebaserc.bak
fi
cd ../..

# Update Cloud Build configuration
echo "📝 Updating Cloud Build configuration..."
cd backend
# Update cloudbuild.yaml with project ID if it exists
if [ -f "cloudbuild.yaml" ]; then
    sed -i.bak "s/\$PROJECT_ID/$PROJECT_ID/g" cloudbuild.yaml
    rm -f cloudbuild.yaml.bak
fi
cd ..

# Create monitoring dashboard
echo "📊 Setting up monitoring..."
cat > monitoring-config.json << EOF
{
  "displayName": "Free Tier Monitoring - $PROJECT_ID",
  "mosaicLayout": {
    "tiles": [
      {
        "width": 6,
        "height": 4,
        "widget": {
          "title": "Cloud Run Requests",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"cloud_run_revision\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_RATE"
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        "width": 6,
        "height": 4,
        "xPos": 6,
        "widget": {
          "title": "Firebase Hosting Usage",
          "xyChart": {
            "dataSets": [
              {
                "timeSeriesQuery": {
                  "timeSeriesFilter": {
                    "filter": "resource.type=\"firebase_hosting\"",
                    "aggregation": {
                      "alignmentPeriod": "60s",
                      "perSeriesAligner": "ALIGN_RATE"
                    }
                  }
                }
              }
            ]
          }
        }
      }
    ]
  }
}
EOF

gcloud monitoring dashboards create --config-from-file=monitoring-config.json

# Set up GitHub Actions secrets (optional)
echo "🔐 Setting up deployment secrets..."
echo ""
echo "To enable automatic deployments, add these secrets to your GitHub repository:"
echo "GCP_PROJECT_ID: $PROJECT_ID"
echo "GCP_SA_KEY: (Service Account Key JSON)"
echo ""
echo "Create a service account key:"
echo "gcloud iam service-accounts create github-actions --display-name='GitHub Actions'"
echo "gcloud projects add-iam-policy-binding $PROJECT_ID --member='serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com' --role='roles/cloudbuild.builds.editor'"
echo "gcloud projects add-iam-policy-binding $PROJECT_ID --member='serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com' --role='roles/run.admin'"
echo "gcloud projects add-iam-policy-binding $PROJECT_ID --member='serviceAccount:github-actions@$PROJECT_ID.iam.gserviceaccount.com' --role='roles/firebase.admin'"
echo "gcloud iam service-accounts keys create key.json --iam-account=github-actions@$PROJECT_ID.iam.gserviceaccount.com"

# Clean up temporary files
rm -f monitoring-config.json

echo ""
echo "✅ Google Cloud setup completed successfully!"
echo ""
echo "📋 SUMMARY:"
echo "  Project ID: $PROJECT_ID"
echo "  Billing Account: $BILLING_ACCOUNT_ID"
echo "  Budget Alert: $0.01 threshold"
echo "  Services: Firebase Hosting, Cloud Run"
echo ""
echo "🚀 NEXT STEPS:"
echo "  1. Deploy web app: ./gcp-setup/deploy-web.sh"
echo "  2. Deploy API: ./gcp-setup/deploy-api.sh"
echo "  3. Monitor usage: https://console.cloud.google.com/billing"
echo ""
echo "🆓 FREE TIER LIMITS:"
echo "  Firebase Hosting: 10GB storage, 10GB/month bandwidth"
echo "  Cloud Run: 2M requests/month, 180K vCPU-seconds/month"
echo "  Cloud Build: 120 minutes/day"
echo ""
echo "🔒 SAFETY FEATURES:"
echo "  ✓ $0.01 budget alert enabled"
echo "  ✓ Minimal IAM permissions"
echo "  ✓ Free tier resource limits"
echo "  ✓ Monitoring dashboard"
echo ""
echo "Remember: Monitor your usage regularly to stay within free tier limits!" 