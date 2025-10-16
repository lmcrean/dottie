# Archived Workflows

This directory contains the old workflow files that were replaced by the consolidated reusable workflow pattern.

## Archived Date
2025-10-11

## Reason for Archiving
These workflows were refactored to eliminate code duplication and prevent drift issues. The new structure uses a reusable workflow pattern that consolidates all deployment and testing logic into a single source of truth.

## Old Structure (12 files)
**Orchestrator workflows:**
- `deploy-preview.production.branch.yml` - Branch preview orchestrator
- `deploy.production.main.yml` - Main production orchestrator

**Deploy workflows:**
- `deploy-api.production.branch.yml` - API deployment for branches
- `deploy-api.production.main.yml` - API deployment for main
- `deploy-web.production.branch.yml` - Web deployment for branches
- `deploy-web.production.main.yml` - Web deployment for main

**Test workflows:**
- `test-api.production.branch.yml` - API tests for branches
- `test-api.production.main.yml` - API tests for main
- `test-integration.production.branch.yml` - Integration tests for branches
- `test-integration.production.main.yml` - Integration tests for main
- `test-e2e.production.branch.yml` - E2E tests for branches
- `test-e2e.production.main.yml` - E2E tests for main

## New Structure (4 files)
**Reusable workflows:**
- `reusable-deploy.yml` - Single source of truth for all deployment logic (API + Web)
- `reusable-test.yml` - Single source of truth for all testing logic (API + Integration + E2E)

**Trigger workflows:**
- `deploy-branch-preview.yml` - Minimal trigger for branch deployments
- `deploy-main-production.yml` - Minimal trigger for main deployments

## Benefits of New Structure
- **Zero Drift**: All deployment logic in one place
- **70% Line Reduction**: ~2,000 → ~700 lines
- **Easier Maintenance**: Change once, apply everywhere
- **Consistent Testing**: Same tests for all environments
- **Better Readability**: Clear separation of triggers vs logic

## Migration Notes
All functionality from the old workflows has been preserved in the new structure. The deployment flow remains the same:
1. Deploy API to Google Cloud Run
2. Deploy Web to Firebase
3. Run API tests
4. Run integration tests
5. Run E2E tests
6. Update PR comment (for branch deployments)

## Restoration
If you need to restore these workflows, simply copy them back to the parent directory. However, we recommend adapting the new reusable workflow pattern instead.
