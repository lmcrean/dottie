# Conversation Hooks Layer

This directory contains React hooks for managing conversation state, data loading, and UI coordination.

## Architecture

The hooks layer is organized in a hierarchical pattern:
- **Main Orchestration**: `useConversationPageState` coordinates all functionality
- **Data Management**: `data/` hooks handle state and loading
- **Navigation**: `navigation/` hooks handle routing and conversation switching

## Files

### `useConversationPageState.ts`
**Main orchestration hook** that combines all conversation functionality:

**Purpose:**
- Coordinate conversation data, message sending, input handling, and navigation
- Manage high-level chat page state including the currently active conversation
- Handle initial message auto-sending logic

**Key Features:**
- Combines multiple specialized hooks
- Manages combined loading state
- Handles initial message auto-send (replaces old useInitialMessage)
- Provides unified interface for chat page components

**Return Interface:**
```typescript
{
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  currentConversationId: string | null;
  handleSend: (messageText: string) => Promise<void>;
  sendFromInput: () => Promise<void>;
  handleConversationSelect: (conversation: ConversationListItem) => void;
  handleNewChat: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  assessmentId: string | null;
  assessmentObject: AssessmentData | null;
}
```

### `index.ts`
Export aggregation for all hooks:
- `useConversationPageState` - Main orchestration hook
- `useConversationData` - Data management (from data/)
- `useConversationNavigation` - Navigation (from navigation/)

## Subdirectories

### `data/`
Contains hooks for conversation data management:
- State management (useConversationState)
- Data loading (useConversationLoader) 
- Combined data coordination (useConversationData)

### `navigation/`
Contains hooks for conversation navigation:
- Conversation switching (useConversationNavigation)
- URL navigation and routing

## Usage Pattern

```typescript
// Main orchestration hook - use in chat page component
const {
  messages,
  input,
  setInput,
  isLoading,
  handleSend,
  handleConversationSelect,
  handleNewChat
} = useConversationPageState({
  chatId: 'conv-123',
  initialMessage: 'Hello',
  onSidebarRefresh: refreshSidebar
});

// Or use individual hooks for specific needs
const { messages, loadConversation } = useConversationData({
  conversationId: 'conv-123'
});

const { handleConversationSelect } = useConversationNavigation({
  onConversationLoad: loadConversation
});
```

## Hook Responsibilities

1. **useConversationPageState**: Full page orchestration
2. **useConversationData**: Data state and loading
3. **useConversationNavigation**: Route navigation
4. **useConversationState**: Local state management
5. **useConversationLoader**: Async data loading

## Dependencies

- React hooks (useState, useEffect, useRef)
- React Router (useNavigate)
- Message hooks from `../messages/hooks/`
- Conversation service layer
- Type definitions from `../../types/`

## Testing

Each hook has comprehensive unit tests in respective `__tests__/` directories covering:
- State management
- Side effects
- Error handling
- Integration with dependencies 