# Symptoms Data Dependency Chain

This document explains how symptom data flows through the Dottie application.

## Flow Overview 🔗

1. **Data Collection in UI**: User selects symptoms in `symptoms/page.tsx`
2. **Hook Layer**: `useSymptoms` hook processes the selections
3. **Context Storage**: Data is stored in `AssessmentResultContext` via `useAssessmentContext`
4. **Data Retrieval**: `results/page.tsx` retrieves data from context using hooks
5. **API Request**: Data sent via `assessment/requests/postSend/Request.ts`
6. **Backend Processing**: Processing in `backend/models/assessment/FlattenedAssessment.js`
7. **Database Storage**: Data persisted in database
8. **API Response**: Data retrieved via API for history view
9. **History Display**: Results displayed in `history/[id]/page.tsx`

## Data Flow Details

### Component to Context Flow

- UI components use specialized hooks (e.g., `useSymptoms`)
- Hooks call `updateResult` function from `useAssessmentContext`
- Context provider maintains state using React's reducer pattern
- All assessment steps share the same context, eliminating need for session storage

### Context to Results Flow

- Results page accesses the same context through hooks
- Complete assessment data is available within context state
- No data transformation needed between assessment steps and results page
