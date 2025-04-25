# Assessment Schema Flattening: Full Dependency Chain

This document provides a comprehensive view of all components that need to be updated to fully implement the flattened assessment structure throughout the application.

## Database Layer

1. ✅ `backend/db/migrations/updateFlattenedAssessmentSchema.js`
   - Migration script that implements schema changes
   - Adds individual columns for each assessment field
   - Converts nested JSON structure to flat columns

2. ✅ `backend/scripts/updateAssessmentSchemaToFlattened.js`
   - Runner script that executes the migration
   - Entry point for updating the database schema

## Backend Components

3. `backend/models/Assessment.js`
   - Update `create()` method to support flattened structure
   - Update `update()` method to handle both formats
   - Update `findById()` to transform data to appropriate format
   - Update `findByUserId()` to handle new structure

4. `backend/routes/assessment/controllers/index.js`
   - Update handlers for all assessment endpoints
   - Ensure compatibility with both data formats

5. `backend/routes/assessment/index.js`
   - Update route definitions if needed
   - Ensure proper validation middleware is applied

6. `backend/routes/assessment/validators/index.js`
   - Update validation logic to work with flattened structure
   - Ensure both nested and flat formats pass validation during transition

7. `backend/utils/formatters.js` (if exists)
   - Update any data formatters used for assessment data
   - Create new formatters for flattened structure if needed

8. `backend/utils/serializers.js` (if exists)
   - Update serializers to convert between DB and API formats
   - Handle JSON string conversion for array fields (symptoms, recommendations)

## Frontend Components

9. `frontend/src/api/assessment/index.ts`
   - Update API client methods to work with new data structure
   - Ensure backward compatibility with existing code

10. `frontend/src/api/assessment/types.ts`
    - Update assessment interface definitions
    - Add proper typing for flattened structure
    - Maintain backward compatibility types during transition

11. `frontend/src/store/assessment/` (if using Redux or similar)
    - `actions.ts` - Update action creators to handle new format
    - `reducers.ts` - Update state management for flattened data
    - `selectors.ts` - Update selectors to work with new data structure

12. `frontend/src/components/Assessment/` (adjust paths as needed)
    - `AssessmentForm.tsx` - Update form handling for flattened data
    - `AssessmentView.tsx` - Update display components
    - `SymptomsSection.tsx` - Update to handle separated symptom fields
    - `RecommendationsSection.tsx` - Update to handle top-level recommendations

13. `frontend/src/utils/assessment.ts` (if exists)
    - Create helpers for converting between formats if needed
    - Update any parsing logic for symptoms and recommendations

## Testing Infrastructure

14. `backend/routes/assessment/__tests__/`
    - `unit/assessment.test.js` - Update unit tests for assessment model
    - `unit/controllers.test.js` - Update controller tests
    - `e2e/assessment.test.js` - Update API endpoint tests

15. `frontend/src/api/__tests__/unit/assessment.test.ts`
    - Update test fixtures to use new format
    - Update assertions to check for correct structure
    - Add tests for backward compatibility

16. `frontend/src/components/Assessment/__tests__/`
    - Update component tests to work with flattened data structure
    - Test both formats during transition period

17. `frontend/cypress/` or `frontend/playwright/` (e2e tests)
    - Update E2E tests to work with new data structure
    - Update test data generators and fixtures

## Migration Scripts

18. `backend/scripts/migrateAssessmentData.js` (create if needed)
    - Script to convert existing production data
    - Test framework for verifying data integrity

## Deployment Plan

1. Database schema update
   - Deploy `updateFlattenedAssessmentSchema.js`
   - Run migration on staging/test environments first

2. Backend deployment
   - Update all backend files with dual format support
   - Deploy to staging environment
   - Verify API endpoints handle both formats correctly

3. Frontend deployment
   - Update frontend types and components
   - Deploy updates to staging
   - Verify forms and displays work correctly

4. Testing
   - Run all updated tests
   - Perform manual verification
   - Check for any regressions

5. Production deployment
   - Deploy backend changes with dual format support
   - Deploy frontend updates
   - Migrate existing data if needed
   - Monitor for issues

6. Legacy format removal (future)
   - Remove support for nested format once transition complete
   - Update documentation

## Verification Checklist

- [ ] Schema migration runs successfully
- [ ] Backend handles both formats correctly
- [ ] API responses maintain consistent structure
- [ ] All tests pass with new format
- [ ] Frontend displays data correctly
- [ ] Forms create and update assessments properly
- [ ] No regression in existing functionality 