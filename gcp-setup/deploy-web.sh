#!/bin/bash

# Deploy Web App to Firebase Hosting - FREE TIER ONLY
# This script ensures we never exceed free tier limits

set -e

echo "🚀 Deploying Web App to Firebase Hosting (FREE TIER)"
echo "================================================"

# Safety checks
echo "🔒 Performing safety checks..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
    # Add npm global bin to PATH for current session
    export PATH="$PATH:$(npm config get prefix)/bin"
    # Also try alternative path locations
    export PATH="$PATH:$HOME/.npm-packages/bin:$HOME/AppData/Roaming/npm"
fi

# Use npx as fallback if firebase command not found
if ! command -v firebase &> /dev/null; then
    echo "🔄 Using npx firebase-tools as fallback..."
    FIREBASE_CMD="npx firebase-tools"
else
    FIREBASE_CMD="firebase"
fi

# Check if logged in to Firebase
if ! $FIREBASE_CMD projects:list &> /dev/null; then
    echo "🔑 Please log in to Firebase first:"
    $FIREBASE_CMD login
fi

# Check project configuration
if [ ! -f "frontend/.firebaserc" ]; then
    echo "❌ Error: .firebaserc not found. Please configure your Firebase project first."
    exit 1
fi

# Navigate to web app directory
cd frontend

# Check if build directory exists and is reasonable size
if [ -d "dist" ]; then
    BUILD_SIZE=$(du -sm dist | cut -f1)
    if [ $BUILD_SIZE -gt 8000 ]; then
        echo "⚠️  Warning: Build size is ${BUILD_SIZE}MB, approaching 10GB free tier limit"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the React application
echo "🏗️  Building React application..."
npm run build

# Deploy to Firebase Hosting
echo "📤 Deploying to Firebase Hosting..."
$FIREBASE_CMD deploy --only hosting

# Get the hosting URL
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "dottie")
HOSTING_URL="https://${PROJECT_ID}.web.app"

echo "✅ Deployment completed successfully!"
echo "🌐 Your React app is live at: $HOSTING_URL"
echo "📊 Check your Firebase console for usage statistics"
echo "🆓 Remember: Firebase Hosting free tier includes 10GB storage and 10GB/month bandwidth"

# Return to project root
cd .. 