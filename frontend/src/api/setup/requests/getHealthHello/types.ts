import { HealthResponse } from '../../types';

export interface HealthHelloResponse extends HealthResponse {
  message: string;
}
