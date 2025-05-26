# PowerShell script to properly fix empty imports
Write-Host "Starting proper fix for empty imports..."

$totalFixedFiles = 0

# First, revert the comment replacements back to empty imports
Write-Host "Reverting comments back to empty imports..."
$allTsFiles = Get-ChildItem -Path . -Filter "*.ts" -Recurse
foreach ($file in $allTsFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Revert the comment replacements
    $content = $content -replace "// TODO: Fix empty import", "import  from '';"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Reverted comments in: $($file.FullName)"
        $totalFixedFiles++
    }
}

# Now let's find and fix actual empty import patterns
Write-Host "`nFixing actual empty imports..."
foreach ($file in $allTsFiles) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content -eq $null) { continue }
        
        $originalContent = $content
        $lines = $content -split "`n"
        $newLines = @()
        
        for ($i = 0; $i -lt $lines.Length; $i++) {
            $line = $lines[$i]
            
            # Check for empty import patterns and comment them out properly
            if ($line -match "^import .* from '';$" -or $line -match "^import .* from """";$") {
                $newLines += "// TODO: Fix empty import - $line"
                Write-Host "  Fixed empty import in: $($file.FullName) - line $($i+1)"
            }
            else {
                $newLines += $line
            }
        }
        
        $newContent = $newLines -join "`n"
        if ($newContent -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            $totalFixedFiles++
        }
    }
    catch {
        Write-Host "  Skipped file due to access error: $($file.FullName)"
    }
}

Write-Host "`nEmpty import fixes completed!"
Write-Host "Total files processed: $totalFixedFiles" 