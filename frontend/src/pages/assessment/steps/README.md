# Assessment Data Flow

This document outlines the flow of assessment data through the steps of the assessment process.

## Data Flow

The assessment data flows through the following steps:

1. **Symptoms Collection (Step 6)**

   - User inputs their symptoms
   - Data stored in context via `useAssessmentData` hook

2. **Pattern Calculation (Step 7)**

   - `useDeterminedPattern` hook reads symptom data from context
   - `determinePattern.ts` logic determines the menstrual pattern
   - Pattern is stored back in context

3. **Recommendation Generation (Step 8)**

   - `useGenerateRecommendations` hook reads pattern from context
   - `generateRecommendations.ts` selects appropriate recommendations
   - Recommendations stored in context

4. **Save Assessment (Step 9)**
   - `Request.ts` prepares to send data to backend
   - `AssessmentObjectReady.tsx` validates the data is complete
   - If validation passes, data is sent to the backend

## Key Files

- **Context Types**: `context/types/index.ts` - Defines all data types
- **Context Hook**: `context/hooks/useAssessmentResult.ts` - Provides access to context
- **Pattern Determination**: `7-calculate-pattern/determinePattern.ts` - Logic for determining pattern
- **Recommendations**: `context/types/recommendations.ts` - Recommendation definitions
- **Validation**: `validation/AssessmentObjectReady.tsx` - Validates assessment before saving

## Data Flow Diagram

```
User Input → Symptoms Collection → Context → Pattern Calculation →
Context → Recommendation Generation → Context → Validation → Backend
```

## Debugging

The flow can be traced via console logs at each step:

- `useAssessmentData` logs data extraction and mapping
- `useDeterminedPattern` logs when pattern is calculated or changed
- `useGenerateRecommendations` logs recommendation generation
- `AssessmentObjectReady` logs validation of assessment data
- `Request.ts` logs when sending data to backend
