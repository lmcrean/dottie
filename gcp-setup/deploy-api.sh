#!/bin/bash

# Deploy API to Cloud Run - FREE TIER ONLY
# This script ensures we never exceed free tier limits

set -e

echo "🚀 Deploying API to Cloud Run (FREE TIER)"
echo "======================================="

# Safety checks
echo "🔒 Performing safety checks..."

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if gcloud CLI is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if logged in to Google Cloud
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "🔑 Please log in to Google Cloud first:"
    gcloud auth login
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No Google Cloud project configured"
    echo "Set your project with: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

# Check billing account (safety check)
echo "🔍 Checking billing configuration..."
BILLING_ACCOUNT=$(gcloud billing accounts list --format="value(name)" --filter="open:true" | head -1)
if [ -z "$BILLING_ACCOUNT" ]; then
    echo "⚠️  Warning: No active billing account found"
    echo "Make sure you have billing enabled with strict budget controls"
fi

# Navigate to API directory
cd backend

# Check if Dockerfile exists
if [ ! -f "Dockerfile" ]; then
    echo "❌ Error: Dockerfile not found in backend/"
    exit 1
fi

# Build the container image using Cloud Build
echo "🏗️  Building container image..."
IMAGE_NAME="gcr.io/${PROJECT_ID}/dottie-api"
gcloud builds submit --tag ${IMAGE_NAME} .

# Deploy to Cloud Run with strict free tier limits
echo "📤 Deploying to Cloud Run with FREE TIER limits..."
gcloud run deploy dottie-api \
    --image ${IMAGE_NAME} \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --concurrency 100 \
    --timeout 60s \
    --cpu-throttling \
    --no-use-http2 \
    --execution-environment gen2

# Get the service URL
SERVICE_URL=$(gcloud run services describe dottie-api --platform managed --region us-central1 --format="value(status.url)")

echo "✅ Deployment completed successfully!"
echo "🌐 Your API is live at: $SERVICE_URL"
echo "🔗 Health check: $SERVICE_URL/health"
echo "📡 API endpoints: $SERVICE_URL/api/"
echo ""
echo "🆓 FREE TIER LIMITS:"
echo "   - CPU: 180,000 vCPU-seconds/month"
echo "   - Memory: 360,000 GiB-seconds/month"
echo "   - Requests: 2 million/month"
echo "   - Bandwidth: 1 GB/month egress"
echo ""
echo "📊 Monitor usage in Cloud Console: https://console.cloud.google.com/run"

# Return to project root
cd .. 