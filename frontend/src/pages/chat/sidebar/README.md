# Chat Sidebar Component

This directory contains the chat sidebar component and its associated API calls for managing conversation history with enhanced assessment integration.

## Components

### ChatSidebar.tsx

A React component that displays a list of previous chat conversations with the following enhanced features:

- Shows conversation previews with timestamps
- **Prominently displays assessment patterns** (e.g., "Regular Heavy Flow")
- Shows user information (user_id)
- Visual indicators for assessment-linked conversations
- Message count display
- Allows selecting conversations
- Supports deleting conversations
- Shows "New Chat" button
- Responsive design with dark mode support

## Fields Used in Sidebar

The sidebar now displays and uses all requested fields:

### Core Fields

- **date** (`last_message_date`) - Timestamp of the last message in the conversation
- **message_count** - Number of messages in the conversation
- **recent_message** (`preview`) - Preview of the most recent message content
- **user_id** (FK) - Foreign key reference to the user who owns the conversation

### Assessment Integration (Foreign Keys)

- **assessment_id** (FK) - Foreign key reference to the assessments table (stored for backend relationships, not displayed in UI)
- **assessment_pattern** (FK) - **Prominently displayed** assessment pattern information (e.g., "Regular Heavy Flow")

## Visual Indicators

### Assessment Pattern Display

**Primary Feature**: Assessment patterns are displayed in a dedicated, prominent purple-themed container with a Target icon. The pattern text is formatted for readability (e.g., "Regular Heavy Flow" instead of "regular_heavy_flow").

### User ID Display

A truncated user ID is shown with a User icon for identification purposes.

## API Structure

### get-list/

Contains API calls for fetching the enhanced list of conversations:

- `getConversationsList.ts` - Main API function to fetch conversation history with all fields
- `index.ts` - Export file for the API function

## Enhanced Footer

The footer now shows:

- Total number of conversations
- Count of conversations with assessment patterns

## Usage

```tsx
import { ChatSidebar } from './components/sidebar/ChatSidebar';

<ChatSidebar
  onConversationSelect={(conversation) => {
    // conversation includes:
    // - id, last_message_date, preview, message_count, user_id
    // - assessment_id (for backend use), assessment_pattern (displayed prominently)
    loadConversation(conversation);
  }}
  onNewChat={() => startNewChat()}
  selectedConversationId={currentConversationId}
/>;
```

## Props

- `onConversationSelect`: Callback when a conversation is selected (receives full ConversationListItem)
- `onNewChat`: Callback when "New Chat" button is clicked
- `selectedConversationId`: ID of currently selected conversation (optional)

## API Integration

The sidebar uses the following API endpoints:

- `GET /api/chat/history` - Fetch conversation list with all fields
- `DELETE /api/chat/history/:id` - Delete a conversation

## Database Schema

The conversations table includes:

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  assessment_id TEXT NULL REFERENCES assessments(id), -- For backend relationships
  assessment_pattern TEXT NULL, -- Displayed prominently in UI
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Backend Models

### Enhanced Functions

- `createConversation(userId, assessmentId?, assessmentPattern?)` - Create conversation with optional assessment links
- `updateConversationAssessmentLinks(conversationId, userId, assessmentId?, assessmentPattern?)` - Update assessment links
- `getUserConversations(userId)` - Get all conversations with assessment data

### Migration

Run the assessment fields migration:

```bash
node backend/scripts/run-assessment-fields-migration.js
```

## Type Definitions

```typescript
interface ConversationListItem {
  id: string;
  last_message_date: string; // date
  preview: string; // recent_message
  message_count: number;
  assessment_id?: string; // FK to assessments table (backend use only)
  assessment_pattern?: string; // Prominently displayed pattern info
  user_id: string; // FK to users table
}
```

## Design Principles

- **Pattern-Focused**: Assessment patterns are the primary visual indicator, displayed prominently
- **Data Integrity**: assessment_id is maintained for backend relationships but not cluttered in UI
- **User-Friendly**: Patterns are formatted for readability (e.g., "Regular Heavy Flow" vs "regular_heavy_flow")
- **Visual Hierarchy**: Important information (pattern, date, preview) is prioritized in the layout
