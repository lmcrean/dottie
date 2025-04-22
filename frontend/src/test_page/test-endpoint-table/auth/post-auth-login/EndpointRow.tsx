import React, { useState, useEffect, useRef } from "react";
import {
  EndpointRow as BaseEndpointRow,
  testCredentialsManager,
} from "../../../page-components";

// Track the last API response globally for debugging
let lastLoginResponse: any = null;

// Import authApi in a way that won't break if it's not available
let authApi: any = {
  verifyToken: () => {
    // Implement a direct token verification function using localStorage
    const authToken = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refresh_token");

    return {
      data: {
        success: true,
        authTokenExists: !!authToken,
        refreshTokenExists: !!refreshToken,
        authTokenValue: authToken ? `${authToken.substring(0, 10)}...` : null,
        refreshTokenValue: refreshToken
          ? `${refreshToken.substring(0, 10)}...`
          : null,
      },
    };
  },
};

// Try to import the real API, but don't fail if not available
try {
  // Use a mock implementation instead of dynamic import
  // This prevents path resolution issues when moving files
  authApi = {
    verifyToken: () => {
      let authToken = null;
      let refreshToken = null;

      try {
        // Use only snake_case naming convention
        authToken =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("authToken")
            : null;

        refreshToken =
          typeof localStorage !== "undefined"
            ? localStorage.getItem("refresh_token")
            : null;
      } catch (e) {
        console.warn("LocalStorage not available, using mock values");
      }

      return {
        data: {
          success: true,
          authTokenExists: !!authToken,
          refreshTokenExists: !!refreshToken,
          authTokenValue: authToken ? `${authToken.substring(0, 10)}...` : null,
          refreshTokenValue: refreshToken
            ? `${refreshToken.substring(0, 10)}...`
            : null,
        },
      };
    },
  };
} catch (err) {
  console.warn("Auth API not available, using mock", err);
}

