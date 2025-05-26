# Assessment API Integration Tests

This directory contains end-to-end integration tests for the assessment API endpoints. The tests validate the complete lifecycle of assessment operations in a single sequential flow.

## Test Lifecycle Flow

The integration test executes operations in the following sequence:

1. **Create** - First, create a new assessment using `/api/assessment/send`
2. **Get Detail** - Then retrieve the specific assessment details using `/api/assessment/:id`
3. **Get List** - Verify the assessment appears in the list using `/api/assessment/list`
4. **Delete** - Finally delete the assessment using `/api/assessment/:userId/:id`

## Implementation Approach

- A single test file executes all four operations in sequence
- Each step depends on the success of the previous step
- The same test server and port are used throughout the test
- State (like assessment ID) is maintained between test steps
- Tests use a consistent set of mock user data

This approach validates the full API lifecycle in a realistic usage scenario, ensuring data consistency and proper API behavior across operations.

## Current Test Status

| Operation                      | Expected Status | Validation                                            |
|--------------------------------|----------------|-------------------------------------------------------|
| Create Assessment              | 201            | Returns assessment with ID and correct data           |
| Get Assessment Detail          | 200            | Returns matching assessment data for the created ID   |
| List User Assessments          | 200            | Returns array including the created assessment        |
| Delete Assessment              | 200            | Returns success message and assessment no longer exists |

## Running the Integration Test

```bash
npm test -- "routes/assessment/__tests__/e2e/dev/integration-test.js"
```
