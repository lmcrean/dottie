import { DatabaseStatusResponse } from '../../types';

export interface GetDatabaseStatusResponse extends DatabaseStatusResponse {
  status: 'success' | 'error';
}
