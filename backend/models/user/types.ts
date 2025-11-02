/**
 * Type definitions for User domain
 */

/**
 * Database user record (complete with sensitive fields)
 */
export interface UserRecord {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  age?: number | null;
  reset_token?: string | null;
  reset_token_expires?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
}

/**
 * Public user representation (sensitive fields removed)
 */
export interface UserPublic {
  id: string;
  username: string;
  email: string;
  age?: number | null;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * User creation input
 */
export interface UserCreateInput {
  username: string;
  email: string;
  password_hash: string;
  age?: number;
}

/**
 * User update input (partial)
 */
export interface UserUpdateInput {
  username?: string;
  email?: string;
  password_hash?: string;
  age?: number;
  reset_token?: string | null;
  reset_token_expires?: Date | string | null;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Operation result
 */
export interface OperationResult<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Authentication result
 */
export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserPublic;
}

/**
 * Deletion preview
 */
export interface DeletionPreview {
  userId: string;
  conversations: number;
  assessments: number;
  messages: number;
  totalRecords: number;
}

/**
 * Password reset initiation result
 */
export interface PasswordResetInitResult {
  success: boolean;
  message: string;
  resetToken?: string;
  expiresAt?: Date | string;
}

/**
 * Password reset validation result
 */
export interface ResetTokenValidation {
  isValid: boolean;
  userId?: string;
  message: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Password strength score (0-5)
 */
export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Password strength label
 */
export type PasswordStrengthLabel = 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Unknown';
