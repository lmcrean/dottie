# Middleware Components

This directory contains middleware functions that are used across multiple parts of the application. Middleware in this folder is designed to be reusable and to implement cross-cutting concerns.

## Authentication Middleware

`auth.js` provides JWT authentication middleware that is used by multiple routes in the application, including:

- User endpoints (`/api/user/*`)
- Assessment endpoints (`/api/assessment/*`)
- AI Chat endpoints (`/api/chat/*`)
- Any other endpoints requiring authentication

### Usage

To protect a route with authentication:

```javascript
import { authenticateToken } from '../../middleware/auth.js';

// Apply to single route
router.get('/protected-route', authenticateToken, controller.someFunction);

// Or apply to all routes in a router
router.use(authenticateToken);
router.get('/protected-route', controller.someFunction);
```

### How It Works

The `authenticateToken` middleware:

1. Extracts the JWT token from the Authorization header
2. Verifies the token using the JWT_SECRET from environment variables
3. Adds the decoded user information to the request object (`req.user`)
4. Handles error cases with appropriate HTTP status codes:
   - 401: No token provided
   - 403: Invalid or expired token
   - 500: Authentication process failed

## Middleware Placement Guidelines

Middleware should be placed in this directory when:

- It's used by multiple route modules
- It implements cross-cutting concerns like authentication, logging, etc.
- It's general-purpose and not specific to any particular feature

Route-specific middleware (only used by one feature) should be placed in the relevant feature's directory instead. 