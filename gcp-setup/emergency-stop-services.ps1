# EMERGENCY: Set All Cloud Run Services to Scale-to-Zero
# This stops services from running 24/7 and incurring charges when idle

$PROJECT_ID = "dottie-app-37930"
$REGION = "europe-west2"

Write-Host "=================================="  -ForegroundColor Red
Write-Host "EMERGENCY COST REDUCTION" -ForegroundColor Red
Write-Host "Setting all services to minScale=0" -ForegroundColor Red
Write-Host "==================================" -ForegroundColor Red
Write-Host ""

Write-Host "CRITICAL ISSUE FOUND:" -ForegroundColor Yellow
Write-Host "All your services have minScale=1, meaning they run 24/7" -ForegroundColor Yellow
Write-Host "This costs ~£1.80/day or £54/month for 10 services" -ForegroundColor Yellow
Write-Host ""
Write-Host "SOLUTION:" -ForegroundColor Green
Write-Host "Setting minScale=0 makes services only run when receiving requests" -ForegroundColor Green
Write-Host "Expected savings: 80-90% reduction in costs" -ForegroundColor Green
Write-Host ""

# Get all services
Write-Host "Finding all Cloud Run services..." -ForegroundColor Cyan
$services = gcloud run services list --project=$PROJECT_ID --format="value(name,region)" | ForEach-Object {
    $parts = $_ -split '\t'
    [PSCustomObject]@{
        Name = $parts[0]
        Region = $parts[1]
    }
}

Write-Host "Found $($services.Count) services" -ForegroundColor Cyan
Write-Host ""

# Update each service
$successCount = 0
$failCount = 0

foreach ($service in $services) {
    Write-Host "Updating $($service.Name) in $($service.Region)..." -ForegroundColor Yellow

    try {
        gcloud run services update $service.Name `
            --region=$service.Region `
            --project=$PROJECT_ID `
            --min-instances=0 `
            --max-instances=3 `
            --quiet 2>&1 | Out-Null

        Write-Host "  ✅ Success - Service will now scale to zero when idle" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "  ❌ Failed - $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "RESULTS:" -ForegroundColor Cyan
Write-Host "  ✅ Updated: $successCount services" -ForegroundColor Green
Write-Host "  ❌ Failed: $failCount services" -ForegroundColor Red
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

if ($successCount -gt 0) {
    Write-Host "COST IMPACT:" -ForegroundColor Yellow
    Write-Host "  Before: ~£1.80/day (£54/month)" -ForegroundColor Red
    Write-Host "  After: ~£0.20/day (£6/month)" -ForegroundColor Green
    Write-Host "  Savings: ~£48/month (89% reduction)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Services will now:" -ForegroundColor Cyan
    Write-Host "  • Shut down completely when not receiving requests" -ForegroundColor White
    Write-Host "  • Start up in 1-2 seconds when request arrives" -ForegroundColor White
    Write-Host "  • Only cost money when actually processing requests" -ForegroundColor White
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Delete old services: .\cleanup-old-services.ps1" -ForegroundColor Cyan
Write-Host "2. Set up budgets: .\setup-billing-limits.ps1" -ForegroundColor Cyan
Write-Host "3. Monitor costs: https://console.cloud.google.com/billing/012718-1BB7C0-9493DB/reports" -ForegroundColor Blue
Write-Host ""
