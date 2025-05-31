# Assessment Dependency Chain

1. Components using assessment data
2. useAssessmentResult hook (frontend/src/hooks/use-assessment-result.ts)
3. AssessmentResultContext (frontend/src/context/assessment/AssessmentResultContext.ts)
4. Assessment state & actions (frontend/src/context/assessment/reducer.ts)
5. Assessment services:
   - determinePattern (frontend/src/services/assessment/determinePattern.ts)
   - generateRecommendations (frontend/src/services/assessment/generateRecommendations.ts)
   - transformToFlattenedFormat (frontend/src/services/assessment/transformToFlattenedFormat.ts)

Related files:

- types.ts - Contains assessment data type definitions
- AssessmentResultProvider.tsx - Provides context to components
