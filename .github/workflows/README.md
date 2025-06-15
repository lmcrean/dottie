# GitHub Actions - Vercel Deployment Workflow

## Overview

The `vercel-deploy.yml` workflow automates the deployment of the frontend application to Vercel, providing both production and preview deployments.

## What This Workflow Does

### Triggers
- **Production Deployment**: Triggers when code is pushed to the `main` branch
- **Preview Deployment**: Triggers when a pull request is opened/updated targeting the `main` branch
- **Path Filtering**: Only runs when files in the `frontend/` directory are modified

### Deployment Process
1. **Environment Setup**: 
   - Uses Ubuntu latest runner
   - Sets up Node.js version 22
   - Caches npm dependencies for faster builds

2. **Build Process**:
   - Installs dependencies with `npm ci` (clean install)
   - Builds the frontend project with `npm run build`

3. **Deployment**:
   - **Production**: Deploys to production Vercel environment when pushed to `main`
   - **Preview**: Creates preview deployment for pull requests with automatic GitHub comments

### Required Secrets
The workflow requires these secrets to be configured in GitHub repository settings:
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your specific Vercel project ID

## How to Test This Workflow

### Method 1: Create a Test Pull Request (Recommended)
1. Create a new branch from `main`:
   ```bash
   git checkout -b test-vercel-deployment
   ```

2. Make a small change to any file in the `frontend/` directory:
   ```bash
   # Example: Update a comment or add a console.log
   echo "// Test deployment" >> frontend/src/App.js
   ```

3. Commit and push the changes:
   ```bash
   git add frontend/
   git commit -m "test: trigger Vercel preview deployment"
   git push origin test-vercel-deployment
   ```

4. Create a pull request targeting `main` branch

5. Check the **Actions** tab in GitHub to see the workflow running

6. Once complete, the workflow will comment on the PR with the preview URL

### Method 2: Test Production Deployment (Use with Caution)
1. Make changes to `frontend/` files on a feature branch
2. Merge to `main` branch (this will trigger production deployment)
3. Monitor the Actions tab for deployment status

### Method 3: Local Testing with Act (Advanced)
Install [act](https://github.com/nektos/act) to run GitHub Actions locally:
```bash
# Install act (if not already installed)
# Then run the workflow locally
act pull_request --secret-file .secrets
```

## Expected Outcomes

### Successful Preview Deployment
- ✅ Workflow runs without errors
- ✅ Build completes successfully
- ✅ Preview deployment URL is generated
- ✅ GitHub comment appears on PR with preview link
- ✅ Preview URL follows format: `https://[random-string]-lmcreans-projects.vercel.app`

### Successful Production Deployment
- ✅ Workflow runs on main branch push
- ✅ Production deployment updates the main domain
- ✅ Changes are live on production URL

### Common Issues to Watch For
- ❌ Build failures (check Node.js version compatibility)
- ❌ Missing environment variables or secrets
- ❌ Frontend build errors (missing dependencies, TypeScript errors)
- ❌ Vercel deployment limits exceeded

## Monitoring and Debugging

1. **GitHub Actions Tab**: View real-time logs and status
2. **Vercel Dashboard**: Check deployment status and logs
3. **PR Comments**: Automatic preview URL comments
4. **Build Logs**: Review detailed build output for errors

## Notes
- The workflow only runs when `frontend/` files are modified
- Preview deployments are automatically created for PRs
- Production deployments only occur on `main` branch pushes
- The workflow uses npm caching to speed up builds
