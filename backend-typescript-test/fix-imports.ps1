# Fix import paths from .js to .ts
Write-Host "Fixing import paths..."

$files = Get-ChildItem -Recurse -Include "*.ts" | Where-Object { $_.DirectoryName -notmatch "node_modules" }
$count = 0

foreach($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $content -replace "\.js(['\""])", ".ts`$1"
    
    if($content -ne $updated) {
        Set-Content $file.FullName $updated
        $count++
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "Fixed $count files" 