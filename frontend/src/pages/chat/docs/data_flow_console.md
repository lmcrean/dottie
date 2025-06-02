# Chat Data Flow and Console Logging Guide

This document outlines the ideal flow of data and console logging between frontend and backend components during the chat creation and messaging process. Following this logging pattern will help identify and debug issues with data types, especially with IDs.

## Initial Chat Creation Flow

### Frontend: SendInitialMessageButton.tsx

```javascript
// 1. Button Click
console.log(`[SendInitialMessageButton] Start chat clicked with assessmentId: ${assessmentId}, type: ${typeof assessmentId}`);
console.log(`[SendInitialMessageButton] Initial message: "${initialMessage}"`);

// 2. Before API Call
console.log(`[SendInitialMessageButton] Creating new chat with assessment_id: ${assessmentIdString}, type: ${typeof assessmentIdString}`);

// 3. After API Response
console.log(`[SendInitialMessageButton] Chat created successfully, received ID: ${newChat.id}, type: ${typeof newChat.id}`);
console.log(`[SendInitialMessageButton] Converted chat ID: ${chatIdString}, type: ${typeof chatIdString}`);

// 4. Before Sending Initial Message
console.log(`[SendInitialMessageButton] Sending initial message to chat ${chatIdString}, with assessment ${assessmentIdString}`);
console.log(`[SendInitialMessageButton] Request payload:`, {
  chat_id: chatIdString,
  assessment_id: assessmentIdString,
  message: initialMessage
});
```

### Backend: create-chat/controller.js

```javascript
// 1. Request Received
console.log(`[createChat] Request received with raw data:`, {
  userId: req.user.userId || req.user.id,
  assessment_id: req.body.assessment_id,
  initial_message: !!req.body.initial_message
});

// 2. After Type Conversion
console.log(`[createChat] Converted data:`, {
  userIdString: userIdString,
  userIdStringType: typeof userIdString,
  assessmentIdString: assessmentIdString,
  assessmentIdStringType: assessmentIdString ? typeof assessmentIdString : 'null'
});

// 3. Before createConversation Call
console.log(`[createChat] Calling createConversation with:`, {
  userIdString,
  assessmentIdString
});

// 4. After Conversation Creation
console.log(`[createChat] Conversation created with ID: ${conversationIdString}, type: ${typeof conversationIdString}`);

// 5. Response Payload
console.log(`[createChat] Sending response:`, chatResponse);
```

### Backend: createFlow.js and conversationCreate.js

```javascript
// 1. createAssessmentConversation
console.log(`[createAssessmentConversation] Received IDs:`, {
  userId,
  userIdType: typeof userId,
  assessmentId,
  assessmentIdType: assessmentId ? typeof assessmentId : 'null'
});

// 2. After Type Conversion
console.log(`[createAssessmentConversation] Converted IDs:`, {
  userIdString,
  userIdStringType: typeof userIdString,
  assessmentIdString,
  assessmentIdStringType: assessmentIdString ? typeof assessmentIdString : 'null'
});

// 3. conversationCreate Function
console.log(`[createConversation] Received IDs:`, {
  userId,
  userIdType: typeof userId,
  assessmentId,
  assessmentIdType: assessmentId ? typeof assessmentId : 'null'
});

// 4. After UUID Generation
console.log(`[createConversation] Generated conversation ID: ${conversationId}, type: ${typeof conversationId}`);

// 5. Conversation Data Object
console.log(`[createConversation] Conversation data object:`, conversationData);

// 6. Before Database Insert
console.log(`[createConversation] Inserting conversation with ID: ${conversationId}, type: ${typeof conversationId}`);

// 7. Return Value
console.log(`[createConversation] Returning conversation ID: ${conversationId}, type: ${typeof conversationId}`);
```

## Initial Message Flow

### Frontend: sendInitialMessage.ts

```javascript
// 1. Before API Call
console.log(`[sendInitialMessage] Preparing request with chat_id: ${params.chat_id}, type: ${typeof params.chat_id}`);
console.log(`[sendInitialMessage] Converted chat_id: ${chatIdString}, type: ${typeof chatIdString}`);
console.log(`[sendInitialMessage] Full request params:`, {
  chat_id: chatIdString,
  assessment_id: params.assessment_id,
  message: params.message
});

// 2. API Response
console.log(`[sendInitialMessage] Received response:`, response.data);
```

### Backend: send-initial-message/controller.js

