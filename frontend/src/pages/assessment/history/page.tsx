import { useEffect, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar, ChevronRight, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { assessmentApi, type Assessment } from "@/src/api/assessment";
import { toast } from "sonner";
import PageTransition from "../page-transitions";

export default function HistoryPage() {
  // #actual
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  // hack for type script errors
  // const [assessments, setAssessments] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<string | null>(null);

  const formatValue = (value: string | undefined): string => {
    if (!value) return "Not provided";

    if (value === "not-sure") return "Not sure";
    if (value === "varies") return "Varies";
    if (value === "under-13") return "Under 13";
    if (value === "8-plus") return "8+ days";

    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Unknown date";

    try {
      // Handle numeric timestamp format (e.g., "1745679949668.0")
      if (/^\d+(\.\d+)?$/.test(dateString)) {
        const timestamp = parseFloat(dateString);
        const date = new Date(timestamp);
        if (isValid(date)) {
          return format(date, "MMM d, yyyy");
        }
      }

      // Standard date string handling
      const date = parseISO(dateString);
      if (!isValid(date)) return "Unknown date";
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Unknown date";
    }
  };

  const openDeleteModal = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setAssessmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setAssessmentToDelete(null);
  };

  const confirmDelete = async () => {
    if (!assessmentToDelete) return;
    
    try {
      await assessmentApi.delete(assessmentToDelete);
      setAssessments(assessments.filter(assessment => assessment.id !== assessmentToDelete));
      toast.success("Assessment deleted successfully");
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("Failed to delete assessment");
    } finally {
      closeDeleteModal();
    }
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await assessmentApi.list();
        setAssessments(data);
        // Additional debugging for first assessment structure
        setError(null);
      } catch (error) {
        console.error("Error fetching assessments:", error);
        setError("Unable to load your assessments. Please try again later.");
        toast.error("Failed to load assessments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Assessment History
          </h1>
          <Link
            to="/assessment/age-verification"
            className="inline-flex items-center px-4 py-2 bg-pink-600 text-white hover:text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            New Assessment
          </Link>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">⚠️</div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : assessments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No assessments yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start your first assessment to track your menstrual health.
            </p>
            <div className="mt-6">
              <Link
                to="/assessment"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => {
              // Handle both legacy and flattened data formats
              const legacyData = assessment?.assessment_data;
              const pattern = legacyData?.pattern || assessment?.pattern;
              const date = legacyData?.date || assessment?.created_at;
              const periodDuration = legacyData?.periodDuration || assessment?.period_duration;
              const cycleLength = legacyData?.cycleLength || assessment?.cycle_length;

              return (
                <Link
                  key={assessment.id}
                  to={`/assessment/history/${assessment.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md border dark:border-slate-800 transition-shadow p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-2 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {formatValue(pattern)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(date)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="text-gray-900">Period Duration:</span> {formatValue(periodDuration)}
                          {periodDuration && !["other", "varies", "not-sure"].includes(periodDuration) ? "" : ""}
                        </p>
                        <p>
                          <span className="text-gray-900">Cycle Length:</span> {formatValue(cycleLength)}
                          {cycleLength &&
                          !["other", "varies", "not-sure"].includes(
                            cycleLength
                          )
                            ? " days"
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => openDeleteModal(assessment.id, e)}
                        className="p-2 text-gray-500 hover:text-red-600 mr-2"
                        aria-label="Delete assessment"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
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
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
}