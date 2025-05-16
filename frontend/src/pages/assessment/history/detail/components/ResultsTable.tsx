import React from 'react';
import { Droplet, Brain } from 'lucide-react';
import { Assessment } from '@/src/pages/assessment/api/types';
import {
  CycleInformation,
  FlowAndPain,
  SymptomsDisplay,
  RecommendationsDisplay
} from './results-details';

interface ResultsTableProps {
  assessment: Assessment;
  hasFlattenedFormat: boolean;
  formatValue: (value: string | undefined) => string;
  physicalSymptoms: string[];
  emotionalSymptoms: string[];
  recommendations: Array<{ title: string; description: string }>;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  assessment,
  hasFlattenedFormat,
  formatValue,
  physicalSymptoms,
  emotionalSymptoms,
  recommendations
}) => {
  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <CycleInformation
          assessment={assessment}
          hasFlattenedFormat={hasFlattenedFormat}
          formatValue={formatValue}
        />
        <FlowAndPain
          assessment={assessment}
          hasFlattenedFormat={hasFlattenedFormat}
          formatValue={formatValue}
        />
      </div>

      <div className="space-y-6">
        <SymptomsDisplay title="Physical Symptoms" symptoms={physicalSymptoms} icon={Droplet} />
        <SymptomsDisplay title="Emotional Symptoms" symptoms={emotionalSymptoms} icon={Brain} />
        <RecommendationsDisplay recommendations={recommendations} />
      </div>
    </>
  );
};
