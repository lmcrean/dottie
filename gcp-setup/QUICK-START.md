# 🚀 Quick Start Guide - FREE Google Cloud Hosting

## ⚡ 3-Step Setup (15 minutes)

### Step 1: Prerequisites
1. **Google Cloud Account**: Create at [console.cloud.google.com](https://console.cloud.google.com/)
2. **Install Google Cloud CLI**: [Download here](https://cloud.google.com/sdk/docs/install)
3. **Node.js 18+**: [Download here](https://nodejs.org/)

### Step 2: Run Setup Script
```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the setup script
./gcp-setup/setup.sh
```

The script will:
- ✅ Create or configure your Google Cloud project
- ✅ Set up billing with $0.01 alert
- ✅ Enable required APIs (free tier only)
- ✅ Configure Firebase and Cloud Run
- ✅ Create monitoring dashboard

### Step 3: Deploy Your Apps
```bash
# Deploy web app to Firebase Hosting
./gcp-setup/deploy-web.sh

# Deploy API to Cloud Run
./gcp-setup/deploy-api.sh
```

## 🎉 You're Live!

Your apps are now hosted on Google Cloud **completely free**:
- **Web App**: `https://YOUR_PROJECT_ID.web.app`
- **API**: `https://YOUR_API_URL/api/health`

## 🔒 Safety Features Active

- **$0.01 Budget Alert**: Immediate email if any charges occur
- **Free Tier Limits**: All services capped at free tier usage
- **Auto-scaling**: Scales to zero when not in use
- **Monitoring**: Real-time usage tracking

## 📊 Monitor Your Usage

Visit these URLs to monitor your free tier usage:
- **Billing**: https://console.cloud.google.com/billing
- **Firebase**: https://console.firebase.google.com
- **Cloud Run**: https://console.cloud.google.com/run

## 🤖 Optional: Automated Deployment

### Setup GitHub Actions
```bash
# Install workflows
./gcp-setup/install-workflows.sh

# Add these secrets to your GitHub repository:
# GCP_PROJECT_ID: Your project ID
# GCP_SA_KEY: Service account key JSON
```

Now your apps deploy automatically on every push to main!

## 🆓 Free Tier Limits

### Firebase Hosting
- **Storage**: 10GB
- **Bandwidth**: 10GB/month
- **Custom domain**: 1 included
- **SSL**: Unlimited free certificates

### Cloud Run
- **Requests**: 2 million/month
- **CPU**: 180,000 vCPU-seconds/month
- **Memory**: 360,000 GiB-seconds/month
- **Bandwidth**: 1GB/month egress

### Cloud Build
- **Build time**: 120 minutes/day
- **Storage**: 10GB free

## 🚨 Emergency: If You See Charges

1. **Immediate**: Go to [billing console](https://console.cloud.google.com/billing)
2. **Disable**: Turn off billing account
3. **Delete**: Remove any unintended resources
4. **Contact**: Google Cloud Support for charge removal

## 🔗 Quick Links

- [📖 Full Documentation](README.md)
- [💰 Billing Controls Guide](billing-controls.md)
- [🌐 Google Cloud Console](https://console.cloud.google.com/)
- [🔥 Firebase Console](https://console.firebase.google.com/)

---

**✅ GUARANTEED FREE**: This setup ensures you never pay for hosting your portfolio! 