# Assessment Results Save Flow

This document describes the data flow for saving assessment results.

## Save/Create Flow (POST /api/assessment/send)

1. `frontend/src/pages/assessment/results/components/save-results-btn/SaveResultsButton.tsx` - Button that initiates saving results
2. `frontend/src/pages/assessment/api/index.ts` - API client that exports the `assessmentApi.sendAssessment()` method
3. `frontend/src/pages/assessment/api/requests/postSend/Request.ts` - Handles the API request for sending assessment data
4. `backend/routes/assessment/index.js` - Main router that directs to the create endpoint
5. `backend/routes/assessment/create/routes.js` - Backend route that handles the POST request
6. `backend/routes/assessment/create/controller.js` - Controller that processes the request and saves data
7. `backend/models/assessment/Assessment.js` - Database model that creates the assessment record
