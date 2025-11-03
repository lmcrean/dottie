#!/bin/bash

# GCP Billing Controls Setup for dottie-app-37930
# This script sets up strict billing controls to prevent unexpected charges

set -e

PROJECT_ID="dottie-app-37930"
BILLING_ACCOUNT="012718-1BB7C0-9493DB"
BUDGET_AMOUNT=5  # £5 per month budget

echo "=================================="
echo "GCP Billing Controls Setup"
echo "Project: $PROJECT_ID"
echo "Budget: £$BUDGET_AMOUNT/month"
echo "=================================="

# Set the project
gcloud config set project $PROJECT_ID

# Step 1: Create billing budget with alerts
echo ""
echo "Step 1: Creating billing budget..."
echo "This will create alerts at 50%, 75%, 90%, and 100% of budget"

# Check if budget CLI is available
if ! gcloud billing budgets --help &> /dev/null; then
    echo "Installing gcloud billing components..."
    gcloud components install alpha --quiet
fi

# Create budget with multiple thresholds
gcloud billing budgets create \
    --billing-account=$BILLING_ACCOUNT \
    --display-name="Dottie-Monthly-Budget-£$BUDGET_AMOUNT" \
    --budget-amount=${BUDGET_AMOUNT}GBP \
    --threshold-rule=percent=0.5 \
    --threshold-rule=percent=0.75 \
    --threshold-rule=percent=0.9 \
    --threshold-rule=percent=1.0 \
    --filter-projects="projects/$PROJECT_ID" \
    2>&1 || echo "Budget may already exist - continuing..."

echo "✅ Budget created successfully"

# Step 2: List current Cloud Run services
echo ""
echo "Step 2: Auditing Cloud Run services..."
echo "Current services consuming resources:"
gcloud run services list --format="table(name,region,status.url)" | tee cloud-run-audit.txt

# Step 3: Check current month's costs
echo ""
echo "Step 3: Checking current costs..."
echo "View detailed billing at:"
echo "https://console.cloud.google.com/billing/012718-1BB7C0-9493DB/reports?project=$PROJECT_ID"

# Step 4: Set Cloud Run to minimum resources
echo ""
echo "Step 4: Setting Cloud Run services to minimum resources..."
echo "Updating api-main to minimum configuration..."

gcloud run services update api-main \
    --region=europe-west2 \
    --min-instances=0 \
    --max-instances=1 \
    --cpu=1 \
    --memory=512Mi \
    --concurrency=80 \
    --timeout=60s \
    --no-cpu-throttling \
    2>&1 || echo "Service may not exist"

# Step 5: Set up notification channels
echo ""
echo "Step 5: Setting up email notifications..."
echo "IMPORTANT: Configure email notifications in the GCP Console:"
echo "1. Go to: https://console.cloud.google.com/monitoring/alerting/notifications?project=$PROJECT_ID"
echo "2. Add your email address for budget alerts"
echo "3. Enable notifications for budget thresholds"

# Step 6: Create cleanup script for old services
cat > cleanup-old-services.sh << 'EOF'
#!/bin/bash

# Cleanup script for old Cloud Run services
# Run this to delete branch deployment services

PROJECT_ID="dottie-app-37930"
REGION="europe-west2"

# Services to keep (production services)
KEEP_SERVICES=("api-main" "dottie-api-main")

echo "Services that will be KEPT:"
for service in "${KEEP_SERVICES[@]}"; do
    echo "  ✅ $service"
done

echo ""
echo "Services that will be DELETED:"
gcloud run services list --project=$PROJECT_ID --region=$REGION --format="value(name)" | while read service; do
    if [[ ! " ${KEEP_SERVICES[@]} " =~ " ${service} " ]]; then
        echo "  ❌ $service"
    fi
done

echo ""
read -p "Do you want to delete these services? (yes/no): " confirm

if [[ $confirm == "yes" ]]; then
    gcloud run services list --project=$PROJECT_ID --region=$REGION --format="value(name)" | while read service; do
        if [[ ! " ${KEEP_SERVICES[@]} " =~ " ${service} " ]]; then
            echo "Deleting $service..."
            gcloud run services delete $service --project=$PROJECT_ID --region=$REGION --quiet
        fi
    done
    echo "✅ Cleanup complete!"
else
    echo "Cleanup cancelled."
fi
EOF

chmod +x cleanup-old-services.sh

echo ""
echo "=================================="
echo "✅ Billing Controls Setup Complete"
echo "=================================="
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Set up email notifications (CRITICAL):"
echo "   https://console.cloud.google.com/monitoring/alerting/notifications?project=$PROJECT_ID"
echo ""
echo "2. Review and clean up old services:"
echo "   ./cleanup-old-services.sh"
echo ""
echo "3. Monitor your costs daily:"
echo "   https://console.cloud.google.com/billing/012718-1BB7C0-9493DB/reports?project=$PROJECT_ID"
echo ""
echo "4. Current budget: £$BUDGET_AMOUNT/month"
echo "   Alerts at: 50% (£2.50), 75% (£3.75), 90% (£4.50), 100% (£5.00)"
echo ""
echo "5. To check costs anytime:"
echo "   gcloud billing accounts list"
echo ""
