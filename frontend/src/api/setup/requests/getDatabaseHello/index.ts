import { GetDatabaseHelloResponse } from './types';
import { apiClient } from '../../../core/apiClient';

/**
 * Database hello endpoint to verify connection
 */
export const getDatabaseHello = async (): Promise<GetDatabaseHelloResponse> => {
  const response = await apiClient.get<GetDatabaseHelloResponse>('/setup/database/hello');
  return response.data;
};
