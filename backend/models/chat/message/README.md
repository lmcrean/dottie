# Message System Architecture

## Clean Separated Concerns

The message system is now organized with clear separation of concerns:

```
message/
├── 1-user-message/           # Handles ONLY user message creation
│   └── add-message/
│       ├── sendUserMessage.js      # Main: addUserMessage()
│       └── database/
│           └── sendUserMessage.js  # insertChatMessage()
│
├── 2-chatbot-message/        # Handles ONLY AI response generation + saving
│   ├── generateResponse.js         # Main: generateAndSaveResponse()
│   └── database/
│       └── sendChatbotMessage.js   # sendChatbotMessage()
│
└── send-message-flow/        # Orchestrator: calls 1 then 2
    └── sendMessageFlow.js          # Main: sendMessageFlow()
```

## Data Flow

1. **User sends message** → `sendMessageFlow()` orchestrator
2. **Step 1**: Add user message → `addUserMessage()` → database
3. **Step 2**: Generate AI response → `generateAndSaveResponse()` → database
4. **Result**: Both messages saved, conversation updated

## Key Functions

### 1. User Message (Step 1)
```js
import { addUserMessage } from './1-user-message/add-message/sendUserMessage.js';

const result = await addUserMessage(conversationId, userId, messageText);
// Returns: { userMessage, conversationId, timestamp }
```

### 2. Chatbot Message (Step 2)  
```js
import { generateAndSaveResponse } from './2-chatbot-message/generateResponse.js';

const result = await generateAndSaveResponse(conversationId, userId, userMessageId, messageText);
// Returns: { chatbotMessage, conversationId, timestamp }
```

### 3. Complete Flow (Orchestrator)
```js
import { sendMessageFlow } from './send-message-flow/sendMessageFlow.js';

const result = await sendMessageFlow(userId, message, conversationId);
// Returns: { success, conversationId, userMessage, assistantMessage, timestamp }
```

## Benefits of This Structure

- **Single Responsibility**: Each folder handles one specific concern
- **No Duplication**: Logic is not repeated across files
- **Clean Testing**: Each step can be tested independently  
- **Maintainable**: Easy to modify user or AI logic separately
- **Scalable**: Add new message types by creating new numbered folders

## Backward Compatibility

All legacy function names are preserved via exports in `index.js`:
- `sendMessage()` → `addUserMessage()` (user message only)
- `sendMessageNew()` → `sendMessageFlow()` (complete flow)
- `generateResponseToMessage()` → `generateAndSaveResponse()` 