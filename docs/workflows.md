# GitHub Actions Workflows

## Workflow Architecture

The project uses two distinct deployment patterns with consistent naming conventions that mirror the Playwright test configurations.

## Naming Convention

All workflows follow the pattern: `{purpose}.production.{environment}.yml`

- **Purpose**: `test-api`, `test-e2e`, `test-integration`, `deploy-api`, `deploy-web`, `deploy-preview`, `deploy`
- **Environment**: `branch` (preview deployments) or `main` (production deployments)

## Branch Workflows (`.production.branch.yml`)

**Purpose**: Preview deployments for pull requests and feature branches. Enables the code reviewers to quickly preview a new feature/fix and confirm it works in production. It also identifies specific issues in production through E2E testing.

**Characteristics**:
- Triggered on pull requests to main
- Deploy to temporary preview environments
- Short-lived infrastructure (cleaned up after PR merge/close)
- Branch-specific URLs with PR identifiers
- Full integration testing against preview deployments

**Workflows**:
- `test-api.production.branch.yml` - API health and integration tests
- `test-e2e.production.branch.yml` - End-to-end tests against preview
- `test-integration.production.branch.yml` - Cross-service integration tests
- `deploy-api.production.branch.yml` - Deploy API to Cloud Run preview
- `deploy-web.production.branch.yml` - Deploy web to Cloud Run preview
- `deploy-preview.production.branch.yml` - Orchestrate full preview deployment

## Main Workflows (`.production.main.yml`)

**Purpose**: Production deployments for the main branch

**Characteristics**:
- Triggered on pushes to main branch
- Deploy to stable production environment
- Persistent infrastructure
- Production URLs (stable endpoints)
- Comprehensive testing and monitoring

**Workflows**:
- `test-api.production.main.yml` - Production API testing
- `test-e2e.production.main.yml` - Production end-to-end validation
- `test-integration.production.main.yml` - Production integration testing
- `deploy-api.production.main.yml` - Deploy API to production Cloud Run
- `deploy-web.production.main.yml` - Deploy web to production Cloud Run
- `deploy.production.main.yml` - Orchestrate full production deployment

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