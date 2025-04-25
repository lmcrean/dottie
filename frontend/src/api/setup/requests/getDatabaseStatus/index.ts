import { GetDatabaseStatusResponse } from './types';
import { apiClient } from '../../../core/apiClient';

/**
 * Database status check endpoint
 */
export const getDatabaseStatus = async (): Promise<GetDatabaseStatusResponse> => {
  const response = await apiClient.get<GetDatabaseStatusResponse>('/setup/database/status');
  return response.data;
};
