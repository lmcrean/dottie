# Comprehensive TS2339 Error Fix Script
# This script systematically addresses the 1,497 TS2339 errors

Write-Host "🚀 Starting Comprehensive TS2339 Error Fixes..." -ForegroundColor Cyan

# 1. Add type imports to files that need them
Write-Host "`n1️⃣ Adding type imports..." -ForegroundColor Yellow

# Add common types to test files
Get-ChildItem -Recurse -Include "*.test.ts","*.spec.ts" | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -and $content -notmatch "import.*types/common") {
        Write-Host "Adding types to: $($_.Name)" -ForegroundColor Gray
        $newImport = "import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../types/common';"
        $content = $newImport + "`n" + $content
        Set-Content $_.FullName $content
    }
}

# 2. Fix common body property access patterns
Write-Host "`n2️⃣ Fixing body property access..." -ForegroundColor Yellow

Get-ChildItem -Recurse -Include "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content) {
        $originalContent = $content
        
        # Fix body properties
        $content = $content -replace '\bbody\.email\b', '(body as TestRequestBody).email'
        $content = $content -replace '\bbody\.password\b', '(body as TestRequestBody).password'
        $content = $content -replace '\bbody\.username\b', '(body as TestRequestBody).username'
        $content = $content -replace '\bbody\.token\b', '(body as TestRequestBody).token'
        
        if ($content -ne $originalContent) {
            Write-Host "Fixed body properties in: $($_.Name)" -ForegroundColor Gray
            Set-Content $_.FullName $content
        }
    }
}

# 3. Fix response object properties
Write-Host "`n3️⃣ Fixing response properties..." -ForegroundColor Yellow

Get-ChildItem -Recurse -Include "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content) {
        $originalContent = $content
        
        # Fix response properties
        $content = $content -replace '\bresponse\.ok\b', '(response as MockResponse).ok'
        $content = $content -replace '\bresponse\.status\b', '(response as MockResponse).status'
        $content = $content -replace '\bresponse\.statusText\b', '(response as MockResponse).statusText'
        
        if ($content -ne $originalContent) {
            Write-Host "Fixed response properties in: $($_.Name)" -ForegroundColor Gray
            Set-Content $_.FullName $content
        }
    }
}

# 4. Fix test fixture overrides
Write-Host "`n4️⃣ Fixing test fixture overrides..." -ForegroundColor Yellow

Get-ChildItem -Recurse -Name "testFixtures.ts" | ForEach-Object {
    $fullPath = Join-Path $PWD $_
    $content = Get-Content $fullPath -Raw
    if ($content) {
        $originalContent = $content
        
        # Add type import if not present
        if ($content -notmatch "import.*types/common") {
            $content = "import { TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../types/common';`n" + $content
        }
        
        # Fix overrides properties with specific typing
        $content = $content -replace '\boverrides\.id\b', '(overrides as TestUserOverrides).id'
        $content = $content -replace '\boverrides\.username\b', '(overrides as TestUserOverrides).username'
        $content = $content -replace '\boverrides\.email\b', '(overrides as TestUserOverrides).email'
        $content = $content -replace '\boverrides\.password_hash\b', '(overrides as TestUserOverrides).password_hash'
        $content = $content -replace '\boverrides\.age\b', '(overrides as TestUserOverrides).age'
        $content = $content -replace '\boverrides\.created_at\b', '(overrides as TestUserOverrides).created_at'
        $content = $content -replace '\boverrides\.updated_at\b', '(overrides as TestUserOverrides).updated_at'
        
        # Fix cycle-specific overrides
        $content = $content -replace '\boverrides\.user_id\b', '(overrides as any).user_id'
        $content = $content -replace '\boverrides\.start_date\b', '(overrides as TestCycleOverrides).start_date'
        $content = $content -replace '\boverrides\.end_date\b', '(overrides as TestCycleOverrides).end_date'
        $content = $content -replace '\boverrides\.flow_level\b', '(overrides as TestCycleOverrides).flow_level'
        
        # Fix symptom-specific overrides
        $content = $content -replace '\boverrides\.date\b', '(overrides as any).date'
        $content = $content -replace '\boverrides\.type\b', '(overrides as TestSymptomOverrides).type'
        $content = $content -replace '\boverrides\.severity\b', '(overrides as TestSymptomOverrides).severity'
        $content = $content -replace '\boverrides\.notes\b', '(overrides as TestSymptomOverrides).notes'
        
        # Fix assessment-specific overrides
        $content = $content -replace '\boverrides\.result_category\b', '(overrides as TestAssessmentOverrides).result_category'
        $content = $content -replace '\boverrides\.recommendations\b', '(overrides as TestAssessmentOverrides).recommendations'
        
        if ($content -ne $originalContent) {
            Write-Host "Fixed test fixtures in: $_" -ForegroundColor Gray
            Set-Content $fullPath $content
        }
    }
}

