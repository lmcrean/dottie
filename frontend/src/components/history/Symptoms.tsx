import React from 'react'

interface SymptomsProps {
  symptoms: string[]
  symptomsType: string
}

const Symptoms = ({ symptoms, symptomsType }: SymptomsProps) => {
  const fallbackMessage =
    symptomsType === 'physicalSymptoms'
      ? 'No physical symptoms reported'
      : 'No emotional symptoms reported';

  return (
    <div className="flex flex-wrap gap-2">
      {symptoms.length > 0 ? (
        symptoms.map((symptom: string, index: number) => (
          <div
            className="flex flex-col items-center justify-center border rounded-lg p-3 cursor-pointer bg-gray-50 hover:bg-pink-50 border-pink-300"
            key={index}
          >
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-gray-800">
              {symptom}
            </span>
          </div>
        ))
      ) : (
        <span className="text-sm text-gray-500">{fallbackMessage}</span>
      )}
    </div>
  );
};

export default Symptoms;