# Manual Deployment Instructions

This guide provides step-by-step instructions for manually deploying both the API and web applications using terminal commands.

## Prerequisites

- Google Cloud SDK (`gcloud`) installed and configured
- Node.js and npm installed
- Firebase CLI installed
- Authenticated with Google Cloud and Firebase

## Part 1: Deploy API to Google Cloud Run

### Step 1: Setup and Authentication

```bash
# Set your personal Google account as active
gcloud config set account your-email@gmail.com

# Verify authentication
gcloud auth list

# Ensure you're using the correct project
gcloud config set project lauriecrean-free-38256
```

### Step 2: Build and Deploy API

```bash
# Navigate to the API directory
cd apps/api/github

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Google Cloud Run
gcloud run deploy api-github-main \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --timeout=60s \
  --concurrency=100 \
  --set-env-vars="NODE_ENV=production"
```

### Step 3: Verify API Deployment

```bash
# Test the health endpoint (replace with your actual URL)
curl https://api-github-main-329000596728.us-central1.run.app/health

# Expected response:
# {"status":"ok","timestamp":"2025-07-06T16:07:31.141Z","service":"api-github"}
```

## Part 2: Deploy Web App to Firebase Hosting

### Step 1: Setup Firebase CLI

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Or use npx if global installation doesn't work
npx firebase --version
```

### Step 2: Firebase Authentication

```bash
# Login to Firebase (if not already logged in)
npx firebase login

# Verify you're logged in
npx firebase projects:list
```

### Step 3: Build and Deploy Web App

```bash
# Navigate to the web app directory
cd apps/web

# Install dependencies
npm install

# Build the application
npm run build

# Deploy to Firebase Hosting
npx firebase deploy --only hosting
```

### Step 4: Verify Web App Deployment

```bash
# Firebase will provide a hosting URL after deployment
# Test by visiting: https://your-project-id.web.app
# Or: https://your-project-id.firebaseapp.com
```

## Troubleshooting

### Common API Issues

1. **PORT Environment Variable Error**
   - Don't include `PORT=8080` in environment variables
   - Cloud Run automatically sets the PORT variable

2. **Build Failures**
   - Ensure `npm run build` completes successfully
   - Check that your Dockerfile is properly configured

3. **Permission Errors**
   - Verify you're authenticated with the correct account
   - Ensure your account has Cloud Run Admin permissions

### Common Web App Issues

1. **Firebase CLI Not Found**
   - Use `npx firebase` instead of `firebase`
   - Or install globally with `npm install -g firebase-tools`

2. **Build Warnings**
   - Docusaurus may show broken link warnings
   - These are usually non-critical and won't prevent deployment

3. **Firebase Project Not Found**
   - Ensure `firebase.json` exists in the project root
   - Verify the project ID matches your Firebase project

## Deployment URLs

After successful deployment, you'll get these URLs:

- **API**: `https://api-github-main-329000596728.us-central1.run.app`
- **Web App**: `https://your-project-id.web.app`

## Environment Variables

### API Environment Variables
- `NODE_ENV=production` (automatically set by Cloud Run)
- `PORT` (automatically set by Cloud Run - DO NOT override)

### Web App Environment Variables
- Build-time variables should be set in the build process
- Runtime variables for static sites should be handled differently

## Next Steps

1. **Set up custom domains** (optional)
2. **Configure HTTPS** (automatically handled by both platforms)
3. **Set up monitoring and logging**
4. **Configure CI/CD pipelines** for automated deployment

## Notes

- Cloud Run automatically handles scaling and HTTPS
- Firebase Hosting provides global CDN and automatic SSL
- Both platforms have generous free tiers for development
- Monitor usage to avoid unexpected charges

## Successful Deployment Verification

### API Health Check
```bash
# Should return JSON with status "ok"
curl https://your-api-url/health
```

### Web App
- Visit the Firebase hosting URL
- Verify all pages load correctly
- Check browser console for any errors

## Manual Deployment vs GitHub Actions

Manual deployment is useful for:
- Testing and debugging
- One-off deployments
- Local development
- Troubleshooting CI/CD issues

GitHub Actions provide:
- Automated deployment on code changes
- Consistent deployment process
- Integration with pull requests
- Deployment to multiple environments
