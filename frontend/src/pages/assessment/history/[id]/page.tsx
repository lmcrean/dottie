import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns';
import { ArrowLeft, Calendar, Activity, Droplet, Heart, Brain } from 'lucide-react';
import { Assessment } from '@/src/api/assessment/types';
import { assessmentApi } from '@/src/api/assessment';
import { toast } from 'sonner';

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await assessmentApi.getById(id);
        if (data) {
          data.physical_symptoms = ensureArrayFormat(data.physical_symptoms);
          data.emotional_symptoms = ensureArrayFormat(data.emotional_symptoms);
          setAssessment(data);
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

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await assessmentApi.delete(id);
      toast.success("Assessment deleted successfully");
      navigate("/assessment/history");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    } finally {
      closeDeleteModal();
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';

    try {
      // Special handling for numeric timestamp strings
      if (/^\d+(\.\d+)?$/.test(dateString)) {
        // Convert from milliseconds to date
        const timestamp = parseFloat(dateString);
        const date = new Date(timestamp);
        if (isValid(date)) {
          return format(date, "MMMM d, yyyy");
        }
      }
      
      // Try standard date parsing
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Invalid date';

      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date format';
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
  let recommendations: {title: string, description: string}[] = [];

  if (hasLegacyFormat) {
    physicalSymptoms = assessmentData.symptoms?.physical || [];
    emotionalSymptoms = assessmentData.symptoms?.emotional || [];
    recommendations = assessmentData.recommendations || [];
  } else if (hasFlattenedFormat) {
    // Ensure we're getting arrays, parse if needed
    physicalSymptoms = ensureArrayFormat(assessment?.physical_symptoms) || [];
    emotionalSymptoms = ensureArrayFormat(assessment?.emotional_symptoms) || [];
    recommendations = assessment?.recommendations || [];
  }

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
              <p className="text-sm text-gray-500 dark:text-slate-200">
                {formatDate(hasLegacyFormat ? assessmentData.date : assessment?.created_at)}
              </p>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confirm Delete</h3>
              <button 
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
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
