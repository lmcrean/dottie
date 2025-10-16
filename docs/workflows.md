# GitHub Actions Workflows

## Workflow Architecture

The project uses a **reusable workflow pattern** to eliminate code duplication and prevent drift between branch and main deployments. This architecture consolidates all deployment and testing logic into centralized workflows that are called by minimal trigger files.

## Design Principles

- **Zero Drift**: Single source of truth for deployment and testing logic
- **Consistency**: Same steps for branch and main deployments
- **Maintainability**: Change once, apply everywhere
- **Dual-Server Support**: Handles both API (Cloud Run) and Web (Firebase) deployments

## Workflow Structure

### Reusable Workflows (Core Logic)

**`reusable-deploy.yml`** - Contains ALL deployment logic
- Deploys API to Google Cloud Run (with environment-specific naming)
- Deploys Web to Firebase Hosting (with channel management)
- Validates both deployments
- Updates PR comments for branch deployments
- **Inputs**: `deployment_type`, `branch_name`, `pr_number`
- **Outputs**: `api_url`, `web_url`

**`reusable-test.yml`** - Contains ALL testing logic
- API tests (unit tests, health checks, endpoint validation)
- Integration tests (cross-service validation, CORS, performance)
- E2E tests (Playwright browser tests, full user flows)
- Uploads test artifacts
- Updates PR test status for branch deployments
- **Inputs**: `api_url`, `web_url`, `deployment_type`, `branch_name`, `pr_number`

### Trigger Workflows (Minimal)

**`deploy-branch-preview.yml`** - Branch deployment trigger (~30 lines)
- **Purpose**: Preview deployments for pull requests
- **Trigger**: PR opened/synchronized/reopened, manual dispatch
- **Action**: Calls `reusable-deploy.yml` → `reusable-test.yml` with branch parameters
- **Result**: Temporary preview deployment with URLs posted to PR

**`deploy-main-production.yml`** - Production deployment trigger (~30 lines)
- **Purpose**: Production deployments for main branch
- **Trigger**: Push to main, manual dispatch
- **Action**: Calls `reusable-deploy.yml` → `reusable-test.yml` with main parameters
- **Result**: Production deployment with summary logged

## Branch Deployments

**Purpose**: Preview deployments for pull requests and feature branches. Enables code reviewers to quickly preview a new feature/fix and confirm it works in production. Identifies specific issues through E2E testing.

**Characteristics**:
- Triggered on pull requests to main
- Deploy to temporary preview environments
- Short-lived infrastructure (can be cleaned up after PR merge/close)
- Branch-specific URLs with PR identifiers
- Full integration testing against preview deployments
- PR comments with deployment URLs and test results

**Deployment Flow**:
1. Build and deploy API to Cloud Run with branch-specific name: `api-{branch-name}`
2. Build and deploy Web to Firebase with preview channel: `branch-{pr-number}`
3. Post deployment URLs to PR comment
4. Run API tests (unit, health, endpoints)
5. Run integration tests (cross-service, CORS, performance)
6. Run E2E tests (Playwright browser tests)
7. Update PR comment with test results

## Main Deployments

**Purpose**: Production deployments for the main branch

**Characteristics**:
- Triggered on pushes to main branch
- Deploy to stable production environment
- Persistent infrastructure
- Production URLs (stable endpoints)
- Comprehensive testing and monitoring
- Deployment summary logged

**Deployment Flow**:
1. Build and deploy API to Cloud Run with production name: `dottie-api-main`
2. Build and deploy Web to Firebase with live channel
3. Run API tests (unit, health, endpoints)
4. Run integration tests (cross-service, CORS, performance)
5. Run E2E tests (Playwright browser tests)
6. Log deployment summary

## Archived Workflows

The old workflow structure (12 separate files with ~2,000 lines of code) has been archived in `.github/workflows/archive/`. The previous structure had significant code duplication leading to drift issues:

**Old Structure** (archived):
- 6 deployment workflows (deploy-api.production.{branch|main}.yml, deploy-web.production.{branch|main}.yml, deploy-preview/deploy.production.{branch|main}.yml)
- 6 test workflows (test-{api|integration|e2e}.production.{branch|main}.yml)

**New Structure** (current):
- 2 reusable workflows (reusable-deploy.yml, reusable-test.yml)
- 2 trigger workflows (deploy-branch-preview.yml, deploy-main-production.yml)

**Benefits**:
- 67% reduction in number of files (12 → 4)
- 65% reduction in lines of code (~2,000 → ~700)
- 100% elimination of code duplication
- Zero drift points between environments

## Testing Integration

Workflow naming aligns with Playwright configurations:

**Branch Testing**:
- `playwright.config.api.production.branch.ts`
- `playwright.config.web.production.branch.ts`

**Main Testing**:
- `playwright.config.api.production.main.ts`
- `playwright.config.web.production.main.ts`

This consistency ensures clear mapping between deployment environments and their corresponding test configurations.

## Environment Variables

Both patterns use environment-specific variables:

**Branch Deployments**:
- `API_DEPLOYMENT_URL` - Branch-specific API URL
- `WEB_DEPLOYMENT_URL` - Branch-specific web URL
- `BRANCH_NAME` - Source branch name
- `PR_NUMBER` - Pull request identifier

**Main Deployments**:
- `PRODUCTION_API_URL` - Stable production API URL
- `PRODUCTION_WEB_URL` - Stable production web URL
- `GITHUB_SHA` - Commit hash for release tracking