# PowerShell script to fix imports with empty string paths
Write-Host "=== Finding and fixing empty string imports ===" -ForegroundColor Green

# Find all TypeScript files with empty string imports
$emptyStringImports = Get-ChildItem -Path . -Recurse -Include "*.ts", "*.js" | 
    Where-Object { 
        $content = Get-Content $_.FullName -Raw
        $content -match "import\s+[^;]+from\s*['\`"]\s*['\`"]"
    }

Write-Host "Found $($emptyStringImports.Count) files with empty string imports:" -ForegroundColor Yellow

# Process each file
foreach ($file in $emptyStringImports) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Cyan
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Find all import statements with empty strings
    $matches = [regex]::Matches($content, "import\s+([^;]+)from\s*['\`"]\s*['\`"];?")
    
    if ($matches.Count -gt 0) {
        Write-Host "  Found $($matches.Count) empty string imports:" -ForegroundColor Yellow
        
        foreach ($match in $matches) {
            $fullImport = $match.Value
            $importPart = $match.Groups[1].Value.Trim()
            
            Write-Host "    - $($fullImport.Trim())" -ForegroundColor Red
        }
        
        # Comment out empty string imports for manual review
        $content = $content -replace "import\s+([^;]+)from\s*['\`"]\s*['\`"];?", "// TODO: Fix import path - import `$1from '';"
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            Write-Host "  ✓ Commented out empty string imports for manual review" -ForegroundColor Green
        }
    }
}

Write-Host "=== Empty string imports fix completed ===" -ForegroundColor Green
Write-Host "Note: Empty string imports have been commented out for manual review." -ForegroundColor Yellow 