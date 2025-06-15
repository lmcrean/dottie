# Conversation API Tests

This directory contains unit tests for the conversation API layer.

## Test Files

### `conversationApi.test.ts`
**Unit tests for HTTP API functions**

**Test Coverage:**
- `fetchConversation()` HTTP requests
- Response handling and transformation
- Error handling strategies (404, network, auth)
- Parameter validation and conversion

**Test Scenarios:**
1. **Successful conversation fetch**
   - Verifies correct API endpoint called
   - Validates request parameters
   - Confirms response data returned unchanged

2. **404 Error Handling**
   - Returns `null` for 404 responses
   - Does not throw error for missing conversations
   - Uses axios.isAxiosError for error detection

3. **Network Error Handling**  
   - Propagates network errors to caller
   - Maintains error details for debugging
   - Logs errors for monitoring

4. **Parameter Conversion**
   - Converts conversationId to string
   - Handles numeric IDs correctly
   - Validates API path construction

**Mocking Strategy:**
- Mocks `apiClient` from core API module
- Mocks `axios` for error type checking
- Isolates HTTP logic from business logic

### `index.test.ts`
**Export verification tests**

**Test Coverage:**
- Verifies `conversationApi` export
- Ensures clean module interface
- Validates API object structure

## Running Tests

```bash
cd frontend

# Run all API tests
npm test -- "conversation/api/__tests__"

# Run specific test files
npm test -- "conversationApi.test.js"
npm test -- "conversation/api/__tests__/index.test.js"
```

## Test Patterns

### API Layer Testing
- **Mock HTTP Client**: apiClient is mocked for isolation
- **Test HTTP Behavior**: Focus on request/response handling
- **Error Scenarios**: Test all error paths and edge cases
- **Response Validation**: Ensure correct data flow

### Mock Setup
```typescript
// Mock HTTP client
vi.mock('../../../../../../../api/core/apiClient');
vi.mock('axios');

const mockApiClient = vi.mocked(apiClient);
const mockAxios = vi.mocked(axios);

// Setup response mocks
mockApiClient.get.mockResolvedValue({ data: mockResponse });
```

### Error Testing
```typescript
// 404 error simulation
const mockError = { response: { status: 404 } };
mockAxios.isAxiosError.mockReturnValue(true);
mockApiClient.get.mockRejectedValue(mockError);
```

## Test Data

### Mock Conversation Response
```typescript
const mockConversationResponse = {
  id: 'conv-123',
  messages: [
    { id: 'msg-1', content: 'Hello', role: 'user', created_at: '2024-01-01T10:00:00Z' }
  ],
  assessment_id: 'assess-1',
  assessment_object: {
    id: 'assess-1',
    pattern: 'regular',
    key_findings: ['Normal cycle']
  }
};
```

## Dependencies Tested

- `apiClient` (mocked) - HTTP request handling
- `axios` (mocked) - Error type checking
- Response type interfaces
- URL path construction

## Coverage Goals

- 100% line coverage for API functions
- All HTTP error scenarios tested
- Parameter validation verified
- Response transformation validated 