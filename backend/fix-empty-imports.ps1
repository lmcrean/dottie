#!/usr/bin/env pwsh

Write-Host "🔧 Fixing Empty Import Statements..." -ForegroundColor Green

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
            
            # Fix empty app imports
            if ($content -match 'import app from '''';') {
                $content = $content -replace 'import app from '''';', 'import app from ''../../../server.js'';'
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix empty User imports
            if ($content -match 'import User from '''';') {
                $content = $content -replace 'import User from '''';', 'import User from ''../../../models/user/User.js'';'
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix empty db imports with curly braces
            if ($content -match 'import \{ db \} from '''';') {
                $content = $content -replace 'import \{ db \} from '''';', 'import { db } from ''../../db/index.js'';'
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix empty db default imports
            if ($content -match 'import db from '''';') {
                $content = $content -replace 'import db from '''';', 'import db from ''../../db/index.js'';'
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix empty findById imports
            if ($content -match "import \{ findById \} from '';") {
                $content = $content -replace "import \{ findById \} from '';", "import { findById } from '../../services/db-service/findById.js';"
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix empty test utilities imports
            if ($content -match "import \{ setupTestClient, closeTestServer \} from '';") {
                $content = $content -replace "import \{ setupTestClient, closeTestServer \} from '';", "import { setupTestClient, closeTestServer } from '../../test-utilities/setup.js';"
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix empty resolveFromRoot imports
            if ($content -match "import \{ resolveFromRoot \} from '';") {
                $content = $content -replace "import \{ resolveFromRoot \} from '';", "import { resolveFromRoot } from '../paths.js';"
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix empty updateAssessmentSchema imports
            if ($content -match "import \{ updateAssessmentSchema \} from '';") {
                $content = $content -replace "import \{ updateAssessmentSchema \} from '';", "import { updateAssessmentSchema } from '../../db/migrations/updateAssessmentSchema.js';"
                $fileFixed = $true
                $totalFixes++
            }
            
            # Fix .ts extension imports (replace .ts with .js)
            if ($content -match "from '[^']*\.ts';") {
                $content = $content -replace "\.ts';", ".js';"
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
Write-Host "✅ Import Fix Summary:" -ForegroundColor Green
Write-Host "Files processed: $($files.Count)"
Write-Host "Files with fixes: $filesFixed" 
Write-Host "Total import fixes applied: $totalFixes"
Write-Host ""
Write-Host "🎯 Run 'npx tsc --noEmit' to check progress!" -ForegroundColor Cyan 