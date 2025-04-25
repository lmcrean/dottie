'use client';

import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';

// Define user interface
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define the context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  authToken: string | null;
  refreshToken: string | null;
  authTokenExists: boolean;
  refreshTokenExists: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  checkTokens: () => void; // Expose to make testing easier
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  authToken: null,
  refreshToken: null,
  authTokenExists: false,
  refreshTokenExists: false,
  isAuthenticated: false,
  login: async () => ({ id: '', email: '' }),
  logout: () => {},
  updatePassword: async () => false,
  checkTokens: () => {}, // Default implementation
});

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [authTokenExists, setAuthTokenExists] = useState<boolean>(false);
  const [refreshTokenExists, setRefreshTokenExists] = useState<boolean>(false);

  // Create a memoized function to check and update tokens
  const checkTokens = useCallback(() => {
    const currentAuthToken = localStorage.getItem('authToken');
    const currentRefreshToken = localStorage.getItem('refresh_token');

    setAuthToken(currentAuthToken);
    setRefreshToken(currentRefreshToken);
    setAuthTokenExists(!!currentAuthToken);
    setRefreshTokenExists(!!currentRefreshToken);
  }, []);

  // Function to validate and retrieve user information
  const validateToken = useCallback(async () => {
    try {
      setLoading(true);
      const currentAuthToken = localStorage.getItem('authToken');

      if (currentAuthToken) {
        // In a real app, make an API call to validate the token
        // For now, try to load user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to validate token'));
      // Clear invalid tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial check for tokens
    checkTokens();
    validateToken();

    // Set up event listeners
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === 'authToken' ||
        event.key === 'refresh_token' ||
        event.key === 'user' ||
        event.key === null
      ) {
        checkTokens();
        validateToken();
      }
    };

    const handleAuthTokenChanged = () => {
      checkTokens();
      validateToken();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authToken_changed', handleAuthTokenChanged);

    return () => {
      // Remove event listeners on cleanup
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authToken_changed', handleAuthTokenChanged);
    };
  }, [checkTokens, validateToken]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // This would be an API call in a real app
      // For demo, we'll just simulate a successful login
      const user = { id: '123', email };

      // Store tokens and user info
      localStorage.setItem('authToken', 'demo-auth-token-' + Date.now());
      localStorage.setItem('refresh_token', 'demo-refresh-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      setUser(user);
      checkTokens();

      // Dispatch event to notify other tabs
      window.dispatchEvent(new Event('authToken_changed'));

      return user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to login'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    // Update state
    setUser(null);
    checkTokens();

    // Dispatch event to notify other tabs
    window.dispatchEvent(new Event('authToken_changed'));
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      // This would be an API call in a real app
      // Mock successful password update
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update password'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    authToken,
    refreshToken,
    authTokenExists,
    refreshTokenExists,
    isAuthenticated: !!user && !!authToken,
    login,
    logout,
    updatePassword,
    checkTokens, // Expose to make testing easier
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to get authentication status and token values from context
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
