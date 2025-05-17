# Sign-Up Authentication Flow Dependency Chain

This document lists the key files involved in the sign-up authentication flow.

## Files in Sequence 🔗

1. `frontend/src/pages/auth/sign-up.tsx` - Main component that renders the sign-up form
2. `frontend/src/context/AuthContext.tsx` - Context provider that exports the signup method
3. `frontend/src/lib/validations/auth.ts` - Contains the signUpSchema for form validation
4. `frontend/src/api/auth/index.ts` - API client that exports the authApi.signup() method
5. `frontend/src/api/auth/requests/postSignup/Request.ts` - Handles the API request for user registration
6. `backend/routes/auth/signup/route.js` - Backend route that handles the POST request
7. `backend/routes/auth/signup/controller.js` - Controller that validates user data and creates new accounts
8. `backend/models/user/User.js` - Database model for user accounts and authentication
9. `frontend/src/api/core/tokenManager.ts` - Manages authentication tokens after successful registration
