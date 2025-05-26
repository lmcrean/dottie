# PowerShell script to fix incorrect type import paths
Write-Host "Starting type import path fixes..."

# Define the mappings of file patterns to correct import paths
$importFixMappings = @{
    # For test files in __tests__/models/
    '__tests__/models/**/*.ts' = @{
        'from' = '../types/common'
        'to' = '../../../types/common'
    }
    # For files in models/chat/conversation/create-new-conversation/__tests__/
    'models/chat/conversation/create-new-conversation/__tests__/*.ts' = @{
        'from' = '../types/common'
        'to' = '../../../../../types/common'
    }
    # For files in models/chat/message/user-message/add-message/__tests__/
    'models/chat/message/user-message/add-message/__tests__/*.ts' = @{
        'from' = '../types/common'
        'to' = '../../../../../../types/common'
    }
    # For files in models/user/__tests__/
    'models/user/__tests__/*.ts' = @{
        'from' = '../types/common'
        'to' = '../../../types/common'
    }
    # For files in routes/__tests__/e2e/
    'routes/__tests__/e2e/**/*.ts' = @{
        'from' = '../types/common'
        'to' = '../../../types/common'
    }
    # For files in routes/assessment/__tests__/
    'routes/assessment/__tests__/**/*.ts' = @{
        'from' = '../types/common'
        'to' = '../../../../types/common'
    }
    # For files in routes/assessment/create/__tests__/
    'routes/assessment/create/__tests__/**/*.ts' = @{
        'from' = '../types/common'
        'to' = '../../../../../types/common'
    }
}

$totalFixedFiles = 0

foreach ($pattern in $importFixMappings.Keys) {
    $mapping = $importFixMappings[$pattern]
    $fromImport = $mapping.from
    $toImport = $mapping.to
    
    Write-Host "Fixing pattern: $pattern"
    Write-Host "  From: $fromImport"
    Write-Host "  To: $toImport"
    
    # Get all matching files
    $files = Get-ChildItem -Path . -Filter "*.ts" -Recurse | 
        Where-Object { $_.FullName -like "*$($pattern.Replace('**/', '*').Replace('*.ts', '*.ts'))" }
    
    foreach ($file in $files) {
        $content = Get-Content $file.FullName -Raw
        if ($content -match [regex]::Escape("from '$fromImport'")) {
            $newContent = $content -replace [regex]::Escape("from '$fromImport'"), "from '$toImport'"
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "  Fixed: $($file.FullName)"
            $totalFixedFiles++
        }
    }
}

# Additional specific pattern fixes
Write-Host "`nFixing additional specific patterns..."

# Fix any remaining ../types/common imports with more specific logic
$allTsFiles = Get-ChildItem -Path . -Filter "*.ts" -Recurse
foreach ($file in $allTsFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "from '\.\./types/common'") {
        # Calculate the correct path based on file location
        $relativePath = $file.FullName.Replace($PWD.Path, "").Replace("\", "/")
        $depth = ($relativePath.Split("/").Length) - 2  # Subtract 2 for current file and root
        
        if ($depth -gt 1) {
            $correctPath = ("../" * ($depth - 1)) + "types/common"
            $newContent = $content -replace "from '\.\./types/common'", "from '$correctPath'"
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "  Additional fix: $($file.FullName) -> $correctPath"
            $totalFixedFiles++
        }
    }
}

Write-Host "`nType import path fixes completed!"
Write-Host "Total files fixed: $totalFixedFiles" 