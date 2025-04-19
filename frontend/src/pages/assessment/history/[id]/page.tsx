import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Assessment } from "@/src/api/assessment/types";
import { assessmentApi } from "@/src/api/assessment";
import { toast } from "sonner";

// Define type for assessment data structure
interface AssessmentData {
  date?: string;
  pattern?: string;
  age?: string;
  cycleLength?: string;
  periodDuration?: string;
  flowHeaviness?: string;
  painLevel?: string;
  symptoms?: {
    physical: string[];
    emotional: string[];
  };
  recommendations?: {
    title: string;
    description: string;
  }[];
}

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
        console.log(`Fetching assessment with ID: ${id}`);
        const data = await assessmentApi.getById(id);
        console.log("Retrieved assessment data:", data);
        console.log("Assessment data structure:", {
          keys: Object.keys(data),
          hasAssessmentData: !!data.assessmentData,
          assessmentDataType: typeof data.assessmentData,
          assessmentDataKeys: data.assessmentData ? Object.keys(data.assessmentData) : 'none'
        });
        setAssessment(data);
      } catch (error) {
        console.error("Failed to fetch assessment:", error);
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
      const date = parseISO(dateString);
      if (!isValid(date)) return "Invalid date";

      return format(date, "MMMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
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

  const assessmentDataWrapper = assessment?.assessmentData as AssessmentData | undefined;
  if (!assessmentDataWrapper) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link
            to="/assessment/history"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
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

  const assessmentData = (assessmentDataWrapper as any).assessmentData || assessmentDataWrapper;
  console.log("Final assessment data being used:", assessmentData);

  const rawPhysicalSymptoms = assessmentData.symptoms?.physical || [];
  const rawEmotionalSymptoms = assessmentData.symptoms?.emotional || [];
  
  const emotionalKeywords = ['emotional', 'mood', 'anxiety', 'depression', 'irritability', 'sensitivity'];
  
  const physicalSymptoms = rawPhysicalSymptoms.filter((symptom: string) => 
    !emotionalKeywords.some(keyword => symptom.toLowerCase().includes(keyword))
  );
  
  const emotionalSymptoms = [
    ...rawEmotionalSymptoms,
    ...rawPhysicalSymptoms.filter((symptom: string) => 
      emotionalKeywords.some(keyword => symptom.toLowerCase().includes(keyword))
    )
  ];
  
  console.log("Recategorized symptoms:", {
    originalPhysical: rawPhysicalSymptoms,
    originalEmotional: rawEmotionalSymptoms,
    fixedPhysical: physicalSymptoms,
    fixedEmotional: emotionalSymptoms
  });

  const recommendations = assessmentData.recommendations || [];

  const getEmojiForRecommendation = (title: string) => {
    // Map specific title patterns to emojis based on the results page patterns
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes("iron") || titleLower.includes("food") || titleLower.includes("diet") || titleLower.includes("nutrition")) {
      return "🍳";
    }
    if (titleLower.includes("water") || titleLower.includes("hydrat")) {
      return "💧";
    }
    if (titleLower.includes("heat") || titleLower.includes("warm")) {
      return "🔥";
    }
    if (titleLower.includes("pain")) {
      return "💊";
    }
    if (titleLower.includes("exercise") || titleLower.includes("walk") || titleLower.includes("gentle")) {
      return "🧘‍♀️";
    }
    if (titleLower.includes("medical") || titleLower.includes("doctor") || titleLower.includes("healthcare") || titleLower.includes("provider")) {
      return "👩‍⚕️";
    }
    if (titleLower.includes("plan") || titleLower.includes("ahead") || titleLower.includes("supply")) {
      return "⏰";
    }
    if (titleLower.includes("track") || titleLower.includes("calendar")) {
      return "📅";
    }
    if (titleLower.includes("sleep")) {
      return "🌙";
    }
    if (titleLower.includes("stress") || titleLower.includes("meditat")) {
      return "🧘‍♀️";
    }
    if (titleLower.includes("patient") || titleLower.includes("time")) {
      return "⏱️";
    }
    if (titleLower.includes("learn") || titleLower.includes("educate") || titleLower.includes("body")) {
      return "🧠";
    }
    if (titleLower.includes("talk") || titleLower.includes("trust") || titleLower.includes("parent")) {
      return "👩‍👧";
    }
    if (titleLower.includes("balance") || titleLower.includes("diet")) {
      return "❤️";
    }
    
    // Default emoji if no match is found
    return "💡";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/assessment/history"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Assessment Details
              </h1>
              <p className="text-sm text-gray-500">
                {formatDate(assessmentData.date)}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
              {formatValue(assessmentData.pattern)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/public/calendar.png" className="w-[25px] h-[25px]" />
                <span className="text-sm font-medium text-gray-900">
                  Cycle Information
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Age:</span>{" "}
                  {formatValue(assessmentData.age)} years
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Cycle Length:</span>{" "}
                  {formatValue(assessmentData.cycleLength)} days
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Period Duration:</span>{" "}
                  {formatValue(assessmentData.periodDuration)} days
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src="/public/d-drop.png" className="w-[25px] h-[25px]" />
                <span className="text-sm font-medium text-gray-900">
                  Flow & Pain
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Flow Level:</span>{" "}
                  {formatValue(assessmentData.flowHeaviness)}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Pain Level:</span>{" "}
                  {formatValue(assessmentData.painLevel)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/public/drop.png" className="w-[25px] h-[25px]" />
                <h2 className="text-lg font-medium text-gray-900">
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
                  <span className="text-sm text-gray-500">
                    No physical symptoms reported
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/public/emotion.png" className="w-[25px] h-[25px]" />
                <h2 className="text-lg font-medium text-gray-900">
                  Emotional Symptoms
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {emotionalSymptoms.length > 0 ? (
                  emotionalSymptoms.map((symptom: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {symptom}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">
                    No emotional symptoms reported
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold">Recommendations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.length > 0 ? (
                  recommendations.map(
                    (
                      rec: { title: string; description: string },
                      index: number
                    ) => (
                      <div 
                        key={index} 
                        className="border rounded-xl p-4 hover:bg-pink-50 transition-colors duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            {getEmojiForRecommendation(rec.title)}
                          </div>
                          <div>
                            <h3 className="font-medium text-lg">
                              {rec.title}
                            </h3>
                            <p className="text-gray-600">
                              {rec.description}
                            </p>
                          </div>
                        </div>
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
