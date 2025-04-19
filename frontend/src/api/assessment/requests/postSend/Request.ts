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
    // Format the data to match the backend's expected nested structure
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

    const response = await apiClient.post("/api/assessment/send", formattedData);
    return response.data;
  } catch (error) {
    console.error("Failed to send assessment:", error);
    throw error;
  }
};

export default postSend;
