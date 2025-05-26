# PowerShell script to fix TS2339 class property errors systematically

Write-Host "🔧 Fixing TS2339 Class Property Errors..." -ForegroundColor Green

# Function to add property declarations to classes
function Add-ClassProperties {
    param($FilePath, $ClassName, $Properties)
    
    $content = Get-Content $FilePath -Raw
    
    # Find class declaration
    $classPattern = "class\s+$ClassName\s*\{"
    if ($content -match $classPattern) {
        Write-Host "Fixing class: $ClassName in $FilePath" -ForegroundColor Yellow
        
        # Create property declarations
        $propertyDeclarations = ""
        foreach ($prop in $Properties) {
            $propertyDeclarations += "  private $($prop.Name): $($prop.Type);`n"
        }
        
        # Insert after class declaration
        $content = $content -replace "($classPattern)", "`$1`n$propertyDeclarations"
        Set-Content $FilePath $content
    }
}

# Fix WebhookService (already done manually)
Write-Host "✅ WebhookService already fixed" -ForegroundColor Green

# Add more class fixes as needed
$classesToFix = @(
    @{
        File = "services/webhookService.ts"
        Class = "WebhookService"
        Properties = @(
            @{Name = "webhookEndpoints"; Type = "WebhookEndpoint[]"},
            @{Name = "retryAttempts"; Type = "number"},
            @{Name = "retryDelay"; Type = "number"}
        )
    }
    # Add more classes here as patterns are identified
)

# Apply fixes
foreach ($classInfo in $classesToFix) {
    if (Test-Path $classInfo.File) {
        Add-ClassProperties -FilePath $classInfo.File -ClassName $classInfo.Class -Properties $classInfo.Properties
    }
}

Write-Host "🎯 Class property fixes completed!" -ForegroundColor Green 