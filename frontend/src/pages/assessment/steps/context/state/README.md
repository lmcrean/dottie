# Assessment Context State Management

## Overview

This directory contains the state management logic for the assessment feature using React's Context API with reducers. The state management follows a Redux-like pattern with actions and reducers.

## Files

### actions.ts

Contains action creators that dispatch actions to modify the assessment state:

- `setResult`: Sets the complete assessment result
- `updateResult`: Partially updates the assessment result
- `resetResult`: Resets the assessment result to initial state
- `setPattern`: Updates just the menstrual pattern in the result
- `setRecommendations`: Updates the recommendations array in the result

### reducer.ts

Contains the reducer function that processes actions and updates the state:

- `assessmentResultReducer`: The main reducer function that processes all assessment-related actions
- Handles state transitions based on the dispatched action types
- Maintains the assessment result state and completion status

## Usage

Import these files in your context provider to set up the state management system:

```typescript
import { assessmentResultReducer } from './reducer';
import * as AssessmentActions from './actions';

// In your context provider:
const [state, dispatch] = useReducer(assessmentResultReducer, initialState);

// To dispatch an action:
dispatch(AssessmentActions.setResult(result));
```

## State Structure

The assessment state maintains:

- `result`: The assessment result data including pattern and recommendations
- `isComplete`: Flag indicating if the assessment has been completed

## Type Definitions

Type definitions for the state and actions are imported from the parent context's types file.
