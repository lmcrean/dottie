# Age Data Dependency Chain

## Flow of Age Range Data (frontend context)

1. **frontend/src/pages/assessment/steps/age-verification/page.tsx** - Entry point where user selects age range

   - Uses `useAgeVerification` hook to access/set age in context
   - Saves selected age to both context state and sessionStorage
   - On continue, navigates to next page with selected age

2. **frontend/src/pages/assessment/steps/age-verification/hooks/use-age-verification.ts** - Custom hook for age verification

   - Likely connects to a React context that stores assessment data
   - Provides access to current age value and setter function
   - Logs show it's setting age to "25-plus" but later reporting undefined state

3. **frontend/src/pages/assessment/context/assessment-context.ts** - (Inferred) Context provider

   - Probably stores all assessment-related data including age
   - Should be persisting this data between page navigations

4. **frontend/src/pages/assessment/context/hooks/useAssessmentData.ts** - Data management hook

   - Logs show it's trying to retrieve age data from multiple sources
   - Attempting to read from context first, then sessionStorage
   - Shows sessionStorage raw value is "25-plus" but parsed value becomes empty string

5. **results/components/result-details/AgeRange.tsx** - Display component
   - Receives age as prop which is empty string by the time it arrives
   - Has mapping to convert raw age values to display text
   - Debug logs confirm it's receiving empty string instead of expected value
