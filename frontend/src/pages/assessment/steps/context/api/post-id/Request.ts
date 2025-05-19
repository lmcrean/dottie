import { apiClient } from '@/src/api/core/apiClient';
import { Assessment } from '@/src/pages/assessment/api/types';
import { AssessmentResult } from '../../types';

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * @endpoint /api/assessment/send (POST)
 */
export const postSend = async (contextData: AssessmentResult): Promise<Assessment> => {
  try {
    // Transform context data to match backend expected structure
    const assessmentData = {
      age: contextData.age || '',
      cycle_length: contextData.cycle_length || '',
      period_duration: contextData.period_duration || '',
      flow_heaviness: contextData.flow_heaviness || '',
      pain_level: contextData.pain_level || '',
      physical_symptoms: contextData.physical_symptoms || [],
      emotional_symptoms: contextData.emotional_symptoms || [],
      other_symptoms: contextData.other_symptoms || '',
      pattern: contextData.pattern || '',
      recommendations: contextData.recommendations || [],
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
