# Chat Endpoints

This branch handles all interactions with the Gemini AI chat functionality of the Dottie app.

## Endpoints

| Endpoint | Method | Description | Implementation Status |
|----------|--------|-------------|----------------------|
| `/api/chat/send` | POST | Send a message to the AI (Gemini API) and get a response | Implemented |
| `/api/chat/history` | GET | Get chat history for the authenticated user | Implemented |
| `/api/chat/history/:conversationId` | GET | Get a specific conversation by ID | Implemented |
| `/api/chat/history/:conversationId` | DELETE | Delete a specific conversation | Implemented |

## Implementation Details

### `/api/chat/send`
- Processes user message
- Calls Gemini API with appropriate context
- Returns AI response and conversation ID

### `/api/chat/history`
- Returns a list of all conversations for the user
- Each conversation includes ID, preview, and date of last message

### `/api/chat/history/:conversationId`
- GET: Returns all messages in a specific conversation
- DELETE: Removes the specified conversation and all its messages 