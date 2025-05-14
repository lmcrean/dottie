# Chat Endpoints Tests

This directory contains tests for the Chat Endpoints component and its associated API service.

## Running the Tests

You can run all tests from the project root with:

```bash
npm test -- "ChatEndpoints"
```

Or run specific tests:

```bash
# Run just the component tests
npm test -- "ChatEndpoints/ChatEndpoints.test.tsx"

# Run just the API service tests
npm test -- "ChatEndpoints/ChatApiService.test.ts"

# Run just the Axios request tests
npm test -- "ChatEndpoints/ChatAxiosRequests.test.ts"
```

## Test Structure

- `unit/` - Unit tests
  - `ChatEndpoints.test.tsx` - Tests for the ChatEndpoints component
  - `ChatApiService.test.ts` - Tests for the ChatApiService class
  - `ChatAxiosRequests.test.ts` - Specific tests for Axios requests

## Expected Environment Variables

For the backend to work properly, ensure your backend `.env` file contains the necessary configuration for the chat API endpoints. 