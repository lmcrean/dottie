import { AssessmentResultContext } from '@/src/context/assessment/AssessmentResultContext';
import { useContext } from 'react';

export function useAssessmentResult() {
  const context = useContext(AssessmentResultContext);
  if (context === undefined) {
    throw new Error('useAssessmentResult must be used within an AssessmentResultProvider');
  }
  return context;
}
