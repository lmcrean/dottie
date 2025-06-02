# Conversation Service Tests

This directory contains unit tests for the main conversation service layer.

## Test Files

### `conversationService.test.ts`
**Unit tests for the main conversation service**

**Test Coverage:**
- `fetchConversation()` function behavior
- API layer integration (mocked)
- Error handling and propagation
- Parameter validation

**Test Scenarios:**
1. **Successful conversation fetch**
   - Verifies API call with correct parameters
   - Confirms response data is returned unchanged
   - Validates service acts as clean passthrough

2. **Error handling**
   - API errors are properly propagated
   - No transformation of error objects
   - Error logging verification

**Mocking Strategy:**
- Mocks `conversationApi` from `../api`
- Uses vitest mocking for clean isolation
- Tests service logic without API implementation details

### `index.test.ts`
**Export verification tests**

**Test Coverage:**
- Verifies all required exports are available
- Ensures clean module interface
- Validates no missing exports

**Test Scenarios:**
1. **Export availability**
   - `conversationService` export exists
   - `conversationApi` export exists
   - Hook exports are available

## Running Tests

```bash
cd frontend

# Run all conversation service tests
npm test -- "services/conversation/__tests__"

# Run specific test files
npm test -- "conversationService.test.js"
npm test -- "conversation/__tests__/index.test.js"
```

## Test Patterns

### Service Layer Testing
- **Mock Dependencies**: API layer is mocked for isolation
- **Focus on Logic**: Test business logic, not implementation details
- **Error Boundaries**: Verify error handling and propagation
- **Interface Testing**: Ensure clean input/output contracts

### Mock Setup
```typescript
// Clean mock setup before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Specific mock behavior for test scenarios
vi.mocked(conversationApi.fetchConversation).mockResolvedValue(mockData);
```

### Test Structure
1. **Arrange**: Set up mocks and test data
2. **Act**: Call the service function
3. **Assert**: Verify behavior and results

## Dependencies Tested

- `conversationApi` (mocked)
- Export structure and interface
- Error propagation patterns

## Coverage Goals

- 100% line coverage for service functions
- All error paths tested
- Export interface verified
- Integration points validated 