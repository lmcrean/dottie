# Fix all import paths from .js to .ts
Write-Host "Scanning and fixing all import paths..."

$fileTypes = @("*.ts", "*.tsx")
$totalFixed = 0

foreach ($fileType in $fileTypes) {
    $files = Get-ChildItem -Recurse -Include $fileType | Where-Object { 
        $_.DirectoryName -notmatch "node_modules|dist|build|test-results|playwright-report" 
    }
    
    Write-Host "Processing $($files.Count) $fileType files..."
    
    foreach ($file in $files) {
        try {
            $content = Get-Content $file.FullName -Raw -ErrorAction Stop
            
            # Replace import statements: from './path.js' -> from './path.ts'
            $updated = $content -replace "from\s+['""]([^'""]*)\.js['""]\s*;?", "from '`$1.ts';"
            
            # Replace require statements: require('./path.js') -> require('./path.ts')
            $updated = $updated -replace "require\s*\(\s*['""]([^'""]*)\.js['""]\s*\)", "require('`$1.ts')"
            
            # Replace vi.mock statements: vi.mock('./path.js') -> vi.mock('./path.ts')
            $updated = $updated -replace "vi\.mock\s*\(\s*['""]([^'""]*)\.js['""]\s*\)", "vi.mock('`$1.ts')"
            
            if ($content -ne $updated) {
                Set-Content $file.FullName $updated -ErrorAction Stop
                $totalFixed++
                Write-Host "  Fixed: $($file.Name)"
            }
        }
        catch {
            Write-Host "  Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Import path fixing completed!" -ForegroundColor Green
Write-Host "Total files fixed: $totalFixed" -ForegroundColor Cyan 