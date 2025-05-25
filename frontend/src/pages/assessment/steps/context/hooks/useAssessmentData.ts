import { useState, useEffect } from 'react';
import { useAssessmentResult } from '@/src/pages/assessment/steps/context/hooks/use-assessment-result';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

export interface AssessmentData {
  pattern?: MenstrualPattern;
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
    if (result) {
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
        other_symptoms: result.other_symptoms || '',
        pattern: result.pattern
      };

      setData((current) => ({ ...current, ...updatedData }));
    }
  }, [result]);

  const setExpandableSymptoms = (value: boolean) => {
    setData((current) => ({ ...current, expandableSymptoms: value }));
  };

  const setIsClamped = (value: boolean) => {
    setData((current) => ({ ...current, isClamped: value }));
  };

  return {
    ...data,
    setExpandableSymptoms,
    setIsClamped
  };
};
