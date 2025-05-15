import { AuthContext } from '@/src/context/auth/AuthContext';
import { useContext } from 'react';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
