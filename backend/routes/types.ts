import { Request, Response, NextFunction } from 'express';

/**
 * User object attached to request after authentication
 */
export interface AuthUser {
  id: string; // User ID from JWT
  username?: string;
  email: string;
  iat?: number; // JWT issued at timestamp
  exp?: number; // JWT expiration timestamp
}

/**
 * Extended Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Async request handler type for Express routes
 */
export type AsyncRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
}

/**
 * Error response structure
 */
export interface ApiError {
  error: string;
  code: string;
  details?: any;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationMeta;
}
