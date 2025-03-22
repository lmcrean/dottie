# Test Page

This page serves as a development and testing utility for the Dottie application. It provides a way to test backend connectivity and database operations directly from the browser.

## Features

- **Environment Detection**: Displays whether the app is running in `DEVELOPMENT` or `PRODUCTION` mode
- **API Connection Test**: Tests connectivity to the API endpoints
- **SQLite Connection Test**: Tests the SQLite database connection (works in development mode only)

## How to Access

The test page is accessible at the `/test` route:

```
http://localhost:3000/test
```

## API Endpoints Used

This test page interacts with the following API endpoints:

1. **`/api/message`**: Returns a simple message with the current environment information
2. **`/api/db`**: Tests the SQLite database connection and performs a basic query

## Test Architecture

Tests are organized in the `__tests__` directory with the following structure:

```
/app/test/__tests__/
├── GetApiMessage/           # Unit tests for API message functionality
│   ├── GetApiMessage.test.tsx
│   └── AxiosReq.test.tsx
├── DbConnection/            # Unit tests for database connection
│   └── DbConnection.test.tsx
├── TestPage/                # Unit tests for the Test page component
│   └── TestPage.test.tsx
└── e2e/                     # End-to-end tests with Playwright
    ├── development.spec.ts
    ├── production-simulation.spec.ts
    └── README.md
```

## Running Unit Tests

To run the unit tests with Vitest, use one of the following commands:

```bash
# Run all tests
npm test

# Run specific test file or pattern
npm test -- "GetApiMessage"
npm test -- "DbConnection"
npm test -- "TestPage"

# Run in watch mode
npm run test:watch

# Run tests in "yolo" mode (recommended for TDD workflow)
npm run test:yolo
```

## Running End-to-End Tests

To run the Playwright end-to-end tests, use one of the following commands:

```bash
# Run all e2e tests
npm run test:e2e

# Run with a UI for debugging
npm run test:e2e:ui

# Run specifically the development tests
npm run test:e2e:dev
```

## Development Notes

- **In development mode:**
  - The heading will show "DEVELOPMENT"
  - The SQLite connection works for testing database functionality
- **In production mode:**
  - The heading will show "PRODUCTION"
  - The SQLite test will show a message indicating it's not available
- All API responses include timestamps for verification purposes
