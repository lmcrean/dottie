import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Assessment } from '@/src/pages/assessment/api/types';
import { assessmentApi } from '@/src/pages/assessment/api';
import { toast } from 'sonner';
import DeleteButton from '../components/delete-button';
import { ResultsTable } from './components';

// Utility function to ensure data is an array
const ensureArrayFormat = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }
  return [] as T[];
};

export default function AssessmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hasFlattenedFormat = !!assessment && !assessment.assessment_data;
  const hasLegacyFormat = !!assessment?.assessment_data;

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
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

    fetchAssessment();
  }, [id]);

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

  // Extracted data for ResultsTable props
  const physicalSymptoms = useMemo(() => {
    if (hasLegacyFormat && assessment?.assessment_data?.symptoms) {
      return ensureArrayFormat<string>(assessment.assessment_data.symptoms.physical);
    }
    if (hasFlattenedFormat && assessment) {
      return ensureArrayFormat<string>(assessment.physical_symptoms);
    }
    return [];
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
        const parsedDate = parseISO(dateToFormat);
        if (isValid(parsedDate)) {
          return format(parsedDate, 'PPP');
        }
      } catch (e) {
        console.error('Error parsing date:', dateToFormat, e);
      }
    }
    return 'Date not available';
  }, [assessment, hasLegacyFormat, hasFlattenedFormat]);

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

  if (!assessment) {
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

  // This specific check for legacy data integrity might be less critical if !assessment handles it,
  // but keeping for now if it represents a distinct invalid state post-successful fetch.
  if (hasLegacyFormat && !assessment.assessment_data) {
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
            recommendations={recommendations}
          />
        </div>
      </div>
    </div>
  );
}
