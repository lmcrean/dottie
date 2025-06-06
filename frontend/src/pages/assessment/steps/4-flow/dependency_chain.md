# Flow Level Data Dependency Chain

## Flow of Flow Level Data (frontend context)

1. **frontend/src/pages/assessment/steps/flow/page.tsx** - Entry point where user selects flow level

   - Uses `useFlowHeaviness` hook to access/set flow heaviness in context
   - Sets selected value to local state AND context state
   - On continue, navigates to next page with selected flow level

2. **frontend/src/pages/assessment/steps/flow/hooks/use-flow-heaviness.ts** - Custom hook for flow level

   - Connects to Assessment Context using useAssessmentContext
   - Provides access to current flow_heaviness value and setter function
   - Updates the context with flow_heaviness when value changes

3. **frontend/src/pages/assessment/context/hooks/use-assessment-context.ts** - Context access hook

   - Retrieves assessment context using React's useContext
   - Validates context exists and provides access to state/methods

4. **frontend/src/pages/assessment/context/AssessmentResultProvider.tsx** - Context provider

   - Stores all assessment-related data including flow_heaviness
   - Provides methods to update the assessment result state
   - Persists this data between page navigations

5. **frontend/src/pages/assessment/context/hooks/useAssessmentData.ts** - Data management hook

   - Maps context data (flow_heaviness) to component-friendly format (flowLevel)
   - Falls back to sessionStorage only if context is not available
   - Used by display components like ResultsTable to show the data

6. **results/components/result-details/FlowLevel.tsx** - Display component
   - Receives flowLevel as prop from useAssessmentData hook
   - Displays the formatted flow level information to the user
   - Has mapping to convert raw flow level values to display text
