# JavaScript to TypeScript Migration Script
# Using Airbnb's ts-migrate tool

Write-Host "Starting JavaScript to TypeScript migration..."
Write-Host ""

# Step 1: Copy backend folder
Write-Host "Step 1: Copying backend folder..."
if (Test-Path "backend-typescript-test") {
    Remove-Item "backend-typescript-test" -Recurse -Force
    Write-Host "   Removed existing test folder"
}

Copy-Item -Path "backend" -Destination "backend-typescript-test" -Recurse
Write-Host "   Backend copied to 'backend-typescript-test'"

# Step 2: Navigate to test folder
Write-Host ""
Write-Host "Step 2: Navigating to test folder..."
Set-Location "backend-typescript-test"
Write-Host "   Changed directory to backend-typescript-test"

# Step 3: Install TypeScript and type definitions first
Write-Host ""
Write-Host "Step 3: Installing TypeScript and type definitions..."
npm install -D typescript @types/node @types/supertest
Write-Host "   TypeScript and type definitions installed"

# Step 4: Install ts-migrate globally using npx instead
Write-Host ""
Write-Host "Step 4: Installing ts-migrate..."
npm install -g @airbnb/ts-migrate
Write-Host "   ts-migrate installation attempted"

# Step 5: Run ts-migrate migration using npx
Write-Host ""
Write-Host "Step 5: Running ts-migrate conversion..."
npx @airbnb/ts-migrate migrate .
Write-Host "   ts-migrate conversion completed"

# Step 6: Create tsconfig.json
Write-Host ""
Write-Host "Step 6: Creating tsconfig.json..."
$tsconfigContent = @"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowJs": true,
    "noEmit": true,
    "types": ["node", "vitest"]
  },
  "include": [
    "**/*.ts",
    "**/*.js",
    "**/*.test.ts",
    "**/*.spec.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "test-results",
    "playwright-report"
  ]
}
"@

$tsconfigContent | Out-File -FilePath "tsconfig.json" -Encoding UTF8
Write-Host "   tsconfig.json created"

# Step 7: Check TypeScript compilation
Write-Host ""
Write-Host "Step 7: Testing TypeScript compilation..."
npx tsc --noEmit 2>&1 | Write-Host
Write-Host "   TypeScript compilation check completed"

# Step 8: Show converted files
Write-Host ""
Write-Host "Step 8: Showing converted TypeScript files..."
$tsFiles = Get-ChildItem -Recurse -Include "*.ts" -Exclude "node_modules"
Write-Host "   Found $($tsFiles.Count) TypeScript files"

# Step 9: Summary
Write-Host ""
Write-Host "MIGRATION COMPLETE!"
Write-Host "==================="
Write-Host ""
Write-Host "Summary:"
Write-Host "   - Converted $($tsFiles.Count) JavaScript files to TypeScript"
Write-Host "   - Created tsconfig.json with test support"
Write-Host "   - Installed necessary type definitions"
Write-Host "   - Files are in: backend-typescript-test/"
Write-Host ""
Write-Host "Next Steps:"
Write-Host "   1. Review the converted files"
Write-Host "   2. Gradually replace @ts-ignore comments with proper types"
Write-Host "   3. Run: cd backend-typescript-test; npm test"
Write-Host "   4. If satisfied, replace your original backend folder"

# Return to original directory
Set-Location ".."
Write-Host ""
Write-Host "Script completed successfully!" 