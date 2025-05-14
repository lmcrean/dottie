# Test Page Wireframe

## Overview

The test page provides a comprehensive interface to test all API endpoints documented in the Endpoints-master.md file. It displays multiple tables organized by endpoint category, allowing users to test each endpoint, view expected output, and see actual results from API calls.

## Layout

```
+-----------------------------------------------------------+
| Now testing in DEVELOPMENT                                |
+-----------------------------------------------------------+
| Setup Endpoints                                           |
+-----------------------------------------------------------+
| Endpoint Button       | Expected Output    | Actual Output |
+----------------------+--------------------+---------------+
| GET /api/setup/      | { "message":       |               |
| health/hello         | "Hello World from  |               |
|                      | Dottie API!" }     |               |
+----------------------+--------------------+---------------+
| GET /api/setup/      | { "status":        |               |
| database/status      | "connected" }      |               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| GET /api/setup/      | { "message":       |               |
| database/hello       | "Hello World from  |               |
|                      | SQLite!" }         |               |
+----------------------+--------------------+---------------+

+-----------------------------------------------------------+
| Authentication Endpoints                                  |
+-----------------------------------------------------------+
| Endpoint Button       | Expected Output    | Actual Output |
+----------------------+--------------------+---------------+
| POST /api/auth/      | { "user": {...},   |               |
| signup               | "token": "..." }   |               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| POST /api/auth/      | { "token": "...",  |               |
| login                | "user": {...} }    |               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| POST /api/auth/      | { "message":       |               |
| logout               | "Logged out        |               |
|                      | successfully" }    |               |
+----------------------+--------------------+---------------+

+-----------------------------------------------------------+
| Assessment Endpoints                                      |
+-----------------------------------------------------------+
| Endpoint Button       | Expected Output    | Actual Output |
+----------------------+--------------------+---------------+
| POST /api/           | { "id": "...",     |               |
| assessment/send      | "message":         |               |
|                      | "Assessment saved" }|              |
+----------------------+--------------------+---------------+
| GET /api/            | [{ "id": "...",    |               |
| assessment/list      | "date": "..." },   |               |
|                      | ... ]              |               |
+----------------------+--------------------+---------------+
| GET /api/            | { "id": "...",     |               |
| assessment/:id       | "data": {...} }    |               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| PUT /api/            | { "message":       |               |
| assessment/:id       | "Assessment        |               |
|                      | updated" }         |               |
+----------------------+--------------------+---------------+
| DELETE /api/         | { "message":       |               |
| assessment/:id       | "Assessment        |               |
|                      | deleted" }         |               |
+----------------------+--------------------+---------------+

+-----------------------------------------------------------+
| User Endpoints                                            |
+-----------------------------------------------------------+
| Endpoint Button       | Expected Output    | Actual Output |
+----------------------+--------------------+---------------+
| GET /api/user/me     | { "id": "...",     |               |
|                      | "email": "...",    |               |
|                      | ... }              |               |
+----------------------+--------------------+---------------+
| GET /api/user/:id    | { "id": "...",     |               |
|                      | "email": "...",    |               |
|                      | ... }              |               |
+----------------------+--------------------+---------------+
| PUT /api/user/:id    | { "message":       |               |
|                      | "User updated" }   |               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| DELETE /api/user/:id | { "message":       |               |
|                      | "User deleted" }   |               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| POST /api/user/      | { "message":       |               |
| pw/reset             | "Password reset    |               |
|                      | email sent" }      |               |
+----------------------+--------------------+---------------+
| POST /api/user/      | { "message":       |               |
| pw/update            | "Password updated  |               |
|                      | successfully" }    |               |
+----------------------+--------------------+---------------+

+-----------------------------------------------------------+
| AI Chat Endpoints                                         |
+-----------------------------------------------------------+
| Endpoint Button       | Expected Output    | Actual Output |
+----------------------+--------------------+---------------+
| POST /api/chat/send  | { "message": "...",|               |
|                      | "conversationId":  |               |
|                      | "..." }            |               |
+----------------------+--------------------+---------------+
| GET /api/chat/       | { "conversations": |               |
| history              | [{...}, {...}] }   |               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| GET /api/chat/       | { "id": "...",     |               |
| history/:id          | "messages": [...] }|               |
|                      |                    |               |
+----------------------+--------------------+---------------+
| DELETE /api/chat/    | { "message":       |               |
| history/:id          | "Conversation      |               |
|                      | deleted" }         |               |
+----------------------+--------------------+---------------+
```

## Interaction Details

1. **For each endpoint button:**

   - Click button to make API call
   - Display loading state during API call
   - Show success/error status after completion
   - Populate the "Actual Output" column with JSON response or error

2. **Visual Indicators:**

   - Green button for successful calls
   - Red button for failed calls
   - Yellow button for partial success

3. **Input Handling:**

   - For endpoints requiring body parameters (POST/PUT), show an input form
   - For endpoints requiring path parameters, show an input field
   - Default test values are pre-populated

4. **Response Display:**
   - Format JSON responses with proper indentation
   - Highlight differences between expected and actual output

## Mobile Responsiveness

On smaller screens:

- Stack the columns vertically
- Collapse tables to show one endpoint at a time
- Add expandable sections for each endpoint category
