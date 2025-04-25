# Core API Modules

## apiClient.ts

Axios-based HTTP client with centralized configuration and error handling.

### Key Features:

- Base URL: `http://localhost:5000`
- Default headers:
  ```ts
  {
    'Content-Type': 'application/json',
    Authorization: 'Bearer <token>' // Added via interceptor
  }
  ```
- **Interceptors:**
  - Request: Automatically adds JWT from localStorage
  - Response: Handles common error scenarios:
    - 401 Unauthorized: Clears auth token
    - Network errors
    - Server errors (5xx)
- Status helpers:
  ```ts
  isSuccess(status); // 200-299
  isClientError(status); // 400-499
  isServerError(status); // 500+
  ```

## db.ts

Database service layer providing common data operations.

### Exported Functions:

1. `checkDbConnection()`

   - Endpoint: GET `/api/setup/database/status`
   - Returns: Connection status object
   - Error handling: Returns error status message

2. `fetchUserData(userId: string)`
   - Endpoint: GET `/api/users/${userId}`
   - Returns: User data object
   - Error handling: Throws error for caller to handle

### Usage Example:

```ts
import { checkDbConnection, fetchUserData } from './db';

// Check database health
const status = await checkDbConnection();

// Get user data
try {
  const user = await fetchUserData('123');
} catch (error) {
  // Handle specific error
}
```

```

This documentation provides:
1. Architectural overview of the API layer
2. Key configuration details
3. Error handling strategies
4. Concrete usage examples
5. Endpoint references

Would you like me to add any specific details or modify the structure?
```
