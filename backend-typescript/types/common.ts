// Common type definitions for the application

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

// Test/Mock object types
export interface TestRequestBody {
  email?: string;
  password?: string;
  username?: string;
  token?: string;
  [key: string]: any;
}

export interface MockResponse {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<any>;
  text: () => Promise<string>;
}

export interface TestOptions {
  port?: number;
  production?: boolean;
  useMocks?: boolean;
  [key: string]: any;
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
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

// Express-related types for request body
export interface AuthenticatedRequest {
  user?: {
    id: string;
    email: string;
    username: string;
  };
  body: TestRequestBody;
}

// Test fixture types
export interface TestUserOverrides {
  id?: string;
  username?: string;
  email?: string;
  password_hash?: string;
  age?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TestCycleOverrides {
  id?: string;
  user_id?: string;
  start_date?: Date;
  end_date?: Date;
  flow_level?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TestSymptomOverrides {
  id?: string;
  user_id?: string;
  date?: Date;
  type?: string;
  severity?: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TestAssessmentOverrides {
  id?: string;
  user_id?: string;
  date?: Date;
  result_category?: string;
  recommendations?: string;
  created_at?: Date;
  updated_at?: Date;
} 