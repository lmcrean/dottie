# Assessment Hooks

This directory contains React hooks for managing assessment state and functionality in the Dottie application. The hooks are designed to provide a clean separation of concerns and focused functionality for different aspects of the assessment process.

## Directory Structure

```
assessment/
│
├── use-assessment-context.ts     # Base hook for context access
├── use-assessment-submission.ts  # Assessment completion and utilities
│
└── steps/                        # Specialized hooks for each assessment step
    ├── use-age-verification.ts
    ├── use-cycle-length.ts
    ├── use-flow-heaviness.ts
    ├── use-pain-level.ts
    ├── use-period-duration.ts
    └── use-symptoms.ts
```

## Core Hooks

### `use-assessment-context.ts`

- Foundation hook that provides direct access to the AssessmentResultContext
- Manages the connection to React context
- Performs error checking to ensure the hook is used within a provider
- All other hooks build upon this hook

### `use-assessment-submission.ts`

- Handles assessment completion process
- Contains business logic for pattern determination and recommendation generation
- Provides data transformation utilities for API submissions
- Includes assessment utility functions (e.g., clearing assessment data)

## Step-Specific Hooks

Each hook in the `steps/` directory is focused on a specific part of the assessment:

- **`use-age-verification.ts`**: Manages age range selection
- **`use-cycle-length.ts`**: Handles menstrual cycle length data
- **`use-flow-heaviness.ts`**: Manages flow heaviness information
- **`use-pain-level.ts`**: Handles pain level assessment data
- **`use-period-duration.ts`**: Manages period duration information
- **`use-symptoms.ts`**: Handles physical and emotional symptoms data

## Usage Guidelines

1. For most components, import the specific hook related to the assessment step being implemented:

```tsx
import { useAgeVerification } from '@/src/hooks/assessment';

function AgeVerificationPage() {
  const { age, setAge } = useAgeVerification();
  // ...
}
```

2. For components that need access to assessment completion or utility functions:

```tsx
import { useAssessmentSubmission } from '@/src/hooks/assessment';

function AssessmentResultsPage() {
  const { completeAssessment, getFlattenedData, clearAssessment } = useAssessmentSubmission();
  // ...
}
```

3. Avoid using the context hook directly in components unless absolutely necessary:

```tsx
// Prefer NOT to use this directly in components
import { useAssessmentContext } from '@/src/hooks/assessment';
```

## Type Definitions

Type definitions for assessment data are located in `src/context/assessment/types/index.ts`.
