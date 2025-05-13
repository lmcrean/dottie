import React from 'react';
import { CardContent } from '@/src/components/ui/card';
import { AssessmentData } from '../../context/hooks/useAssessmentData';
import {
  AgeRange,
  CycleLength,
  PeriodDuration,
  FlowLevel,
  PainLevel,
  Symptoms,
  PatternRecommendations
} from './result-details';

interface ResultsTableProps {
  data: AssessmentData;
  setIsClamped: (value: boolean) => void;
  setExpandableSymptoms: (value: boolean) => void;
}

export const ResultsTable = ({ data, setIsClamped, setExpandableSymptoms }: ResultsTableProps) => {
  const {
    pattern,
    age,
    cycleLength,
    periodDuration,
    flowLevel,
    painLevel,
    symptoms,
    expandableSymptoms,
    isClamped
  } = data;

  return (
    <CardContent className="pb-8 pt-8">
      <div className="mb-8 grid grid-cols-1 items-start gap-6 dark:text-gray-900 md:grid-cols-2">
        <AgeRange age={age} />
        <CycleLength cycleLength={cycleLength} />
        <PeriodDuration periodDuration={periodDuration} />
        <FlowLevel flowLevel={flowLevel} />
        <PainLevel painLevel={painLevel} pattern={pattern} />
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
