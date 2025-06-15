import { User } from '@/src/api/auth';
import { apiClient } from './apiClient';

/**
 * Check database connection status
 * @returns Promise with connection status
 */
export const checkDbConnection = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await apiClient.get('/api/setup/database/status');
    return response.data;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return {
      status: 'error',
      message: 'Failed to check database connection'
    };
  }
};

/**
 * Fetch user data from the database
 * @param userId - The ID of the user to fetch
 * @returns Promise with user data
 */
export const fetchUserData = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch user data failed:', error);
    throw error;
  }
};

// Add more database-related functions as needed

export default {
  checkDbConnection,
  fetchUserData
};
