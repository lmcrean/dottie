import { AssessmentResultState, initialState } from '../types';
import { setResult, updateResult, resetResult, setPattern, setRecommendations } from './actions';

type AssessmentResultAction =
  | ReturnType<typeof setResult>
  | ReturnType<typeof updateResult>
  | ReturnType<typeof resetResult>
  | ReturnType<typeof setPattern>
  | ReturnType<typeof setRecommendations>;

// Reducer
export function assessmentResultReducer(
  state: AssessmentResultState,
  action: AssessmentResultAction
): AssessmentResultState {
  switch (action.type) {
    case 'SET_RESULT':
      return {
        ...state,
        result: action.payload,
        isComplete: true
      };
    case 'UPDATE_RESULT': {
      // Special handling for pain_level for debugging
      if ('pain_level' in action.payload) {
        // Debug logging would go here if needed
      }

      // Handle case where result is null and this is the first update
      if (!state.result) {
        const updatedState = {
          ...state,
          result: {
            physical_symptoms: [],
            emotional_symptoms: [],
            ...action.payload
          }
        };

        return updatedState;
      }

      // Handle normal update when result already exists
      const updatedState = {
        ...state,
        result: { ...state.result, ...action.payload }
      };

      return updatedState;
    }
    case 'RESET_RESULT':
      return initialState;
    case 'SET_PATTERN': {
      return {
        ...state,
        result: state.result ? { ...state.result, pattern: action.payload } : null
      };
    }
    case 'SET_RECOMMENDATIONS': {
      return {
        ...state,
        result: state.result ? { ...state.result, recommendations: action.payload } : null
      };
    }
    default:
      return state;
  }
}
