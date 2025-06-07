# User Model Dependency Chain

This document lists the files that depend on the User model.

## Files in Sequence 🔗

### Controllers
1. `backend/routes/auth/signup/controller.js` - Creates new users and checks for existing users
2. `backend/routes/auth/login/controller.js` - Authenticates users by email
3. `backend/routes/user/get-all-users/controller.js` - Retrieves all users
4. `backend/routes/user/get-user/controller.js` - Gets a specific user by ID
5. `backend/routes/user/update-user/controller.js` - Updates user information
6. `backend/routes/user/delete-user/controller.js` - Deletes a user account
7. `backend/routes/user/reset-password/controller.js` - Handles password reset requests and token validation
8. `backend/routes/user/update-password/controller.js` - Updates user passwords

### Routes
1. `backend/routes/index.js` - Main route handler that imports user routes
2. `backend/routes/auth/index.js` - Authentication routes that use User model
3. `backend/server.js` - Imports and uses the user routes

### Frontend API Integration
1. `frontend/src/api/user/index.ts` - User API client
2. `frontend/src/api/index.ts` - Exports user types and API
3. `frontend/src/context/AuthContext.tsx` - User authentication context

### Testing
1. Various test files in `backend/routes/user/__tests__/unit/` - Unit tests for user operations
2. Various test files in `backend/routes/auth/__tests__/unit/` - Unit tests for authentication
3. `backend/dev/tests/master-integration/master-integration.api.pw.spec.js` - Integration tests 