import { useState, useEffect } from 'react';
import { useAssessmentResult } from '@/src/pages/assessment/context/hooks/use-assessment-result';
import { MenstrualPattern } from '@/src/pages/assessment/context/types';

export interface AssessmentData {
  pattern: MenstrualPattern;
  age: string;
  cycleLength: string;
  periodDuration: string;
  flowLevel: string;
  painLevel: string;
  symptoms: string[];
  expandableSymptoms: boolean;
  isClamped: boolean;
}

export const useAssessmentData = () => {
  const { result } = useAssessmentResult();
  const [data, setData] = useState<AssessmentData>({
    pattern: 'developing',
    age: '',
    cycleLength: '',
    periodDuration: '',
    flowLevel: '',
    painLevel: '',
    symptoms: [],
    expandableSymptoms: false,
    isClamped: false
  });

  useEffect(() => {
    console.log('useAssessmentData - Context result:', result);

    // Extract data from context
    if (result) {
      console.log('useAssessmentData - Using context data, age:', result.age);

      const updatedData: Partial<AssessmentData> = {
        age: result.age || '',
        cycleLength: result.cycle_length || '',
        periodDuration: result.period_duration || '',
        flowLevel: result.flow_heaviness || '',
        painLevel: result.pain_level || '',
        symptoms: [
          ...(result.physical_symptoms || []),
          ...(result.emotional_symptoms || []),
          ...(result.other_symptoms ? [result.other_symptoms] : [])
        ]
      };

      console.log('useAssessmentData - Mapped context data:', updatedData);

      // Determine pattern based on context values
      let determinedPattern: MenstrualPattern = 'regular';

      if (
        result.cycle_length?.includes('irregular') ||
        result.cycle_length?.includes('less-than-21')
      ) {
        determinedPattern = 'irregular';
      } else if (
        result.flow_heaviness?.includes('heavy') ||
        result.flow_heaviness?.includes('very-heavy')
      ) {
        determinedPattern = 'heavy';
      } else if (
        result.pain_level?.includes('severe') ||
        result.pain_level?.includes('debilitating')
      ) {
        determinedPattern = 'pain';
      } else if (result.age?.includes('under-13') || result.age?.includes('13-17')) {
        determinedPattern = 'developing';
      }

      updatedData.pattern = determinedPattern;

      // Update the data state with context data
      setData((current) => ({ ...current, ...updatedData }));
    }
  }, [result]);

  const setExpandableSymptoms = (value: boolean) => {
    setData((current) => ({ ...current, expandableSymptoms: value }));
  };

  const setIsClamped = (value: boolean) => {
    setData((current) => ({ ...current, isClamped: value }));
  };

  // Debug the final data state
  console.log('useAssessmentData - Final data state:', data);

  return {
    ...data,
    setExpandableSymptoms,
    setIsClamped
  };
};
