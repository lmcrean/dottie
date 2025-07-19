# Google Cloud Billing Controls - ZERO COST GUARANTEE

## CRITICAL: Complete These Steps BEFORE Creating Any Resources

### 1. Set Up Billing Account with $0 Budget Alert

```bash
# Create a billing budget that alerts at $0.01 and stops at $1.00
gcloud billing budgets create \
    --billing-account=YOUR_BILLING_ACCOUNT_ID \
    --display-name="Zero-Cost-Alert" \
    --budget-amount=1.00 \
    --threshold-rule=percent=0.01,spend-basis=CURRENT_SPEND \
    --threshold-rule=percent=100,spend-basis=CURRENT_SPEND,alert-consumed-budget=true

# Set up billing alerts for immediate notification
gcloud alpha billing budgets create \
    --billing-account=YOUR_BILLING_ACCOUNT_ID \
    --display-name="Immediate-Alert" \
    --budget-amount=0.01 \
    --all-updates-rule-monitoring-notification-channels=YOUR_NOTIFICATION_CHANNEL \
    --threshold-rule=percent=1.0,spend-basis=CURRENT_SPEND
```

### 2. Enable Required APIs (FREE TIER ONLY)

```bash
# Enable only the free APIs we need
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    firebase.googleapis.com \
    iamcredentials.googleapis.com \
    storage.googleapis.com
```

### 3. Set Up Project Quotas and Limits

```bash
# Set strict quotas to prevent accidental charges
gcloud compute project-info add-metadata \
    --metadata google-compute-default-region=us-central1 \
    --metadata google-compute-default-zone=us-central1-a

# Create a quota policy for Cloud Run (free tier limits)
gcloud alpha resource-manager org-policies set-policy quota-policy.yaml
```

### 4. Create IAM Roles with Minimal Permissions

```bash
# Create a custom role for deployment with minimal permissions
gcloud iam roles create deploymentRole \
    --project=YOUR_PROJECT_ID \
    --title="Deployment Role" \
    --description="Minimal permissions for free tier deployment" \
    --permissions="run.services.create,run.services.update,run.services.get,run.services.list,cloudbuild.builds.create,storage.objects.create,storage.objects.get"
```

## FREE TIER LIMITS - NEVER EXCEED THESE

### Firebase Hosting (FREE FOREVER)
- **Storage**: 10 GB
- **Bandwidth**: 10 GB/month
- **Custom Domain**: 1 included
- **SSL Certificates**: Unlimited (free)

### Cloud Run (FREE TIER)
- **CPU**: 180,000 vCPU-seconds/month
- **Memory**: 360,000 GiB-seconds/month
- **Requests**: 2 million/month
- **Bandwidth**: 1 GB/month egress to North America

### Cloud Build (FREE TIER)
- **Build Minutes**: 120 minutes/day
- **Storage**: First 10 GB free

## AUTOMATIC BILLING PROTECTION

### 1. Set Up Billing Alerts

Create `billing-alert-function.js`:
```javascript
// Cloud Function to automatically disable billing if threshold exceeded
exports.billingAlert = (data, context) => {
    const budget = data.budgetDisplayName;
    const amount = data.costAmount;
    const threshold = data.alertThresholdExceeded;
    
    if (threshold > 0.01) {
        // Disable billing account
        console.error(`BILLING ALERT: $${amount} spent on ${budget}`);
        // Add logic to disable services or notify
    }
};
```

### 2. Create Monitoring Dashboard

```yaml
# monitoring-dashboard.yaml
displayName: "Free Tier Monitoring"
mosaicLayout:
  tiles:
    - widget:
        title: "Cloud Run Requests"
        xyChart:
          dataSets:
            - timeSeriesQuery:
                timeSeriesFilter:
                  filter: 'resource.type="cloud_run_revision"'
                  aggregation:
                    alignmentPeriod: "60s"
                    perSeriesAligner: "ALIGN_RATE"
```

## DEPLOYMENT SAFETY CHECKS

### Pre-Deployment Checklist
- [ ] Billing account has $0 budget alert
- [ ] Cloud Run configured with minimum resources
- [ ] Firebase Hosting within 10GB limit
- [ ] No premium features enabled
- [ ] Monitoring alerts active
- [ ] Deployment scripts include cost checks

### Emergency Procedures
If any charges appear:
1. Immediately disable billing account
2. Delete all non-essential resources
3. Contact Google Cloud Support
4. Review audit logs for unauthorized usage

## COST MONITORING COMMANDS

```bash
# Check current billing
gcloud billing accounts get-billing-info YOUR_PROJECT_ID

# Monitor usage
gcloud logging read "resource.type=cloud_run_revision" --limit=10 --format=json

# Check quotas
gcloud compute project-info describe --format="value(quotas)"
``` 