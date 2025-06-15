// Auth Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  age?: string; // Optional for backward compatibility
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}
