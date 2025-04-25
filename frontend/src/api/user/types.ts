// User Types
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
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
