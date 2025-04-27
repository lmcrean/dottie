import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Activity,
  Droplet,
  Heart,
  Brain,
} from "lucide-react";
import { Assessment } from "@/src/api/assessment/types";
import { assessmentApi } from "@/src/api/assessment";
import { toast } from "sonner";

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await assessmentApi.getById(id);
        setAssessment(data);
      } catch (error) {
        toast.error("Failed to load assessment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Unknown date";

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
      if (!isValid(date)) return "Invalid date";

      return format(date, "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date format";
    }
  };

  const formatValue = (value: string | undefined) => {
    if (!value) return "Not provided";

    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment details...</p>
        </div>
      </div>
    );
  }

  // Check for both formats
  const legacyData = assessment?.assessment_data;
  
  const flattenedData = assessment ? {
    date: assessment.created_at,
    pattern: assessment.pattern,
    age: assessment.age,
    cycleLength: assessment.cycle_length,
    periodDuration: assessment.period_duration,
    flowHeaviness: assessment.flow_heaviness,
    painLevel: assessment.pain_level,
    symptoms: {
      physical: assessment.physical_symptoms || [],
      emotional: assessment.emotional_symptoms || []
    },
    recommendations: assessment.recommendations || []
  } : null;
  
  const hasLegacyFormat = !!legacyData;
  const hasFlattenedFormat = !!(assessment?.age || assessment?.pattern);
  
  // Use either format, prioritizing legacy for backward compatibility
  const assessmentData = hasLegacyFormat ? legacyData : flattenedData;

  if (!assessmentData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            to="/assessment/history"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-slate-200 dark:hover:text-pink-700 mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to History
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600 mb-6">
              Invalid assessment data format.
            </p>
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
    physicalSymptoms = assessment?.physical_symptoms || [];
    emotionalSymptoms = assessment?.emotional_symptoms || [];
    recommendations = assessment?.recommendations || [];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/assessment/history"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-slate-200 dark:hover:text-pink-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-slate-800 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Assessment Details
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-200">
                {formatDate(hasLegacyFormat ? assessmentData.date : assessment?.created_at)}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
              {formatValue(assessmentData.pattern)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-slate-200" />
                <span className="text-lg font-medium text-pink-700">
                  Cycle Information
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Age:</span>{" "}
                  {formatValue(assessmentData.age)} years
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Cycle Length:</span>{" "}
                  {formatValue(assessmentData.cycleLength)} days
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Period Duration:</span>{" "}
                  {formatValue(assessmentData.periodDuration)} days
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-lg font-medium text-pink-700">
                  Flow & Pain
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Flow Level:</span>{" "}
                  {formatValue(assessmentData.flowHeaviness)}
                </p>
                <p className="text-sm text-gray-600 dark:text-slate-200">
                  <span className="font-medium">Pain Level:</span>{" "}
                  {formatValue(assessmentData.painLevel)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Droplet className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-pink-700">
                  Physical Symptoms
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {physicalSymptoms.length > 0 ? (
                  physicalSymptoms.map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
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
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-pink-700">
                  Emotional Symptoms
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {emotionalSymptoms.length > 0 ? (
                  emotionalSymptoms.map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:text-slate-200"
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
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-medium text-gray-900 dark:text-slate-100">
                  Recommendations
                </h2>
              </div>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map(
                    (
                      rec: { title: string; description: string },
                      index: number
                    ) => (
                      <div key={index} className="bg-gray-50 border dark:border-slate-800 rounded-lg p-4">
                        <h3 className="font-medium text-xl text-pink-600">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {rec.description}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-gray-500">
                    No recommendations available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
