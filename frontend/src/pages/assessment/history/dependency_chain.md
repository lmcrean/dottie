# Assessment History Data Dependency Chain

This document lists the key files involved in the assessment history flow.

## Files in Sequence 🔗

1. `frontend/src/pages/assessment/history/page.tsx` - Main component that renders the assessment list
2. `frontend/src/api/assessment/index.ts` - API client that exports the assessmentApi.list() method
3. `frontend/src/api/assessment/requests/list/Request.ts` - Handles the API request for listing assessments
4. `backend/routes/assessment.js` - Backend route that handles the GET request
5. `backend/models/assessment/Assessment.js` - Database model for assessments
6. `backend/controllers/assessment.js` - Controller that processes the request and returns data
7. `frontend/src/pages/assessment/history/[id]/page.tsx` - Individual assessment detail page 