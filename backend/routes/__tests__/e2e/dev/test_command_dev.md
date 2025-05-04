```bash
npx playwright test routes/__tests__/e2e/dev/master-integration.api.pw.spec.js -c playwright.dev.config.js
```

This command runs the specific Playwright test file for the dev master integration (`master-integration.api.pw.spec.js`) using the development-specific Playwright configuration (`playwright.dev.config.js`). 

Note: Run this command from the `backend` directory. No need to add `cd backend` before this command if you're already in that directory. 