# Conversation Navigation Hooks Tests

This directory contains unit tests for conversation navigation hooks.

## Test Files

### `useConversationNavigation.test.ts`
**Unit tests for conversation navigation and routing**

**Test Coverage:**
- Navigation function calls and URL routing
- Callback coordination with data loading
- Error handling for navigation operations
- React Router integration

**Test Scenarios:**
1. **URL Navigation**
   - `navigateToConversation()` calls React Router correctly
   - `navigateToChat()` navigates to chat home
   - Proper URL parameters and routing options

2. **Conversation Selection**
   - `handleConversationSelect()` extracts ID and calls callback
   - Handles conversation loading via dependency injection
   - Error handling for failed conversation loads

3. **New Chat Creation**
   - `handleNewChat()` calls conversation clear callback
   - Does not perform navigation (parent responsibility)

4. **Error Handling**
   - Gracefully handles callback errors
   - Continues navigation even if data loading fails
   - Logs errors appropriately

**Mocking Strategy:**
- Mocks React Router's `useNavigate` hook
- Mocks callback functions for coordination testing
- Isolates navigation logic from data operations

### `index.test.ts`
**Export verification tests**

**Test Coverage:**
- Verifies `useConversationNavigation` export
- Ensures clean module interface
- Validates hook availability

## Running Tests

```bash
cd frontend

# Run all navigation hooks tests
npm test -- "conversation/hooks/navigation/__tests__"

# Run specific test files
npm test -- "useConversationNavigation.test.js"
npm test -- "navigation/__tests__/index.test.js"
```

## Test Patterns

### Navigation Hook Testing
```typescript
// Mock React Router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Test navigation calls
result.current.navigateToConversation('conv-123');
expect(mockNavigate).toHaveBeenCalledWith('/chat/conv-123', { replace: false });
```

### Callback Coordination Testing
```typescript
// Mock callbacks
const mockCallbacks = {
  onConversationLoad: vi.fn(),
  onConversationClear: vi.fn()
};

// Test callback invocation
const conversation = { id: 'conv-123', title: 'Test Chat' };
result.current.handleConversationSelect(conversation);
expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('conv-123');
```

### Error Handling Testing
```typescript
// Mock callback error
mockCallbacks.onConversationLoad.mockRejectedValue(new Error('Load failed'));

// Should not throw
expect(() => {
  result.current.handleConversationSelect(conversation);
}).not.toThrow();
```

## Test Data

### Mock Conversation Item
```typescript
const mockConversation = {
  id: 'conv-123',
  title: 'Test Conversation',
  created_at: '2024-01-01T10:00:00Z',
  updated_at: '2024-01-01T10:00:00Z'
};
```

### Mock Callbacks
```typescript
const mockCallbacks = {
  onConversationLoad: vi.fn().mockResolvedValue(true),
  onConversationClear: vi.fn()
};
```

## Dependencies Tested

- React Router (`useNavigate`) - Mocked for navigation testing
- Callback functions (mocked) - For coordination testing
- Type interfaces - ConversationListItem validation
- Error handling patterns

## Coverage Goals

- 100% line coverage for navigation functions
- All callback scenarios tested
- Error paths verified
- React Router integration validated
- URL routing patterns confirmed 