# Pain Level Data Dependency Chain

## Flow of Pain Level Data (frontend context)

1. **frontend/src/pages/assessment/steps/pain/page.tsx** - Entry point where user selects pain level

   - Uses `usePainLevel` hook to access/set pain level in context
   - Sets selected value to local state AND context state
   - On continue, navigates to next page with selected pain level

2. **frontend/src/pages/assessment/steps/pain/hooks/use-pain-level.ts** - Custom hook for pain level

   - Connects to Assessment Context using useAssessmentContext
   - Provides access to current pain_level value and setter function
   - Updates the context with pain_level when value changes

3. **frontend/src/pages/assessment/context/hooks/use-assessment-context.ts** - Context access hook

   - Retrieves assessment context using React's useContext
   - Validates context exists and provides access to state/methods

4. **frontend/src/pages/assessment/context/AssessmentResultProvider.tsx** - Context provider

   - Stores all assessment-related data including pain_level
   - Provides methods to update the assessment result state
   - Persists this data between page navigations

5. **frontend/src/pages/assessment/context/hooks/useAssessmentData.ts** - Data management hook

   - Maps context data (pain_level) to component-friendly format (painLevel)
   - Falls back to sessionStorage only if context is not available
   - Used by display components like ResultsTable to show the data

6. **results/components/result-details/PainLevel.tsx** - Display component
   - Receives painLevel as prop from useAssessmentData hook
   - Displays the formatted pain level information to the user
   - Has special styling based on pattern determination
