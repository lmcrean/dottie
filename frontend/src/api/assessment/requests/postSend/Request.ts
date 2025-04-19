import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * @endpoint /api/assessment/send (POST)
 */
export const postSend = async (
  assessmentData: Omit<Assessment["assessmentData"]["assessmentData"], "date"> & { date?: string }
): Promise<Assessment> => {
  try {
    console.log("postSend received:", JSON.stringify(assessmentData, null, 2));
    
    // Format the data to match the backend's expected nested structure using camelCase consistently
    const now = new Date().toISOString();
    const formattedData = {
      assessmentData: {
        createdAt: now,
        assessmentData: {
          date: assessmentData.date || now,
          ...assessmentData
        }
      }
    };
    
    console.log("Formatted data to send:", JSON.stringify(formattedData, null, 2));

    const response = await apiClient.post("/api/assessment/send", formattedData);
    console.log("Response from assessment send:", response.status, response.data);
    return response.data;
  } catch (error: any) {
    console.error("Failed to send assessment:", error);
    if (error.response) {
      console.error("Error response:", error.response.status, error.response.data);
    }
    throw error;
  }
};

export default postSend;
