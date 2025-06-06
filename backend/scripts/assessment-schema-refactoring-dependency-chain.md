# Assessment Schema Flattening: Full Dependency Chain

This document provides a comprehensive view of all components that need to be updated to fully implement the flattened assessment structure throughout the application.

## Database Layer

1.  `backend/db/migrations/updateFlattenedAssessmentSchema.js`
   - Migration script that implements schema changes
   - Adds individual columns for each assessment field
   - Converts nested JSON structure to flat columns

2.  `backend/scripts/updateAssessmentSchemaToFlattened.js`
   - Runner script that executes the migration
   - Entry point for updating the database schema

## Backend Components

3. `backend/models/Assessment.js`
   - Update `create()` method to support flattened structure
   - Update `update()` method to handle both formats
   - Update `findById()` to transform data to appropriate format
   - Update `_transformDbRecordToApiResponse()` to handle flattened fields

4. `backend/routes/assessment/create/controller.js`
   - Update controller to handle flattened assessment format
   - Ensure proper validation and data transformation

5. `backend/routes/assessment/update/controller.js`
   - Update controller to handle both data formats
   - Ensure compatibility during transition period

6. `backend/routes/assessment/getList/controller.js`
   - Update to handle flattened data retrieval
   - Transform database records to API format

7. `backend/routes/assessment/getDetail/controller.js`
   - Update to return properly formatted assessment data
   - Handle both flattened and nested formats

8. `backend/routes/assessment/validators/index.js`
   - Update validation logic to work with flattened structure
   - Ensure both nested and flat formats pass validation during transition

9. `backend/services/dbService.js`
   - Update JSON handling methods if needed for array fields
   - Ensure proper JSON stringification/parsing for symptoms and recommendations

## Frontend Components

10. `frontend/src/api/assessment/index.ts`
    - Update API client methods to work with new data structure
    - Ensure backward compatibility with existing code

11. `frontend/src/api/assessment/types.ts`
    - Update assessment interface definitions
    - Add proper typing for flattened structure
    - Maintain backward compatibility types during transition

12. `frontend/src/api/assessment/requests/postSend/Request.ts`
    - Update to handle sending flattened assessment data
    - Ensure compatibility with backend changes

13. `frontend/src/api/assessment/requests/getById/Request.ts`
    - Update to handle receiving flattened data structure
    - Transform data if needed for UI components

14. `frontend/src/api/assessment/requests/getList/Request.ts`
    - Update to handle receiving lists of flattened data
    - Transform data format if needed for components

15. `frontend/src/components/Assessment/` (adjust paths based on actual structure)
    - Update form components to handle flattened data
    - Update display components for symptoms and recommendations

## Testing Infrastructure

16. `backend/routes/assessment/__tests__/`
    - Update unit tests for assessment model
    - Update controller tests
    - Update API endpoint tests

17. `frontend/src/api/__tests__/unit/integration/runners/assessment.ts`
    - Update test fixtures to use new format
    - Update assertions to check for correct structure
    - Add tests for backward compatibility

18. `backend/dev/tests/master-integration/runners/assessment.js`
    - Update integration tests to work with flattened data structure
    - Test both formats during transition period

## Migration Scripts

19. `backend/scripts/migrateAssessmentData.js` (create if needed)
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