# Google Cloud Setup - FREE TIER ONLY 🆓

This setup ensures you **NEVER** get charged for hosting Dottie (AI menstrual health app) on Google Cloud.

## 🚨 CRITICAL SAFETY FEATURES

### Billing Protection
- **$0.01 Budget Alert**: Immediate notification if any charges occur
- **Free Tier Limits**: All services configured within free tier bounds
- **Resource Quotas**: Automatic limits to prevent overage
- **Monitoring Dashboard**: Real-time usage tracking

### Free Tier Limits
- **Firebase Hosting**: 10GB storage, 10GB/month bandwidth
- **Cloud Run**: 2M requests/month, 180K vCPU-seconds/month, 360K GiB-seconds/month
- **Cloud Build**: 120 minutes/day build time

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Make scripts executable
chmod +x gcp-setup/*.sh

# Run the setup script
./gcp-setup/setup.sh
```

### 2. Deploy Applications
```bash
# Deploy web app to Firebase Hosting
./gcp-setup/deploy-web.sh

# Deploy API to Cloud Run
./gcp-setup/deploy-api.sh
```

### 3. Monitor Usage
Visit your [Google Cloud Console](https://console.cloud.google.com/billing) to monitor usage.

## 📋 Prerequisites

### Required Software
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- [Node.js 18+](https://nodejs.org/)
- [Firebase CLI](https://firebase.google.com/docs/cli) (installed automatically)

### Google Cloud Account
1. Create a Google Cloud account at [console.cloud.google.com](https://console.cloud.google.com/)
2. Set up a billing account (required for Cloud Run, even on free tier)
3. **IMPORTANT**: The setup script will create a $0.01 budget alert

## 🏗️ Architecture

### Web App (Firebase Hosting)
- **Technology**: React/Vite with TypeScript
- **Hosting**: Firebase Hosting (Free Tier)
- **Build**: Static files optimized for CDN
- **SSL**: Automatic HTTPS certificates

### API (Cloud Run)
- **Technology**: Node.js/Express API
- **Hosting**: Google Cloud Run (Free Tier)
- **Container**: Docker container with Node.js 18 Alpine runtime
- **Scaling**: 0 to 10 instances (scales to zero when not in use)

## 📁 File Structure

```
gcp-setup/
├── README.md                 # This file
├── billing-controls.md       # Detailed billing protection guide
├── setup.sh                  # Initial setup script
├── deploy-web.sh            # Web app deployment
├── deploy-api.sh            # API deployment
└── workflows/               # GitHub Actions workflows
    ├── deploy-web.yml
    └── deploy-api.yml

frontend/
├── firebase.json            # Firebase Hosting config
├── .firebaserc              # Firebase project config
├── vite.config.ts           # Vite configuration
└── ...

backend/
├── Dockerfile              # Container configuration
├── package.json            # Node.js dependencies
└── ...
```

## 🔧 Configuration Details

### Firebase Hosting Configuration
- **Public Directory**: `dist/` (Vite output)
- **Caching**: Optimized for static assets
- **Rewrites**: Single-page app routing
- **Clean URLs**: Enabled for better SEO

### Cloud Run Configuration
- **Memory**: 512Mi (within free tier)
- **CPU**: 1 vCPU (within free tier)
- **Concurrency**: 100 requests per instance
- **Timeout**: 60 seconds
- **Min Instances**: 0 (scales to zero)
- **Max Instances**: 10 (prevents runaway scaling)

## 🛡️ Safety Measures

### 1. Budget Controls
The setup creates a budget with:
- **Alert at $0.01**: Immediate email notification
- **Monitoring**: Real-time usage tracking
- **Limits**: Resource quotas to prevent overage

### 2. Resource Limits
All services are configured with:
- **Minimum resources**: To stay within free tier
- **Maximum limits**: To prevent accidental scaling
- **Timeout controls**: To prevent long-running processes

### 3. Monitoring
- **Usage Dashboard**: Real-time monitoring
- **Billing Alerts**: Email notifications
- **Audit Logs**: Track all resource usage

## 🚨 Emergency Procedures

### If You See Any Charges
1. **Immediate Action**: 
   - Go to [Google Cloud Console](https://console.cloud.google.com/billing)
   - Disable billing account immediately
   
2. **Check Resources**:
   - Delete any unintended resources
   - Review Cloud Run instances
   - Check Firebase Hosting usage

3. **Contact Support**:
   - File a support ticket with Google Cloud
   - Explain the situation and request charge removal

### Prevention
- **Regular Monitoring**: Check usage weekly
- **Budget Alerts**: Ensure notifications are working
- **Resource Cleanup**: Delete unused resources immediately

## 🔄 Automated Deployment

### GitHub Actions Setup
1. Add these secrets to your GitHub repository:
   - `GCP_PROJECT_ID`: Your Google Cloud project ID
   - `GCP_SA_KEY`: Service account key JSON

2. The workflows will automatically:
   - Deploy web app on pushes to main branch
   - Deploy API when API code changes
   - Run within free tier limits

### Manual Deployment
Use the provided scripts for manual deployment:
```bash
./gcp-setup/deploy-web.sh    # Deploy React app
./gcp-setup/deploy-api.sh    # Deploy Node.js API
```

## 🔍 Troubleshooting

### Common Issues

#### "Billing account not found"
- Ensure you have a billing account set up
- The setup script will guide you through this

#### "Project not found"
- Run `gcloud config set project YOUR_PROJECT_ID`
- Ensure the project exists and you have access

#### "Service not enabled"
- The setup script enables required services
- Manually enable with: `gcloud services enable SERVICE_NAME`

#### "Quota exceeded"
- Check your usage in the Cloud Console
- Ensure you're within free tier limits

### Getting Help
1. Check the [billing controls guide](billing-controls.md)
2. Review Google Cloud documentation
3. File an issue in this repository

## 📊 Monitoring Commands

```bash
# Check billing status
gcloud billing projects describe YOUR_PROJECT_ID

# Monitor Cloud Run usage
gcloud run services list --region=us-central1

# Check Firebase Hosting
firebase hosting:sites:list

# View budget alerts
gcloud billing budgets list --billing-account=YOUR_BILLING_ACCOUNT_ID
```

## 🔄 Updates and Maintenance

### Regular Tasks
1. **Monthly**: Check usage in Cloud Console
2. **Weekly**: Review budget alerts
3. **After deployments**: Verify resource usage

### Updating the Setup
- Re-run `./gcp-setup/setup.sh` to update configurations
- Deploy scripts can be run multiple times safely

## 🆓 Free Tier Guarantee

This setup is designed to:
- ✅ Never exceed free tier limits
- ✅ Scale to zero when not in use
- ✅ Alert immediately if charges occur
- ✅ Use minimal resources
- ✅ Provide production-ready hosting

**Remember**: The free tier has generous limits, but monitoring usage is essential for long-term free hosting.

## 🔗 Useful Links

- [Google Cloud Free Tier](https://cloud.google.com/free)
- [Firebase Hosting Pricing](https://firebase.google.com/pricing)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Budget Alerts Setup](https://cloud.google.com/billing/docs/how-to/budgets)
- [Cloud Console](https://console.cloud.google.com/)

---

**⚠️ IMPORTANT**: Always monitor your usage and keep budget alerts active to maintain free hosting!