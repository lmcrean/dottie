## Dependency Chain: Assessment Data Flow

This document outlines the flow of assessment data from the frontend through the backend for both POST (creation) and GET (retrieval) requests.

# Summary

POST request:

1. `frontend/src/pages/assessment/steps/9-save/post-id/Request.ts`
2. `backend/routes/assessment/create/routes.js`
3. `backend/routes/assessment/create/controller.js`
4. `backend/models/assessment/Assessment.js`
5. `backend/models/assessment/FlattenedAssessment.js` (if no `assessment_data` in payload)
6. `backend/models/assessment/LegacyAssessment.js` (if `assessment_data` in payload)
7. `backend/services/dbService.js` (interacts with DB)

GET request:

1. `frontend/src/pages/assessment/detail/page.tsx` (initiates fetch)
2. `frontend/src/pages/assessment/detail/components/results/api/getById/Request.ts` (frontend API call)
3. `backend/routes/assessment/getDetail/routes.js`
4. `backend/routes/assessment/getDetail/controller.js`
5. `backend/models/assessment/Assessment.js` (determines format)
6. `backend/models/assessment/FlattenedAssessment.js` (if flattened format in DB)
7. `backend/models/assessment/LegacyAssessment.js` (if legacy format in DB)
8. `backend/services/dbService.js` (interacts with DB)
9. `frontend/src/pages/assessment/detail/components/results/api/getById/Request.ts` (processes response)
10. `frontend/src/pages/assessment/detail/page.tsx` (consumes processed data)

**POST Request (`/api/assessment/send`) - Creating/Saving Data:**

1.  **Frontend - Data Submission**:

    - File: `frontend/src/pages/assessment/steps/9-save/post-id/Request.ts`
    - Function: `postSend`
    - Action: Collects assessment data (including distinct `physical_symptoms`, `emotional_symptoms` as arrays, and `other_symptoms` as a string) from context. Uses `prepareAssessmentData` which ensures these fields are correctly formatted before sending.

2.  **Backend - Route Definition**:

    - File: `backend/routes/assessment/create/routes.js`
    - Action: Defines the `/api/assessment/send` POST endpoint and maps it to the controller.

3.  **Backend - Request Controller**:

    - File: `backend/routes/assessment/create/controller.js`
    - Function: `createAssessment`
    - Action: Receives the request. The `assessmentData` in `req.body` contains `physical_symptoms`, `emotional_symptoms`, and `other_symptoms`. Calls the model layer.

4.  **Backend - Main Model (Factory)**:

    - File: `backend/models/assessment/Assessment.js`
    - Static Method: `Assessment.create(assessmentData, userId)`
    - Action: Determines whether to use `LegacyAssessment` or `FlattenedAssessment`.

5.  **Backend - Specific Model (Data Handling & DB Interaction)**:

    - **If `assessmentData.assessment_data` is NOT present (Flattened Format)**:
      - File: `backend/models/assessment/FlattenedAssessment.js`
      - Static Method: `FlattenedAssessment.create(assessmentData, userId)`
      - Action:
        - Extracts `physical_symptoms`, `emotional_symptoms` (arrays), and `other_symptoms` (string).
        - Stores `physical_symptoms` and `emotional_symptoms` as JSON strings of arrays.
        - If `other_symptoms` is a non-empty string, it's converted to a single-element array (e.g., `["user input"]`) and then stored as a JSON string. Otherwise, stores `null`.
    - **If `assessmentData.assessment_data` IS present (Legacy Format)**:
      - File: `backend/models/assessment/LegacyAssessment.js`
      - Static Method: `LegacyAssessment.create(assessmentData, userId)`
      - Action: Stores the entire `assessmentData.assessment_data` object (which might contain nested `symptoms` with `physical` and `emotional` arrays) as a JSON string in the `assessment_data` column. `other_symptoms` is not explicitly handled at this stage for legacy creation in a distinct top-level field.

6.  **Backend - Database Service**:

    - File: `backend/services/dbService.js`
    - Action: Provides generic methods for DB interaction.

7.  **Database**: Table: `assessments`

---

**GET Request (`/api/assessment/:id` or `/api/assessment/:assessmentId`) - Retrieving Data:**

1.  **Frontend - Data Fetch Trigger**:

    - File: `frontend/src/pages/assessment/detail/page.tsx`
    - Action: `useEffect` hook calls `assessmentApi.getById(id)`.

2.  **Frontend - API Call Preparation**:

    - File: `frontend/src/pages/assessment/detail/components/results/api/getById/Request.ts`
    - Function: `getById`
    - Action: Makes the GET request to the backend.

3.  **Backend - Route Definition**:

    - File: `backend/routes/assessment/getDetail/routes.js`
    - Action: Defines GET endpoint.

4.  **Backend - Request Controller**:

    - File: `backend/routes/assessment/getDetail/controller.js`
    - Function: `getAssessmentDetail`
    - Action: Calls model layer.

5.  **Backend - Main Model (Factory)**:

    - File: `backend/models/assessment/Assessment.js`
    - Static Method: `Assessment.findById(id)`
    - Action: Determines format.

