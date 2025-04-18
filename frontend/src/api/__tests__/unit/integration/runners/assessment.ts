/**
 * Assessment Utilities for Integration Tests
 * 
 * This file contains helper functions for assessment-related operations
 * in integration tests, such as creating, retrieving, updating and deleting assessments.
 */
import { api } from './apiClient';
import { AxiosError } from 'axios';

interface Symptoms {
  physical: string[];
  emotional: string[];
  [key: string]: any;
}

interface AssessmentData {
  age?: string;
  cycleLength?: string;
  periodDuration?: string;
  flowHeaviness?: string;
  painLevel?: string;
  symptoms?: Symptoms;
  [key: string]: any;
}

interface Assessment {
  id: string;
  userId: string;
  assessmentData: AssessmentData;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Create a new assessment
 * @param {string} userId - User ID
 * @param {AssessmentData} assessmentData - Assessment data
 * @returns {Promise<string>} Assessment ID
 */
export async function createAssessment(userId: string, assessmentData: AssessmentData | null = null): Promise<string> {
  try {
    console.log('Creating assessment for user:', userId);
    
    // If no assessment data provided, use default test data
    const data = assessmentData || generateDefaultAssessment();
    
    const payload = {
      userId: userId,
      assessmentData: data
    };
    
    console.log('Assessment payload:', payload);
    
    const response = await api.post('/api/assessment/send', payload);
    console.log('Create assessment response:', response.data);
    
    return response.data.id;
  } catch (error) {
    console.error('Failed to create assessment:', (error as AxiosError).response?.data || (error as Error).message);
    throw new Error(`Failed to create assessment: ${(error as AxiosError).response?.status || (error as Error).message}`);
  }
}

/**
 * Get all assessments for a user
 * @returns {Promise<Assessment[]>} List of assessments
 */
export async function getAssessments(): Promise<Assessment[]> {
  try {
    console.log('Getting all assessments');
    
    const response = await api.get('/api/assessment/list');
    console.log('Get assessments response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Failed to get assessments:', (error as AxiosError).response?.data || (error as Error).message);
    throw new Error(`Failed to get assessments: ${(error as AxiosError).response?.status || (error as Error).message}`);
  }
}

/**
 * Get a specific assessment by ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Assessment>} Assessment data
 */
export async function getAssessmentById(assessmentId: string): Promise<Assessment> {
  try {
    console.log('Getting assessment by ID:', assessmentId);
    
    const response = await api.get(`/api/assessment/${assessmentId}`);
    console.log('Get assessment by ID response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Failed to get assessment:', (error as AxiosError).response?.data || (error as Error).message);
    throw new Error(`Failed to get assessment: ${(error as AxiosError).response?.status || (error as Error).message}`);
  }
}

/**
 * Update an existing assessment
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @param {AssessmentData} updateData - Updated assessment data
 * @returns {Promise<Assessment>} Updated assessment
 */
export async function updateAssessment(userId: string, assessmentId: string, updateData: AssessmentData): Promise<Assessment> {
  try {
    console.log('Updating assessment:', assessmentId, 'for user:', userId);
    console.log('Update data:', updateData);
    
    // The API expects the full assessment structure with the updated data
    const payload = {
      assessmentData: updateData
    };
    
    const response = await api.put(`/api/assessment/${userId}/${assessmentId}`, payload);
    console.log('Update assessment response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Failed to update assessment:', (error as AxiosError).response?.data || (error as Error).message);
    throw new Error(`Failed to update assessment: ${(error as AxiosError).response?.status || (error as Error).message}`);
  }
}

/**
 * Delete an assessment
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteAssessment(userId: string, assessmentId: string): Promise<boolean> {
  try {
    console.log('Deleting assessment:', assessmentId, 'for user:', userId);
    
    const response = await api.delete(`/api/assessment/${userId}/${assessmentId}`);
    console.log('Delete assessment status:', response.status);
    
    return response.status === 200;
  } catch (error) {
    console.error('Failed to delete assessment:', (error as AxiosError).response?.data || (error as Error).message);
    throw new Error(`Failed to delete assessment: ${(error as AxiosError).response?.status || (error as Error).message}`);
  }
}

/**
 * Generate default assessment data for testing
 * @returns {AssessmentData} Default assessment data
 */
export function generateDefaultAssessment(): AssessmentData {
  return {
    age: '25_34',
    cycleLength: '26_30',
    periodDuration: '4-5',
    flowHeaviness: 'moderate',
    painLevel: 'moderate',
    symptoms: {
      physical: ['Bloating', 'Headaches'],
      emotional: ['Mood swings', 'Irritability']
    }
  };
}

/**
 * Generate a more severe assessment profile
 * @returns {AssessmentData} Severe assessment data
 */
export function generateSevereAssessment(): AssessmentData {
  return {
    age: '25_34',
    cycleLength: '21-25',
    periodDuration: '6-7',
    flowHeaviness: 'heavy',
    painLevel: 'severe',
    symptoms: {
      physical: ['Cramps', 'Headaches', 'Fatigue', 'Nausea'],
      emotional: ['Irritability', 'Anxiety', 'Depression']
    }
  };
} 