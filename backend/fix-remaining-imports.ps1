#!/usr/bin/env pwsh

Write-Host "Starting fix for remaining import issues..."

$totalFixedFiles = 0

# 1. Fix incorrect paths for __tests__/models/ files (should be ../../../types/common)
Write-Host "Fixing __tests__/models/ type import paths..."
$testFiles = Get-ChildItem -Path "__tests__/models/" -Filter "*.ts" -Recurse
foreach ($file in $testFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "from '\.\./\.\./types/common'") {
        $newContent = $content -replace "from '\.\./\.\./types/common'", "from '../../../types/common'"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "  Fixed path in: $($file.FullName)"
        $totalFixedFiles++
    }
}

# 2. Fix empty import statements throughout the codebase
Write-Host "`nFixing empty import statements..."
$allTsFiles = Get-ChildItem -Path . -Filter "*.ts" -Recurse
foreach ($file in $allTsFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix common empty imports
    $content = $content -replace "import .* from '';", "// TODO: Fix empty import"
    $content = $content -replace "import .* from """";", "// TODO: Fix empty import"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Fixed empty imports in: $($file.FullName)"
        $totalFixedFiles++
    }
}

# 3. Look for any remaining ../types/common imports and calculate correct paths
Write-Host "`nFixing any remaining ../types/common import paths..."
foreach ($file in $allTsFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "from '\.\./types/common'") {
        # Calculate correct path based on directory depth
        $relativePath = $file.FullName.Replace($PWD.Path, "").Replace("\", "/")
        $pathParts = $relativePath.Split("/") | Where-Object { $_ -ne "" }
        $depth = $pathParts.Length - 1  # Subtract 1 for the file itself
        
        $correctPath = ("../" * $depth) + "types/common"
        $newContent = $content -replace "from '\.\./types/common'", "from '$correctPath'"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "  Fixed remaining path in: $($file.FullName) -> $correctPath"
        $totalFixedFiles++
    }
}

Write-Host "`nRemaining import fixes completed!"
Write-Host "Total files fixed: $totalFixedFiles"

Write-Host "Fixing Remaining Empty Import Statements..." -ForegroundColor Green

# Define more specific import fixes
$routeImportFixes = @{
    'import { authenticateToken } from '''';' = 'import { authenticateToken } from ''../auth/middleware/index.js'';'
    'import { validateUserUpdate } from '''';' = 'import { validateUserUpdate } from ''../auth/middleware/validators/userValidators.js'';'
    'import { createTables } from '''';' = 'import { createTables } from ''../db/init.js'';'
    'import initializeSQLiteDatabase from '''';' = 'import initializeSQLiteDatabase from ''../db/init-sqlite.js'';'
    'import { addAssessmentFieldsToConversations } from '''';' = 'import { addAssessmentFieldsToConversations } from ''../db/migrations/addAssessmentFields.js'';'
    'import { addOtherSymptomsColumn } from '''';' = 'import { addOtherSymptomsColumn } from ''../db/migrations/addOtherSymptoms.js'';'
    'import { URLS } from '''';' = 'import { URLS } from ''../test-utilities/urls.js'';'
    'import { createConversation, getAssessmentPattern } from '''';' = 'import { createConversation, getAssessmentPattern } from ''../models/chat/conversation/conversation.js'';'
}

# Server imports
$serverImportFixes = @{
    'import assessmentRoutes from '''';' = 'import assessmentRoutes from ''./routes/assessment/index.js'';'
    'import userRoutes from '''';' = 'import userRoutes from ''./routes/user/index.js'';'
    'import authRoutes from '''';' = 'import authRoutes from ''./routes/auth/index.js'';'
    'import setupRoutes from '''';' = 'import setupRoutes from ''./routes/setup/index.js'';'
    'import chatRoutes from '''';' = 'import chatRoutes from ''./routes/chat/index.js'';'
    'import routes from '''';' = 'import routes from ''./routes/index.js'';'
}

# Service imports
$serviceImportFixes = @{
    'export { default } from '''';' = 'export { default } from ''./index.js'';'
    'export * from '''';' = 'export * from ''./index.js'';'
    'import { update } from '''';' = 'import { update } from ''./update.js'';'
    'import { findByIdWithJson } from '''';' = 'import { findByIdWithJson } from ''./findByIdWithJson.js'';'
}

# Get all TypeScript files
$files = Get-ChildItem -Recurse -Filter "*.ts" -Exclude "*.d.ts"

$filesFixed = 0
$totalFixes = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        
        if ($content) {
            $originalContent = $content
            $fileFixed = $false
            
            # Apply route-specific fixes
            foreach ($pattern in $routeImportFixes.Keys) {
                if ($content.Contains($pattern)) {
                    $content = $content.Replace($pattern, $routeImportFixes[$pattern])
                    $fileFixed = $true
                    $totalFixes++
                }
            }
            
            # Apply server-specific fixes
            foreach ($pattern in $serverImportFixes.Keys) {
                if ($content.Contains($pattern)) {
                    $content = $content.Replace($pattern, $serverImportFixes[$pattern])
                    $fileFixed = $true
                    $totalFixes++
                }
            }
            
            # Apply service-specific fixes
            foreach ($pattern in $serviceImportFixes.Keys) {
                if ($content.Contains($pattern)) {
                    $content = $content.Replace($pattern, $serviceImportFixes[$pattern])
                    $fileFixed = $true
                    $totalFixes++
                }
            }
            
            # Fix @/db/index.js import to relative path
            if ($content.Contains('@/db/index.js')) {
                $content = $content.Replace('@/db/index.js', '../../db/index.js')
                $fileFixed = $true
                $totalFixes++
            }
            
            # Write back if changes were made
            if ($content -ne $originalContent) {
                Set-Content $file.FullName $content -NoNewline
                if ($fileFixed) {
                    Write-Host "Fixed imports in: $($file.Name)" -ForegroundColor Yellow
                    $filesFixed++
                }
            }
        }
    }
    catch {
        Write-Host "Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Remaining Import Fix Summary:" -ForegroundColor Green
Write-Host "Files processed: $($files.Count)"
Write-Host "Files with fixes: $filesFixed" 
Write-Host "Total import fixes applied: $totalFixes"
Write-Host ""
Write-Host "Run 'npx tsc --noEmit' to check progress!" -ForegroundColor Cyan 