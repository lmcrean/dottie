import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * @endpoint /api/assessment/send (POST)
 */
export const postSend = async (
  assessmentData: Omit<Assessment, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Assessment> => {
  try {
    // Send assessment data wrapped in an assessmentData property
    // This matches the backend controller's expected structure
    const response = await apiClient.post("/api/assessment/send", {
      assessmentData: assessmentData,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to send assessment:", error);
    throw error;
  }
};

export default postSend;
