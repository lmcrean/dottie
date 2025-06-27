# Preview Deployment Workflow

## 🚀 Overview

The new deployment system uses **Vercel's GitHub integration** instead of CLI to avoid configuration issues. It's broken into modular, reusable workflows (<100 lines each).

## 📋 Workflow Architecture

### 1. `deploy-preview.yml` (Main Orchestrator)
- **Trigger**: PR opened/updated
- **Function**: Coordinates all deployment steps
- **Outputs**: Comprehensive PR comment with deployment status

### 2. `deploy-backend.yml` (Backend Deployment)
- **Function**: Deploys backend to Vercel preview
- **Validation**: Health checks and URL verification
- **Output**: Backend deployment URL

### 3. `deploy-frontend.yml` (Frontend Deployment)
- **Function**: Deploys frontend with backend URL integration
- **Environment**: `VITE_API_BASE_URL` set to backend URL
- **Output**: Frontend deployment URL

### 4. `test-integration.yml` (Integration Testing)
- **Function**: Tests backend/frontend connectivity
- **Tests**: Health checks, API endpoints, CORS, accessibility
- **Output**: Integration test results

## 🔧 Required Secrets

Add these to GitHub Repository Settings → Secrets:

```
VERCEL_TOKEN              # Vercel API token
VERCEL_ORG_ID            # Vercel organization ID
VERCEL_BACKEND_PROJECT_ID # Backend project ID
VERCEL_FRONTEND_PROJECT_ID # Frontend project ID
```

## 🎯 Benefits

- ✅ **No CLI Issues**: Uses Vercel's GitHub integration
- ✅ **Modular**: Each workflow <100 lines
- ✅ **Reliable**: Proper error handling and retries
- ✅ **Integrated**: Backend deployed first, frontend connects
- ✅ **Tested**: Comprehensive integration testing
- ✅ **Informative**: Detailed PR comments with status

## 🔄 Deployment Flow

1. **PR Created/Updated** → Triggers `deploy-preview.yml`
2. **Backend Deployment** → Uses `deploy-backend.yml`
3. **Frontend Deployment** → Uses `deploy-frontend.yml` with backend URL
4. **Integration Testing** → Uses `test-integration.yml`
5. **PR Update** → Comment with deployment URLs and status

## 🧪 Testing Locally

```bash
# Backend
cd backend; npm install; npm run dev

# Frontend (new terminal)
cd frontend; npm install; npm run dev
```

## 🔍 Troubleshooting

- **Deployment fails**: Check secrets are set correctly
- **Backend URL wrong**: Verify project ID matches backend project
- **Integration fails**: Check CORS settings and API endpoints
- **Frontend not connecting**: Verify `VITE_API_BASE_URL` is set 