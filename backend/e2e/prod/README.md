# Production E2E Tests

This directory contains the production configuration for E2E tests.

## DRY Approach
Following DRY (Don't Repeat Yourself) principles, production tests now use the same test runners as development tests (`e2e/dev/runners`) but with production-specific configuration.

## Configuration
- **Test Files**: Uses `e2e/dev/master-integration.api.pw.spec.js` (shared with dev)
- **Runners**: Uses `e2e/dev/runners/*` (shared with dev)  
- **Config**: Uses `playwright.prod.config.js` with production URL
- **Base URL**: `https://dottie-backend-piqudv2ms-lmcreans-projects.vercel.app`

## Running Tests
```bash
npm run test:prod           # Run production tests
npm run test:prod:verbose   # Run with detailed output
npm run test:prod:deployed  # Deploy first, then test
```

## Test Order
Tests follow the same order as development:
1. Setup endpoints
2. Authentication endpoints  
3. Assessment endpoints
4. User endpoints
5. Chat endpoints