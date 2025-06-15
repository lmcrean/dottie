# Conversation Services

This directory contains all services, APIs, and hooks related to conversation management in the chat detail page.

## Architecture Overview

The conversation services follow a layered architecture:
- **Service Layer**: High-level business logic (`conversationService.ts`)
- **API Layer**: HTTP communication with backend (`api/`)
- **Hook Layer**: React state management and UI coordination (`hooks/`)

## Files

### `conversationService.ts`
Main service interface that orchestrates conversation operations. Provides a clean API for:
- Fetching conversation data from backend
- Business logic validation
- Error handling coordination

### `index.ts`
Central export point for all conversation-related functionality. Exports:
- `conversationService` - Main service layer
- `conversationApi` - API layer 
- `useConversationPageState` - Main orchestration hook
- `useConversationData` - Data management hooks
- `useConversationNavigation` - Navigation hooks

## Directory Structure

```
conversation/
├── README.md                    # This file
├── conversationService.ts       # Main service layer
├── index.ts                     # Export aggregation
├── api/                         # HTTP API layer
│   ├── README.md               # API documentation
│   ├── conversationApi.ts      # Conversation HTTP requests
│   └── index.ts                # API exports
└── hooks/                       # React hooks layer
    ├── README.md               # Hooks documentation
    ├── useConversationPageState.ts  # Main orchestration hook
    ├── index.ts                # Hook exports
    ├── data/                   # Data management hooks
    │   └── README.md           # Data hooks documentation
    └── navigation/             # Navigation hooks
        └── README.md           # Navigation documentation
```

## Usage Pattern

```typescript
// Import from main index for clean dependencies
import { 
  conversationService,
  useConversationPageState,
  useConversationData 
} from './services/conversation';

// Use in components
const { messages, handleSend, isLoading } = useConversationPageState({
  chatId: 'conv-123',
  initialMessage: 'Hello'
});
```

## Principles

1. **Single Responsibility**: Each file handles one specific concern
2. **Dependency Injection**: Hooks accept callbacks for coordination
3. **Error Boundaries**: Graceful error handling at each layer
4. **Testability**: Clean interfaces for unit testing
5. **Type Safety**: Full TypeScript coverage with strict types 