// Setup API shared types
export interface SetupApiResponse {
  status: 'success' | 'error';
  message?: string;
}

export interface HealthResponse extends SetupApiResponse {
  timestamp: string;
}

export interface DatabaseStatusResponse extends SetupApiResponse {
  connected: boolean;
  databaseVersion: string;
}

export interface DatabaseHelloResponse extends SetupApiResponse {
  connectionId: string;
}
