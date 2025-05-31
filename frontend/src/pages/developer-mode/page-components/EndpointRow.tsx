import React, { useState, useEffect, Fragment } from 'react';
import EndpointButton from './EndpointButton';
import JsonDisplay from './JsonDisplay';
import ApiResponse from './ApiResponse';
import InputForm from './InputForm';
import { apiClient } from '../../../api';
import { AxiosError } from 'axios';

interface InputField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'json';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}

interface EndpointRowProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  expectedOutput: unknown;
  requiresAuth?: boolean;
  requiresParams?: boolean;
  inputFields?: InputField[];
  pathParams?: string[];
  onCustomButtonClick?: () => void;
}

/**
 * A reusable row component for an API endpoint
 */
export default function EndpointRow({
  method,
  endpoint,
  expectedOutput,
  requiresAuth = false,
  requiresParams = false,
  inputFields = [],
  pathParams = [],
  onCustomButtonClick
}: EndpointRowProps) {
  const [response, setResponse] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'partial'>('idle');
  const [showInputForm, setShowInputForm] = useState(false);
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
  }, []);

  // Prepare path parameters input fields
  const pathParamFields: InputField[] = pathParams.map((param) => ({
    name: param,
    label: `${param} (path parameter)`,
    type: 'text',
    required: true,
    placeholder: `Enter value for ${param}`
  }));

  // Replace path parameters in endpoint
  const getProcessedEndpoint = (overridePathParams?: Record<string, string>) => {
    let processedEndpoint = endpoint;
    // Use overridePathParams if provided, otherwise use state
    const paramsToUse = overridePathParams || pathParamValues;

    pathParams.forEach((param) => {
      if (paramsToUse[param]) {
        processedEndpoint = processedEndpoint.replace(`:${param}`, paramsToUse[param]);
      }
    });

    return processedEndpoint;
  };

  const handleApiCall = async (
    formData?: Record<string, unknown>,
    overridePathParams?: Record<string, string>
  ) => {
    setIsLoading(true);
    setStatus('idle');
    setAuthError(false);

    try {
      let result;
      const processedEndpoint = getProcessedEndpoint(overridePathParams);

      // Check authentication if required - special case for logout which should still work
      if (requiresAuth && !localStorage.getItem('authToken') && endpoint !== '/api/auth/logout') {
        setAuthError(true);
        throw new Error('Authentication required. Please login first.');
      }

      // API client already handles auth headers through interceptors

      // Make appropriate API call based on method
      switch (method) {
        case 'GET':
          result = await apiClient.get(processedEndpoint);
          break;
        case 'POST':
          // Special case for logout endpoint
          if (endpoint === '/api/auth/logout') {
            try {
              // Get tokens before clearing storage
              const refreshToken = localStorage.getItem('refresh_token');
              const authToken = localStorage.getItem('authToken');

              // Try the API call with the tokens we have
              try {
                // Directly use axios to have more control over the request
                const response = await fetch(processedEndpoint, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
                  },
                  body: JSON.stringify({ refreshToken })
                });

                if (response.ok) {
                  // Logout successful
                } else {
                  await response.json();
                }
              } catch (error: unknown) {
                // Handle fetch error silently for logout
                console.warn('Logout request failed, but continuing with cleanup:', error);
              }

              // Clear local storage tokens after API call attempt

              localStorage.removeItem('authToken');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('auth_user');

              result = { data: { message: 'Logged out successfully' } };
            } catch (error) {
              console.error('[Logout Debug] Error during logout:', error);
              throw error;
            }
          } else {
            result = await apiClient.post(processedEndpoint, formData || {});
          }
          break;
        case 'PUT':
          result = await apiClient.put(processedEndpoint, formData || {});
          break;
        case 'DELETE':
          result = await apiClient.delete(processedEndpoint);
          break;
      }

      setResponse(result.data);
      setStatus('success');

      // Hide form after successful call
      if (requiresParams) {
        setShowInputForm(false);
      }
    } catch (error: unknown) {
      console.error(`Error calling ${endpoint}:`, error);
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        response: (error as AxiosError)?.response?.data,
        status: (error as AxiosError)?.response?.status,
        headers: (error as AxiosError)?.response?.headers
      });
      setResponse(error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    // If a custom handler is provided, use that instead
    if (onCustomButtonClick) {
      onCustomButtonClick();
      return;
    }

    // If this endpoint requires parameters, show the form instead of making API call
    if ((requiresParams && inputFields.length > 0) || pathParams.length > 0) {
      setShowInputForm(true);
    } else {
      handleApiCall();
    }
  };

  const handleFormSubmit = (formData: Record<string, unknown>) => {
    // Extract path parameters if needed
    if (pathParams.length > 0) {
      const newPathParamValues: Record<string, string> = {};
      pathParams.forEach((param) => {
        if (formData[param]) {
          newPathParamValues[param] = formData[param] as string;
          delete formData[param]; // Remove from form data
        } else {
          // Path parameter missing, will be handled by form validation
        }
      });

      setPathParamValues(newPathParamValues);
    }

    handleApiCall(formData);
  };

  const handlePathParamSubmit = (formData: Record<string, unknown>) => {
    // Update state for future reference
    setPathParamValues(formData as Record<string, string>);

    // If no other parameters are needed, make the call
    if (!requiresParams || inputFields.length === 0) {
      // Pass the form data directly instead of relying on state update
      handleApiCall(undefined, formData as Record<string, string>);
    } else {
      // Otherwise keep the form open for body parameters
      setShowInputForm(true);
    }
  };

  return (
    <Fragment>
      <tr className="border-t border-gray-700">
        <td className="p-4 align-top">
          <div className="space-y-3">
            <EndpointButton
              label={`${method} ${endpoint}`}
              method={method}
              onClick={handleButtonClick}
              status={status}
              isLoading={isLoading}
            />

            {requiresAuth && !isAuthenticated && (
              <div className={`text-xs ${authError ? 'text-red-400' : 'text-yellow-400'} mt-1`}>
                {authError
                  ? 'Authentication required. Please login first.'
                  : 'Requires authentication'}
              </div>
            )}
          </div>
        </td>

        <td className="p-4 align-top">
          <JsonDisplay data={expectedOutput} isExpected={true} />
        </td>

        <td className="p-4 align-top">
          <ApiResponse data={response} status={status} />
        </td>
      </tr>

      {/* Show forms in a separate row */}
      {showInputForm && (pathParams.length > 0 || (requiresParams && inputFields.length > 0)) && (
        <tr>
          <td colSpan={3} className="p-4">
            <div className="space-y-4">
              {/* Show path parameter form if needed */}
              {pathParams.length > 0 && (
                <div className="mt-2">
                  <h3 className="mb-2 text-sm font-medium text-gray-300">Path Parameters</h3>
                  <InputForm
                    fields={pathParamFields}
                    onSubmit={handlePathParamSubmit}
                    submitLabel="Set Path Parameters"
                    isLoading={isLoading}
                  />
                </div>
              )}

              {/* Show input form for request body if needed */}
              {requiresParams && inputFields.length > 0 && (
                <div className="mt-2">
                  <h3 className="mb-2 text-sm font-medium text-gray-300">Request Body</h3>
                  <InputForm
                    fields={inputFields}
                    onSubmit={handleFormSubmit}
                    submitLabel={`Send ${method} Request`}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </Fragment>
  );
}
