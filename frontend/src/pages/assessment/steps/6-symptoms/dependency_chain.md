# Symptoms Data Dependency Chain

This document explains how symptom data flows through the Dottie application.

## Two Primary Data Journeys

The symptoms data flows through two distinct journeys:

1. **UI Data Journey**: Page → Hook → Context → Hook → Page
2. **Submission Journey**: Button → Context → Axios → Backend

## UI Data Journey: Page → Hook → Context → Hook → Page 🔄

1. **Page**: `page.tsx` - User interface where symptoms are selected
2. **Hook**: `useSymptoms.ts` - Processes the user's symptom selections
3. **Context**: `AssessmentResultContext.tsx` - Stores symptom data for the application
4. **Hook**: `useAssessmentContext.ts` - Retrieves stored symptom data
5. **Page**: `page.tsx` (results) - Displays processed symptoms to the user

## Submission Journey: Button → Context → Axios → Backend 📤

1. **Button**: `SubmitButton.tsx` - Triggers the assessment submission process
2. **Context**: `useAssessmentContext.ts` - Retrieves complete assessment data
3. **Axios**: `Request.ts` - Formats and sends data to backend API
4. **Backend**: `FlattenedAssessment.js` - Processes incoming symptom data
5. **Database**: Database storage - Persists the assessment data

## Data Structure Requirements

- Symptoms must be stored as an array of symptom objects
- Empty arrays or null values result in "None Reported" display
- Format consistency must be maintained throughout the data flow
