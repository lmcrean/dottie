# Test Commands for Master Integration

## Running Full Integration Tests

```bash
npm run test:master
```

## Running Individual Test Categories

```bash
# Landing page tests
npm test -- "src/pages/__tests__/dev/runners/landing"

# Auth tests (coming soon)
npm test -- "src/pages/__tests__/dev/runners/auth"

# User tests (coming soon)
npm test -- "src/pages/__tests__/dev/runners/user"

# Assessment tests (coming soon)
npm test -- "src/pages/__tests__/dev/runners/assessment"

# Chat tests (coming soon)
npm test -- "src/pages/__tests__/dev/runners/chat"
```

## Test Execution Order

The tests should be run in the following sequence to properly simulate user journey:

1. Landing Pages - Basic page rendering and API health checks
2. Authentication - Register and login processes
3. User - Profile viewing and editing
4. Assessment - Creating and viewing assessment data
5. Chat - Conversation functionality
6. Cleanup - Resource deletion

## Running with Safari

All tests are configured to run with Safari only, as specified in the project requirements.

## Test Screenshots

Screenshots are automatically saved to:

```
test_screenshots/page_integration/
```

## Folder Structure

```
runners/
├── landing/          # Landing page and basic health checks
├── auth/             # Authentication tests (planned)
├── user/             # User profile tests (planned)
├── assessment/       # Assessment tests (planned)
├── chat/             # Chat functionality tests (planned)
```

Each module contains the necessary tests for its domain area.
