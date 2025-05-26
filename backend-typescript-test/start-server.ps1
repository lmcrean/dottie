# PowerShell script to start the backend server
# This script is intended to be called from the test setup

# Change to the backend directory (if not already there)
Set-Location $PSScriptRoot

# Run the backend server
npm run dev 