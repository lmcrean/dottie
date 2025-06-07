// User Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface PasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email?: string;
}

export interface PasswordResetCompletion {
  email: string;
  newPassword: string;
  confirmPassword: string;
}
