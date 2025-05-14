# Frontend Test Page Integration Test

## Run Command

```bash
npx playwright test src/test_page/__tests__/dev/test-page-integration.spec.ts
```

Or use the npm script:

```bash
npm run test:devmode
```

This command runs the frontend test page integration test using the default Playwright configuration, which uses Safari as specified.

## What This Test Covers

1. **Navigation**: Verifies the test page loads correctly
2. **Setup Endpoints**: Tests basic API health and database connection
3. **Authentication**: Registers a new user and logs in
4. **Assessment Endpoints**: Creates, lists, and deletes assessments
5. **User Endpoints**: Gets and updates user profile information
6. **Chat Endpoints**: Creates conversations, sends messages, and manages chat history
7. **Cleanup**: Removes test data created during the test

## Expected Results

All tests should pass successfully, validating that the frontend test page correctly interacts with all key backend endpoints.

## Screenshots

Test screenshots will be saved in the configured directories under `test_screenshots/test_page/frontend-integration/`. 