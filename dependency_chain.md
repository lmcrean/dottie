## Dependency Chain: Assessment Data Flow

This document outlines the flow of assessment data from the frontend through the backend for both POST (creation) and GET (retrieval) requests.

**POST Request (`/api/assessment/send`) - Creating/Saving Data:**

1.  **Frontend - Data Submission**:
    *   File: `frontend/src/pages/assessment/steps/9-save/post-id/Request.ts`
    *   Function: `postSend`
    *   Action: Collects assessment data from context and prepares it for the API.

2.  **Backend - Route Definition**:
    *   File: `backend/routes/assessment/create/routes.js`
    *   Action: Defines the `/api/assessment/send` POST endpoint and maps it to the controller.

3.  **Backend - Request Controller**:
    *   File: `backend/routes/assessment/create/controller.js`
    *   Function: `createAssessment`
    *   Action: Receives the request, authenticates the user, validates data, and calls the model layer to create the assessment. It ensures `physical_symptoms` and `emotional_symptoms` are arrays.

4.  **Backend - Main Model (Factory)**:
    *   File: `backend/models/assessment/Assessment.js`
    *   Static Method: `Assessment.create(assessmentData, userId)`
    *   Action: Determines whether to use `LegacyAssessment` or `FlattenedAssessment` based on the presence of `assessmentData.assessment_data`.

5.  **Backend - Specific Model (Data Handling & DB Interaction)**:
    *   **If `assessmentData.assessment_data` is NOT present (Flattened Format)**:
        *   File: `backend/models/assessment/FlattenedAssessment.js`
        *   Static Method: `FlattenedAssessment.create(assessmentData, userId)`
        *   Action:
            *   Extracts fields like `age`, `pattern`, `physical_symptoms`, `emotional_symptoms`, `other_symptoms`.
            *   Stores `physical_symptoms`, `emotional_symptoms`, and `recommendations` as JSON strings in the database.
            *   `other_symptoms` is stored as a string.
    *   **If `assessmentData.assessment_data` IS present (Legacy Format)**:
        *   File: `backend/models/assessment/LegacyAssessment.js`
        *   Static Method: `LegacyAssessment.create(assessmentData, userId)`
        *   Action: Stores the entire `assessmentData.assessment_data` object (or `assessmentData` itself if `assessment_data` sub-property is missing) as a JSON string in the `assessment_data` column.

6.  **Backend - Database Service**:
    *   File: `backend/services/dbService.js`
    *   Action: Provides generic methods (`create`, `findById`, `update`, `delete`, etc.) for interacting with the database (Knex.js).

7.  **Database**:
    *   Persistence layer (e.g., PostgreSQL, SQLite) managed by Knex.js.
    *   Table: `assessments`

---

**GET Request (`/api/assessment/:id` or `/api/assessment/:assessmentId`) - Retrieving Data:**

1.  **Frontend - Data Fetch Trigger**:
    *   File: `frontend/src/pages/assessment/detail/page.tsx`
    *   Action: `useEffect` hook calls `assessmentApi.getById(id)`.
    *   Helper: `assessmentApi.getById` likely maps through `frontend/src/pages/assessment/api/index.ts` to `frontend/src/pages/assessment/detail/components/results/api/getById/Request.ts` (`getById` function).

2.  **Backend - Route Definition**:
    *   File: `backend/routes/assessment/getDetail/routes.js`
    *   Action: Defines the `/api/assessment/:assessmentId` GET endpoint and maps it to the controller.

3.  **Backend - Request Controller**:
    *   File: `backend/routes/assessment/getDetail/controller.js`
    *   Function: `getAssessmentDetail`
    *   Action: Receives the request, authenticates the user, validates ownership, and calls the model layer to fetch the assessment.

4.  **Backend - Main Model (Factory)**:
    *   File: `backend/models/assessment/Assessment.js`
    *   Static Method: `Assessment.findById(id)`
    *   Action: Fetches the raw record from the database and then determines whether to use `LegacyAssessment.findById` or `FlattenedAssessment.findById` based on the presence of `assessment_data` in the raw record.

