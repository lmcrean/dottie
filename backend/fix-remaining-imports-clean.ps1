# PowerShell script to fix remaining import issues
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