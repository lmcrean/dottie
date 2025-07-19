# Project Overview

Dottie is a full-stack web application providing AI-powered menstrual health guidance for adolescents, built with React/TypeScript frontend and Node.js/Express backend, deployed to Google Cloud Platform.

## Implementation Status

### Iteration 1 (i1) - Hello World Foundation ✅ COMPLETED
**Goal**: Establish basic React-to-Node.js API communication and deployment pipeline

#### Backend (backend/) - Node.js/Express API
- ✅ Project structure with routes, models, middleware directories
- ✅ Health endpoints with `/api/health` (simple string) and `/api/health/status` (structured JSON)
- ✅ Additional `/health` endpoint for workflow compatibility
- ✅ CORS configuration for React frontend (localhost:3000)
- ✅ Express.js routing and middleware
- ✅ Google Cloud Run deployment configuration (Dockerfile)
- ✅ Environment-specific settings (Development/Production)
- ✅ Database integration with SQLite (dev) and Azure SQL/Supabase (prod)

#### Frontend (frontend/) - React/Vite
- ✅ React components with TypeScript
- ✅ API client layer for HTTP communication with backend
- ✅ Component-based architecture with pages and reusable components
- ✅ Environment configurations (development/production)
- ✅ Firebase hosting configuration
- ✅ Error handling and loading states
- ✅ Tailwind CSS styling with Radix UI components

#### Key Features Implemented
- Basic API health endpoints returning "Hello World" messages
- React components consuming Node.js API with structured response
- Environment-specific API URL configuration with VITE_ prefix
- Google Cloud deployment ready (Cloud Run + Firebase)
- CORS properly configured for cross-origin requests

#### Next Steps (Iteration 2)
- Authentication system implementation
- JWT token management
- AI chat integration with Google Generative AI
- Assessment questionnaire system

## Docker Configuration ✅ UPDATED
**Configuration**: Node.js Alpine-based production container

**Docker Configuration** (`backend/Dockerfile`):
- Multi-stage Node.js build with Alpine Linux
- Security-focused with non-root user
- Proper signal handling with dumb-init
- Optimized layer caching for npm dependencies
- Port 8080 for Cloud Run compatibility

**Updated GitHub Actions Workflows**:
- All workflows updated for Node.js/React deployment
- Docker builds use proper Node.js base images
- Environment variables use VITE_ prefix for frontend

## Health Endpoints
- `/` - Simple "API is running" response
- `/health` - JSON health status for workflows
- `/api/health` - Express route-based health check
- `/api/health/status` - Structured health response with system information