6.  **Backend - Specific Model (Data Handling & DB Interaction)**:

    - **If DB record does NOT have `assessment_data` (Flattened Format)**:
      - File: `backend/models/assessment/FlattenedAssessment.js`
      - Static Method: `FlattenedAssessment.findById(id)`
      - Transformation: `_transformDbRecordToApiResponse(record)`
        - Parses `physical_symptoms` (JSON string) into an array.
        - Parses `emotional_symptoms` (JSON string) into an array.
        - Parses `other_symptoms` (JSON string, originally from a single string input wrapped in an array) into an array of strings (e.g., `["user input"]` or `[]`).
        - Returns these as distinct fields in the API response.
    - **If DB record HAS `assessment_data` (Legacy Format)**:
      - File: `backend/models/assessment/LegacyAssessment.js`
      - Static Method: `LegacyAssessment.findById(id)`
      - Transformation: `_transformDbRecordToApiResponse(record)`
        - Parses `assessment_data` JSON string.
        - Extracts `physical_symptoms` and `emotional_symptoms` from `assessmentData.symptoms.physical` and `assessmentData.symptoms.emotional` respectively, ensuring they are arrays.
        - `other_symptoms` is typically returned as an empty array as it's not explicitly stored as a distinct top-level field in this legacy structure.
        - Returns these as distinct fields in the API response.

7.  **Backend - Database Service**: File: `backend/services/dbService.js`

8.  **Database**: Table: `assessments`

9.  **Frontend - API Response Processing**:

    - File: `frontend/src/pages/assessment/detail/components/results/api/getById/Request.ts`
    - Function: `getById` (after `await apiClient.get`)
    - Action: Receives the API response. Ensures `physical_symptoms`, `emotional_symptoms`, and `other_symptoms` are arrays (e.g., using `ensureArrayFormat` or similar logic, or by type definition). It does NOT combine them into a single `symptoms` field anymore.

10. **Frontend - Data Consumption**:
    - File: `frontend/src/pages/assessment/detail/page.tsx`
    - Action:
      - Receives assessment data with distinct `physical_symptoms`, `emotional_symptoms`, and `other_symptoms` (now string[]).
      - Uses `useMemo` hooks to prepare these three distinct arrays for the `ResultsTable` component.
      - Handles `hasFlattenedFormat` and `hasLegacyFormat` to correctly source these fields.

---

**Key Files for Symptom Data Transformation:**

- `backend/models/assessment/FlattenedAssessment.js`:
  - `create()`: `JSON.stringify()` for `physical_symptoms` (array) and `emotional_symptoms` (array). `other_symptoms` (string) is wrapped into an array `["user input"]` then `JSON.stringify()`'d if non-empty.
  - `_transformDbRecordToApiResponse()`: `JSON.parse()` for `physical_symptoms`, `emotional_symptoms`, and `other_symptoms` to return them as distinct arrays.
- `backend/models/assessment/LegacyAssessment.js`:
  - `create()`: `JSON.stringify()` for the entire `assessment_data` object.
  - `_transformDbRecordToApiResponse()`: `JSON.parse()` for `assessment_data`, then extracts `physical_symptoms` and `emotional_symptoms` from the nested structure. `other_symptoms` will typically be an empty array.
- `frontend/src/pages/assessment/detail/components/results/api/getById/Request.ts`:
  - Ensures `physical_symptoms`, `emotional_symptoms`, and `other_symptoms` from the API response are correctly typed/handled as arrays. No longer creates a combined `symptoms` field.
- `frontend/src/pages/assessment/detail/page.tsx`:
  - `ensureArrayFormat()`: Utility to ensure symptom fields are arrays.
  - `physicalSymptoms`, `emotionalSymptoms`, `otherSymptoms` (via `useMemo`): Extracts data for these three distinct arrays based on `hasLegacyFormat` or `hasFlattenedFormat`. These are then passed to `ResultsTable`.

---

**Regarding `other_symptoms`:**

- **Backend Handling (`FlattenedAssessment.js`)**:
  - **Creation**: If a non-empty string is provided for `other_symptoms` (e.g., "loss of motivation"), it's wrapped into an array (`["loss of motivation"]`) and then JSON stringified for database storage. Empty or null input results in `null` in DB.
  - **Retrieval**: The JSON string is parsed back into an array (e.g., `["loss of motivation"]` or `[]` if it was originally empty/null).
- **User Expectation**: `other_symptoms: ["xxxxx"]` (an array containing a single string if input was provided, otherwise an empty array).
- **Current Alignment**: The backend now aligns with this expectation for the flattened format. Legacy format will generally yield an empty array for `other_symptoms` in the API response unless a specific mapping from its free-text fields were to be implemented.

**Regarding `emotional_symptoms` (and `physical_symptoms`):**

- **User Observation**: Expected `emotional_symptoms: ["depression", "anxiety"]` but got `[]` in GET response.
- **POST Request Log**: Showed `emotional_symptoms:[]` in the `assessmentData` payload sent to the backend.
- **Indication**: The backend correctly processes and returns what it receives. If `emotional_symptoms` is empty in the POST request, it will be empty in the GET response. The issue for missing `emotional_symptoms` (if they were indeed selected by the user) lies in the frontend data collection/context management _before_ the `postSend` function in `frontend/src/pages/assessment/steps/9-save/post-id/Request.ts` is called.

**Regarding `physical_symptoms`:**

- **User Observation**: Expected `physical_symptoms: ["food-cravings"]` but got `[]` in GET response.
- **POST Request Log**: Showed `physical_symptoms:[]` in the `assessmentData` payload sent to the backend.
- **Indication**: The backend correctly processes and returns what it receives. If `physical_symptoms` is empty in the POST request, it will be empty in the GET response. The issue for missing `physical_symptoms` (if they were indeed selected by the user) lies in the frontend data collection/context management _before_ the `postSend` function in `frontend/src/pages/assessment/steps/9-save/post-id/Request.ts` is called.
