# Assessment History List View Flow

This document describes the data flow for the assessment list view.

## List View Flow (GET /api/assessment/list)

1. `frontend/src/pages/assessment/history/list/page.tsx` - Main component that renders the assessment list
2. `frontend/src/pages/assessment/api/index.ts` - API client that exports the `assessmentApi.list()` method
3. `frontend/src/pages/assessment/api/requests/getList/Request.ts` - Handles the API request for listing assessments
4. `backend/routes/assessment/index.js` - Main router that directs to the list endpoint
5. `backend/routes/assessment/getList/routes.js` - Backend route that handles the GET request
6. `backend/routes/assessment/getList/controller.js` - Controller that processes the request
7. `backend/models/assessment/Assessment.js` - Database model that fetches assessments
