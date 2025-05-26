# Test Utilities

Simplified test utilities for the Dottie backend. This approach makes it easy to write tests that can run against both local and remote APIs with the same code, just by changing a configuration parameter.

## Files

- `paths.js` - Path resolution utilities
- `urls.js` - Environment and URL configuration 
- `setupDb.js` - Database setup for tests
- `setup.js` - Test client setup for both local and production environments

## Usage Examples

### Local Development Tests

```javascript
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { setupTestClient, createTestToken, closeTestServer } from '../../../test-utilities/setup.js';

// Store test data
let server;
let request;
let testUserId;
let testToken;

// Setup before tests
beforeAll(async () => {
  // Setup local test client
  const setup = await setupTestClient({ port: 5001 });
  server = setup.server;
  request = setup.request;

  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createTestToken(testUserId);
}, 15000);

// Cleanup after tests
afterAll(async () => {
  await closeTestServer(server);
}, 15000);

// Test suite
describe("Example Test Suite", { tags: ['api', 'dev'] }, () => {
  test("GET /api/health - should return ok", async () => {
    const response = await request.get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });
});
```

### Production Tests

```javascript
import { describe, test, expect, beforeAll } from 'vitest';
import { setupTestClient, createTestToken } from '../../../test-utilities/setup.js';

// Store test data
let request;
let testUserId;
let testToken;

// Setup before tests
beforeAll(async () => {
  // Setup production test client
  const setup = await setupTestClient({ production: true });
  request = setup.request;

  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createTestToken(testUserId, true); // true for production token
}, 15000);

// Test suite
describe("Example Production Test Suite", { tags: ['api', 'prod'] }, () => {
  test("GET /api/health - should return ok", async () => {
    const response = await request.get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });
});
```

## Setting the Environment

You can set the test environment using the `TEST_ENV` environment variable:

```bash
# For development tests
TEST_ENV=DEV npm test

# For production tests
TEST_ENV=PROD npm test
```

Or force the environment in the test itself:

```javascript
const setup = await setupTestClient({ production: true }); // Force production
``` 