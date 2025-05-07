# Assessment Context

This module provides a centralized system for managing user assessment data throughout the application.

## Purpose

The assessment context allows components to:

- Store and retrieve user-provided health assessment information
- Calculate patterns based on user inputs
- Generate personalized recommendations
- Persist assessment data between sessions
- Transform data into different formats as needed

It separates UI components from the underlying business logic, making the codebase more maintainable and testable.

## Architecture

The assessment context follows the React Context + Reducer pattern for state management:

### Folder Structure

```
frontend/src/context/assessment/
├── state/                  # State management logic
│   ├── actions.ts          # Action creators for state changes
│   └── reducer.ts          # Reducer logic for state transitions
├── types/                  # Type definitions
│   ├── types.ts            # TypeScript interfaces and types
│   └── recommendations.ts  # Pre-defined recommendation data
├── AssessmentResultContext.ts     # React Context definition
├── AssessmentResultProvider.tsx   # Context Provider component
└── README.md                      # Documentation
```

### Core Files

- **types/types.ts**: Defines all TypeScript interfaces and types used across the system, including assessment input fields, result states, patterns, and recommendations.

- **types/recommendations.ts**: Maintains a collection of predefined recommendation objects that can be assigned based on assessment patterns.

- **state/actions.ts**: Contains action creator functions that components use to dispatch state changes in a type-safe manner.

- **state/reducer.ts**: Implements state management logic that determines how the application state changes in response to dispatched actions.

- **AssessmentResultContext.ts**: Creates and defines the React Context interface with state and available action methods.

- **AssessmentResultProvider.tsx**: Wraps the application with the context provider, sets up the reducer, and exposes state and actions to child components.

## Usage

Components can access assessment data and actions by using the React useContext hook:

```tsx
import { useContext } from 'react';
import { AssessmentResultContext } from './context/assessment/AssessmentResultContext';

function MyComponent() {
  const { state, updateResult, setPattern, setRecommendations } =
    useContext(AssessmentResultContext);

  // Now you can access state.result and dispatch actions
}
```

## Data Flow

1. User input is captured in UI components
2. Components dispatch actions (e.g., updateResult)
3. The reducer processes actions and updates state
4. Pattern analysis can be performed on the collected data
5. Recommendations are assigned based on identified patterns
6. UI components re-render with the updated state
