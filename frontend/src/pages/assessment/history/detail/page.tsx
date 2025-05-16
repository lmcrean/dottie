import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { ArrowLeft, Calendar, Activity, Droplet, Heart, Brain, X } from 'lucide-react';
import { Assessment } from '@/src/pages/assessment/api/types';
import { assessmentApi } from '@/src/pages/assessment/api';
import { toast } from 'sonner';

// Utility function to ensure data is an array
// Returns unknown[] to accommodate different array types like recommendations
const ensureArrayFormat = <T = string,>(data: unknown): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }
  // Add specific parsing logic here if needed, e.g., for JSON strings
  // For now, just return empty array if not already an array
  return [] as T[];
};

export default function AssessmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Determine data format
  const hasLegacyFormat = !!assessment?.assessment_data;
  // Assume flattened if not legacy and assessment exists
  const hasFlattenedFormat = !!assessment && !assessment.assessment_data;

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await assessmentApi.getById(id);
        if (data) {
          setAssessment(data);
          // Ensure symptoms arrays are in the correct format after fetching
          // This logic might be adjusted based on actual API response structure
          if (data && !data.assessment_data) {
            // If flattened format
            data.physical_symptoms = ensureArrayFormat<string>(data.physical_symptoms);
            data.emotional_symptoms = ensureArrayFormat<string>(data.emotional_symptoms);
          }
        }
      } catch (error) {
        console.error('Failed to fetch assessment:', error);
        toast.error('Failed to load assessment details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await assessmentApi.delete(id);
      toast.success('Assessment deleted successfully');
      navigate('/assessment/history');
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment');
    } finally {
      closeDeleteModal();
    }
  };

  const formatValue = (value: string | undefined) => {
    if (!value) return 'Not provided';

    return value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-');
  };

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

  const assessmentData = assessment?.assessment_data;
  if (!assessmentData) {
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
            <p className="mb-6 text-gray-600">Invalid assessment data format.</p>
          </div>
        </div>
      </div>
    );
  }

  // Extract data using the correct path based on format
  let physicalSymptoms: string[] = [];
  let emotionalSymptoms: string[] = [];
  let recommendations: Array<{ title: string; description: string }> = [];

  if (hasLegacyFormat && assessment?.assessment_data) {
    physicalSymptoms = ensureArrayFormat(assessment.assessment_data.symptoms?.physical) as string[];
    emotionalSymptoms = ensureArrayFormat(
      assessment.assessment_data.symptoms?.emotional
    ) as string[];
    // Cast the result of ensureArrayFormat to the expected recommendations type
    recommendations = ensureArrayFormat(assessment.assessment_data.recommendations) as Array<{
      title: string;
      description: string;
    }>;
  } else if (hasFlattenedFormat && assessment) {
    physicalSymptoms = ensureArrayFormat(assessment.physical_symptoms) as string[];
    emotionalSymptoms = ensureArrayFormat(assessment.emotional_symptoms) as string[];
    // Cast the result of ensureArrayFormat to the expected recommendations type
    recommendations = ensureArrayFormat(assessment.recommendations) as Array<{
      title: string;
      description: string;
    }>;
  }

  // Handle potential loading state for date formatting
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
          return format(parsedDate, 'PPP'); // Format like 'Jun 15, 2024'
        }
      } catch (e) {
        console.error('Error parsing date:', dateToFormat, e);
      }
    }
    return 'Date not available';
  }, [assessment, hasLegacyFormat, hasFlattenedFormat]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/assessment/history"
          className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-slate-200 dark:hover:text-pink-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Link>

        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Assessment Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-200">{formattedDate}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-sm font-medium text-pink-800">
              {formatValue(assessmentData.pattern)}
            </span>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-slate-200" />
                <span className="text-lg font-medium text-pink-700">Cycle Information</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Age:</span> {formatValue(assessmentData.age)} years
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Cycle Length:</span>{' '}
                  {formatValue(assessmentData.cycleLength)} days
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Period Duration:</span>{' '}
                  {formatValue(assessmentData.periodDuration)} days
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-lg font-medium text-pink-700">Flow & Pain</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Flow Level:</span>{' '}
                  {formatValue(assessmentData.flowHeaviness)}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Pain Level:</span>{' '}
                  {formatValue(assessmentData.painLevel)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Droplet className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-pink-700">Physical Symptoms</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {physicalSymptoms.length > 0 ? (
                  physicalSymptoms.map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800"
                    >
                      {symptom}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-slate-200">
                    No physical symptoms reported
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-pink-700">Emotional Symptoms</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {emotionalSymptoms.length > 0 ? (
                  emotionalSymptoms.map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:text-slate-200"
                    >
                      {symptom}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-slate-200">
                    No emotional symptoms reported
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">
                  Recommendations
                </h2>
              </div>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map(
                    (rec: { title: string; description: string }, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border bg-gray-50 p-4 dark:border-slate-800"
                      >
                        <h3 className="text-xl font-medium text-pink-600">{rec.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{rec.description}</p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500">No recommendations available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h3>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this assessment? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
