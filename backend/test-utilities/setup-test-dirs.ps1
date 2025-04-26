# PowerShell script to set up test directory structure

$routeFolders = @(
    "backend\routes\assessment\update",
    "backend\routes\assessment\delete",
    "backend\routes\assessment\getDetail",
    "backend\routes\assessment\getList"
)

foreach ($route in $routeFolders) {
    # Create directory structure
    $testDir = "$route\__tests__"
    
    # Create dev and unit directories with success and error subdirectories
    mkdir -Force "$testDir\dev\success"
    mkdir -Force "$testDir\dev\error"
    mkdir -Force "$testDir\unit\success"
    mkdir -Force "$testDir\unit\error"
    
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
    
    Write-Host "Created test directory structure for $routeName"
}

Write-Host "All test directories created successfully!" 