5.  **Backend - Specific Model (Data Handling & DB Interaction)**:
    *   **If DB record does NOT have `assessment_data` (Flattened Format)**:
        *   File: `backend/models/assessment/FlattenedAssessment.js`
        *   Static Method: `FlattenedAssessment.findById(id)` (which uses `DbService.findById`)
        *   Transformation: `_transformDbRecordToApiResponse(record)`
            *   Parses `physical_symptoms`, `emotional_symptoms`, and `recommendations` from JSON strings back into arrays.
            *   `other_symptoms` is returned as a string.
    *   **If DB record HAS `assessment_data` (Legacy Format)**:
        *   File: `backend/models/assessment/LegacyAssessment.js`
        *   Static Method: `LegacyAssessment.findById(id)` (which uses `DbService.findById`)
        *   Transformation: `_transformDbRecordToApiResponse(record)`
            *   Parses the `assessment_data` JSON string.
            *   Extracts symptoms (`physical_symptoms`, `emotional_symptoms`) from the nested `assessmentData.symptoms` object.

6.  **Backend - Database Service**:
    *   File: `backend/services/dbService.js`
    *   Action: Provides `findById` method for database interaction.

7.  **Database**:
    *   Persistence layer (e.g., PostgreSQL, SQLite) managed by Knex.js.
    *   Table: `assessments`

8.  **Frontend - Data Consumption**:
    *   File: `frontend/src/pages/assessment/detail/page.tsx`
    *   Action:
        *   Receives the assessment data from the API.
        *   Uses `useMemo` to prepare `physicalSymptoms`, `emotionalSymptoms`, and `recommendations` for display, primarily for the `ResultsTable` component.
        *   Handles `hasFlattenedFormat` and `hasLegacyFormat` flags to adapt to the data structure.

---

**Key Files for Symptom Data Transformation:**

*   `backend/models/assessment/FlattenedAssessment.js`:
    *   `create()`: `JSON.stringify()` for `physical_symptoms`, `emotional_symptoms`. `other_symptoms` as string.
    *   `_transformDbRecordToApiResponse()`: `JSON.parse()` for `physical_symptoms`, `emotional_symptoms`. `other_symptoms` as string.
*   `backend/models/assessment/LegacyAssessment.js`:
    *   `create()`: `JSON.stringify()` for the entire `assessment_data` object.
    *   `_transformDbRecordToApiResponse()`: `JSON.parse()` for `assessment_data`, then accesses `assessmentData.symptoms.physical`, etc.
*   `frontend/src/pages/assessment/detail/page.tsx`:
    *   `ensureArrayFormat()`: Utility to ensure symptom fields are arrays before use.
    *   `physicalSymptoms`, `emotionalSymptoms` (via `useMemo`): Extracts data based on `hasLegacyFormat` or `hasFlattenedFormat`.
    *   It does **not** seem to explicitly process or display `other_symptoms` in the `ResultsTable` or related logic shown in the provided file.

---

**Regarding `other_symptoms`:**

*   **Current Backend Handling (`FlattenedAssessment.js`)**:
    *   Saved as a direct string value from `assessmentData.other_symptoms`.
    *   Retrieved as a string.
*   **User Expectation**: `other_symptoms: ["xxxxx"]` (an array containing a single string).
*   **Discrepancy**: The backend stores and returns `other_symptoms` as a plain string (e.g., `""` or `"some text"`), not an array (e.g., `["some text"]`). If the frontend sends an empty string, it's stored and returned as such. If the intent is for `other_symptoms` to always be an array containing the user's text input, the backend (specifically `FlattenedAssessment.js`) and potentially the frontend data preparation (`Request.ts`) would need modification.

**Regarding `emotional_symptoms`:**

*   **User Observation**: Expected `["depression", "anxiety"]` but got `[]`.
*   **POST Request Log**: Shows `emotional_symptoms:[]` in the `assessmentData` payload sent to the backend.
    *   `[0] Assessment creation payload: {"assessmentData":{"physical_symptoms":["food-cravings"],"emotional_symptoms":[], ...}}`
*   **GET Request Log**: Shows `emotional_symptoms: []` in the final transformed assessment.
*   **Indication**: If `emotional_symptoms` is empty in the POST request payload, the backend correctly processes and returns an empty array. The issue likely lies in the frontend data collection/preparation phase *before* `postSend` in `frontend/src/pages/assessment/steps/9-save/post-id/Request.ts` is called, or in the `contextData` it receives. The data might be lost or cleared before being sent. 