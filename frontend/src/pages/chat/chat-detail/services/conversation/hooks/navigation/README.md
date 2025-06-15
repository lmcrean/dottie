# Conversation Navigation Hooks

This directory contains React hooks for managing navigation between conversations and chat routing.

## Architecture

The navigation hooks focus on URL routing and conversation switching:
- **Route Management**: Using React Router for URL navigation
- **Conversation Switching**: Coordinating conversation loads with navigation
- **State Coordination**: Working with parent hooks for data loading

## Files

### `useConversationNavigation.ts`
**Main navigation hook** for managing conversation routing and switching:

**Purpose:**
- Handle navigation between individual conversation threads
- Manage conversation selection from sidebar
- Create new chat sessions
- Coordinate URL navigation with data loading

**Key Features:**
- Uses React Router's `useNavigate` for URL management
- Provides callback-based coordination with data hooks
- Handles conversation loading via dependency injection
- Separates navigation logic from data loading logic

**Return Interface:**
```typescript
{
  handleConversationSelect: (conversation: ConversationListItem) => void;
  handleNewChat: () => void;
  navigateToConversation: (conversationId: string) => void;
  navigateToChat: () => void;
}
```

**Navigation Functions:**

#### `handleConversationSelect(conversation: ConversationListItem)`
- Triggered when user selects a conversation from sidebar
- Extracts conversationId and calls onConversationLoad callback
- Does NOT navigate (parent component handles URL changes)
- Handles loading errors gracefully

#### `handleNewChat()`
- Triggered when user wants to start a new conversation
- Calls onConversationClear callback to reset state
- Does NOT navigate (parent component handles URL changes)

#### `navigateToConversation(conversationId: string)`
- Direct URL navigation to specific conversation
- Uses React Router navigate with replace: false
- Route: `/chat/${conversationId}`

#### `navigateToChat()`
- Navigate to chat home (no specific conversation)
- Uses React Router navigate with replace: false
- Route: `/chat`

### `index.ts`
Export aggregation for navigation hooks:
- `useConversationNavigation` - Main navigation hook

## Usage Pattern

```typescript
// Typical usage with data loading coordination
const { loadConversation, clearConversation } = useConversationData({
  conversationId: chatId
});

const {
  handleConversationSelect,
  handleNewChat,
  navigateToConversation,
  navigateToChat
} = useConversationNavigation({
  onConversationLoad: loadConversation,
  onConversationClear: clearConversation
});

// In sidebar component
<ConversationItem 
  onClick={() => handleConversationSelect(conversation)}
/>

// In new chat button
<Button onClick={handleNewChat}>
  New Chat
</Button>

// Direct navigation (from URL params, etc.)
useEffect(() => {
  if (conversationId) {
    navigateToConversation(conversationId);
  }
}, [conversationId]);
```

## Coordination Pattern

The navigation hook uses **dependency injection** to coordinate with data loading:

1. **Parent provides callbacks**: `onConversationLoad` and `onConversationClear`
2. **Navigation hook calls callbacks**: When user actions occur
3. **Parent handles data**: Loading/clearing based on navigation actions
4. **URL stays in sync**: Parent components handle URL updates

This pattern ensures:
- Clean separation between navigation and data concerns
- Testable interfaces (mockable callbacks)
- Flexible coordination (different data loading strategies)

## Route Structure

- `/chat` - Chat home page (no active conversation)
- `/chat/:conversationId` - Specific conversation page

## Dependencies

- React Router (`useNavigate`)
- Type definitions from `../../../types/` (ConversationListItem)

## Error Handling

- Conversation loading errors are caught and logged
- Navigation continues even if data loading fails
- No user-facing error UI (handled by parent components)

## Testing

See `__tests__/useConversationNavigation.test.ts` for unit tests covering:
- Navigation function calls
- Callback coordination
- Error handling
- React Router integration 