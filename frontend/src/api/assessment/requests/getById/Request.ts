import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";
import { getUserData } from "../../../core/tokenManager";

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
      keys: Object.keys(response.data),
      hasAssessmentData: !!response.data.assessment_data,
      assessmentDataType: typeof response.data.assessment_data,
      assessmentDataKeys: response.data.assessment_data ? Object.keys(response.data.assessment_data) : 'none'
    });
    
    return response.data;
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