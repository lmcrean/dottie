import React from 'react';

interface AssessmentInfoProps {
  data: {
    age: string;
    cycleLength: string;
    periodDuration: string;
    flowHeaviness?: string;
    painLevel?: string;
  };
  type: 'CycleInfo' | 'FlowAndPain';
  formatValue: (value: string | undefined) => string;
}

const AssessmentInfo = ({ data, type, formatValue }: AssessmentInfoProps) => {

  const fields = {
    CycleInfo: [
      { label: 'Age', value: data.age },
      { label: 'Cycle Length', value: data.cycleLength },
      { label: 'Period Duration', value: data.periodDuration },
    ],
    FlowAndPain: [
      { label: 'Flow Level', value: data.flowHeaviness },
      { label: 'Pain Level', value: data.painLevel },
    ],
  };


  const selectedFields = fields[type] || [];

  return (
    <div className="space-y-4">
      {selectedFields.map((item, index) => (
        <div key={index} className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-700">{item.label}:</span>
          <span className="text-sm text-gray-900">{formatValue(item.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default AssessmentInfo;