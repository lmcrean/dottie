Components using assessment data
↓
useAssessmentResult hook (frontend/src/hooks/use-assessment-result.ts)
↓
AssessmentResultContext (frontend/src/context/assessment/AssessmentResultContext.ts)
↓
Assessment state & actions (frontend/src/context/assessment/reducer.ts)
↓
Assessment services:

- determinePattern (frontend/src/services/assessment/determinePattern.ts)
- generateRecommendations (frontend/src/services/assessment/generateRecommendations.ts)
- transformToFlattenedFormat (frontend/src/services/assessment/transformToFlattenedFormat.ts)

Related files:

- types.ts - Contains assessment data type definitions
- AssessmentResultProvider.tsx - Provides context to components
