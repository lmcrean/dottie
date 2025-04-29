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

To run the integration test:

```bash
# From the backend directory
npx playwright test dev/tests/master-integration/master-integration.api.pw.spec.js --headed
```

The `--headed` flag will show the test execution in the browser window.

## Adding More Tests

To add more functionality:

1. Add new utility functions to the appropriate file in the `runners/` directory
2. Update the master integration test to use these new functions
3. Maintain the logical order: authentication → assessment → user actions

## Debugging

If a test fails, you can debug it using several approaches:

1. Check the Playwright report for detailed error information
2. Look for console log messages that indicate which operation failed
3. Inspect the specific module where the failure occurred

## Test Data

The test utilities provide functions to generate test data:

- `auth.generateTestUser()` - Creates user data for registration
- `assessment.generateDefaultAssessment()` - Creates a default assessment
- `assessment.generateSevereAssessment()` - Creates an assessment with severe symptoms
- `user.generateProfileUpdate()` - Creates data for profile updates 