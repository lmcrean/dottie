import { useEffect, useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { assessmentApi, type Assessment } from "@/src/api/assessment";
import { toast } from "sonner";
import PageTransition from "../page-transitions";

export default function HistoryPage() {
  // const [assessments, setAssessments] = useState<Assessment[]>([]);
  // hack for type script errors
  const [assessments, setAssessments] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const date = parseISO(dateString);
      if (!isValid(date)) return "Invalid date";
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await assessmentApi.list();
        setAssessments(data);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Assessment History
          </h1>
          <Link
            to="/assessment/age-verification"
            className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
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
                className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
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
                className="inline-flex items-center px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => {
              const data = assessment?.assessmentData?.assessmentData?.assessmentData;  //TODO: This works for now, need to find the reason for the nested response

              return (
                <Link
                  key={assessment.id}
                  to={`/assessment/history/${assessment.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                          {formatValue(data?.pattern)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(data?.date)}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          Age: {formatValue(data?.age)}
                          {data?.age && data.age !== "under-13" ? " years" : ""}
                        </p>
                        <p>
                          Cycle Length: {formatValue(data?.cycleLength)}
                          {data?.cycleLength &&
                          !["other", "varies", "not-sure"].includes(
                            data.cycleLength
                          )
                            ? " days"
                            : ""}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}
