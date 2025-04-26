# PowerShell script to set up test directory structure

# Navigate to the project root
$currentDir = Get-Location
$projectRoot = if ($currentDir -match '(.*\\backend).*') { $matches[1] } else { "..\.." }

$routeFolders = @(
    "$projectRoot\routes\assessment\update",
    "$projectRoot\routes\assessment\delete",
    "$projectRoot\routes\assessment\getDetail",
    "$projectRoot\routes\assessment\getList"
)

foreach ($route in $routeFolders) {
    # Create directory structure
    $testDir = "$route\__tests__"
    
    # Create dev and unit directories with success and error subdirectories
    mkdir -Force "$testDir\dev\success"
    mkdir -Force "$testDir\dev\error"
    mkdir -Force "$testDir\unit\success"
    mkdir -Force "$testDir\unit\error"
    # Create e2e/prod directories with success and error subdirectories
    mkdir -Force "$testDir\e2e\prod\success"
    mkdir -Force "$testDir\e2e\prod\error"
    
    # Create README files with appropriate content
    $routeName = $route.Split('\')[-1]
    
    # Dev Success README
    @"
# Development Success Tests

This folder contains end-to-end and integration tests for the successful $routeName of assessments.

Tests in this folder should verify that the assessment $routeName endpoint works correctly with valid inputs.
"@ | Out-File -FilePath "$testDir\dev\success\README.md" -Encoding utf8
    
    # Dev Error README
    @"
# Development Error Tests

This folder contains end-to-end and integration tests for error handling when performing $routeName operations on assessments.

Tests in this folder should verify that the assessment $routeName endpoint correctly handles invalid inputs and edge cases.
"@ | Out-File -FilePath "$testDir\dev\error\README.md" -Encoding utf8
    
    # Unit Success README
    @"
# Unit Success Tests

This folder contains unit tests for the successful $routeName of assessments.

Tests in this folder should verify that individual functions and components related to assessment $routeName work correctly with valid inputs.
"@ | Out-File -FilePath "$testDir\unit\success\README.md" -Encoding utf8
    
    # Unit Error README
    @"
# Unit Error Tests

This folder contains unit tests for error handling when performing $routeName operations on assessments.

Tests in this folder should verify that individual functions and components related to assessment $routeName correctly handle invalid inputs and edge cases.
"@ | Out-File -FilePath "$testDir\unit\error\README.md" -Encoding utf8
    
    # E2E Prod Success README
    @"
# Production E2E Success Tests

This folder contains end-to-end tests for the successful $routeName of assessments in production environment.

Tests in this folder should verify that the assessment $routeName endpoint works correctly with valid inputs in production conditions.
"@ | Out-File -FilePath "$testDir\e2e\prod\success\README.md" -Encoding utf8
    
    # E2E Prod Error README
    @"
# Production E2E Error Tests

This folder contains end-to-end tests for error handling when performing $routeName operations on assessments in production environment.

Tests in this folder should verify that the assessment $routeName endpoint correctly handles invalid inputs and edge cases in production conditions.
"@ | Out-File -FilePath "$testDir\e2e\prod\error\README.md" -Encoding utf8
    
    Write-Host "Created test directory structure for $routeName"
}

Write-Host "All test directories created successfully!" 