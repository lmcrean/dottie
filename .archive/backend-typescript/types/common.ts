// Common type definitions for the backend application

// Test-related types
export interface TestRequestBody {
  email?: string;
  password?: string;
  username?: string;
  token?: string;
  currentPassword?: string;
  newPassword?: string;
  [key: string]: any;
}

export interface TestOptions {
  port?: number;
  production?: boolean;
  useMocks?: boolean;
  [key: string]: any;
}

export interface MockResponse {
  status: number;
  statusText?: string;
  ok: boolean;
  body: any;
  json(): Promise<any>;
  [key: string]: any;
}

// Test fixture override types
export interface TestUserOverrides {
  id?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  age?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any;
}

export interface TestCycleOverrides {
  id?: string | number;
  user_id?: string;
  start_date?: Date;
  end_date?: Date;
  flow_level?: number;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any;
}

export interface TestSymptomOverrides {
  id?: string | number;
  user_id?: string;
  date?: Date;
  type?: string;
  severity?: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any;
}

export interface TestAssessmentOverrides {
  id?: string | number;
  user_id?: string;
  date?: Date;
  result_category?: string;
  recommendations?: string;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: any;
}

// Database-related types
export interface DatabaseConnection {
  query(sql: string, params?: any[]): Promise<any>;
  close(): Promise<void>;
}

// User-related types
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  age?: string;
  created_at: Date;
  updated_at: Date;
}

// Assessment-related types
export interface Assessment {
  id: string;
  user_id: string;
  date: Date;
  result_category: string;
  recommendations: string;
  created_at: Date;
  updated_at: Date;
}

// Chat/Conversation types
export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Request/Response extensions (using Express Request)
export interface AuthenticatedRequest {
  user?: {
    userId: string;
    role: string;
    [key: string]: any;
  };
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
  [key: string]: any;
}

// Utility types for testing
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Export commonly used type combinations
export type TestUser = DeepPartial<User> & TestUserOverrides;
export type TestCycle = DeepPartial<any> & TestCycleOverrides;
export type TestSymptom = DeepPartial<any> & TestSymptomOverrides;
export type TestAssessment = DeepPartial<Assessment> & TestAssessmentOverrides;

// User-related types
export interface UserCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  age: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RequestResetRequest {
  email: string;
}

// Assessment types
export interface AssessmentData {
  id: string;
  user_id: string;
  result_category: string;
  recommendations: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAssessmentRequest {
  user_id: string;
  result_category: string;
  recommendations: string;
}

// Cycle tracking types
export interface CycleData {
  id: string;
  user_id: string;
  start_date: Date;
  end_date: Date;
  flow_level: number;
  created_at: Date;
  updated_at: Date;
}

export interface SymptomData {
  id: string;
  user_id: string;
  date: Date;
  type: string;
  severity: number;
  notes: string;
  created_at: Date;
  updated_at: Date;
}

// Chat/Conversation types
export interface ConversationData {
  id: string;
  user_id: string;
  title?: string;
  created_at: Date;
  updated_at: Date;
}

export interface MessageData {
  id: string;
  conversation_id: string;
  user_id?: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: Date;
}

// Database service types
export interface DbServiceOptions {
  table: string;
  where?: Record<string, any>;
  data?: Record<string, any>;
  returning?: string[];
}

// Generic utility types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

 