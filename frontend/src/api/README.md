# src/api

This directory is the entry point between the frontend and the backend.

It contains all API-related code organized by domain. They should access the established endpoints of the backend as described in the `backend/Endpoints-master.md` file and built in the `backend/routes` folder.

## Structure

```
src/api/
├── auth/               # Authentication-related API functions
│   ├── index.ts        # Main export for auth API
│   ├── schemas.ts      # Zod validation schemas
│   └── types.ts        # TypeScript type definitions
├── assessment/         # Assessment-related API functions
│   └── index.ts
├── message/            # Message-related API functions
│   └── index.ts
├── user/               # User profile API functions
│   └── index.ts
├── core/               # Core API utilities
│   ├── apiClient.ts    # Axios configuration
│   └── db.ts           # Database utilities
├── __tests__/          # API tests
│   └── api.test.ts
└── index.ts            # Main barrel file
```

## Usage

Import the API modules you need:

```typescript
// Import specific API modules
import { authApi } from '../api/auth';
import { assessmentApi } from '../api/assessment';

// Or import from the main barrel file
import { authApi, userApi } from '../api';
import api from '../api'; // Import everything as a namespace

// Example usage
const login = async () => {
  try {
    const response = await authApi.login({
      email: 'user@example.com',
      password: 'password123'
    });
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};

// Alternative using the namespace import
const getProfile = async () => {
  try {
    const profile = await api.user.getProfile();
    // Use profile data
  } catch (error) {
    // Handle error
  }
};
```

## API Client

The core `apiClient` is an Axios instance with predefined configuration and interceptors for authentication. It automatically adds the auth token to requests if available in localStorage.

## Testing

Each API module has associated tests in the `__tests__` directory. Run them with:

```
npm test -- "api.test"
```
