import { apiClient, isSuccess, isClientError, isServerError } from './core/apiClient';
import { checkDbConnection, fetchUserData } from './core/db';

import { authApi, postLogin, postSignup, postLogout, postRefreshToken } from './auth';
import { type User, type LoginInput, type SignupInput, type AuthResponse } from './auth/types';

import { assessmentApi, type Assessment } from '../pages/assessment/api';
// Chat API is now colocated with components - import from specific locations as needed
import {
  userApi,
  type UserProfile,
  type PasswordResetRequest,
  type PasswordUpdateRequest
} from '../pages/user/api';
import setupApi from './setup';
import {
  type HealthResponse,
  type DatabaseStatusResponse,
  type DatabaseHelloResponse
} from './setup/types';

// Export all API modules
export {
  apiClient,
  isSuccess,
  isClientError,
  isServerError,
  checkDbConnection,
  fetchUserData,

  // Auth exports
  authApi,
  postLogin,
  postSignup,
  postLogout,
  postRefreshToken,
  User,
  LoginInput,
  SignupInput,
  AuthResponse,

  // Assessment exports
  assessmentApi,
  Assessment,

  // Chat APIs are now colocated with their respective components
  // Import directly from:
  // - ../pages/chat/chat-detail/components/buttons/send-message
  // - ../pages/chat/sidebar/api/get-list
  // - etc.

  // User exports
  userApi,
  UserProfile,
  PasswordResetRequest,
  PasswordUpdateRequest,

  // Setup exports
  setupApi,
  HealthResponse,
  DatabaseStatusResponse,
  DatabaseHelloResponse
};

// Default export for convenience
export default {
  apiClient,
  auth: authApi,
  assessment: assessmentApi,
  // chat: removed - now colocated with components
  user: userApi,
  setup: setupApi,
  db: { checkDbConnection, fetchUserData }
};
