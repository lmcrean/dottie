import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";
import { getAuthToken, getUserData } from "../../../core/tokenManager";

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * @endpoint /api/assessment/send (POST)
 */
export const postSend = async (
  assessmentData: Omit<Assessment["assessmentData"]["assessmentData"], "date"> & { date?: string }
): Promise<Assessment> => {
  try {
    // Check for authentication first
    const token = getAuthToken();
    if (!token) {
      console.error("Authentication token missing. User must be logged in to save assessments.");
      throw new Error("Authentication required. Please log in and try again.");
    }
    
    // Get user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      console.error("User ID missing from token data");
      throw new Error("Authentication required. Please log in and try again.");
    }
    
    console.log("postSend received:", JSON.stringify(assessmentData, null, 2));
    
    // IMPORTANT: The backend expects assessmentData (camelCase), not assessment_data (snake_case)
    const formattedData = {
      assessmentData: assessmentData
    };
    
    console.log("Formatted data to send:", JSON.stringify(formattedData, null, 2));

    const response = await apiClient.post("/api/assessment/send", formattedData);
    console.log("Response from assessment send:", response.status, response.data);
    return response.data as Assessment;
  } catch (error: any) {
    console.error("Failed to send assessment:", error);
    if (error.response) {
      console.error("Error response:", error.response.status, error.response.data);
      console.error("Request data that caused 400 error:", error.config?.data);
      
      // Check for 401 status specifically
      if (error.response.status === 401) {
        throw new Error("Authentication required. Please log in and try again.");
      }
      
      // Safely check if error.response.data.error is a string
      const errorMessage = 
        typeof error.response.data === 'object' && error.response.data !== null && 
        typeof error.response.data.error === 'string' 
          ? error.response.data.error 
          : "Unknown server error";
          
      if (errorMessage.includes('Authentication')) {
        throw new Error("Authentication required. Please log in and try again.");
      }
      
      // Include more details in the error
      throw new Error(`Failed to save assessment: ${errorMessage}`);
    }
    throw error;
  }
};

export default postSend;
