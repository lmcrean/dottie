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
    console.log('POST request received assessment data:', JSON.stringify(contextData, null, 2));

    // Check if symptoms arrays exist and have values
    console.log(
      'Physical symptoms before validation:',
      Array.isArray(contextData.physical_symptoms)
        ? contextData.physical_symptoms.length
        : 'not an array'
    );
    console.log(
      'Emotional symptoms before validation:',
      Array.isArray(contextData.emotional_symptoms)
        ? contextData.emotional_symptoms.length
        : 'not an array'
    );

    // Use the validation utility to prepare assessment data
    const validatedData = prepareAssessmentData(contextData);

    console.log('Pattern after validation:', validatedData.pattern);
    console.log(
      'Physical symptoms after validation:',
      validatedData.physical_symptoms?.length || 0
    );
    console.log(
      'Emotional symptoms after validation:',
      validatedData.emotional_symptoms?.length || 0
    );

    // Transform validated data to match backend expected structure
    const assessmentData = {
      ...validatedData,
      // Backend will fill these in
      user_id: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Sending assessment with pattern:', validatedData.pattern);
    console.log('Final assessment data structure:', JSON.stringify(assessmentData, null, 2));

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
