# Dottie API Endpoints

## Setup Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/setup/health/hello` | GET | Test endpoint that returns "Hello World from Dottie API!" |
| `/api/setup/database/status` | GET | Check database connection status |
| `/api/setup/database/hello` | GET | Test endpoint that returns a hello message from the database (SQLite or Azure SQL) |

## Authentication Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user account |
| `/api/auth/login` | POST | Authenticate user and get access token |
| `/api/auth/logout` | POST | Logout user and invalidate token |

## Assessment Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/assessment/send` | POST | Send assessment results from frontend context, generates a new assessmentId |
| `/api/assessment/list` | GET | Get list of all assessments for the authenticated user |
| `/api/assessment/:id` | GET | Get detailed view of a specific assessment by ID |
| `/api/assessment/:id` | DELETE | Delete a specific assessment by ID |


## User Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/me` | GET | Get current user |
| `/api/user/:id` | GET | Get user by ID (todo: replace with /api/user/me) |
| `/api/user/:id` | PUT | Update a user |
| `/api/user/:id` | DELETE | Delete a user |
| `/api/user/pw/update` | POST | Update current user's password |

- *There is also a ``| `/api/user/` | GET | Get list of all users |`` endpoint, but it is not needed in the frontend.*

## AI Chat Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat/send` | POST | Send a message to the AI (Gemini API) and get a response |
| `/api/chat/history` | GET | Get chat history for the authenticated user, returns all conversations as a list |
| `/api/chat/history/:conversationId` | GET | Get a specific conversation by ID |
| `/api/chat/history/:conversationId` | DELETE | Delete a specific conversation |

## Request Examples

### Setup

```javascript
// Test API health
fetch("/api/setup/health/hello")
  .then(response => response.json())
  .then(data => console.log(data));
// Response: { "message": "Hello World from Dottie API!" }

// Test database connection with hello
fetch("/api/setup/database/hello")
  .then(response => response.json())
  .then(data => console.log(data));
// Response: { "message": "Hello World from SQLite!", "dbType": "sqlite3", "isConnected": true }

// Check database status
fetch("/api/setup/database/status")
  .then(response => response.json())
  .then(data => console.log(data));
// Response: { "status": "connected" }
```

### Authentication

```javascript
// Signup
fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "user123",
    email: "user@example.com",
    password: "securePassword123"
  })
});

// Login
fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securePassword123"
  })
});
```

### Assessment

```javascript
// Send assessment
fetch("/api/assessment/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-access-token"
  },
  body: JSON.stringify({
    userId: "user-123",
    assessmentData: {
      age: "18-24",
      cycleLength: "26-30",
      periodDuration: "4-5",
      flowHeaviness: "moderate",
      painLevel: "moderate",
      symptoms: {
        physical: ["Bloating", "Headaches"],
        emotional: ["Mood swings", "Irritability"]
      }
    }
  })
});

// Get assessment list
fetch("/api/assessment/list", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});

// Get specific assessment
fetch("/api/assessment/assessment-123", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});
```

### User

```javascript
// Update password
fetch("/api/user/pw/update", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-access-token"
  },
  body: JSON.stringify({
    currentPassword: "oldPassword123",
    newPassword: "newSecurePassword456"
  })
});
```

### AI Chat

```javascript
// Send message to AI
fetch("/api/chat/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-access-token"
  },
  body: JSON.stringify({
    message: "Hello, can you help with my period symptoms?",
    conversationId: "conversation-123" // Optional, for continuing a conversation
  })
});
// Response: { "message": "I'd be happy to help with your period symptoms...", "conversationId": "conversation-123" }

// Get chat history
fetch("/api/chat/history", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});
// Response: { "conversations": [{ "id": "conversation-123", "lastMessageDate": "2023-06-15T10:30:00Z", "preview": "Hello, can you help with..." }] }

// Get specific conversation
fetch("/api/chat/history/conversation-123", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});
// Response: { "id": "conversation-123", "messages": [{ "role": "user", "content": "Hello, can you help with my period symptoms?" }, { "role": "assistant", "content": "I'd be happy to help with your period symptoms..." }] }
``` 