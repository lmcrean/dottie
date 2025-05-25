import { apiClient } from '@/src/api/core/apiClient';
import { Assessment } from '@/src/pages/assessment/api/types';
import { AssessmentResult } from '@/src/pages/assessment/steps/context/types';
import { prepareAssessmentData } from './validation/AssessmentObjectReady';

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * @endpoint /api/assessment/send (POST)
 */
export const postSend = async (contextData: AssessmentResult): Promise<Assessment> => {
  try {
    // Use the validation utility to prepare assessment data
    const validatedData = prepareAssessmentData(contextData);

    // Transform validated data to match backend expected structure
    const assessmentData = {
      ...validatedData,
      // Backend will fill these in
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Send assessment data wrapped in an assessmentData property
    // This matches the backend controller's expected structure
    const response = await apiClient.post('/api/assessment/send', {
      assessmentData
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send assessment:', error);
    throw error;
  }
};

export default postSend;
