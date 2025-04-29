# Dottie API End-to-End Tests

This directory contains Playwright end-to-end tests for the Dottie API endpoints.

## Setup

The tests are configured to use only Safari browser for UI tests as per project requirements.

## File Naming Convention

To avoid conflicts between Playwright and Vitest, we use the following naming convention:
- Playwright API tests: `*.api.pw.spec.js`
- Playwright UI tests: `*.ui.pw.spec.js`
- Vitest tests (in other directories): `*.test.js`

This separation ensures that Playwright doesn't try to run Vitest tests and vice versa.

## Test Order

When running tests, it's important to follow this order:
1. Setup endpoints tests
2. Basic API endpoints tests 
3. Authentication endpoints tests
4. Assessment endpoints tests
5. User endpoints tests

This order ensures that dependencies between tests are respected (e.g., auth tests need to run before user tests).

## Automatic Server Management

These tests run against the actual backend server. The Playwright configuration includes a `webServer` setting that automatically:

- Starts the backend server before tests run
- Waits for it to be available at http://localhost:5000
- Runs the tests
- Shuts down the server when tests complete

## Running Tests

From the `backend` directory, run:

```bash
# Run all tests
npx playwright test

# Run tests in the correct order
npm run test:api:ordered

# Run specific test suites
npx playwright test -g "setup"
npx playwright test -g "Basic API"
npx playwright test -g "Authentication"
npx playwright test -g "Assessment"  
npx playwright test -g "User"

# Run only API tests (without browser)
npx playwright test --project=api

# Run only browser tests (with Safari)
npx playwright test --project=browser
```

## Viewing Reports

After running tests, you can view the generated HTML report:
```bash
npm run test:api:report
```

## Test Files

- `api-basic-endpoints.api.pw.spec.js` - Tests for basic endpoints:
  - `/api/hello` - Simple greeting endpoint
  - `/api/setup/database/status` - Database connection status
- `api-auth-endpoints.api.pw.spec.js` - Tests for authentication-related endpoints:
  - `/api/auth/signup` - Register a new user
  - `/api/auth/login` - Authenticate and get token
  - `/api/auth/users` - Get all users
  - `/api/auth/users/:id` - Get specific user
  - `/api/auth/logout` - Logout user
- `api-assessment-endpoints.api.pw.spec.js` - Tests for assessment-related endpoints:
  - `/api/assessment/send` - Submit a new assessment
  - `/api/assessment/list` - Get all assessments
  - `/api/assessment/:id` - Get, update or delete specific assessment
- `api-setup-endpoints.api.pw.spec.js` - Tests for setup-related endpoints:
  - `/api/setup/health/hello` - Health check endpoint
  - `/api/setup/database/status` - Database connection status
  - `/api/setup/database/hello` - Database connectivity test with query
- `api-user-endpoints.api.pw.spec.js` - Tests for user-related endpoints (using auth routes):
  - `/api/auth/users` - List all users
  - `/api/auth/users/:id` - Get, update and delete specific users

## Notes

- The `webServer` feature automatically manages the backend server for live testing
- Some tests may be skipped if prerequisites aren't met (e.g., authentication token not available)
- Test user data includes timestamps to avoid conflicts with existing data 