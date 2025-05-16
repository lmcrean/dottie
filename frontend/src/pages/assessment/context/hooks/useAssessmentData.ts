import { useState, useEffect } from 'react';
import { useAssessmentResult } from '@/src/pages/assessment/context/hooks/use-assessment-result';
import { MenstrualPattern } from '@/src/pages/assessment/context/types';

export interface AssessmentData {
  pattern: MenstrualPattern;
  age: string;
  cycle_length: string;
  period_duration: string;
  flow_heaviness: string;
  pain_level: string;
  symptoms: string[];
  physical_symptoms: string[];
  emotional_symptoms: string[];
  other_symptoms: string;
  expandableSymptoms: boolean;
  isClamped: boolean;
}

export const useAssessmentData = () => {
  const { result } = useAssessmentResult();
  const [data, setData] = useState<AssessmentData>({
    pattern: 'developing',
    age: '',
    cycle_length: '',
    period_duration: '',
    flow_heaviness: '',
    pain_level: '',
    symptoms: [],
    physical_symptoms: [],
    emotional_symptoms: [],
    other_symptoms: '',
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
        cycle_length: result.cycle_length || '',
        period_duration: result.period_duration || '',
        flow_heaviness: result.flow_heaviness || '',
        pain_level: result.pain_level || '',
        symptoms: [
          ...(result.physical_symptoms || []),
          ...(result.emotional_symptoms || []),
          ...(result.other_symptoms ? [result.other_symptoms] : [])
        ],
        physical_symptoms: result.physical_symptoms || [],
        emotional_symptoms: result.emotional_symptoms || [],
        other_symptoms: result.other_symptoms || ''
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
