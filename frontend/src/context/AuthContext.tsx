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

  console.log("[AuthContext Debug] Getting stored auth data:", {
    hasUserStr: !!user,
    hasToken: !!token,
  });

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
      console.log("[AuthContext Debug] Initializing auth state");
      const { user, token } = getStoredAuthData();

      if (user && token) {
        console.log("[AuthContext Debug] Found existing user and token");
        // Verify token validity by fetching current user
        try {
          const currentUser = await userApi.current();
          console.log(
            "[AuthContext Debug] Current user validated:",
            currentUser.id
          );
          setState({
            user: currentUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          console.log(
            "[AuthContext Debug] Auth state updated - user authenticated"
          );
        } catch (error) {
          console.log(
            "[AuthContext Debug] Error validating current user:",
            error
          );
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } else {
        console.log("[AuthContext Debug] No valid user/token found");
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
      console.log("[AuthContext Debug] Login attempt with:", credentials.email);
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await authApi.login(credentials);
      console.log(
        "[AuthContext Debug] Login successful, received token and user:",
        {
          userId: response.user.id,
          hasToken: !!response.token,
        }
      );

      // Use the token manager to store auth data
      storeAuthData(response);
      console.log(
        "[AuthContext Debug] Saved user and token using token manager"
      );

      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      console.log("[AuthContext Debug] Updated auth state to authenticated");
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
      console.log("[AuthContext Debug] Signup attempt");
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await authApi.signup(userData);
      console.log("[AuthContext Debug] Signup successful");

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
      console.log("[AuthContext Debug] Logout attempt");
      await authApi.logout();
      console.log("[AuthContext Debug] Logout API call successful");
    } catch (error) {
      console.error("[AuthContext Debug] Logout error:", error);
    } finally {
      // Use token manager to clear all tokens
      clearAllTokens();
      console.log(
        "[AuthContext Debug] Removed user and tokens using token manager"
      );

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      console.log("[AuthContext Debug] Reset auth state");
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
