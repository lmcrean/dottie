import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";
import { getUserData } from "../../../core/tokenManager";
import { snakeToCamel } from "../../../utils";

/**
 * Get assessment by ID
 * @endpoint /api/assessment/:id (GET)
 */
export const getById = async (id: string): Promise<Assessment> => {
  console.log(`Starting request to fetch assessment with ID: ${id}`);
  try {
    // Get the user data from token manager
    const userData = getUserData();
    console.log("User data from token:", userData);
    if (!userData || !userData.id) {
      throw new Error('User ID not found. Please login again.');
    }
    
    console.log(`Making API request to /api/assessment/${id}`);
    const response = await apiClient.get(`/api/assessment/${id}`);
    console.log("Raw assessment response data:", response.data);
    console.log("Assessment response status:", response.status);
    console.log("Assessment data structure:", {
      keys: Object.keys(response.data as object),
      hasAssessmentData: !!(response.data as any).assessment_data,
      assessmentDataType: typeof (response.data as any).assessment_data,
      assessmentDataKeys: (response.data as any).assessment_data ? Object.keys((response.data as any).assessment_data as object) : 'none'
    });
    
    // Transform the response to match the expected format
    const transformedData = snakeToCamel(response.data) as Assessment;
    
    console.log("Transformed assessment data:", transformedData);
    console.log("Transformed data structure:", {
      keys: Object.keys(transformedData),
      hasAssessmentData: !!transformedData.assessmentData,
      assessmentDataType: typeof transformedData.assessmentData,
      assessmentDataKeys: transformedData.assessmentData ? Object.keys(transformedData.assessmentData as object) : 'none'
    });
    
    return transformedData;
  } catch (error: any) {
    console.error('Failed to get assessment:', error);
    console.log("Error details:", error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    } : "No response data");
    throw error;
  }
};

export default getById; 