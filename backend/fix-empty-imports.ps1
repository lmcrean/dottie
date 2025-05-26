#!/usr/bin/env pwsh

Write-Host "🔧 Fixing Empty Import Statements..." -ForegroundColor Green

# Common import fixes based on file location patterns
$importFixes = @{
    # App imports
    'import app from '''';' = 'import app from ''../../../server.js'';'
    'import app from ''./app.js'';' = 'import app from ''../../../server.js'';'
    
    # User model imports
    'import User from '''';' = 'import User from ''../../../models/user/User.js'';'
    'from '''';' = 'from ''../../../models/user/User.js'';'
    
    # Database imports
    'import { db } from '''';' = 'import { db } from ''../../db/index.js'';'
    'import db from '''';' = 'import db from ''../../db/index.js'';'
    
    # DbService imports
    'import { findById } from '''';' = 'import { findById } from ''../../services/db-service/findById.js'';'
    'import { findBy } from '''';' = 'import { findBy } from ''../../services/db-service/findBy.js'';'
    'import { create } from '''';' = 'import { create } from ''../../services/db-service/create.js'';'
    'import { update } from '''';' = 'import { update } from ''../../services/db-service/update.js'';'
    
    # Test utilities
    'import { setupTestClient, closeTestServer } from '''';' = 'import { setupTestClient, closeTestServer } from ''../../test-utilities/setup.js'';'
    'import { resolveFromRoot } from '''';' = 'import { resolveFromRoot } from ''../paths.js'';'
    
    # Assessment imports
    'import { updateAssessmentSchema } from '''';' = 'import { updateAssessmentSchema } from ''../../db/migrations/updateAssessmentSchema.js'';'
    
    # Types imports (for files looking for types)
    'from ''../types/common'';' = 'from ''../../../../types/common.js'';'
    'from ''../../types/common'';' = 'from ''../../../types/common.js'';'
    'from ''../../../types/common'';' = 'from ''../../types/common.js'';'
}

# Files to process (get all TypeScript files)
$files = Get-ChildItem -Recurse -Filter "*.ts" -Exclude "*.d.ts"

$filesFixed = 0
$totalFixes = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    
    if ($content) {
        $originalContent = $content
        $fileFixed = $false
        
        # Apply each fix
        foreach ($pattern in $importFixes.Keys) {
            if ($content -match [regex]::Escape($pattern)) {
                $content = $content -replace [regex]::Escape($pattern), $importFixes[$pattern]
                $fileFixed = $true
                $totalFixes++
            }
        }
        
        # Special handling for different file types and locations
        if ($file.FullName -match "routes.*test") {
            # Route test files need different app import
            $content = $content -replace 'import app from '''';', 'import app from ''../../../../server.js'';'
        }
        
        if ($file.FullName -match "models.*test") {
            # Model test files 
            $content = $content -replace 'import User from '''';', 'import User from ''../User.js'';'
        }
        
        # Fix .ts extension imports (remove .ts for Node.js compatibility)
        $content = $content -replace 'from ''([^'']+)\.ts'';', 'from ''$1.js'';'
        $content = $content -replace 'from "([^"]+)\.ts";', 'from "$1.js";'
        
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

Write-Host "`n✅ Import Fix Summary:" -ForegroundColor Green
Write-Host "Files processed: $($files.Count)"
Write-Host "Files with fixes: $filesFixed"
Write-Host "Total import fixes applied: $totalFixes"
Write-Host "`n🎯 Run 'npx tsc --noEmit' to check progress!" -ForegroundColor Cyan 