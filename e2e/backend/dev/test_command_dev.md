```bash
npx playwright test e2e/dev/master-integration.api.pw.spec.js -c playwright.dev.config.js
```

This command runs the master integration test for the development environment using the development-specific Playwright configuration.

The test covers:
1. Basic API health checks
2. User registration and authentication
3. Assessment creation and management
4. User profile management
5. Cleanup operations

Run this command from the `backend` directory. You should see all tests passing except for the intentionally skipped user deletion test. 