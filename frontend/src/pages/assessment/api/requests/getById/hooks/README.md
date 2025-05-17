# `useAssessmentById` Hook (Conceptual)

This hook fetches an assessment by ID, transforms the API data, and updates the global `AssessmentResultContext`.

## Key Actions:

1.  **Fetch:** Calls `getById` API request.
2.  **Transform:** Uses `transformApiAssessmentToContextResult` utility (from `frontend/src/pages/assessment/context/utils.ts`).
3.  **Update Context:** Dispatches `setResult` to `AssessmentResultContext`.

## Purpose:

Integrates fetched assessment data into the central context, enabling `ResultsTable.tsx` to display it. This supports UI unification and simplification by removing older detail components.