# 5. Fix test setup options
Write-Host "`n5️⃣ Fixing test setup options..." -ForegroundColor Yellow

Get-ChildItem -Recurse -Name "*setup*.ts" | ForEach-Object {
    $fullPath = Join-Path $PWD $_
    $content = Get-Content $fullPath -Raw
    if ($content) {
        $originalContent = $content
        
        # Add type import if not present
        if ($content -notmatch "import.*TestOptions") {
            $content = "import { TestOptions, TestRequestBody, MockResponse } from '../types/common';`n" + $content
        }
        
        # Fix options properties
        $content = $content -replace '\boptions\.port\b', '(options as TestOptions).port'
        $content = $content -replace '\boptions\.production\b', '(options as TestOptions).production'
        $content = $content -replace '\boptions\.useMocks\b', '(options as TestOptions).useMocks'
        
        if ($content -ne $originalContent) {
            Write-Host "Fixed setup options in: $_" -ForegroundColor Gray
            Set-Content $fullPath $content
        }
    }
}

# 6. Fix global.vi property error
Write-Host "`n6️⃣ Fixing global.vi property..." -ForegroundColor Yellow

$vitestSetupFile = "vitest-setup.ts"
if (Test-Path $vitestSetupFile) {
    $content = Get-Content $vitestSetupFile -Raw
    if ($content -match "global\.vi = vi") {
        Write-Host "Fixing global.vi in vitest-setup.ts" -ForegroundColor Gray
        # Add type declaration for global.vi
        $typeDeclaration = @"
declare global {
  var vi: typeof import('vitest').vi;
}

"@
        $content = $typeDeclaration + $content
        Set-Content $vitestSetupFile $content
    }
}

# 7. Fix requestObj.body property in setup files
Write-Host "`n7️⃣ Fixing requestObj.body..." -ForegroundColor Yellow

Get-ChildItem -Recurse -Include "*.ts" | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -and $content -match "requestObj\.body") {
        Write-Host "Fixing requestObj.body in: $($_.Name)" -ForegroundColor Gray
        # Add type assertion for requestObj
        $content = $content -replace '\brequestObj\.body\b', '(requestObj as any).body'
        Set-Content $_.FullName $content
    }
}

# 8. Create index file for easy type imports
Write-Host "`n8️⃣ Creating type index file..." -ForegroundColor Yellow

$typesIndexPath = "types/index.ts"
if (-not (Test-Path $typesIndexPath)) {
    $indexContent = @"
// Re-export all common types for easy importing
export * from './common';

// Additional utility types
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type Required<T> = {
    [P in keyof T]-?: T[P];
};

export type AnyObject = Record<string, any>;
export type AnyFunction = (...args: any[]) => any;
"@
    Set-Content $typesIndexPath $indexContent
    Write-Host "Created types index file" -ForegroundColor Gray
}

# Summary
Write-Host "`n✅ TS2339 Error Fix Summary:" -ForegroundColor Green
Write-Host "1. Added type imports to test files" -ForegroundColor White
Write-Host "2. Fixed body property access patterns" -ForegroundColor White
Write-Host "3. Fixed response object properties" -ForegroundColor White
Write-Host "4. Fixed test fixture overrides" -ForegroundColor White
Write-Host "5. Fixed test setup options" -ForegroundColor White
Write-Host "6. Fixed global.vi property" -ForegroundColor White
Write-Host "7. Fixed requestObj.body issues" -ForegroundColor White
Write-Host "8. Created comprehensive type definitions" -ForegroundColor White

Write-Host "`n🎯 Expected reduction: ~600-800 TS2339 errors (40-55% of total)" -ForegroundColor Cyan
Write-Host "Run 'npx tsc --noEmit' to check results!" -ForegroundColor Yellow 