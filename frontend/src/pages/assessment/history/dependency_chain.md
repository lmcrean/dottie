# Assessment History Data Dependency Chain

This document lists the key files involved in the assessment history flow.

## Files in Sequence 🔗

### List View Flow (GET /api/assessment/list)

1. `frontend/src/pages/assessment/history/page.tsx` - Main component that renders the assessment list
2. `frontend/src/pages/assessment/api/index.ts` - API client that exports the `assessmentApi.list()` method
3. `frontend/src/pages/assessment/api/requests/getList/Request.ts` - Handles the API request for listing assessments
4. `backend/routes/assessment/index.js` - Main router that directs to the list endpoint
5. `backend/routes/assessment/getList/routes.js` - Backend route that handles the GET request
6. `backend/routes/assessment/getList/controller.js` - Controller that processes the request
7. `backend/models/assessment/Assessment.js` - Database model that fetches assessments

### Detail View Flow (GET /api/assessment/:id)

1. `frontend/src/pages/assessment/history/[id]/page.tsx` - Individual assessment detail page
2. `frontend/src/pages/assessment/api/index.ts` - API client that exports the `assessmentApi.getById()` method
3. `frontend/src/pages/assessment/api/requests/getById/Request.ts` - Handles the API request for getting a specific assessment
4. `backend/routes/assessment/index.js` - Main router that directs to the detail endpoint
5. `backend/routes/assessment/getDetail/routes.js` - Backend route that handles the GET request
6. `backend/routes/assessment/getDetail/controller.js` - Controller that processes the request
7. `backend/models/assessment/Assessment.js` - Database model that fetches the specific assessment

## Save/Create Flow (POST /api/assessment/send)

1. `frontend/src/pages/assessment/results/components/save-results-btn/SaveResultsButton.tsx` - Button that initiates saving results
2. `frontend/src/pages/assessment/api/index.ts` - API client that exports the `assessmentApi.sendAssessment()` method
3. `frontend/src/pages/assessment/api/requests/postSend/Request.ts` - Handles the API request for sending assessment data
4. `backend/routes/assessment/index.js` - Main router that directs to the create endpoint
5. `backend/routes/assessment/create/routes.js` - Backend route that handles the POST request
6. `backend/routes/assessment/create/controller.js` - Controller that processes the request and saves data
7. `backend/models/assessment/Assessment.js` - Database model that creates the assessment record
