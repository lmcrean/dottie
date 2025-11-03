# GCP Billing Controls Setup for dottie-app-37930 (PowerShell)
# This script sets up strict billing controls to prevent unexpected charges

$PROJECT_ID = "dottie-app-37930"
$BILLING_ACCOUNT = "012718-1BB7C0-9493DB"
$BUDGET_AMOUNT = 5  # £5 per month budget

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "GCP Billing Controls Setup" -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "Budget: £$BUDGET_AMOUNT/month" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Set the project
Write-Host "Setting GCP project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Step 1: Create billing budget with alerts
Write-Host ""
Write-Host "Step 1: Creating billing budget..." -ForegroundColor Yellow
Write-Host "This will create alerts at 50%, 75%, 90%, and 100% of budget"

# Create budget with multiple thresholds
$budgetCmd = @"
gcloud billing budgets create `
    --billing-account=$BILLING_ACCOUNT `
    --display-name="Dottie-Monthly-Budget-£$BUDGET_AMOUNT" `
    --budget-amount=${BUDGET_AMOUNT}GBP `
    --threshold-rule=percent=0.5 `
    --threshold-rule=percent=0.75 `
    --threshold-rule=percent=0.9 `
    --threshold-rule=percent=1.0 `
    --filter-projects="projects/$PROJECT_ID"
"@

try {
    Invoke-Expression $budgetCmd
    Write-Host "✅ Budget created successfully" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Budget may already exist - continuing..." -ForegroundColor Yellow
}

# Step 2: List current Cloud Run services
Write-Host ""
Write-Host "Step 2: Auditing Cloud Run services..." -ForegroundColor Yellow
Write-Host "Current services consuming resources:"
gcloud run services list --format="table(name,region,status.url)"

# Step 3: Check current costs
Write-Host ""
Write-Host "Step 3: Checking current costs..." -ForegroundColor Yellow
Write-Host "View detailed billing at:" -ForegroundColor Cyan
Write-Host "https://console.cloud.google.com/billing/012718-1BB7C0-9493DB/reports?project=$PROJECT_ID" -ForegroundColor Blue

# Step 4: Set Cloud Run to minimum resources
Write-Host ""
Write-Host "Step 4: Setting Cloud Run services to minimum resources..." -ForegroundColor Yellow
Write-Host "Updating api-main to minimum configuration..."

try {
    gcloud run services update api-main `
        --region=europe-west2 `
        --min-instances=0 `
        --max-instances=1 `
        --cpu=1 `
        --memory=512Mi `
        --concurrency=80 `
        --timeout=60s `
        --no-cpu-throttling
    Write-Host "✅ Service updated" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Service may not exist" -ForegroundColor Yellow
}

# Step 5: Create cleanup script for old services
Write-Host ""
Write-Host "Creating cleanup-old-services.ps1..." -ForegroundColor Yellow

$cleanupScript = @'
# Cleanup script for old Cloud Run services
# Run this to delete branch deployment services

$PROJECT_ID = "dottie-app-37930"
$REGION = "europe-west2"

# Services to keep (production services)
$KEEP_SERVICES = @("api-main", "dottie-api-main")

Write-Host "Services that will be KEPT:" -ForegroundColor Green
foreach ($service in $KEEP_SERVICES) {
    Write-Host "  ✅ $service" -ForegroundColor Green
}

Write-Host ""
Write-Host "Services that will be DELETED:" -ForegroundColor Red
$allServices = gcloud run services list --project=$PROJECT_ID --region=$REGION --format="value(name)" | Where-Object { $_ -notin $KEEP_SERVICES }
foreach ($service in $allServices) {
    Write-Host "  ❌ $service" -ForegroundColor Red
}

Write-Host ""
$confirm = Read-Host "Do you want to delete these services? (yes/no)"

if ($confirm -eq "yes") {
    foreach ($service in $allServices) {
        Write-Host "Deleting $service..." -ForegroundColor Yellow
        gcloud run services delete $service --project=$PROJECT_ID --region=$REGION --quiet
    }
    Write-Host "✅ Cleanup complete!" -ForegroundColor Green
} else {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
}
'@

$cleanupScript | Out-File -FilePath "cleanup-old-services.ps1" -Encoding UTF8

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ Billing Controls Setup Complete" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Set up email notifications (CRITICAL):" -ForegroundColor Red
Write-Host "   https://console.cloud.google.com/monitoring/alerting/notifications?project=$PROJECT_ID" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Review and clean up old services:" -ForegroundColor Yellow
Write-Host "   .\cleanup-old-services.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Monitor your costs daily:" -ForegroundColor Yellow
Write-Host "   https://console.cloud.google.com/billing/012718-1BB7C0-9493DB/reports?project=$PROJECT_ID" -ForegroundColor Blue
Write-Host ""
Write-Host "4. Current budget: £$BUDGET_AMOUNT/month" -ForegroundColor Yellow
Write-Host "   Alerts at: 50% (£2.50), 75% (£3.75), 90% (£4.50), 100% (£5.00)" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. To check costs anytime:" -ForegroundColor Yellow
Write-Host "   gcloud billing accounts list" -ForegroundColor Cyan
Write-Host ""
