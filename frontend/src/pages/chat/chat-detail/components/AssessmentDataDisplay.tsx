import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, Activity, Heart, AlertCircle } from 'lucide-react';

interface AssessmentData {
  id: string;
  age: number;
  pattern: string;
  cycle_length: number;
  period_duration: number;
  flow_heaviness: string;
  pain_level: number;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  other_symptoms: string[];
  recommendations: Array<{
    title: string;
    description: string;
  }>;
}

interface AssessmentDataDisplayProps {
  assessmentId?: string;
  assessmentObject?: AssessmentData | null;
  onError?: (error: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function AssessmentDataDisplay({
  assessmentId,
  assessmentObject,
  onError
}: AssessmentDataDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Priority 1: Use assessmentObject if provided
    if (assessmentObject) {
      setAssessmentData(assessmentObject);
      return;
    }

    // Priority 2: Fetch by assessmentId if no object provided
    if (assessmentId) {
      fetchAssessmentData();
    }
  }, [assessmentId, assessmentObject]);

  const fetchAssessmentData = async () => {
    if (!assessmentId) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/assessment/getDetail/${assessmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch assessment data');
      }

      const data = await response.json();
      setAssessmentData(data);
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      onError?.('Failed to load assessment data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!assessmentId && !assessmentObject) {
    return null;
  }

  const getPainLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600 dark:text-green-400';
    if (level <= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getFlowColor = (flow: string) => {
    switch (flow?.toLowerCase()) {
      case 'light':
        return 'text-blue-600 dark:text-blue-400';
      case 'moderate':
        return 'text-green-600 dark:text-green-400';
      case 'heavy':
        return 'text-orange-600 dark:text-orange-400';
      case 'very heavy':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Assessment Data
          </span>
          {isLoading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && assessmentData && (
        <div className="space-y-4 px-4 pb-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Basic Info */}
            <div className="space-y-2">
              <h4 className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Calendar className="h-3 w-3" />
                Cycle Information
              </h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Pattern:</span> {assessmentData.pattern}
                </div>
                <div>
                  <span className="font-medium">Cycle Length:</span> {assessmentData.cycle_length}{' '}
                  days
                </div>
                <div>
                  <span className="font-medium">Period Duration:</span>{' '}
                  {assessmentData.period_duration} days
                </div>
                <div>
                  <span className="font-medium">Flow:</span>
                  <span className={`ml-1 ${getFlowColor(assessmentData.flow_heaviness)}`}>
                    {assessmentData.flow_heaviness}
                  </span>
                </div>
              </div>
            </div>

            {/* Pain & Symptoms */}
            <div className="space-y-2">
              <h4 className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <AlertCircle className="h-3 w-3" />
                Pain & Symptoms
              </h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Pain Level:</span>
                  <span
                    className={`ml-1 font-semibold ${getPainLevelColor(assessmentData.pain_level)}`}
                  >
                    {assessmentData.pain_level}/10
                  </span>
                </div>
                {assessmentData.physical_symptoms.length > 0 && (
                  <div>
                    <span className="font-medium">Physical:</span>
                    <div className="ml-2">
                      {assessmentData.physical_symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="mb-1 mr-1 inline-block rounded bg-gray-200 px-1 text-xs dark:bg-gray-700"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {assessmentData.emotional_symptoms.length > 0 && (
                  <div>
                    <span className="font-medium">Emotional:</span>
                    <div className="ml-2">
                      {assessmentData.emotional_symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="mb-1 mr-1 inline-block rounded bg-gray-200 px-1 text-xs dark:bg-gray-700"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {assessmentData.other_symptoms.length > 0 && (
                  <div>
                    <span className="font-medium">Other:</span>
                    <div className="ml-2">
                      {assessmentData.other_symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="mb-1 mr-1 inline-block rounded bg-gray-200 px-1 text-xs dark:bg-gray-700"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {assessmentData.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Heart className="h-3 w-3" />
                  Recommendations
                </h4>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  {assessmentData.recommendations.map((rec, index) => (
                    <div key={index} className="rounded bg-gray-200 p-2 text-xs dark:bg-gray-700">
                      <div className="font-medium">{rec.title}</div>
                      {rec.description && (
                        <div className="mt-1 text-gray-500 dark:text-gray-500">
                          {rec.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
