import { useEffect, useState, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { Card } from '@/src/components/ui/card';
import { ArrowLeft, List } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';

import { useAssessmentData } from '../steps/context/hooks/useAssessmentData';
import { ResultsTable } from './components/results/ResultsTable';
import { DeterminedPattern } from './components/results/results-details/DeterminedPattern';
import { Assessment } from '../api/types';
import { assessmentApi } from '../api';
import { toast } from 'sonner';
import DeleteButton from '../components/buttons/delete-id/DeleteButton';
import { MenstrualPattern } from '../steps/context/types';
import { SendInitialMessageButton } from '@/src/pages/chat/chat-detail/components/buttons/send-initial-message';

// Utility function to ensure data is an array
const ensureArrayFormat = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }
  return [] as T[];
};

export default function DetailPage() {
  const [searchParams] = useSearchParams();
  const isNewAssessment = searchParams.get('new') === 'true';

  // Get context data as fallback
  const assessmentDataFromContext = useAssessmentData();

  // State for assessment data from API
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  // Determine if we're viewing an assessment from history or a new assessment
  const isHistoryView = !!id && !isNewAssessment;

  // Format related variables for legacy assessment
  const hasFlattenedFormat = !!assessment && !assessment.assessment_data;
  const hasLegacyFormat = !!assessment?.assessment_data;

  // Fetch the latest assessment if this is a new assessment (no ID)
  useEffect(() => {
    const fetchLatestAssessment = async () => {
      if (isHistoryView || !isNewAssessment) {
        // Skip if it's a history view or not a new assessment
        return;
      }

      try {
        setIsLoading(true);
        const assessments = await assessmentApi.getList();

        if (assessments && assessments.length > 0) {
          // Sort by created_at to get the most recent one
          const sortedAssessments = [...assessments].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });

          const latestAssessmentData = { ...sortedAssessments[0] }; // Create a mutable copy

          // Apply the same processing logic as in getById for consistency
          if (latestAssessmentData && !latestAssessmentData.assessment_data) {
            // Flattened format
            latestAssessmentData.physical_symptoms = ensureArrayFormat<string>(
              latestAssessmentData.physical_symptoms
            );
            latestAssessmentData.emotional_symptoms = ensureArrayFormat<string>(
              latestAssessmentData.emotional_symptoms
            );
            latestAssessmentData.other_symptoms = ensureArrayFormat<string>(
              latestAssessmentData.other_symptoms
            );
            latestAssessmentData.recommendations = ensureArrayFormat<{
              title: string;
              description: string;
            }>(latestAssessmentData.recommendations);
          } else if (latestAssessmentData && latestAssessmentData.assessment_data) {
            // Legacy format
            if (latestAssessmentData.assessment_data.symptoms) {
              latestAssessmentData.assessment_data.symptoms.physical = ensureArrayFormat<string>(
                latestAssessmentData.assessment_data.symptoms.physical
              );
              latestAssessmentData.assessment_data.symptoms.emotional = ensureArrayFormat<string>(
                latestAssessmentData.assessment_data.symptoms.emotional
              );
            }
            latestAssessmentData.assessment_data.recommendations = ensureArrayFormat<{
              title: string;
              description: string;
            }>(latestAssessmentData.assessment_data.recommendations);
          }

          setAssessment(latestAssessmentData);
        }
      } catch (error) {
        console.error('Failed to fetch latest assessment:', error);
        toast.error('Failed to load latest assessment');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAssessment();
  }, [isHistoryView, isNewAssessment]);

  // Force progress bars to update when values change (for new assessment)
  useEffect(() => {
    if (!isHistoryView) {
      // Trigger a re-render when these values change
      const progressElements = document.querySelectorAll('.bg-pink-600.h-2.rounded-full');
      if (progressElements.length > 0) {
        // This forces a style recalculation
        progressElements.forEach((el) => {
          el.classList.remove('bg-pink-500');
          setTimeout(() => el.classList.add('bg-pink-500'), 0);
        });
      }
    }
  }, [
    isHistoryView,
    assessmentDataFromContext.age,
    assessmentDataFromContext.cycle_length,
    assessmentDataFromContext.period_duration,
    assessmentDataFromContext.flow_heaviness,
    assessmentDataFromContext.pain_level
  ]);

  // Fetch existing assessment data if viewing from history
  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id || !isHistoryView) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await assessmentApi.getById(id);
        if (data) {
          // Data processing before setting state to ensure correct types for arrays
          const processedData = { ...data };
          if (processedData && !processedData.assessment_data) {
            // Flattened format
            processedData.physical_symptoms = ensureArrayFormat<string>(
              processedData.physical_symptoms
            );
            processedData.emotional_symptoms = ensureArrayFormat<string>(
              processedData.emotional_symptoms
            );
            processedData.recommendations = ensureArrayFormat<{
              title: string;
              description: string;
            }>(processedData.recommendations);
          } else if (processedData && processedData.assessment_data) {
            // Legacy format
            if (processedData.assessment_data.symptoms) {
              processedData.assessment_data.symptoms.physical = ensureArrayFormat<string>(
                processedData.assessment_data.symptoms.physical
              );
              processedData.assessment_data.symptoms.emotional = ensureArrayFormat<string>(
                processedData.assessment_data.symptoms.emotional
              );
            }
            processedData.assessment_data.recommendations = ensureArrayFormat<{
              title: string;
              description: string;
            }>(processedData.assessment_data.recommendations);
          }
          setAssessment(processedData);
        } else {
          setAssessment(null); // Explicitly set to null if no data
        }
      } catch (error) {
        console.error('Failed to fetch assessment:', error);
        toast.error('Failed to load assessment details');
        setAssessment(null); // Set to null on error
      } finally {
        setIsLoading(false);
      }
    };

    if (isHistoryView) {
      fetchAssessment();
    }
  }, [id, isHistoryView]);

  const formatValue = (value: string | undefined) => {
    if (!value) return 'Not provided';

    // Specific value mappings from list page, could be useful here too if desired
    if (value === 'not-sure') return 'Not sure';
    if (value === 'varies') return 'Varies';
    if (value === 'under-13') return 'Under 13';
    if (value === '8-plus') return '8+ days';

    return value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

  // Extracted data for ResultsTable props (legacy assessment)
  const physicalSymptoms = useMemo(() => {
    let symptomsToLog: string[] = [];
    if (hasLegacyFormat && assessment?.assessment_data?.symptoms) {
      symptomsToLog = ensureArrayFormat<string>(assessment.assessment_data.symptoms.physical);
    }
    if (hasFlattenedFormat && assessment) {
      symptomsToLog = ensureArrayFormat<string>(assessment.physical_symptoms);
    }

    return symptomsToLog;
  }, [assessment, hasLegacyFormat, hasFlattenedFormat]);

  const emotionalSymptoms = useMemo(() => {
    if (hasLegacyFormat && assessment?.assessment_data?.symptoms) {
      return ensureArrayFormat<string>(assessment.assessment_data.symptoms.emotional);
    }
    if (hasFlattenedFormat && assessment) {
      return ensureArrayFormat<string>(assessment.emotional_symptoms);
    }
    return [];
  }, [assessment, hasLegacyFormat, hasFlattenedFormat]);

  const otherSymptoms = useMemo(() => {
    // For flattened format, assessment.other_symptoms should now be string[] from the API
    // For legacy, it was not explicitly handled, so we'll return empty array
    if (hasFlattenedFormat && assessment) {
      return ensureArrayFormat<string>(assessment.other_symptoms);
    }
    // Legacy format doesn't have a dedicated other_symptoms field in the same way.
    // It might be part of a free text field not specifically parsed out here.
    return [];
  }, [assessment, hasFlattenedFormat]);

  const recommendations = useMemo(() => {
    if (hasLegacyFormat && assessment?.assessment_data) {
      return ensureArrayFormat<{ title: string; description: string }>(
        assessment.assessment_data.recommendations
      );
    }
    if (hasFlattenedFormat && assessment) {
      return ensureArrayFormat<{ title: string; description: string }>(assessment.recommendations);
    }
    return [];
  }, [assessment, hasLegacyFormat, hasFlattenedFormat]);

  const formattedDate = useMemo(() => {
    let dateToFormat: string | undefined;
    if (hasLegacyFormat && assessment?.assessment_data?.date) {
      dateToFormat = assessment.assessment_data.date;
    } else if (hasFlattenedFormat && assessment?.created_at) {
      dateToFormat = assessment.created_at;
    }

    if (dateToFormat) {
      try {
        // Handle numeric timestamp format (e.g., "1745679949668.0")
        if (/^\d+(\.\d+)?$/.test(dateToFormat)) {
          const timestamp = parseFloat(dateToFormat);
          const date = new Date(timestamp);
          if (isValid(date)) {
            return format(date, 'PPP'); // e.g., May 22nd, 2025
          }
        }

        // Standard date string handling
        const parsedDate = parseISO(dateToFormat);
        if (isValid(parsedDate)) {
          return format(parsedDate, 'PPP'); // e.g., May 22nd, 2025
        }
      } catch (e) {
        console.error('Error parsing date:', dateToFormat, e);
      }
    }
    return 'Date not available';
  }, [assessment, hasLegacyFormat, hasFlattenedFormat]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">Loading assessment details...</p>
        </div>
      </div>
    );
  }

  // Error state - assessment not found (only for history view)
  if (isHistoryView && !assessment) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            to="/assessment/history"
            className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-slate-200 dark:hover:text-pink-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <p className="mb-6 text-gray-600">Assessment details not found or failed to load.</p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid legacy data structure
  if (isHistoryView && hasLegacyFormat && !assessment?.assessment_data) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Link
            to="/assessment/history"
            className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-slate-200 dark:hover:text-pink-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
          <div className="rounded-lg bg-white p-6 text-center shadow-sm">
            <p className="mb-6 text-gray-600">Invalid legacy assessment data structure.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render specific layout for history view (existing assessment)
  if (isHistoryView && assessment) {
    // Get the pattern for the history view
    const historyPattern = hasFlattenedFormat
      ? assessment.pattern
      : assessment.assessment_data?.pattern || 'regular';

    // Ensure we have a valid pattern value
    const safeHistoryPattern: MenstrualPattern = [
      'regular',
      'irregular',
      'heavy',
      'pain',
      'developing'
    ].includes(historyPattern as string)
      ? (historyPattern as MenstrualPattern)
      : 'regular';

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/assessment/history"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-slate-200 dark:hover:text-pink-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Link>
            {id && <DeleteButton assessmentId={id} />}
          </div>

          {/* Add the pattern display with icon */}
          <div className="mb-6">
            <DeterminedPattern pattern={safeHistoryPattern} />
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gray-900">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  Assessment Details
                </h1>
                <p className="text-sm text-gray-500 dark:text-slate-200">{formattedDate}</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
                {formatValue(
                  hasFlattenedFormat ? assessment.pattern : assessment.assessment_data?.pattern
                )}
              </span>
            </div>
            <ResultsTable
              assessment={assessment}
              hasFlattenedFormat={hasFlattenedFormat}
              formatValue={formatValue}
              physicalSymptoms={physicalSymptoms}
              emotionalSymptoms={emotionalSymptoms}
              otherSymptoms={otherSymptoms}
              recommendations={recommendations}
            />
          </div>

          <div className="mb-8 mt-4 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SendInitialMessageButton
              assessmentId={id}
              pattern={safeHistoryPattern}
              className="px-6 py-6 text-lg"
            />
            <Link to="/assessment/history">
              <Button className="flex items-center justify-center gap-2 border border-pink-200 bg-white px-6 py-6 text-lg text-pink-600 hover:bg-pink-50">
                <List className="h-5 w-5 hover:text-pink-700" />
                View All Results
              </Button>
            </Link>
          </div>
        </div>{' '}
      </div>
    );
  }

  // Render layout for new assessment results from API data
  if (assessment) {
    // We have fetched the assessment from the API
    const patternFromAPI = hasFlattenedFormat
      ? assessment.pattern
      : assessment.assessment_data?.pattern || 'regular';

    // Ensure we have a valid pattern value
    const safePattern: MenstrualPattern = [
      'regular',
      'irregular',
      'heavy',
      'pain',
      'developing'
    ].includes(patternFromAPI as string)
      ? (patternFromAPI as MenstrualPattern)
      : 'regular';

    return (
      <div className="flex min-h-screen flex-col">
        <main className="mx-auto w-full max-w-4xl flex-1 p-6">
          <div className="mb-8 h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 w-full rounded-full bg-pink-500 transition-all duration-500"></div>
          </div>
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold dark:text-slate-100">Your Assessment Results</h1>
            <p className="text-gray-600 dark:text-slate-200">
              {" Based on your responses, here's what we've found about your menstrual health."}
            </p>
          </div>
          <DeterminedPattern pattern={safePattern} />
          <Card className="mb-8 w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800">
            {' '}
            <ResultsTable
              assessment={assessment}
              hasFlattenedFormat={hasFlattenedFormat}
              formatValue={formatValue}
              physicalSymptoms={physicalSymptoms}
              emotionalSymptoms={emotionalSymptoms}
              otherSymptoms={otherSymptoms}
              recommendations={recommendations}
            />
          </Card>

          <div className="mb-8 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SendInitialMessageButton
              assessmentId={id}
              pattern={safePattern}
              className="px-6 py-6 text-lg"
            />
            <Link to="/assessment/history">
              <Button className="flex items-center justify-center gap-2 border border-pink-200 bg-white px-6 py-6 text-lg text-pink-600 hover:bg-pink-50">
                <List className="h-5 w-5 hover:text-pink-700" />
                View All Results
              </Button>
            </Link>
            {id && <DeleteButton assessmentId={id} className="px-6 py-6 text-lg" />}
          </div>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link to="/assessment/history">
              <Button
                variant="outline"
                className="flex items-center px-6 py-6 text-lg dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700"
              >
                View History
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Fallback to context-based rendering if no API data is available
  // Ensure we have a valid pattern value from context
  const safePatternFromContext: MenstrualPattern = [
    'regular',
    'irregular',
    'heavy',
    'pain',
    'developing'
  ].includes(assessmentDataFromContext.pattern as string)
    ? (assessmentDataFromContext.pattern as MenstrualPattern)
    : 'regular';

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-8 h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 w-full rounded-full bg-pink-500 transition-all duration-500"></div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold dark:text-slate-100">Your Assessment Results</h1>
          <p className="text-gray-600 dark:text-slate-200">
            {" Based on your responses, here's what we've found about your menstrual health."}
          </p>
        </div>

        <DeterminedPattern pattern={safePatternFromContext} />

        <Card className="mb-8 w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800">
          <ResultsTable
            data={
              isHistoryView || isNewAssessment
                ? assessment
                  ? assessment
                  : undefined
                : assessmentDataFromContext
            }
            setIsClamped={assessmentDataFromContext.setIsClamped}
          />
        </Card>

        <div className="mb-8 mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SendInitialMessageButton
            pattern={safePatternFromContext}
            className="px-6 py-6 text-lg"
          />
          <Link to="/assessment/history">
            <Button className="flex items-center justify-center gap-2 border border-pink-200 bg-white px-6 py-6 text-lg text-pink-600 hover:bg-pink-50">
              <List className="h-5 w-5 hover:text-pink-700" />
              View All Results
            </Button>
          </Link>
          {id && <DeleteButton assessmentId={id} className="px-6 py-6 text-lg" />}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/assessment/history">
            <Button
              variant="outline"
              className="flex items-center px-6 py-6 text-lg dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700"
            >
              View History
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
