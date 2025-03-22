# End-to-End Tests for Test Page

This directory contains Playwright end-to-end tests for the `/test_page` page of the Dottie application. These tests verify that the page behaves correctly in both development and production environments.

## Test Files

- **`development.spec.ts`**: Tests that verify the behavior of the test page in development mode

## What's Being Tested

### Development Mode Tests

- The heading correctly shows "DEVELOPMENT"
- API connection works and returns a message containing "DEVELOPMENT"
- SQLite connection works and returns successful connection message
- Error handling works correctly when API calls fail

## Running the Tests

To run these end-to-end tests, use one of the following commands:

```bash
# Run all e2e tests
npm run test:e2e

# Run with a UI for debugging
npm run test:e2e:ui

# Run only the development tests in Safari
npm run test:e2e:dev
```

## How the Tests Work

1. The Playwright configuration automatically starts the development server
2. Tests navigate to the `/test_page` page and interact with its elements
3. Production mode is simulated by mocking API responses and injecting environment settings

## Notes

- Only Safari is used
- The development server must be running for these tests to work