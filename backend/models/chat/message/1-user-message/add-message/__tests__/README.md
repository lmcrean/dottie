# Message Flow Dialogue Integration Tests

## Overview

This directory contains integration unit tests for the complete message flow dialogue system, which handles the full cycle from user message creation to chatbot response generation and conversation display ordering.

## Test Files

**`messageFlowDialogue.test.js`** - Main test coordinator (under 100 lines)
**`runners/`** - Individual test runner files (each under 100 lines):
- `messageCreation.js` - User message creation and database storage
- `chatbotResponse.js` - AI/Mock chatbot response generation with configHelper
- `dialogueSequence.js` - Complete dialogue flow and conversation ordering
- `databaseIntegration.js` - SQLite database operations and persistence

## Function Flow Under Test

The complete message flow system performs the following operations:

1. **User sends followup message** (by default, not initial message)
2. **Message gets unique ID** and is assigned to conversation via conversation_id
3. **Message is sent to SQLite DB** via POST request through ChatDatabaseOperations
4. **Message is added to conversation** via conversation_id foreign key
5. **Chatbot response is triggered** (AI or mock depending on configHelper.js .env detection)
6. **Chatbot response is added to conversation** via conversation_id
7. **Dialogue is displayed in chronological order** in conversation object

## Test Validation Requirements

The tests validate all the requirements specified:

### ✅ 1. User Sends Followup Message (By Default)
- Verifies that messages are created as followup messages (not initial)
- Ensures proper message content and structure
- Tests message creation flow through sendMessage function

### ✅ 2. Message Has Unique ID and conversation_id
- Validates that each message gets a unique identifier
- Ensures messages are properly linked to conversations
- Tests conversation_id foreign key relationships

### ✅ 3. Message Sent to SQLite DB via POST Request
- Verifies database insertion through ChatDatabaseOperations.insertMessage
- Tests SQLite storage and persistence
- Validates database operation sequencing

### ✅ 4. Message Added to Conversation via conversation_id
- Confirms proper foreign key relationships
- Tests referential integrity
- Validates conversation message collection

