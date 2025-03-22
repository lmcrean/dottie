# Production Testing Guide

This directory contains tests specifically designed for production environment testing, including database connectivity and API validation with live services.

## Testing Methods

We use two different testing approaches in this project:

1. **Vitest** - For structured test suites with assertions and mocking capabilities
2. **Direct Node.js Scripts** - For quick database connectivity tests and raw output

## Running Vitest Tests

Vitest tests are structured with assertions and are the primary testing framework:

```bash
# Run all production tests
npm run test:prod

# Run a specific test file
npx vitest run tests/prod/your-test-file.test.js
```

## Running Node.js Script Tests

Some tests are direct Node.js scripts that can be executed directly:

```bash
# To test against production Azure SQL database
$env:NODE_ENV="production"; node --experimental-vm-modules tests/e2e/prod/test-db-final.js

# To check environment variables loading
node --experimental-vm-modules tests/e2e/prod/test-env-vars.js
```

## Available Script Tests

- **test-db-final.js** - Complete database test that correctly loads environment variables and tests connectivity
- **test-env-vars.js** - Tests environment variable loading and configuration
- **azureSql.prod.test.js** - Vitest suite for Azure SQL testing

## Output Files

Some tests generate output files:
- `db-prod-test-output.txt` - Contains production database test results
- `env-vars-output.txt` - Contains environment variables test results

## When to Use Each Approach

- **Use Vitest** when you need:
  - Structured test assertions
  - Mocking capabilities
  - Integration with CI/CD pipelines
  - Test reporting

- **Use Node.js Scripts** when you need:
  - Quick ad-hoc testing
  - Immediate feedback on connectivity issues
  - Raw output for debugging
  - Testing without assertion overhead

## Important Notes

1. **Azure SQL Connection Prerequisites**:
   - Your IP **must be whitelisted** in Azure SQL firewall
   - Connection details in .env must be correct
   - You must have network connectivity to Azure

2. **Environment Variable Loading**:
   - `test-db-final.js` ensures environment variables are loaded before database connection
   - Use `test-env-vars.js` to verify environment variables are loaded correctly

3. **Connection Timeout Issues**:
   - Azure SQL connections typically time out if your IP is not whitelisted
   - Test results are saved to files even when connections time out

4. **Environment Settings**:
   - `$env:NODE_ENV="production"` for Azure SQL
   - `$env:NODE_ENV="development"` for SQLite 