import { apiClient, isSuccess, isClientError, isServerError } from './core/apiClient';
import { checkDbConnection, fetchUserData } from './core/db';

import { authApi, login, signup, logout, refreshToken } from './auth';
import { type User, type LoginInput, type SignupInput, type AuthResponse } from './auth/types';

import { assessmentApi, type Assessment } from '../pages/assessment/api';
import {
  chatApi,
  type ApiMessage,
  type Conversation,
  type ChatResponse
} from '../pages/chat/components/api/message';
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
  login,
  signup,
  logout,
  refreshToken,
  User,
  LoginInput,
  SignupInput,
  AuthResponse,

  // Assessment exports
  assessmentApi,
  Assessment,

  // Chat exports
  chatApi,
  ApiMessage,
  Conversation,
  ChatResponse,

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
  chat: chatApi,
  user: userApi,
  setup: setupApi,
  db: { checkDbConnection, fetchUserData }
};
