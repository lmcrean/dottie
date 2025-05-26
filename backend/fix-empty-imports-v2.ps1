#!/usr/bin/env pwsh

Write-Host "Fixing Empty Import Statements..." -ForegroundColor Green

# Define patterns and replacements as variables to avoid parsing issues
$emptyAppImport = 'import app from '''';'
$appReplacement = 'import app from ''../../../server.js'';'

$emptyUserImport = 'import User from '''';'
$userReplacement = 'import User from ''../../../models/user/User.js'';'

$emptyDbImport = 'import { db } from '''';'
$dbReplacement = 'import { db } from ''../../db/index.js'';'

$emptyDbDefaultImport = 'import db from '''';'
$dbDefaultReplacement = 'import db from ''../../db/index.js'';'

$emptyFindByIdImport = 'import { findById } from '''';'
$findByIdReplacement = 'import { findById } from ''../../services/db-service/findById.js'';'

$emptySetupImport = 'import { setupTestClient, closeTestServer } from '''';'
$setupReplacement = 'import { setupTestClient, closeTestServer } from ''../../test-utilities/setup.js'';'

$emptyResolveImport = 'import { resolveFromRoot } from '''';'
$resolveReplacement = 'import { resolveFromRoot } from ''../paths.js'';'

$emptyAssessmentImport = 'import { updateAssessmentSchema } from '''';'
$assessmentReplacement = 'import { updateAssessmentSchema } from ''../../db/migrations/updateAssessmentSchema.js'';'

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
            
            # Fix empty imports using variables
            if ($content.Contains($emptyAppImport)) {
                $content = $content.Replace($emptyAppImport, $appReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            if ($content.Contains($emptyUserImport)) {
                $content = $content.Replace($emptyUserImport, $userReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            if ($content.Contains($emptyDbImport)) {
                $content = $content.Replace($emptyDbImport, $dbReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            if ($content.Contains($emptyDbDefaultImport)) {
                $content = $content.Replace($emptyDbDefaultImport, $dbDefaultReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            if ($content.Contains($emptyFindByIdImport)) {
                $content = $content.Replace($emptyFindByIdImport, $findByIdReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            if ($content.Contains($emptySetupImport)) {
                $content = $content.Replace($emptySetupImport, $setupReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            if ($content.Contains($emptyResolveImport)) {
                $content = $content.Replace($emptyResolveImport, $resolveReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            if ($content.Contains($emptyAssessmentImport)) {
                $content = $content.Replace($emptyAssessmentImport, $assessmentReplacement)
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix .ts extension imports
            if ($content.Contains('.ts'';')) {
                $content = $content.Replace('.ts'';', '.js'';')
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
Write-Host "Import Fix Summary:" -ForegroundColor Green
Write-Host "Files processed: $($files.Count)"
Write-Host "Files with fixes: $filesFixed" 
Write-Host "Total import fixes applied: $totalFixes"
Write-Host ""
Write-Host "Run 'npx tsc --noEmit' to check progress!" -ForegroundColor Cyan 