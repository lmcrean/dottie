import React from 'react';
import { Droplet, Brain, Calendar, Activity, Heart, AlertCircle } from 'lucide-react';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';
import { Recommendation as ContextRecommendation } from '@/src/pages/assessment/steps/context/types'; // Renamed to avoid conflict

// Helper function to format optional values, similar to the original formatValue
const formatDisplayValue = (value: string | undefined | null): string => {
  return value || 'N/A';
};

export const ResultsTable: React.FC = () => {
  const { state } = useAssessmentContext();
  const assessmentResult = state.result;

  if (!assessmentResult) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle className="mb-4 h-12 w-12 text-pink-500" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-slate-300">
          No Assessment Data
        </h2>
        <p className="text-gray-500 dark:text-slate-400">
          Assessment details are not available at the moment. Please complete an assessment or try
          again later.
        </p>
      </div>
    );
  }

  const {
    age,
    cycle_length,
    period_duration,
    flow_heaviness,
    pain_level,
    physical_symptoms = [],
    emotional_symptoms = [],
    recommendations = []
  } = assessmentResult;

  return (
    <>
      {/* Cycle Information Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400 dark:text-slate-200" />
            <span className="text-lg font-medium text-pink-700">Cycle Information</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-slate-200">
              <span className="font-medium">Age:</span> {formatDisplayValue(age)} years
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-200">
              <span className="font-medium">Cycle Length:</span> {formatDisplayValue(cycle_length)}{' '}
              days
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-200">
              <span className="font-medium">Period Duration:</span>{' '}
              {formatDisplayValue(period_duration)} days
            </p>
          </div>
        </div>

        {/* Flow & Pain Section */}
        <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-gray-400 dark:text-slate-200" />
            <span className="text-lg font-medium text-pink-700">Flow & Pain</span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-slate-200">
              <span className="font-medium">Flow Level:</span> {formatDisplayValue(flow_heaviness)}
            </p>
            <p className="text-sm text-gray-600 dark:text-slate-200">
              <span className="font-medium">Pain Level:</span> {formatDisplayValue(pain_level)}
            </p>
          </div>
        </div>
      </div>

      {/* Symptoms Section */}
      <div className="space-y-6">
        {/* Physical Symptoms Display */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Droplet className="h-5 w-5 text-gray-400 dark:text-slate-200" />
            <h2 className="text-lg font-medium text-pink-700">Physical Symptoms</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {physical_symptoms.length > 0 ? (
              physical_symptoms.map((symptom: string, index: number) => (
                <span
                  key={`physical-${index}-${symptom}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-slate-700 dark:text-slate-200"
                >
                  {symptom}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500 dark:text-slate-400">
                No physical symptoms reported.
              </span>
            )}
          </div>
        </div>

        {/* Emotional Symptoms Display */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-gray-400 dark:text-slate-200" />
            <h2 className="text-lg font-medium text-pink-700">Emotional Symptoms</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {emotional_symptoms.length > 0 ? (
              emotional_symptoms.map((symptom: string, index: number) => (
                <span
                  key={`emotional-${index}-${symptom}`}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-slate-700 dark:text-slate-200"
                >
                  {symptom}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500 dark:text-slate-400">
                No emotional symptoms reported.
              </span>
            )}
          </div>
        </div>

        {/* Recommendations Display */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-gray-400 dark:text-slate-200" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">
              Recommendations
            </h2>
          </div>
          <div className="space-y-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec: ContextRecommendation, index: number) => (
                <div
                  key={rec.id || index}
                  className="rounded-lg border bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <h3 className="text-xl font-medium text-pink-600 dark:text-pink-500">
                    {rec.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                    {rec.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-slate-400">
                No recommendations available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
