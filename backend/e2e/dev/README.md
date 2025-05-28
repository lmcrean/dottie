# Integration Testing for Dottie API

This directory contains integration tests for the Dottie API backend.

## Directory Structure

- `master-integration.api.pw.spec.js` - Main integration test file that tests all endpoints in a logical sequence
- `runners/` - Directory containing modular utility files for different test areas:
  - `auth.js` - Authentication utilities (user registration, login, token management)
  - `assessment.js` - Assessment utilities (creating, updating, getting assessments)
  - `user.js` - User utilities (profile management, user information)

## Test Flow

The integration tests follow this flow, separating concerns into logical modules:

1. **Authentication**:
   - Register a new user
   - Login with the created user
   - Verify authentication tokens

2. **Assessment**:
   - Create assessments
   - Get assessment lists
   - Get specific assessments
   - Update assessments
   - Delete assessments

3. **User**:
   - Get user information
   - Update user profiles
   - Manage user accounts
## Modular Design

The test is designed with a modular approach:

- Each domain area (auth, assessment, user) has its own utility file with specialized functions
- The master integration test imports these utilities and uses them in the correct order
- This approach makes the tests more maintainable and easier to extend

## Running Tests

To run the playwright test:

```bash
# From the backend directory
cd backend; npx playwright test e2e/dev/master-integration/master-integration.api.pw.spec.js --config=playwright.config.js
```

To run the vitest test:

```bash
cd backend;     npm test -- "e2e/dev/master-integration/master-integration.api.vitest.test.js"
```