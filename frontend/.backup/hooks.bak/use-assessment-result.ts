import { useCallback } from 'react';
import { useAssessmentResult as useAssessmentResultContext } from '@/context/AssessmentResultContext';
import type { 
  AssessmentResult, 
  MenstrualPattern,
  Recommendation,
  Symptoms 
} from '@/context/AssessmentResultContext';

export function useAssessmentResult() {
  const { 
    state, 
    setResult, 
    updateResult, 
    resetResult, 
    setPattern,
    setRecommendations 
  } = useAssessmentResultContext();

  // Utility function to determine the menstrual pattern based on assessment results
  const determinePattern = useCallback((result: AssessmentResult): MenstrualPattern => {
    const { age, cycleLength, periodDuration, flowHeaviness, painLevel } = result;

    // Developing Pattern (O5)
    if (age === "12_14" || age === "15_17") {
      return 'developing';
    }

    // Irregular Timing Pattern (O1)
    if (cycleLength === 'irregular' || 
        cycleLength === 'less-than-21' || 
        cycleLength === 'more-than-35') {
      return 'irregular';
    }

    // Heavy Flow Pattern (O2)
    if (flowHeaviness === 'heavy' || 
        flowHeaviness === 'very-heavy' || 
        periodDuration === '8-plus') {
      return 'heavy';
    }

    // Pain-Predominant Pattern (O3)
    if (painLevel === 'severe' || painLevel === 'debilitating') {
      return 'pain';
    }

    // Regular Menstrual Cycles (O4)
    return 'regular';
  }, []);

  // Function to generate recommendations based on assessment results
  const generateRecommendations = useCallback((result: AssessmentResult): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    const { pattern, symptoms } = result;

    // Base recommendations for all patterns
    recommendations.push({
      title: "Track Your Cycle",
      description: "Keep a record of when your period starts and stops to identify patterns."
    });

    // Pattern-specific recommendations
    switch (pattern) {
      case 'irregular':
        recommendations.push({
          title: "Consult a Healthcare Provider",
          description: "Irregular cycles may need medical evaluation to identify underlying causes."
        });
        break;
      case 'heavy':
        recommendations.push({
          title: "Iron-Rich Diet",
          description: "Consider increasing iron intake through diet or supplements to prevent anemia."
        });
        break;
      case 'pain':
        recommendations.push({
          title: "Pain Management",
          description: "Over-the-counter pain relievers like ibuprofen can help with cramps."
        });
        break;
      case 'developing':
        recommendations.push({
          title: "Be Patient",
          description: "Your cycles are still establishing. It's normal for them to be irregular during adolescence."
        });
        break;
    }

    // Symptom-specific recommendations
    if (symptoms.physical.includes('Fatigue')) {
      recommendations.push({
        title: "Rest and Sleep",
        description: "Ensure you get adequate rest and maintain a regular sleep schedule."
      });
    }

    if (symptoms.emotional.length > 0) {
      recommendations.push({
        title: "Emotional Support",
        description: "Consider talking to a counselor or joining a support group about emotional symptoms."
      });
    }

    return recommendations;
  }, []);

  // Function to save assessment result to session storage
  const saveToSessionStorage = useCallback((result: AssessmentResult) => {
    Object.entries(result).forEach(([key, value]) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    });
  }, []);

  // Function to load assessment result from session storage
  const loadFromSessionStorage = useCallback((): Partial<AssessmentResult> => {
    const result: Partial<AssessmentResult> = {};
    const keys: (keyof AssessmentResult)[] = [
      'age',
      'cycleLength',
      'periodDuration',
      'flowHeaviness',
      'painLevel',
      'symptoms',
      'pattern',
      'recommendations'
    ];

    keys.forEach((key) => {
      const value = sessionStorage.getItem(key);
      if (value) {
        result[key] = JSON.parse(value);
      }
    });

    return result;
  }, []);

  // Function to update symptoms
  const updateSymptoms = useCallback((
    type: keyof Symptoms,
    symptoms: string[]
  ) => {
    if (!state.result) return;

    const updatedSymptoms: Symptoms = {
      ...state.result.symptoms,
      [type]: symptoms
    };

    updateResult({ symptoms: updatedSymptoms });
  }, [state.result, updateResult]);

  // Function to complete the assessment
  const completeAssessment = useCallback((result: AssessmentResult) => {
    const pattern = determinePattern(result);
    const recommendations = generateRecommendations({ ...result, pattern });
    
    const completeResult = {
      ...result,
      pattern,
      recommendations
    };

    setResult(completeResult);
    saveToSessionStorage(completeResult);
  }, [determinePattern, generateRecommendations, setResult, saveToSessionStorage]);

  // Function to clear assessment data
  const clearAssessment = useCallback(() => {
    resetResult();
    sessionStorage.clear();
  }, [resetResult]);

  return {
    ...state,
    setResult,
    updateResult,
    resetResult,
    setPattern,
    setRecommendations,
    determinePattern,
    generateRecommendations,
    saveToSessionStorage,
    loadFromSessionStorage,
    updateSymptoms,
    completeAssessment,
    clearAssessment,
  };
} 