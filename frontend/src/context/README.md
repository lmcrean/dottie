# Authentication Hooks

This directory contains React hooks for the Dottie application.

## useAuth

The primary authentication hook that provides:

- User authentication state management
- Token storage and retrieval
- Login/logout functionality
- Password update capability
- Cross-tab synchronization

### Usage

```tsx
import { useAuth } from '@/context/useAuthContext';

function MyComponent() {
  const {
    user, // Current user or null if not authenticated
    loading, // Loading state during auth operations
    error, // Error state if an auth operation fails
    isAuthenticated, // Boolean indicating if user is logged in
    authToken, // Current auth token from localStorage
    login, // Function to login: (email, password) => Promise<User>
    logout, // Function to logout: () => void
    updatePassword // Function to update password: (current, new) => Promise<boolean>
  } = useAuth();

  // Example usage
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Redirect or update UI after successful login
    } catch (err) {
      // Handle login error
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'password')}>Login</button>
      )}
    </div>
  );
}
```

### Provider Setup

Make sure to wrap your application with the `AuthProvider`:

```tsx
import { AuthProvider } from '@/context/AuthContextProvider';

function App() {
  return <AuthProvider>{/* Your app components */}</AuthProvider>;
}
```