export default function EndpointRow() {
  const [savedCredentials, setSavedCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [verificationResponse, setVerificationResponse] = useState<any>(null);
  const [verifyStatus, setVerifyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isVerifying, setIsVerifying] = useState(false);
  const [manualTokenCreated, setManualTokenCreated] = useState(false);
  const [lastApiResponse, setLastApiResponse] = useState<any>(null);

  const responseMonitorInterval = useRef<any>(null);

  // Monitor for API responses
  useEffect(() => {
    // Function to capture API responses by overriding fetch and XMLHttpRequest
    const setupResponseMonitoring = () => {
      // Monitor fetch API
      const originalFetch = window.fetch;
      window.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        // Only capture login requests
        if (
          args[0] &&
          typeof args[0] === "string" &&
          args[0].includes("/api/auth/login")
        ) {
          try {
            // Clone the response to avoid consuming it
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();
            lastLoginResponse = data;
            setLastApiResponse(data);

            // Automatically save tokens with correct naming
            if (data.token) {
              localStorage.setItem("authToken", data.token);
            }
            if (data.refreshToken) {
              localStorage.setItem("refresh_token", data.refreshToken);
            }

            // Dispatch auth token changed event
            window.dispatchEvent(new Event("authToken_changed"));
          } catch (e) {
            console.error(
              "[Response Monitor] Error capturing fetch response:",
              e
            );
          }
        }

        return response;
      };

      // Also try to monitor XMLHttpRequest for axios
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      const originalXhrSend = XMLHttpRequest.prototype.send;

      // Add custom property to XMLHttpRequest prototype
      type CustomXMLHttpRequest = XMLHttpRequest & {
        _isLoginRequest?: boolean;
      };

      // Using a more specific type definition for the open method
      const originalOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function (
        this: CustomXMLHttpRequest,
        method: string,
        url: string | URL,
        async: boolean = true,
        username?: string | null,
        password?: string | null
      ) {
        if (typeof url === "string" && url.includes("/api/auth/login")) {
          this._isLoginRequest = true;
        }
        return originalOpen.call(
          this,
          method,
          url,
          async,
          username || undefined,
          password || undefined
        );
      };

      XMLHttpRequest.prototype.send = function (
        this: CustomXMLHttpRequest,
        ...args
      ) {
        if (this._isLoginRequest) {
          const originalOnload = this.onload;
          this.onload = function (e) {
            try {
              if (this.responseText) {
                const data = JSON.parse(this.responseText);
                lastLoginResponse = data;
                setLastApiResponse(data);

                // Automatically save tokens with correct naming
                if (data.token) {
                  localStorage.setItem("authToken", data.token);
                }
                if (data.refreshToken) {
                  localStorage.setItem("refresh_token", data.refreshToken);
                }

                // Dispatch auth token changed event
                window.dispatchEvent(new Event("authToken_changed"));
              }
            } catch (e) {
              console.error(
                "[Response Monitor] Error parsing XHR response:",
                e
              );
            }

            if (originalOnload) {
              originalOnload.call(this, e);
            }
          };
        }
        return originalXhrSend.apply(this, args);
      };
    };

    // Set up response monitoring
    setupResponseMonitoring();

    // Also check periodically if a global response variable was set
    responseMonitorInterval.current = setInterval(() => {
      if (lastLoginResponse && !lastApiResponse) {
        setLastApiResponse(lastLoginResponse);
      }
    }, 1000);

    return () => {
      clearInterval(responseMonitorInterval.current);
    };
  }, [lastApiResponse]);

  // Check for any stored credentials when component loads
  useEffect(() => {
    const checkForStoredCredentials = () => {
      const credentials = testCredentialsManager.getCredentials();
      if (credentials) {
        setSavedCredentials({
          email: credentials.email,
          password: credentials.password,
        });
      }
    };

    checkForStoredCredentials();

    // Add event listener to detect when credentials are updated
    window.addEventListener(
      "signup_credentials_updated",
      checkForStoredCredentials
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "signup_credentials_updated",
        checkForStoredCredentials
      );
    };
  }, []);

  const handleUseSignupCredentials = () => {
    const credentials = testCredentialsManager.getCredentials();
    if (credentials) {
      setSavedCredentials({
        email: credentials.email,
        password: credentials.password,
      });
    }
  };

  const handleCreateTestToken = () => {
    try {
      const testToken = "test-auth-token-" + Date.now();
      const testRefreshToken = "test-refresh-token-" + Date.now();

      // Use snake_case naming convention consistently
      localStorage.setItem("authToken", testToken);
      localStorage.setItem("refresh_token", testRefreshToken);

      setManualTokenCreated(true);
    } catch (error) {
      console.error("[Manual Token] Error creating test tokens:", error);
    }
  };

  const handleExtractFromResponse = () => {
    if (!lastApiResponse) {
      console.error("[Extract Tokens] No API response available");
      return;
    }

    try {
      // Check all possible token field names
      const possibleTokenFields = [
        "token",
        "accessToken",
        "jwt",
        "access_token",
        "jwtToken",
      ];
      const possibleRefreshTokenFields = [
        "refreshToken",
        "refresh_token",
        "refresh",
      ];

      // Try to find a token
      let token = null;
      let tokenField = null;

      for (const field of possibleTokenFields) {
        if (lastApiResponse[field]) {
          token = lastApiResponse[field];
          tokenField = field;
          break;
        }
      }

      // Try to find a refresh token
      let refreshToken = null;
      let refreshField = null;

      for (const field of possibleRefreshTokenFields) {
        if (lastApiResponse[field]) {
          refreshToken = lastApiResponse[field];
          refreshField = field;
          break;
        }
      }

      // Store the tokens if found - using snake_case naming convention
      if (token) {
        localStorage.setItem("authToken", token);
      }

      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      // Set state to indicate tokens were created
      setManualTokenCreated(true);

      // Dispatch event
      window.dispatchEvent(new Event("authToken_changed"));
    } catch (error) {
      console.error("[Extract Tokens] Error extracting tokens:", error);
    }
  };

  const handleVerifyToken = () => {
    try {
      setIsVerifying(true);

      // Add a delay and multiple verification attempts to handle timing issues

      // Try verification up to 3 times with a delay between attempts
      let attempts = 0;
      const maxAttempts = 3;
      const delay = 800; // ms

      // First try to forcefully set a token to test if localStorage is working
      try {
        localStorage.setItem("test_token", "test-value-" + Date.now());
        const testValue = localStorage.getItem("test_token");

        // Check if localStorage is being blocked or cleared
        if (!testValue) {
          console.error(
            "[Token Verification] ERROR: localStorage test failed - cannot read/write to localStorage"
          );
        }
      } catch (e) {
        console.error("[Token Verification] ERROR accessing localStorage:", e);
      }

      const attemptVerification = () => {
        attempts++;

        // Get tokens using snake_case consistently
        const authToken = localStorage.getItem("authToken");
        const refreshToken = localStorage.getItem("refresh_token");

        const verificationResult = {
          success: true,
          authTokenExists: !!authToken,
          refreshTokenExists: !!refreshToken,
          authTokenValue: authToken ? `${authToken.substring(0, 10)}...` : null,
          refreshTokenValue: refreshToken
            ? `${refreshToken.substring(0, 10)}...`
            : null,
        };

        if (verificationResult.authTokenExists || attempts >= maxAttempts) {
          // Success or max attempts reached
          setVerificationResponse(verificationResult);
          setVerifyStatus(
            verificationResult.authTokenExists ? "success" : "error"
          );
          setIsVerifying(false);

          if (!verificationResult.authTokenExists) {
            // If verification failed at the end, add a direct token for debugging
            try {
              const directTestToken = "direct-test-token-" + Date.now();
              localStorage.setItem("authToken", directTestToken);
            } catch (e) {
              console.error(
                "[Token Verification] ERROR setting direct test token:",
                e
              );
            }
          }
        } else {
          // Try again after delay

          setTimeout(attemptVerification, delay);
        }
      };

      // Start the verification process
      attemptVerification();
    } catch (error) {
      console.error("Error verifying tokens:", error);
      setVerifyStatus("error");
      setIsVerifying(false);
    }
  };

  return (
    <>
      <BaseEndpointRow
        method="POST"
        endpoint="/api/auth/login"
        expectedOutput={{
          token: "jwt-token",
          user: {
            id: "user-id",
            email: "user@example.com",
          },
        }}
        requiresParams={true}
        inputFields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
            placeholder: "user@example.com",
            defaultValue: savedCredentials?.email || "",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            required: true,
            placeholder: "Your password",
            defaultValue: savedCredentials?.password || "",
          },
        ]}
      />

      {/* Button row with credentials and verification */}
      <tr>
        <td colSpan={3}>
          <div className="flex flex-col space-y-3 ml-4 mt-2 mb-4">
            <div className="flex items-center">
              <button
                onClick={handleUseSignupCredentials}
                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2"
              >
                Use Latest Signup Credentials
              </button>

              {savedCredentials && (
                <div className="ml-4 p-2 bg-gray-800 rounded text-xs">
                  <div>
                    Using credentials for:{" "}
                    <span className="text-purple-400">
                      {savedCredentials.email}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Token Creation Button */}
            <div className="flex items-center">
              <button
                onClick={handleCreateTestToken}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2"
              >
                Create Test Tokens Manually
              </button>

              {manualTokenCreated && (
                <div className="ml-4 p-2 bg-yellow-900 rounded text-xs">
                  <div>
                    Test tokens <span className="text-yellow-400">created</span>
                  </div>
                </div>
              )}
            </div>

            {/* Verify Auth Token Button */}
            <div className="flex items-center">
              <button
                onClick={handleVerifyToken}
                disabled={isVerifying}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2"
                data-testid="test-get-frontend-auth-token-verification-button"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center space-x-1">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>Verify Auth Token</>
                )}
              </button>

              {verifyStatus !== "idle" && (
                <div
                  className={`ml-4 p-2 ${
                    verifyStatus === "success" ? "bg-green-900" : "bg-red-900"
                  } rounded text-xs`}
                >
                  {verifyStatus === "success" ? (
                    <div>
                      Token verification{" "}
                      <span className="text-green-400">successful</span>
                    </div>
                  ) : (
                    <div>
                      Token verification{" "}
                      <span className="text-red-400">failed</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Extract Tokens from Last Response Button */}
            <div className="flex items-center mt-2">
              <button
                onClick={handleExtractFromResponse}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2"
              >
                Extract Tokens from Response
              </button>

              {lastApiResponse && (
                <div className="ml-4 p-2 bg-gray-800 rounded text-xs">
                  <div>
                    Response captured <span className="text-green-400">✓</span>
                  </div>
                </div>
              )}
            </div>

            {verificationResponse && (
              <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
                <pre className="whitespace-pre-wrap break-words text-gray-300">
                  {JSON.stringify(verificationResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
