#!/usr/bin/env pwsh

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