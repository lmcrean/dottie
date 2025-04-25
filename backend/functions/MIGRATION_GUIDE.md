# Express to Azure Functions Migration Guide

This document provides a step-by-step guide to migrate the Dottie backend from Express.js to Azure Functions.

## 1. Migration Strategy

### Route-by-Route Migration

Instead of migrating the entire application at once, we'll adopt a route-by-route approach:

1. Identify high-priority routes
2. Create equivalent Azure Functions
3. Test each function in isolation
4. Gradually replace Express routes with Function calls

This allows for a smooth transition and minimizes risk.

## 2. Code Structure

### Express Structure (Before)
```
/backend
  /routes
    /auth
      /login
        controller.js
        route.js
    /user
      /profile
        controller.js
        route.js
  /models
  /db
  server.js
```

### Azure Functions Structure (After)
```
/functions
  /auth-login
    function.json
    index.js
  /user-profile
    function.json
    index.js
  /shared
    /models
    /db
    /middleware
```

## 3. Migration Steps by Component

### Routes and Controllers

**Express (Before):**
```javascript
// route.js
import express from 'express';
import { login } from './controller.js';
const router = express.Router();
router.post('/', login);
export default router;

// controller.js
export const login = async (req, res) => {
  // Logic here
  res.json({ result });
};
```

**Azure Functions (After):**
```javascript
// index.js
module.exports = async function (context, req) {
  // Logic here
  context.res = {
    status: 200,
    body: { result }
  };
};

// function.json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["post"],
      "route": "auth/login"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "res"
    }
  ]
}
```

### Authentication Middleware

**Express (Before):**
```javascript
app.use((req, res, next) => {
  // Auth logic
  next();
});
```

**Azure Functions (After):**
```javascript
const authenticateToken = async (req, context) => {
  // Auth logic
  return isAuthenticated;
};

// Use in each function
module.exports = async function (context, req) {
  const isAuthenticated = await authenticateToken(req, context);
  if (!isAuthenticated) return;
  
  // Function logic
};
```

### Database Connection

**Express (Before):**
```javascript
const db = require('./db');
app.use(async (req, res, next) => {
  req.db = await db.connect();
  next();
});
```

**Azure Functions (After):**
```javascript
const { connect } = require('../shared/db');

module.exports = async function (context, req) {
  const db = await connect();
  // Function logic
};
```

## 4. Key Differences to Consider

1. **Request/Response Handling**
   - Express: `req` and `res` objects with methods like `res.json()`
   - Functions: `context.req` and `context.res` with structure like `context.res = { status: 200, body: {} }`

2. **Middleware**
   - Express: Chain of middleware with `next()`
   - Functions: No built-in middleware chain, must be called explicitly in each function

3. **Route Definition**
   - Express: Defined in code with `router.get()`, etc.
   - Functions: Defined in `function.json` configuration

4. **Authentication**
   - Express: Can be global middleware
   - Functions: Must be implemented in each function

5. **Cold Starts**
   - Express: Always running
   - Functions: Subject to cold starts, which can affect performance

## 5. Testing Strategy

1. **Unit Testing**
   - Test each function in isolation
   - Mock database and dependencies

2. **Local Testing**
   - Use Azure Functions Core Tools to run locally
   - Test with HTTP requests to `http://localhost:7071/api/*`

3. **Integration Testing**
   - Deploy to a test environment
   - Test with real services

## 6. Deployment Checklist

Before deploying to production:

1. ✅ Verify all routes are migrated
2. ✅ Test authentication flows
3. ✅ Validate database connections
4. ✅ Check error handling
5. ✅ Monitor performance and cold start impact
6. ✅ Set up proper logging
7. ✅ Configure environment variables in Azure

## 7. Resources

- [Azure Functions HTTP triggers](https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook-trigger)
- [Azure Functions best practices](https://learn.microsoft.com/en-us/azure/azure-functions/functions-best-practices)
- [Cold start optimization](https://learn.microsoft.com/en-us/azure/azure-functions/functions-best-practices#avoid-cold-starts) 