# PowerShell script to run backend server and Playwright tests

Write-Host "Starting backend server..."
$serverJob = Start-Job -ScriptBlock {
    Set-Location -Path "C:\Projects\dottie\backend"
    npm run dev
}

# Give the server time to start
Write-Host "Waiting for server to start..."
Start-Sleep -Seconds 5

Write-Host "Running Playwright tests..."
Set-Location -Path "C:\Projects\dottie\backend\dev"
npx playwright test --project=api

# Stop the server job
Write-Host "Stopping backend server..."
Stop-Job -Job $serverJob
Remove-Job -Job $serverJob 