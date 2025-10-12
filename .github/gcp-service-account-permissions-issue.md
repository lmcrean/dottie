# GCP Service Account Permissions Issue

## Summary

The GitHub Actions workflow is failing during GCP authentication validation due to insufficient permissions for the service account to list enabled services.

## Error Details

```
ERROR: (gcloud.services.list) [***] does not have permission to access projects instance [dottie-app-37930] (or it may not exist): Permission denied to list services for consumer container [projects/600918133046]
Help Token: AeNz4Pj4K8eDXb_2UAwWw0r9Yiz0UGxYUwbRf0t0CliukyBxW3inyp_V1feVEcuZkVIaRgf7nHC6S3IaiVl9yRueY1kP6aRluNyAygdducI01Zst. This command is authenticated as *** using the credentials in /home/runner/work/dottie/dottie/gha-creds-e29f93882786a176.json, specified by the [auth/credential_file_override] property
- '@type': type.googleapis.com/google.rpc.PreconditionFailure
  violations:
  - subject: '110002'
    type: googleapis.com
- '@type': type.googleapis.com/google.rpc.ErrorInfo
  domain: serviceusage.googleapis.com
  reason: AUTH_PERMISSION_DENIED
```

## Root Cause

The service account being used in GitHub Actions lacks the `serviceusage.googleapis.com` API permissions required to execute `gcloud services list` commands. This prevents the validation script from checking if APIs are enabled.

## Impact

- GitHub Actions workflow fails with exit code 1
- Validation step blocks deployment pipeline
- APIs are actually enabled and functional (confirmed via direct testing)

## Solution Options

### Option 1: Grant Additional Permissions (Recommended)
Add the following role to the service account:
- `roles/serviceusage.serviceUsageViewer` - Allows listing enabled services

### Option 2: Modify Validation Script
Update the validation script to:
- Skip the `gcloud services list` check
- Use direct API calls to test functionality instead
- Handle permission errors gracefully without failing the workflow

### Option 3: Alternative Validation Method
Replace `gcloud services list` with direct functionality tests:
```bash
# Instead of checking if APIs are enabled, test if they work
gcloud artifacts repositories list --location=us-central1 >/dev/null 2>&1 && echo "✅ Artifact Registry accessible" || echo "❌ Artifact Registry not accessible"
```

## Verification

Despite the permission error, the following operations work correctly:
- ✅ Service account authentication successful
- ✅ Project access confirmed (dottie-app-37930)
- ✅ API enablement successful
- ✅ Artifact Registry access functional
- ✅ Repository listing works

## Recommended Action

Implement **Option 1** by granting the service account the `serviceusage.serviceUsageViewer` role to allow proper validation while maintaining security best practices.

## Current Status (Latest Update)

### Actions Taken
1. ✅ **Created new service account**: `github-actions-deploy@dottie-app-37930.iam.gserviceaccount.com`
2. ✅ **Added required permissions**:
   - `roles/serviceusage.serviceUsageViewer` - List enabled services (fixes validation error)
   - `roles/artifactregistry.admin` - Manage container images  
   - `roles/run.admin` - Deploy Cloud Run services
   - `roles/cloudbuild.builds.builder` - Build container images
3. ✅ **Generated service account key**: `github-actions-deploy-key.json`
4. ✅ **Added `GCP_SA_KEY` secret** to GitHub repository
5. ✅ **Removed unnecessary GitHub token validation** from workflow files

### Persistent Issue
The same permission error continues to occur:

```
ERROR: (gcloud.services.list) [***] does not have permission to access projects instance [dottie-app-37930] (or it may not exist): Permission denied to list services for consumer container [projects/600918133046]
Help Token: AeNz4PiO4W07VbHFnm20kX-tlWSWMgUodEG0g9RA_qgLVNSoXwtOkGyq2lzW0e4H6xOztplqCSaIkojCAqlfyHxrdcw_T-gX97J35sB8VQ-gEKlg. This command is authenticated as *** using the credentials in /home/runner/work/dottie/dottie/gha-creds-2127616baef5bd9c.json, specified by the [auth/credential_file_override] property
- '@type': type.googleapis.com/google.rpc.PreconditionFailure
  violations:
  - subject: '110002'
    type: googleapis.com
- '@type': type.googleapis.com/google.rpc.ErrorInfo
  domain: serviceusage.googleapis.com
  reason: AUTH_PERMISSION_DENIED
❌ Artifact Registry API is not enabled
```

### Additional Backend Test Issues
Backend tests are also failing with database-related errors:

```
Error in findBy for users: [Error: select * from `users` where `email` = 'test-1752944575829@example.com' - SQLITE_ERROR: no such table: users] {
  errno: 1,
  code: 'SQLITE_ERROR'
}
```

### Next Steps Required
1. **Update GitHub Actions workflow** to use the new service account key authentication instead of Workload Identity Federation
2. **Fix workflow authentication** by replacing:
   ```yaml
   workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
   service_account: ${{ secrets.WIF_SERVICE_ACCOUNT }}
   ```
   With:
   ```yaml
   credentials_json: ${{ secrets.GCP_SA_KEY }}
   ```
3. **Address backend database initialization** for test environment