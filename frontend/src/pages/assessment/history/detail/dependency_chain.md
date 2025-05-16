# Assessment History Detail View Flow

This document describes the data flow for viewing an individual assessment.

## Detail View Flow (GET /api/assessment/:id)

1. `frontend/src/pages/assessment/history/detail/page.tsx` - Individual assessment detail page
2. `frontend/src/pages/assessment/api/index.ts` - API client that exports the `assessmentApi.getById()` method
3. `frontend/src/pages/assessment/api/requests/getById/Request.ts` - Handles the API request for getting a specific assessment
4. `backend/routes/assessment/index.js` - Main router that directs to the detail endpoint
5. `backend/routes/assessment/getDetail/routes.js` - Backend route that handles the GET request
6. `backend/routes/assessment/getDetail/controller.js` - Controller that processes the request
7. `backend/models/assessment/Assessment.js` - Database model that fetches the specific assessment
