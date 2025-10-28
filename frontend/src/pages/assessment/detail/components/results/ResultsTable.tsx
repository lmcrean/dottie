import React, { useEffect, useState } from 'react';
import { CardContent } from '@/src/components/ui/card';
import { User, Droplet, Search, Calendar, Stethoscope, Heart, Sparkles } from 'lucide-react';
import { AssessmentData } from '../../../steps/context/hooks/useAssessmentData';
import {
  AgeRange,
  CycleLength,
  PeriodDuration,
  FlowLevel,
  PainLevel,
  Symptoms,
  PatternRecommendations
} from './results-details';
import { Assessment } from '../../../api/types';
import DebugBox from './DebugBox';

interface ResultsTableProps {
  data?: AssessmentData;
  setIsClamped?: (value: boolean) => void;
  assessment?: Assessment;
  hasFlattenedFormat?: boolean;
  formatValue?: (value: string | undefined) => string;
  physicalSymptoms?: string[];
  emotionalSymptoms?: string[];
  otherSymptoms?: string[];
  recommendations?: { title: string; description: string }[];
}

export const ResultsTable = ({
  data,
  setIsClamped,
  assessment,
  hasFlattenedFormat,
  formatValue,
  physicalSymptoms = [],
  emotionalSymptoms = [],
  otherSymptoms = [],
  recommendations = []
}: ResultsTableProps) => {
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebug((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (data) {
    const { pattern, age, cycle_length, period_duration, flow_heaviness, pain_level } = data;

    return (
      <CardContent className="pb-8 pt-8">
        <div className="mb-8 grid grid-cols-1 items-start gap-6 dark:text-gray-900 md:grid-cols-2">
          <AgeRange age={age} />
          <CycleLength cycleLength={cycle_length} />
          <PeriodDuration periodDuration={period_duration} />
          <FlowLevel flowLevel={flow_heaviness} />
          <PainLevel painLevel={pain_level} pattern={pattern || 'regular'} />
          <Symptoms
            physicalSymptoms={data.physical_symptoms || []}
            emotionalSymptoms={data.emotional_symptoms || []}
            otherSymptoms={
              data.other_symptoms && data.other_symptoms.trim() !== ''
                ? [data.other_symptoms.trim()]
                : []
            }
            setIsClamped={setIsClamped!}
          />
        </div>

        <PatternRecommendations pattern={pattern || 'regular'} />

        <DebugBox assessmentData={data} isVisible={showDebug} />
      </CardContent>
    );
  }

  if (assessment) {
    const formatDisplayValue = (value: string | undefined | null): string => {
      if (formatValue && value) return formatValue(value);
      return value || 'N/A';
    };

    const pattern = hasFlattenedFormat ? assessment.pattern : assessment.assessment_data?.pattern;
    const displayAge = hasFlattenedFormat ? assessment.age : assessment.assessment_data?.age;
    const displayCycleLength = hasFlattenedFormat
      ? assessment.cycle_length
      : assessment.assessment_data?.cycleLength;
    const displayPeriodDuration = hasFlattenedFormat
      ? assessment.period_duration
      : assessment.assessment_data?.periodDuration;
    const displayFlowHeaviness = hasFlattenedFormat
      ? assessment.flow_heaviness
      : assessment.assessment_data?.flowHeaviness;
    const displayPainLevel = hasFlattenedFormat
      ? assessment.pain_level
      : assessment.assessment_data?.painLevel;

    const physical = physicalSymptoms || assessment.physical_symptoms || [];
    const emotional = emotionalSymptoms || assessment.emotional_symptoms || [];
    const other =
      Array.isArray(otherSymptoms) && otherSymptoms.length > 0
        ? otherSymptoms
        : Array.isArray(assessment.other_symptoms)
          ? assessment.other_symptoms
          : [];

    return (
      <div className="p-4">
        {/* Header with sparkle decoration */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-2 dark:from-pink-900/30 dark:to-purple-900/30">
            <Sparkles className="h-5 w-5 text-pink-500 dark:text-pink-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Your Personal Health Summary
            </span>
            <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Basic Information Section */}
          <div className="group relative overflow-hidden rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:from-slate-900 dark:via-pink-950/20 dark:to-purple-950/30">
            <User className="absolute -right-6 -top-6 h-32 w-32 text-pink-300/40 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-300/50 dark:text-pink-500/15 dark:group-hover:text-pink-500/20" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-xl font-bold text-pink-700 dark:text-pink-400">
                  About You
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-white/50 p-3 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Age</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                    {formatDisplayValue(displayAge)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/50 p-3 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Pattern</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                    {formatDisplayValue(pattern)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/50 p-3 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Cycle Length</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                    {formatDisplayValue(displayCycleLength)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/50 p-3 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Period Duration</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                    {formatDisplayValue(displayPeriodDuration)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Flow & Pain Section */}
          <div className="group relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:from-slate-900 dark:via-red-950/20 dark:to-pink-950/30">
            <Droplet className="absolute -right-6 -top-6 h-32 w-32 text-red-300/40 transition-all duration-300 group-hover:scale-110 group-hover:text-red-300/50 dark:text-pink-500/15 dark:group-hover:text-pink-500/20" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-xl font-bold text-rose-700 dark:text-pink-400">
                  Flow & Pain
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-white/50 p-3 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Flow Level</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                    {formatDisplayValue(displayFlowHeaviness)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/50 p-3 dark:bg-slate-800/50">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-300">Pain Level</span>
                  <span className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                    {formatDisplayValue(displayPainLevel)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Symptoms Section */}
          <div className="group relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:from-slate-900 dark:via-purple-950/20 dark:to-indigo-950/30">
            <Search className="absolute -right-6 -top-6 h-32 w-32 text-purple-300/40 transition-all duration-300 group-hover:scale-110 group-hover:text-purple-300/50 dark:text-purple-500/15 dark:group-hover:text-purple-500/20" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-400">
                  What You're Experiencing
                </h3>
              </div>
              <Symptoms
                physicalSymptoms={physical}
                emotionalSymptoms={emotional}
                otherSymptoms={other}
                setIsClamped={setIsClamped!}
              />
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6 shadow-lg dark:border-slate-700 dark:from-slate-900 dark:via-blue-950/20 dark:to-indigo-950/30">
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-2">
                <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                  Tips Just for You
                </h3>
              </div>
              <div className="space-y-4">
                {recommendations && recommendations.length > 0 ? (
                  recommendations.map((rec, index) => {
                    const getRecommendationDisplay = (title: string) => {
                      if (title.toLowerCase().includes('track') || title.toLowerCase().includes('cycle')) {
                        return {
                          icon: Calendar,
                          color: 'from-cyan-100 via-blue-100 to-sky-100 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-sky-950/40',
                          iconColor: 'text-blue-400/30 dark:text-blue-500/15',
                          borderColor: 'border-blue-200 dark:border-slate-700'
                        };
                      } else if (title.toLowerCase().includes('consult') || title.toLowerCase().includes('healthcare') || title.toLowerCase().includes('doctor')) {
                        return {
                          icon: Stethoscope,
                          color: 'from-emerald-100 via-green-100 to-teal-100 dark:from-green-950/40 dark:via-emerald-950/30 dark:to-teal-950/40',
                          iconColor: 'text-green-400/30 dark:text-green-500/15',
                          borderColor: 'border-green-200 dark:border-slate-700'
                        };
                      }
                      return {
                        icon: Heart,
                        color: 'from-pink-100 via-rose-100 to-fuchsia-100 dark:from-pink-950/40 dark:via-rose-950/30 dark:to-fuchsia-950/40',
                        iconColor: 'text-pink-400/30 dark:text-pink-500/15',
                        borderColor: 'border-pink-200 dark:border-slate-700'
                      };
                    };

                    const display = getRecommendationDisplay(rec.title);
                    const IconComponent = display.icon;

                    return (
                      <div
                        key={index}
                        className={`group relative overflow-hidden rounded-xl border ${display.borderColor} bg-gradient-to-br ${display.color} p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                      >
                        <IconComponent className={`absolute -right-4 -bottom-4 h-28 w-28 ${display.iconColor} transition-all duration-300 group-hover:scale-110`} />
                        <div className="relative z-10">
                          <h4 className="mb-2 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-slate-100">
                            {rec.title}
                          </h4>
                          <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                            {rec.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl bg-white/50 p-8 text-center dark:bg-slate-800/50">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      No recommendations available at the moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DebugBox
            assessmentId={assessment.id}
            assessmentData={assessment}
            isVisible={showDebug}
          />
        </div>
      </div>
    );
  }

  return null;
};