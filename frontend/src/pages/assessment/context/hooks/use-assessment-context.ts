import { useContext } from 'react';
import { AssessmentResultContext } from '../AssessmentResultContext';

export function useAssessmentContext() {
  const context = useContext(AssessmentResultContext);
  if (context === undefined) {
    throw new Error('useAssessmentContext must be used within an AssessmentResultProvider');
  }
  return context;
}
