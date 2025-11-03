# Cleanup Script for Old Cloud Run Services
# Deletes branch deployment services to reduce costs

$PROJECT_ID = "dottie-app-37930"

# Services to keep (production services)
$KEEP_SERVICES = @("api-main", "dottie-api-main")

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Cloud Run Service Cleanup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get all services
$allServices = gcloud run services list --project=$PROJECT_ID --format="value(name,region)" | ForEach-Object {
    $parts = $_ -split '\t'
    [PSCustomObject]@{
        Name = $parts[0]
        Region = $parts[1]
    }
}

# Separate services to keep and delete
$servicesToKeep = $allServices | Where-Object { $KEEP_SERVICES -contains $_.Name }
$servicesToDelete = $allServices | Where-Object { $KEEP_SERVICES -notcontains $_.Name }

Write-Host "Services that will be KEPT:" -ForegroundColor Green
if ($servicesToKeep.Count -eq 0) {
    Write-Host "  (none)" -ForegroundColor Gray
} else {
    foreach ($service in $servicesToKeep) {
        Write-Host "  ✅ $($service.Name) ($($service.Region))" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Services that will be DELETED:" -ForegroundColor Red
if ($servicesToDelete.Count -eq 0) {
    Write-Host "  (none - all services are production)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "✅ No cleanup needed!" -ForegroundColor Green
    exit 0
} else {
    foreach ($service in $servicesToDelete) {
        Write-Host "  ❌ $($service.Name) ($($service.Region))" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "COST IMPACT:" -ForegroundColor Yellow
Write-Host "  Deleting $($servicesToDelete.Count) services" -ForegroundColor White
Write-Host "  Estimated savings: £$($servicesToDelete.Count * 1.5)/month" -ForegroundColor Green
Write-Host ""

$confirm = Read-Host "Type 'DELETE' to confirm deletion (or anything else to cancel)"

if ($confirm -eq "DELETE") {
    Write-Host ""
    Write-Host "Deleting services..." -ForegroundColor Yellow

    $deleteCount = 0
    $failCount = 0

    foreach ($service in $servicesToDelete) {
        Write-Host "Deleting $($service.Name) in $($service.Region)..." -ForegroundColor Yellow

        try {
            gcloud run services delete $service.Name `
                --project=$PROJECT_ID `
                --region=$service.Region `
                --quiet 2>&1 | Out-Null

            Write-Host "  ✅ Deleted" -ForegroundColor Green
            $deleteCount++
        }
        catch {
            Write-Host "  ❌ Failed - $($_.Exception.Message)" -ForegroundColor Red
            $failCount++
        }
    }

    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "CLEANUP COMPLETE" -ForegroundColor Cyan
    Write-Host "  ✅ Deleted: $deleteCount services" -ForegroundColor Green
    Write-Host "  ❌ Failed: $failCount services" -ForegroundColor Red
    Write-Host "  💰 Estimated savings: £$($deleteCount * 1.5)/month" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Remaining services:" -ForegroundColor Cyan
    gcloud run services list --project=$PROJECT_ID --format="table(name,region,status.url)"

} else {
    Write-Host ""
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    Write-Host "No services were deleted." -ForegroundColor White
}

Write-Host ""
