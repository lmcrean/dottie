// Auth Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput extends LoginInput {
  name: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}
