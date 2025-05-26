# PowerShell script to fix empty imports - Round 2
Write-Host "=== Finding and fixing empty imports - Round 2 ===" -ForegroundColor Green

# Find all TypeScript files with empty import statements
$emptyImportFiles = Get-ChildItem -Path . -Recurse -Include "*.ts", "*.js" | 
    Where-Object { 
        $content = Get-Content $_.FullName -Raw
        $content -match "import\s*\{\s*\}\s*from\s*['\"]"
    }

Write-Host "Found $($emptyImportFiles.Count) files with empty imports:" -ForegroundColor Yellow

# Process each file
foreach ($file in $emptyImportFiles) {
    Write-Host "Processing: $($file.FullName)" -ForegroundColor Cyan
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove empty import statements
    $content = $content -replace "import\s*\{\s*\}\s*from\s*['\"][^'\"]*['\"];\s*\r?\n?", ""
    
    # Remove import statements that only import whitespace
    $content = $content -replace "import\s*\{\s+\}\s*from\s*['\"][^'\"]*['\"];\s*\r?\n?", ""
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  ✓ Fixed empty imports" -ForegroundColor Green
    } else {
        Write-Host "  - No changes needed" -ForegroundColor Gray
    }
}

# Also check for unused import statements
Write-Host "`n=== Checking for potentially unused imports ===" -ForegroundColor Green

$unusedImportCandidates = Get-ChildItem -Path . -Recurse -Include "*.ts", "*.js" | 
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        # Look for import statements that might be unused
        if ($content -match "import\s*\{[^}]*\}\s*from\s*['\"][^'\"]*['\"];") {
            $matches = [regex]::Matches($content, "import\s*\{([^}]*)\}\s*from\s*['\"]([^'\"]*)['\"];")
            foreach ($match in $matches) {
                $imports = $match.Groups[1].Value -split "," | ForEach-Object { $_.Trim() }
                $module = $match.Groups[2].Value
                
                # Check if any of the imports are actually used
                $unusedImports = @()
                foreach ($import in $imports) {
                    if ($import -and $import -ne "" -and $content -notmatch "\b$([regex]::Escape($import))\b.*(?!import)") {
                        $unusedImports += $import
                    }
                }
                
                if ($unusedImports.Count -gt 0) {
                    [PSCustomObject]@{
                        File = $_.FullName
                        Module = $module
                        UnusedImports = $unusedImports -join ", "
                        FullMatch = $match.Value
                    }
                }
            }
        }
    }

if ($unusedImportCandidates) {
    Write-Host "Found potentially unused imports:" -ForegroundColor Yellow
    $unusedImportCandidates | ForEach-Object {
        Write-Host "  File: $($_.File)" -ForegroundColor Cyan
        Write-Host "    Module: $($_.Module)" -ForegroundColor White
        Write-Host "    Unused: $($_.UnusedImports)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "=== Empty imports fix round 2 completed ===" -ForegroundColor Green 