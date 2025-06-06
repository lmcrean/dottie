# Assessment Delete Dependency Chain

This document lists the key files involved in the assessment deletion flow.

## Files in Sequence 🔗

1. `frontend/src/pages/assessment/history/page.tsx` - Contains delete button UI and confirmation modal
2. `frontend/src/api/assessment/index.ts` - API client that exports the assessmentApi.delete() method
3. `frontend/src/api/assessment/requests/delete/Request.ts` - Handles the API request for deleting an assessment
4. `backend/routes/assessment.js` - Backend route that handles the DELETE request
5. `backend/controllers/assessment.js` - Controller that processes the delete request
6. `backend/models/assessment/Assessment.js` - Database model that performs the deletion operation
7. `frontend/src/pages/assessment/history/page.tsx` - Updates UI to remove deleted assessment
