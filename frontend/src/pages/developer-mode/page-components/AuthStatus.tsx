import React, { useState, useEffect } from 'react';
import { InputForm } from './index';
import { LoginInput } from '../../../api/auth/types';

interface AuthStatusProps {
  onLogin: (credentials: LoginInput) => Promise<void>;
  onLogout: () => void;
}

export default function AuthStatus({ onLogin, onLogout }: AuthStatusProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [isFlowRunning, setIsFlowRunning] = useState<boolean>(false);

  // Check if token exists on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('auth_user');

    if (token) {
      setIsAuthenticated(true);

      if (userString) {
        try {
          setUser(JSON.parse(userString));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    }
  }, []);

  const handleLogin = async (formData: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      const credentials = {
        email: formData.email as string,
        password: formData.password as string
      };
      await onLogin(credentials);
      setIsAuthenticated(true);
      setUser({ email: credentials.email });
      setShowLoginForm(false);
    } catch (_error) {
      console.error('Login error:', _error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      // First update our UI state
      setIsAuthenticated(false);
      setUser(null);

      // Then try to call the logout API
      onLogout();

      // Clear any localStorage items regardless of API success
      localStorage.removeItem('authToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still update UI and clear storage even if API call failed
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth_user');
    }
  };

  // Auth-Flow utility function
  const runAuthFlow = async () => {
    if (isFlowRunning) return;

    setIsFlowRunning(true);
    try {
      // Helper function to scroll element into view
      const scrollToElement = (element: HTMLElement) => {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };

      // Helper function to wait with a message
      const wait = async (ms: number, _message: string) => {
        await new Promise((resolve) => setTimeout(resolve, ms));
      };

      // Step 1: Find and click the "Generate Random User" button
      const generateButton = Array.from(document.querySelectorAll('button')).find((button) =>
        button.textContent?.includes('Generate Random User')
      );

      if (generateButton) {
        scrollToElement(generateButton as HTMLElement);
        await wait(300, 'Scrolling to Generate Random User button');
        (generateButton as HTMLButtonElement).click();

        // Wait for the credentials to be generated
        await wait(800, 'Waiting for user credentials to be generated');

        // Step 2: Find and click the signup button
        const signupButton = document.querySelector(
          'button[data-testid="test-post -api-auth-signup-button"]'
        ) as HTMLButtonElement;
        if (signupButton) {
          scrollToElement(signupButton as HTMLElement);
          await wait(300, 'Scrolling to Signup button');

          signupButton.click();

          // Wait for the form to appear
          await wait(800, 'Waiting for signup form to appear');

          // Step 3: Find and click the "Send POST Request" button for signup
          // Look for the Send POST Request button within the signup section
          const signupForms = document.querySelectorAll('form');
          let sendSignupButton: HTMLButtonElement | null = null;

          // Search through all forms for the one with email and password and username fields
          for (const form of Array.from(signupForms)) {
            const hasEmailField = form.querySelector('input[name="email"]');
            const hasPasswordField = form.querySelector('input[name="password"]');
            const hasUsernameField = form.querySelector('input[name="username"]');

            if (hasEmailField && hasPasswordField && hasUsernameField) {
              // This is likely the signup form
              sendSignupButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
              break;
            }
          }

          if (sendSignupButton) {
            scrollToElement(sendSignupButton as HTMLElement);
            await wait(300, 'Scrolling to Send POST Request button');

            sendSignupButton.click();

            // Wait for signup to complete
            await wait(1500, 'Waiting for signup to complete');

            // Step 4: Find and click the login button
            const loginButton = document.querySelector(
              'button[data-testid="test-post -api-auth-login-button"]'
            ) as HTMLButtonElement;
            if (loginButton) {
              scrollToElement(loginButton as HTMLElement);
              await wait(300, 'Scrolling to Login button');

              loginButton.click();

              // Wait for the form to appear
              await wait(800, 'Waiting for login form to appear');

              // Step 5: Find and click "Use Latest Signup Credentials" button
              const useCredentialsButton = Array.from(document.querySelectorAll('button')).find(
                (button) => button.textContent?.includes('Use Latest Signup Credentials')
              );

              if (useCredentialsButton) {
                scrollToElement(useCredentialsButton as HTMLElement);
                await wait(300, 'Scrolling to Use Latest Signup Credentials button');
                (useCredentialsButton as HTMLButtonElement).click();

                // Wait for credentials to be populated
                await wait(800, 'Waiting for credentials to be populated');

                // Step 6: Find and click the "Send POST Request" button for login
                // Look for the Send POST Request button within the login section
                const loginForms = document.querySelectorAll('form');
                let sendLoginButton: HTMLButtonElement | null = null;

                // Search through all forms for the one with email and password fields but no username
                for (const form of Array.from(loginForms)) {
                  const hasEmailField = form.querySelector('input[name="email"]');
                  const hasPasswordField = form.querySelector('input[name="password"]');
                  const hasUsernameField = form.querySelector('input[name="username"]');

                  if (hasEmailField && hasPasswordField && !hasUsernameField) {
                    // This is likely the login form
                    sendLoginButton = form.querySelector(
                      'button[type="submit"]'
                    ) as HTMLButtonElement;
                    break;
                  }
                }

                if (sendLoginButton) {
                  scrollToElement(sendLoginButton as HTMLElement);
                  await wait(300, 'Scrolling to Send POST Request button for login');

                  sendLoginButton.click();

                  // Wait for login to complete - use a longer delay to ensure token is saved
                  await wait(2500, 'Waiting for login to complete and token to be saved');

                  // Check if authentication worked - more comprehensive check
                  const authToken = localStorage.getItem('authToken');
                  const userString = localStorage.getItem('auth_user');
                  const isAuthSuccess =
                    authToken || userString || document.querySelector('.bg-green-500');

                  if (isAuthSuccess) {
                    // Refresh auth status from localStorage
                    if (userString) {
                      try {
                        const userData = JSON.parse(userString);
                        setIsAuthenticated(true);
                        setUser({ email: userData.email });

                        // Scroll back to the top to show the authentication status
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } catch (_error) {
                        console.error('Error parsing user data:', _error);
                        // Still consider success if we found a token or green status indicator
                        setIsAuthenticated(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    } else {
                      // No user data but we have a token or green status indicator
                      setIsAuthenticated(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  } else {
                    console.warn(
                      'Auth flow completed but no token found. This may still have worked correctly - check UI for login status.'
                    );

                    // Refresh the auth status for reliability
                    const hasGreenStatus = document.querySelector('.bg-green-500');
                    if (hasGreenStatus) {
                      setIsAuthenticated(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      alert('Auth flow likely succeeded - UI shows logged in state.');
                    } else {
                      console.error('Auth flow likely failed - UI shows not logged in.');
                      alert(
                        'Auth flow may have failed: No authentication indicators found. Check your login status in the UI.'
                      );
                    }
                  }
                } else {
                  console.error('Could not find Send POST Request button for login');
                }
              } else {
                console.error('Could not find Use Latest Signup Credentials button');
              }
            } else {
              console.error('Could not find Login button');
            }
          } else {
            console.error('Could not find Send POST Request button for signup');
          }
        } else {
          console.error('Could not find Signup button');
        }
      } else {
        console.error('Could not find Generate Random User button');
      }
    } catch (error) {
      console.error('Error during auth flow:', error);
    } finally {
      setIsFlowRunning(false);
    }
  };

  return (
    <div className="mb-8 rounded-lg bg-gray-800 p-4">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-semibold">Authentication Status</h2>
          <div className="mt-2 flex items-center">
            <div
              className={`mr-2 h-3 w-3 rounded-full ${
                isAuthenticated ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
            <span>{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</span>
          </div>
          {isAuthenticated && user && (
            <div className="mt-2 text-sm text-gray-300">Logged in as: {user.email}</div>
          )}
        </div>

        <div className="flex space-x-3">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              {showLoginForm ? 'Cancel' : 'Login'}
            </button>
          )}

          {/* Auth-Flow utility button */}
          <div className="relative px-14">
            <button
              type="button"
              onClick={runAuthFlow}
              disabled={isFlowRunning}
              className="ml-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-500"
            >
              {isFlowRunning ? 'Running...' : 'Auto Auth Flow'}
            </button>
            <div className="absolute mt-1 text-xs text-gray-300 md:relative md:mt-2">
              Click to quickly signup and login with a random user
            </div>
          </div>
        </div>
      </div>

      {showLoginForm && !isAuthenticated && (
        <div className="mt-4 rounded-md bg-gray-700 p-4">
          <h3 className="mb-2 text-lg font-medium">Login</h3>
          <InputForm
            fields={[
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'user@example.com'
              },
              {
                name: 'password',
                label: 'Password',
                type: 'password',
                required: true,
                placeholder: 'Your password'
              }
            ]}
            onSubmit={handleLogin}
            submitLabel="Login"
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
