cd backend; npx playwright test e2e/prod/master-integration.api.pw.spec.js -c playwright.prod.config.js

## Description

This command will run the tests in the `e2e/prod` directory using the `playwright.prod.config.js` configuration file.

The tests will run against the production environment and will test the full API workflow.

## Alternative Command (with deployment)

```bash
cd backend; vercel --prod; npx playwright test e2e/prod/master-integration.api.pw.spec.js -c playwright.prod.config.js
```