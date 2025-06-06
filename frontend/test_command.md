# Test Commands

This document contains commands for running the assessment flow integration test.

## Running the Master Integration Test

To run the full integration test:

```bash
npm test -- "MasterIntegration.test.tsx"
```

Or using the specific path:

```bash
npm test -- "src/pages/__tests__/unit/MasterIntegration.test.tsx"
```

## Running Individual Component Tests

### Auth Flow Test

```bash
npm test -- "runners/AuthFlow"
```

### Assessment Flow Test

```bash
npm test -- "runners/AssessmentFlow"
```

## Test Structure

The test is organized in the following structure:

- `frontend/src/pages/__tests__/unit/MasterIntegration.test.tsx` - Main test file
- `frontend/src/pages/__tests__/unit/runners/AuthFlow.ts` - Auth flow utility
- `frontend/src/pages/__tests__/unit/runners/AssessmentFlow.ts` - Assessment flow utility

The test follows these steps:

1. Create account
2. Go through assessment steps
3. View results
4. Save results to database
5. View results ID
6. View results list
