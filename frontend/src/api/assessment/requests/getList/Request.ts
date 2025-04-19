import { apiClient } from "../../../core/apiClient";
import { Assessment } from "../../types";
import axios, { AxiosError } from "axios";
import { snakeToCamel } from "../../../utils";

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
    
    // Transform the response to match the expected format
    const transformedData = snakeToCamel(response.data);
    console.log("Transformed assessment list data:", transformedData);
    
    return transformedData;
  } catch (error) {
    console.error("Failed to get assessments:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.log("Error details:", axiosError.response ? {
        status: axiosError.response.status,
        statusText: axiosError.response.statusText,
        data: axiosError.response.data
      } : "No response data");
    } else {
      console.log("Error details: Non-Axios error");
    }
    throw error;
  }
};

export default getList;