### ✅ 5. Chatbot Response Triggered (AI or Mock via configHelper)
- Tests ConfigHelper.detectService() for AI/mock detection
- Validates .env file presence detection
- Ensures proper service routing (AI when .env exists, mock when it doesn't)
- Tests generateResponseToMessage function

### ✅ 6. Chatbot Response Added to Conversation via conversation_id
- Verifies assistant message database insertion
- Tests parent_message_id linking for threading
- Validates conversation context maintenance

### ✅ 7. Dialogue Displayed in Order in Conversation Object
- Tests chronological message ordering
- Validates complete conversation retrieval
- Ensures proper timestamp sequencing
- Tests multiple message exchange handling

## Test Structure

### Runner Architecture

The tests are split into focused runner files to maintain the <100 line limit per file:

1. **`messageCreation.js`** (95 lines) - User message creation and validation
2. **`chatbotResponse.js`** (92 lines) - AI/Mock response generation and config detection
3. **`dialogueSequence.js`** (98 lines) - Complete dialogue flow and ordering
4. **`databaseIntegration.js`** (96 lines) - Database operations and persistence

### Main Test Coordinator

**`messageFlowDialogue.test.js`** (89 lines) - Imports and runs all runners sequentially with shared mock data

### Mock Strategy

The tests use comprehensive mocking coordinated in the main file:
- **DbService** - SQLite database operations
- **Logger** - Logging functionality
- **ChatDatabaseOperations** - Message storage and retrieval
- **sendMessage** - User message creation
- **generateResponseToMessage** - Chatbot response generation
- **ConfigHelper** - AI/Mock service detection

### Test Data

Includes realistic mock data for complete dialogue flow:
- User and assistant message objects with proper structure
- Conversation objects with ordered message arrays
- Various message content types and responses
- Proper timestamp formatting and sequencing

## Running the Tests

### All Tests (Recommended)
```bash
# Run all tests through main coordinator
npm test -- "messageFlowDialogue.test.js"

# Run with watch mode
npm test -- "messageFlowDialogue.test.js" --watch

# Run with verbose output
npm test -- "messageFlowDialogue.test.js" --reporter=verbose
```

### Individual Runner Files
```bash
# Run specific test categories (if needed for debugging)
npm test -- "messageCreation"
npm test -- "chatbotResponse" 
npm test -- "dialogueSequence"
npm test -- "databaseIntegration"
```

### All Message Tests
```bash
# Run all tests in this directory
npm test -- "backend/models/chat/message/user-message/add-message/__tests__/"

# Run with coverage
npm test -- "backend/models/chat/message/user-message/add-message/__tests__/" --coverage
```

### Debug Mode
```bash
# Run specific test case
npm test -- "should create user message with unique ID"

# Run with debug logging
npm test -- "messageFlowDialogue.test.js" --verbose
```

## Test Scenarios Covered

### Message Creation Flow
- User message creation with unique IDs
- Conversation assignment via conversation_id
- Database storage through ChatDatabaseOperations
- Followup message handling (not initial messages)

### Chatbot Response Generation
- ConfigHelper service detection (.env file presence)
- AI service usage when environment configured
- Mock service fallback when no .env file
- Response generation and database storage

### Dialogue Sequence Management
- Chronological message ordering
- Complete conversation object creation
- Multiple message exchange handling
- Threading and parent message relationships

### Database Integration
- SQLite message persistence
- Foreign key constraint validation
- Error handling and graceful degradation
- Referential integrity maintenance

## ConfigHelper Integration

The tests specifically validate the AI/Mock detection system:

### AI Service Detection
- Tests when .env file exists
- Validates AI response generation path
- Ensures proper service configuration

### Mock Service Detection  
- Tests when .env file does not exist
- Validates mock response generation path
- Ensures fallback behavior

### Service Configuration
- Tests ConfigHelper.detectService() method
- Validates environment-based routing
- Ensures consistent service selection

## Sequential Test Execution

Following the requirement for runners to execute in sequence (not parallel):
- Tests are organized in describe blocks that run sequentially
- Each runner completes before the next begins
- Shared mock data ensures consistency across test phases
- No parallel test execution within the suite

## Dependencies

The tests mock all external dependencies:
- `../../../../../services/db-service/dbService.js` - SQLite database operations
- `../../../../../services/logger.js` - Logging service
- `../../shared/database/chatOperations.js` - Message database operations
- `../sendMessage.js` - User message creation
- `../../chatbot-message/generateResponse.js` - Response generation
- `../../chatbot-message/utils/configHelper.js` - Service detection

## Missing Dependencies Note

If tests fail due to missing ChatDatabaseOperations, you may need to create:

### Create database/ folder structure:
```
backend/models/chat/message/shared/database/
└── chatOperations.js
```

### ChatDatabaseOperations should include:
- `insertMessage(conversationId, messageData)` - Insert message into database
- `getMessage(conversationId, messageId)` - Retrieve specific message
- `getConversationMessages(conversationId)` - Get all messages for conversation
- `updateMessage(conversationId, messageId, updates)` - Update message content
- `deleteMessage(conversationId, messageId)` - Delete specific message

## Configuration

Uses standard vitest configuration from `backend/vitest.config.js`:
- Node environment
- 60-second timeout
- Standard alias resolution
- Coverage reporting enabled

## Debugging Tips

### Common Issues
1. **Mock import paths** - Import paths are now relative to this directory
2. **ChatDatabaseOperations missing** - Create the database operations file if needed
3. **ConfigHelper mocking** - Ensure environment detection is properly mocked
4. **Async timing** - Use proper await/async patterns in tests

### Debug Helpers
```javascript
// Add to test for debugging message flow
console.log('User Message:', JSON.stringify(result.userMessage, null, 2));
console.log('Assistant Message:', JSON.stringify(result.assistantMessage, null, 2));
console.log('Mock calls:', ChatDatabaseOperations.insertMessage.mock.calls);
```

### Vitest UI
```bash
# Run with UI for visual debugging
npm test -- --ui
```

## Related Files

### Main Files Being Tested
- `../sendMessage.js` - User message creation
- `../../chatbot-message/generateResponse.js` - Response generation
- `../../chatbot-message/utils/configHelper.js` - Service detection
- `../../shared/database/chatOperations.js` - Database operations

### Test Architecture
- `messageFlowDialogue.test.js` - Main test coordinator
- `runners/messageCreation.js` - Message creation tests
- `runners/chatbotResponse.js` - Response generation tests
- `runners/dialogueSequence.js` - Dialogue flow tests
- `runners/databaseIntegration.js` - Database operation tests 