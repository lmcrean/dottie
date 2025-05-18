import React, { useEffect } from 'react';
import { CardContent } from '@/src/components/ui/card';
import { AssessmentData } from '../../steps/context/hooks/useAssessmentData';
import {
  AgeRange,
  CycleLength,
  PeriodDuration,
  FlowLevel,
  PainLevel,
  Symptoms,
  PatternRecommendations
} from './results-details';

interface ResultsTableProps {
  data: AssessmentData;
  setIsClamped: (value: boolean) => void;
  setExpandableSymptoms: (value: boolean) => void;
}

export const ResultsTable = ({ data, setIsClamped, setExpandableSymptoms }: ResultsTableProps) => {
  const {
    pattern,
    age,
    cycle_length,
    period_duration,
    flow_heaviness,
    pain_level,
    symptoms,
    expandableSymptoms,
    isClamped
  } = data;

  // Debug information
  useEffect(() => {
    console.log('DEBUG [ResultsTable Component]');
    console.log('  - Received data:', data);
    console.log('  - All props:', {
      pattern,
      age,
      cycle_length,
      period_duration,
      flow_heaviness,
      pain_level
    });
  }, [data, pattern, age, cycle_length, period_duration, flow_heaviness, pain_level]);

  return (
    <CardContent className="pb-8 pt-8">
      <div className="mb-8 grid grid-cols-1 items-start gap-6 dark:text-gray-900 md:grid-cols-2">
        <AgeRange age={age} />
        <CycleLength cycleLength={cycle_length} />
        <PeriodDuration periodDuration={period_duration} />
        <FlowLevel flowLevel={flow_heaviness} />
        <PainLevel painLevel={pain_level} pattern={pattern} />
        <Symptoms
          symptoms={symptoms}
          expandableSymptoms={expandableSymptoms}
          setExpandableSymptoms={setExpandableSymptoms}
          isClamped={isClamped}
          setIsClamped={setIsClamped}
        />
      </div>

      <PatternRecommendations pattern={pattern} />
    </CardContent>
  );
};
