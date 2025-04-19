import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";

/**
 * Get list of all assessments for the current user
 * @endpoint /api/assessment/list (GET)
 */
export const getList = async (): Promise<Assessment[]> => {
  console.log("Starting request to fetch assessments from /api/assessment/list");
  try {
    // Try the correct endpoint - it's likely one of these:
    const response = await apiClient.get("/api/assessment/list");
    console.log("Raw assessment response data:", response.data);
    console.log("Assessment response status:", response.status);
    return response.data;
  } catch (error) {
    console.error("Failed to get assessments:", error);
    console.log("Error details:", error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data
    } : "No response data");
    throw error;
  }
};

export default getList;
