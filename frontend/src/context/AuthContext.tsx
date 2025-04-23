import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi } from "@/src/api/auth/index";
import { User, LoginInput, SignupInput } from "@/src/api/auth/types";
import { userApi } from "@/src/api/user/index";
import {
  storeAuthData,
  getAuthToken,
  getUserData,
  clearAllTokens,
} from "../api/core/tokenManager";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginInput) => Promise<void>;
  signup: (userData: SignupInput) => Promise<User>;
  logout: () => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get stored auth data
const getStoredAuthData = (): { user: User | null; token: string | null } => {
  const user = getUserData();
  const token = getAuthToken();

  return {
    user,
    token,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      const { user, token } = getStoredAuthData();

      if (user && token) {
        // Verify token validity by fetching current user
        try {
          const currentUser = await userApi.current();

          setState({
            user: currentUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Handle token refresh
  // useEffect(() => {
  //   let refreshInterval: NodeJS.Timeout;

  //   if (state.isAuthenticated) {
  //     // Refresh token every 14 minutes (assuming 15-minute token expiry)
  //     refreshInterval = setInterval(async () => {
  //       try {
  //         const { token } = await authApi.refreshToken();
  //         localStorage.setItem('authToken', token);
  //       } catch (error) {
  //         // If refresh fails, logout user
  //         await logout();
  //       }
  //     }, 14 * 60 * 1000);
  //   }

  //   return () => {
  //     if (refreshInterval) {
  //       clearInterval(refreshInterval);
  //     }
  //   };
  // }, [state.isAuthenticated]);

  const login = async (credentials: LoginInput) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await authApi.login(credentials);

      // Use the token manager to store auth data
      storeAuthData(response);

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("[AuthContext Debug] Login error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
      throw error;
    }
  };

  const signup = async (userData: SignupInput): Promise<any> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await authApi.signup(userData);

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: null,
      }));

      return response.user;
    } catch (error) {
      console.error("[AuthContext Debug] Signup error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Signup failed",
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("[AuthContext Debug] Logout error:", error);
    } finally {
      // Use token manager to clear all tokens
      clearAllTokens();

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await userApi.updatePassword({
        currentPassword,
        newPassword,
      });
      return true;
    } catch (error) {
      console.error("Failed to update password", error);
      return false;
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        updatePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
