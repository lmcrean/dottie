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
    // Only access sessionStorage if context data isn't available
    if (!result) {
      // Helper function to safely parse JSON or return default
      const parseJSON = <T>(jsonString: string | null, defaultValue: T): T => {
        if (!jsonString) return defaultValue;
        try {
          return JSON.parse(jsonString) as T;
        } catch {
          return defaultValue;
        }
      };

      // Load data from session storage as fallback when context is empty
      const storedAge = sessionStorage.getItem('age');
      const storedCycleLength = sessionStorage.getItem('cycleLength');
      const storedPeriodDuration = sessionStorage.getItem('periodDuration');
      const storedFlowLevel = sessionStorage.getItem('flowHeaviness');
      const storedPainLevel = sessionStorage.getItem('painLevel');
      const storedSymptoms = sessionStorage.getItem('symptoms');

      // Only update state from sessionStorage if context is missing
      const updatedData: Partial<AssessmentData> = {
        age: parseJSON(storedAge, ''),
        cycleLength: parseJSON(storedCycleLength, ''),
        periodDuration: parseJSON(storedPeriodDuration, ''),
        flowLevel: parseJSON(storedFlowLevel, ''),
        painLevel: parseJSON(storedPainLevel, ''),
        symptoms: parseJSON(storedSymptoms, [])
      };

      // Only use sessionStorage for pattern determination if needed
      let determinedPattern: MenstrualPattern = 'regular';

      if (
        updatedData.cycleLength?.includes('irregular') ||
        updatedData.cycleLength?.includes('less-than-21')
      ) {
        determinedPattern = 'irregular';
      } else if (
        updatedData.flowLevel?.includes('heavy') ||
        updatedData.flowLevel?.includes('very-heavy')
      ) {
        determinedPattern = 'heavy';
      } else if (
        updatedData.painLevel?.includes('severe') ||
        updatedData.painLevel?.includes('debilitating')
      ) {
        determinedPattern = 'pain';
      } else if (updatedData.age?.includes('under-13') || updatedData.age?.includes('13-17')) {
        determinedPattern = 'developing';
      }

      updatedData.pattern = determinedPattern;

      // Update state with sessionStorage data as fallback
      setData((current) => ({ ...current, ...updatedData }));
    } else {
      // When context data is available, use it exclusively
      // Extract data from context
      const updatedData: Partial<AssessmentData> = {
        age: result.age || '',
        cycleLength: result.cycle_length || '',
        periodDuration: result.period_duration || '',
        flowLevel: result.flow_heaviness || '',
        painLevel: result.pain_level || '',
        symptoms: [...(result.physical_symptoms || []), ...(result.emotional_symptoms || [])]
      };

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

  return {
    ...data,
    setExpandableSymptoms,
    setIsClamped
  };
};
