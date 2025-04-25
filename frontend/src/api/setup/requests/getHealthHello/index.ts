import { HealthHelloResponse } from './types';
import { apiClient } from '../../../core/apiClient';

/**
 * Health check endpoint for setup
 */
export const getHealthHello = async (): Promise<HealthHelloResponse> => {
  const response = await apiClient.get<HealthHelloResponse>('/setup/health/hello');
  return response.data;
};
