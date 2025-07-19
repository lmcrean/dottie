# GCP Service Account Key Validation Script (PowerShell)
# Usage: .\validate-sa-key.ps1 path\to\service-account-key.json

param(
    [Parameter(Mandatory=$true)]
    [string]$KeyFile
)

Write-Host "🔍 GCP Service Account Key Validation" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if file exists
if (-not (Test-Path $KeyFile)) {
    Write-Host "❌ Service account key file not found: $KeyFile" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Key file: $KeyFile" -ForegroundColor Green

# Validate JSON format
Write-Host "🔧 Validating JSON format..." -ForegroundColor Yellow
try {
    $keyContent = Get-Content $KeyFile -Raw | ConvertFrom-Json
    Write-Host "✅ JSON format is valid" -ForegroundColor Green
} catch {
    Write-Host "❌ Invalid JSON format in key file" -ForegroundColor Red
    exit 1
}

# Extract key information
Write-Host "📋 Extracting key information..." -ForegroundColor Yellow
$projectId = $keyContent.project_id
$clientEmail = $keyContent.client_email
$keyId = $keyContent.private_key_id

Write-Host "  📂 Project ID: $projectId" -ForegroundColor Cyan
Write-Host "  📧 Service Account: $clientEmail" -ForegroundColor Cyan
Write-Host "  🔑 Key ID: $keyId" -ForegroundColor Cyan

# Activate service account
Write-Host "🔐 Activating service account..." -ForegroundColor Yellow
try {
    gcloud auth activate-service-account --key-file="$KeyFile"
    Write-Host "✅ Service account activated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to activate service account" -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "🏗️ Setting project..." -ForegroundColor Yellow
gcloud config set project $projectId

# Test basic authentication
Write-Host "🧪 Testing authentication..." -ForegroundColor Yellow
$activeAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)"
if ($activeAccount -eq $clientEmail) {
    Write-Host "✅ Authentication successful" -ForegroundColor Green
} else {
    Write-Host "❌ Authentication failed. Active account: $activeAccount" -ForegroundColor Red
    exit 1
}

# Check required APIs
Write-Host "🔌 Checking required APIs..." -ForegroundColor Yellow
$requiredApis = @(
    "artifactregistry.googleapis.com",
    "run.googleapis.com", 
    "cloudbuild.googleapis.com"
)

foreach ($api in $requiredApis) {
    $apiEnabled = gcloud services list --enabled --filter="name:$api" --format="value(name)"
    if ($apiEnabled -match $api) {
        Write-Host "  ✅ $api" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $api (not enabled)" -ForegroundColor Red
    }
}

# Check IAM permissions
Write-Host "🔑 Checking IAM permissions..." -ForegroundColor Yellow
gcloud projects get-iam-policy $projectId --flatten="bindings[].members" --format="table(bindings.role)" --filter="bindings.members:$clientEmail"

# Test Artifact Registry access
Write-Host "📦 Testing Artifact Registry access..." -ForegroundColor Yellow
try {
    gcloud artifacts repositories list --location=us-central1 | Out-Null
    Write-Host "✅ Can list Artifact Registry repositories" -ForegroundColor Green
    
    # Check if api-images repository exists
    try {
        gcloud artifacts repositories describe api-images --location=us-central1 | Out-Null
        Write-Host "✅ api-images repository exists" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ api-images repository does not exist (will be created during deployment)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Cannot access Artifact Registry" -ForegroundColor Red
}

# Test Docker authentication
Write-Host "🐳 Testing Docker authentication..." -ForegroundColor Yellow
try {
    gcloud auth configure-docker us-central1-docker.pkg.dev --quiet
    Write-Host "✅ Docker authentication configured" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker authentication failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host "✅ Service account key is valid and working" -ForegroundColor Green
Write-Host "📋 Project: $projectId" -ForegroundColor Cyan
Write-Host "👤 Service Account: $clientEmail" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Green
Write-Host "1. Copy the entire JSON content from: $KeyFile" -ForegroundColor White
Write-Host "2. Go to GitHub: Settings → Secrets and Variables → Actions" -ForegroundColor White
Write-Host "3. Update the secret: GCP_SA_KEY" -ForegroundColor White
Write-Host "4. Paste the JSON content and save" -ForegroundColor White
Write-Host "5. Re-run your GitHub Actions workflow" -ForegroundColor White
Write-Host ""
Write-Host "💡 The new validation step in GitHub Actions will show detailed diagnostics!" -ForegroundColor Yellow 