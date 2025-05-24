# Chat Sidebar Component

This directory contains the chat sidebar component and its associated API calls for managing conversation history.

## Components

### ChatSidebar.tsx

A React component that displays a list of previous chat conversations with the following features:

- Shows conversation previews with timestamps
- Allows selecting conversations
- Supports deleting conversations
- Shows "New Chat" button
- Responsive design with dark mode support

## API Structure

### get-list/

Contains API calls for fetching the list of conversations:

- `getConversationsList.ts` - Main API function to fetch conversation history
- `index.ts` - Export file for the API function

## Usage

```tsx
import { ChatSidebar } from './components/sidebar/ChatSidebar';

<ChatSidebar
  onConversationSelect={(conversation) => loadConversation(conversation)}
  onNewChat={() => startNewChat()}
  selectedConversationId={currentConversationId}
/>;
```

## Props

- `onConversationSelect`: Callback when a conversation is selected
- `onNewChat`: Callback when "New Chat" button is clicked
- `selectedConversationId`: ID of currently selected conversation (optional)

## API Integration

The sidebar uses the following API endpoints:

- `GET /api/chat/history` - Fetch conversation list
- `DELETE /api/chat/history/:id` - Delete a conversation
