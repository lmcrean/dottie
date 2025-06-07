# Conversation Data Hooks

This directory contains React hooks specifically for managing conversation data state and loading operations.

## Architecture

The data hooks follow a separation of concerns pattern:
- **State Management**: `useConversationState` - Local state containers
- **Data Loading**: `useConversationLoader` - Async operations and side effects
- **Coordination**: `useConversationData` - Combines state and loading

## Files

### `useConversationData.ts`
**Main coordination hook** that combines state management and data loading:

**Purpose:**
- Provide unified interface for conversation data operations
- Combine state management with loading logic
- Abstract away the complexity of multiple hooks

**Key Features:**
- Combines `useConversationState` and `useConversationLoader`
- Single interface for all conversation data needs
- Handles prop passing between state and loader hooks

**Return Interface:**
```typescript
{
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  currentConversationId: string | null;
  setCurrentConversationId: React.Dispatch<React.SetStateAction<string | null>>;
  assessmentId: string | null;
  setAssessmentId: React.Dispatch<React.SetStateAction<string | null>>;
  assessmentObject: AssessmentData | null;
  setAssessmentObject: React.Dispatch<React.SetStateAction<AssessmentData | null>>;
  isLoading: boolean;
  loadConversation: (conversationId: string) => Promise<boolean>;
  clearConversation: () => void;
}
```

### `useConversationState.ts`
**State management hook** for conversation-related local state:

**Purpose:**
- Manage conversation messages array
- Track current conversation ID
- Handle assessment data and metadata
- Provide state setters and clear functionality

**Key Features:**
- Uses React useState for all conversation state
- Provides clearConversation utility function
- Handles initialization with optional conversationId

**State Managed:**
- `messages: Message[]` - Array of conversation messages
- `currentConversationId: string | null` - Currently active conversation
- `assessmentId: string | null` - Associated assessment ID
- `assessmentObject: AssessmentData | null` - Full assessment data

### `useConversationLoader.ts`
**Data loading hook** for async conversation operations:

**Purpose:**
- Handle conversation data fetching from backend
- Manage loading states during async operations
- Transform API responses to frontend state
- Coordinate with state setters from useConversationState

**Key Features:**
- Uses conversationService for backend communication
- Manages loading boolean state
- Handles errors gracefully (returns success/failure boolean)
- Auto-loads conversation on mount if conversationId provided

**Loading Logic:**
- Fetches conversation data via conversationService
- Transforms messages to frontend Message type
- Updates state via provided setters
- Returns boolean indicating success/failure

### `index.ts`
Export aggregation for data hooks:
- `useConversationData` - Main coordination hook
- `useConversationState` - State management
- `useConversationLoader` - Data loading

## Usage Patterns

```typescript
// Main usage - coordination hook
const {
  messages,
  currentConversationId,
  isLoading,
  loadConversation,
  clearConversation
} = useConversationData({ conversationId: 'conv-123' });

// Advanced usage - individual hooks
const state = useConversationState({ initialConversationId: 'conv-123' });
const { isLoading, loadConversation } = useConversationLoader({
  conversationId: 'conv-123',
  setMessages: state.setMessages,
  setCurrentConversationId: state.setCurrentConversationId,
  setAssessmentId: state.setAssessmentId,
  setAssessmentObject: state.setAssessmentObject,
  currentConversationId: state.currentConversationId
});
```

## Hook Responsibilities

1. **useConversationData**: Unified data interface
2. **useConversationState**: Local state management only
3. **useConversationLoader**: Async operations only

## Dependencies

- React hooks (useState, useEffect)
- `conversationService` for backend communication
- Type definitions from `../../../../types/`
- Message types from `../../../types/chat`

## Testing

See `__tests__/` directory for comprehensive unit tests covering:
- State initialization and updates
- Loading operations and error handling
- Hook coordination and integration
- Edge cases and error boundaries
