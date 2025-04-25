# Dottie Backend - Azure Functions Migration

This directory contains the Azure Functions implementation of the Dottie backend services. This README provides instructions for developing, testing, and deploying the Azure Functions.

## Structure

- `/functions` - Root directory for all Azure Functions
  - `/auth-login` - Login function
  - `/auth-signup` - Signup function
  - `/auth-logout` - Logout function
  - `/auth-refresh` - Token refresh function
  - `/auth-verify` - Token verification function
  - `/health` - Health check function
  - `/user-profile` - User profile function
  - `/shared` - Shared code used across functions
    - `/db` - Database connection and utilities
    - `/middleware` - Authentication and other middleware
    - `/models` - Data models

## Implemented Authentication Flow

The authentication flow has been implemented with the following functions:

1. **Signup** (`/auth-signup`): Create a new user account
2. **Login** (`/auth-login`): Authenticate user and receive tokens
3. **Verify** (`/auth-verify`): Verify token validity
4. **Refresh** (`/auth-refresh`): Refresh an expired access token
5. **Logout** (`/auth-logout`): Invalidate tokens

## Local Development

### Prerequisites

1. Node.js 18+
2. Azure Functions Core Tools v4
3. Visual Studio Code with Azure Functions extension (recommended)

### Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Configure local settings:
   - Copy `local.settings.json` and update the database and other settings as needed

3. Run locally:
   ```
   npm start
   ```

## Migration Steps

1. ✅ **Identify Express Routes**: Analyze each Express route and controller in the original codebase
2. ✅ **Create Azure Functions**: Create a function for each route or logical group of routes
   - ✅ Authentication routes migrated
   - ✅ Basic user routes migrated
   - ⬜ Assessment routes to be migrated next
3. ✅ **Shared Code**: Move shared code and utilities to the `/shared` directory
4. ✅ **Database Integration**: Update database connection to work with Azure SQL
5. ✅ **Authentication**: Adapt JWT authentication to work within function context
6. ⬜ **Testing**: Test each function locally before deploying

## Next Steps

1. ⬜ **Assessment Functions**: Create functions for the assessment routes
2. ⬜ **Setup Functions**: Create functions for the setup routes
3. ⬜ **Testing Suite**: Setup comprehensive test suite for Azure Functions
4. ⬜ **Performance Optimization**: Optimize for cold starts and performance
5. ⬜ **Azure Deployment**: Deploy to Azure Function App

## Deployment

### To Azure

1. Create an Azure Function App in Azure Portal
2. Configure application settings with the same keys as in `local.settings.json`
3. Deploy using Azure Functions extension or Azure CLI:
   ```
   func azure functionapp publish your-function-app-name
   ```

## Testing

Each function can be tested locally using HTTP requests to `http://localhost:7071/api/*` endpoints.

## Differences from Express Implementation

1. **Request/Response Handling**: Azure Functions use `context.req` and `context.res` instead of Express's `req` and `res`
2. **Middleware**: No middleware pipeline - authentication must be implemented in each function
3. **Route Definition**: Routes are defined in `function.json` files instead of using Express Router
4. **Cold Starts**: Be aware of potential cold start times in serverless environments

## Resources

- [Azure Functions documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [HTTP trigger reference](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook) 