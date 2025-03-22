# End-to-End Integration Tests

This folder contains end-to-end integration tests for the application. These tests verify that the entire application stack works together correctly by simulating real user flows and API interactions.

## Key Characteristics of E2E Tests

- **Real HTTP Requests**: These tests make actual HTTP requests to the API endpoints.
- **Test Server**: A dedicated test server is started for each test suite.
- **Database Interaction**: Tests interact with the actual database (SQLite in test mode).
- **Full User Flows**: Tests simulate complete user journeys from signup to deletion.
- **Cleanup**: Tests handle cleanup of created resources to maintain test isolation.

## userlifecycle.test.js

This test covers a complete user lifecycle:

1. Create a new user
2. Login with the new user
3. Logout the user
4. Login with the new user again
5. Update profile details (multiple iterations):
   1. Update the user's profile
   2. Logout
   3. Login with the updated credentials
6. Delete the user and verify deletion

## assessmentlifecycle.test.js

This test covers a complete assessment management lifecycle:

1. Create a new user
2. Login as this user
3. Post an assessment result
4. Get the assessment result as a detailed object
5. Post a new assessment result with the same user
6. Get the 2 assessment results as a list
7. Update the 2nd assessment result
8. Get the updated 2nd assessment result as a detailed object
9. Delete the 2nd assessment result
10. Get the updated list of assessment results
11. Delete the user

## Running the Tests

To run these end-to-end tests, use:

```
npm test -- backend/tests/e2e/dev/integration
```

Or to run a specific test:

```
npm test -- "backend/tests/e2e/dev/integration/userlifecycle"
```

## Comparison with Unit Tests

Unlike the unit tests in `backend/tests/unit/integration`, these E2E tests:

1. Test the entire system including HTTP layer, routing, controllers, and database
2. Take longer to run but provide higher confidence in system functionality
3. May catch integration issues that unit tests miss
4. Require more setup and teardown resources









