# Conversation Data Hooks Tests

This directory contains unit tests for conversation data management hooks.

## Test Files

### `useConversationData.test.ts`
**Unit tests for the main data coordination hook**

**Test Coverage:**
- Hook coordination between state and loader
- Prop passing and interface contracts
- Combined functionality validation
- Return value composition

**Test Scenarios:**
1. **Hook Coordination**
   - Combines state and loader hooks correctly
   - Passes props between hooks appropriately
   - Returns unified interface

2. **State Management Integration**
   - State values are forwarded correctly
   - Setters are available and functional
   - Clear functionality works

3. **Loading Integration**
   - Loading operations are available
   - Loading state is exposed
   - Error handling is maintained

### `useConversationState.test.ts`
**Unit tests for conversation state management**

**Test Coverage:**
- State initialization with/without initial values
- State updates and mutations
- Clear functionality
- State persistence across re-renders

**Test Scenarios:**
1. **Initialization**
   - Empty state by default
   - Initialize with conversationId when provided
   - All state variables have correct initial values

2. **State Updates**
   - Messages array updates correctly
   - ConversationId updates correctly
   - Assessment data updates correctly
   - Multiple updates work sequentially

3. **Clear Functionality**
   - Resets all state to initial values
   - Maintains functional integrity
   - Can be called multiple times safely

### `useConversationLoader.test.ts`
**Unit tests for conversation data loading**

**Test Coverage:**
- Conversation loading operations
- Loading state management
- Error handling scenarios
- Integration with conversation service

**Test Scenarios:**
1. **Successful Loading**
   - Fetches conversation data via service
   - Updates state via provided setters
   - Returns success boolean
   - Manages loading state correctly

2. **Error Handling**
   - Handles service errors gracefully
   - Returns failure boolean
   - Maintains loading state correctly
   - Logs errors appropriately

3. **State Integration**
   - Calls state setters with correct data
   - Transforms API data to frontend format
   - Handles partial data correctly

4. **Auto-loading**
   - Loads conversation on mount when ID provided
   - Handles ID changes appropriately
   - Prevents unnecessary loads

### `index.test.ts`
**Export verification tests**

**Test Coverage:**
- Verifies all data hook exports
- Ensures clean module interface
- Validates hook availability

## Running Tests

```bash
cd frontend

# Run all data hooks tests
npm test -- "conversation/hooks/data/__tests__"

# Run specific test files
npm test -- "useConversationData.test.js"
npm test -- "useConversationState.test.js"
npm test -- "useConversationLoader.test.js"
npm test -- "data/__tests__/index.test.js"
```

## Test Patterns

### Hook Testing with React Testing Library
```typescript
import { renderHook, act } from '@testing-library/react';

const { result } = renderHook(() => useConversationState({}));

act(() => {
  result.current.setMessages([mockMessage]);
});

expect(result.current.messages).toHaveLength(1);
```

### State Update Testing
```typescript
// Test state updates
act(() => {
  result.current.setMessages([message1, message2]);
});

expect(result.current.messages).toEqual([message1, message2]);
```

### Async Loading Testing
```typescript
// Mock service
vi.mocked(conversationService.fetchConversation).mockResolvedValue(mockData);

// Test loading
await act(async () => {
  const success = await result.current.loadConversation('conv-123');
  expect(success).toBe(true);
});

expect(mockSetters.setMessages).toHaveBeenCalledWith(mockData.messages);
```

## Test Data

### Mock Conversation Data
```typescript
const mockConversation = {
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

### Mock State Setters
```typescript
const mockSetters = {
  setMessages: vi.fn(),
  setCurrentConversationId: vi.fn(),
  setAssessmentId: vi.fn(),
  setAssessmentObject: vi.fn()
};
```

## Dependencies Tested

- `useConversationState` (for coordination tests)
- `useConversationLoader` (for coordination tests)
- `conversationService` (mocked for loader tests)
- React hooks (useState, useEffect)
- State setter coordination

## Coverage Goals

- 100% line coverage for all hooks
- All state transitions tested
- Error scenarios covered
- Hook coordination verified
- Async operations validated 