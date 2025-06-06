# Conversation Hooks Tests

This directory contains unit tests for the main conversation hooks.

## Test Files

### `useConversationPageState.test.ts`
**Unit tests for the main orchestration hook**

**Test Coverage:**
- Hook initialization and state management
- Integration with multiple specialized hooks
- Initial message auto-sending logic
- Loading state coordination
- Event handler functionality

**Test Scenarios:**
1. **Initialization**
   - Correct default state values
   - Proper hook coordination setup
   - Parameter passing to sub-hooks

2. **Initial Message Handling**
   - Auto-sends initial message when provided
   - Prevents duplicate sends with ref tracking
   - Handles send failures gracefully
   - Only sends when conversation is empty

3. **State Coordination**
   - Combines loading states correctly
   - Forwards state updates from data hooks
   - Maintains input state consistency

4. **Event Handlers**
   - `handleSend` forwards to message sending hook
   - `sendFromInput` coordinates input clearing
   - Keyboard event handling
   - Navigation event delegation

**Mocking Strategy:**
- Mocks all dependency hooks individually
- Uses React Testing Library for hook testing
- Isolates orchestration logic from implementations

### `index.test.ts`
**Export verification tests**

**Test Coverage:**
- Verifies all hook exports are available
- Ensures clean module interface
- Validates function types

## Running Tests

```bash
cd frontend

# Run all main hooks tests
npm test -- "conversation/hooks/__tests__"

# Run specific test files
npm test -- "useConversationPageState.test.js"
npm test -- "conversation/hooks/__tests__/index.test.js"
```

## Test Patterns

### Hook Testing
- **React Testing Library**: Use renderHook for isolated testing
- **Mock Dependencies**: Mock all external hooks and services
- **State Testing**: Verify state updates and side effects
- **Act Wrapper**: Use act() for state changes and async operations

### Mock Setup
```typescript
// Mock all dependency hooks
vi.mock('../data/useConversationData');
vi.mock('../../messages/hooks/useMessageSending');
vi.mock('../../messages/hooks/useInputState');
vi.mock('../../messages/hooks/useInputSender');
vi.mock('../navigation/useConversationNavigation');

// Setup hook return values
vi.mocked(useConversationData).mockReturnValue({
  messages: [],
  currentConversationId: null,
  // ... other state
});
```

### Initial Message Testing
```typescript
// Test auto-send behavior
const { result } = renderHook(() => useConversationPageState({
  chatId: 'conv-123',
  initialMessage: 'Hello world',
  onSidebarRefresh: vi.fn()
}));

// Verify sendMessage was called
expect(mockSendMessage).toHaveBeenCalledWith('Hello world');
```

## Test Data

### Mock Hook Returns
```typescript
const mockConversationData = {
  messages: [],
  setMessages: vi.fn(),
  currentConversationId: null,
  assessmentId: null,
  assessmentObject: null,
  isLoading: false,
  loadConversation: vi.fn(),
  clearConversation: vi.fn()
};
```

## Dependencies Tested

- Data hooks (mocked) - Conversation state management
- Message hooks (mocked) - Message sending and input
- Navigation hooks (mocked) - Route coordination
- React hooks - useRef, useEffect integration
- Hook coordination patterns

## Coverage Goals

- 100% line coverage for orchestration logic
- All useEffect dependencies tested
- Event handler functionality verified
- State coordination validated
- Error boundaries tested 