```javascript
// 1. Request Received
console.log(`[sendInitialMessage] Request received:`, {
  chatId: req.params.chatId,
  chatIdType: typeof req.params.chatId,
  message: req.body.message?.substring(0, 50) + '...',
  assessment_id: req.body.assessment_id,
  is_initial: req.body.is_initial,
  userId: req.user.userId || req.user.id
});

// 2. After Type Conversion
console.log(`[sendInitialMessage] Converted data:`, {
  chatIdString,
  chatIdStringType: typeof chatIdString,
  userIdString: userId,
  userIdStringType: typeof userId,
  assessmentIdString: req.body.assessment_id,
  assessmentIdStringType: req.body.assessment_id ? typeof req.body.assessment_id : 'null'
});

// 3. Before getConversation Call
console.log(`[sendInitialMessage] Looking up conversation with ID: ${chatIdString}, user: ${userId}`);

// 4. After getConversation
console.log(`[sendInitialMessage] Conversation found:`, {
  conversationExists: !!conversation,
  conversationId: conversation?.id,
  belongsToUser: conversation?.user_id === userId
});

// 5. Before updateConversationAssessmentLinks
console.log(`[sendInitialMessage] Linking assessment ${req.body.assessment_id} to conversation ${chatIdString}`);

// 6. Before insertChatMessage (User Message)
console.log(`[sendInitialMessage] Inserting user message to chat ${chatIdString}, message length: ${userMessage.content.length}`);

// 7. Before insertChatMessage (Assistant Message)
console.log(`[sendInitialMessage] Inserting assistant message to chat ${chatIdString}, message length: ${assistantMessage.content.length}`);

// 8. Response Payload
console.log(`[sendInitialMessage] Sending response:`, response);
```

### Backend: updateAssessmentLinks.js

```javascript
// 1. Function Entry
console.log(`[updateConversationAssessmentLinks] Called with:`, {
  conversationId,
  conversationIdType: typeof conversationId,
  userId,
  userIdType: typeof userId,
  assessmentId,
  assessmentIdType: typeof assessmentId
});

// 2. After Type Conversion
console.log(`[updateConversationAssessmentLinks] Converted IDs:`, {
  conversationIdString,
  conversationIdStringType: typeof conversationIdString,
  userIdString,
  userIdStringType: typeof userIdString,
  assessmentIdString,
  assessmentIdStringType: typeof assessmentIdString
});

// 3. After Finding Conversation
console.log(`[updateConversationAssessmentLinks] Conversation lookup result:`, {
  found: !!conversation,
  conversationId: conversation?.id,
  userId: conversation?.user_id,
  ownershipMatch: conversation?.user_id === userIdString
});

// 4. Update Data
console.log(`[updateConversationAssessmentLinks] Update data:`, updateData);

// 5. After Update
console.log(`[updateConversationAssessmentLinks] Update result: ${success}`);
```

### Backend: insertChatMessage (sendUserMessage.js)

```javascript
// 1. Function Entry
console.log(`[insertChatMessage] Called with:`, {
  conversationId,
  conversationIdType: typeof conversationId,
  messageRole: messageData.role,
  messageLength: messageData.content.length
});

// 2. After Type Conversion
console.log(`[insertChatMessage] Converted ID: ${conversationIdString}, type: ${typeof conversationIdString}`);

// 3. Before Database Insert
console.log(`[insertChatMessage] Prepared data:`, {
  conversation_id: messageToInsert.conversation_id,
  conversation_id_type: typeof messageToInsert.conversation_id,
  role: messageToInsert.role
});

// 4. After Database Insert
console.log(`[insertChatMessage] Message inserted successfully for conversation ${conversationIdString}`);
```

## Debugging Foreign Key Constraint Failures

When encountering a foreign key constraint failure with `[object Object]` as the conversation_id:

1. Add temporary debug logs at every point where the conversation ID is passed or received
2. Check for object serialization issues (especially in DbService)
3. Inspect any middleware that might be modifying request parameters
4. Ensure all utility functions are properly handling ID types

## DbService Implementation Check

```javascript
// In DbService.create function
console.log(`[DbService.create] Creating record in ${tableName} with data:`, {
  ...data,
  id_type: data.id ? typeof data.id : 'undefined',
  conversation_id_type: data.conversation_id ? typeof data.conversation_id : 'undefined'
});

// Before SQL execution
console.log(`[DbService.create] Executing SQL with parameters:`, parameters);
```

## Complete Flow Diagram

```
Frontend (SendInitialMessageButton)
│
├─ Click "Chat with Dottie"
│  │
│  ├─ createNewChat() API call
│  │  │
│  │  └─ Backend: /api/chat (POST)
│  │     │
│  │     ├─ controller.js: createChat()
│  │     │  │
│  │     │  └─ createConversation()
│  │     │     │
│  │     │     └─ conversationCreate.js
│  │     │        │
│  │     │        └─ Return conversation ID
│  │     │
│  │     └─ Response: { id, user_id, created_at }
│  │
│  └─ sendInitialMessage() API call
│     │
│     └─ Backend: /api/chat/:chatId/message/initial (POST)
│        │
│        ├─ controller.js: sendInitialMessage()
│        │  │
│        │  ├─ getConversation()
│        │  │
│        │  ├─ updateConversationAssessmentLinks()
│        │  │
│        │  ├─ insertChatMessage() (user message)
│        │  │
│        │  ├─ Generate AI/mock response
│        │  │
│        │  └─ insertChatMessage() (assistant message)
│        │
│        └─ Response: { id, chat_id, role, content, created_at }
│
└─ Display FullscreenChat component with conversation
```

## Common Issues and Solutions

1. **ID Type Conversion**: Always use `String()` to convert IDs to strings before using them
2. **Object Parameter Issues**: Check for accidental object passing instead of ID strings
3. **Database Constraints**: Ensure foreign keys exist before attempting to insert dependent records
4. **Error Handling**: Catch and log errors at each step with meaningful context
5. **Response Handling**: Validate API responses before using returned data 