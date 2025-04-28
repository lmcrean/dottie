import { apiClient } from "../../../core/apiClient";
import { SignupInput, AuthResponse } from "../../types";
import axios, { AxiosError } from "axios";

/**
 * Register a new user
 * @endpoint /api/auth/signup (POST)
 */
export const postSignup = async (userData: SignupInput): Promise<AuthResponse> => {
  try {
    // Transform the data to match backend expectations
    const backendData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      age: userData.age || "25_34" // Providing a default value if age is not specified
    };
    
    // Debug log exact data being sent
    console.log("Signup - Data being sent to backend:", JSON.stringify(backendData));
    console.log("API Base URL:", apiClient.defaults.baseURL);
    
    try {
      // First try a direct request to production to compare
      const testResponse = await fetch('https://dottie-backend.vercel.app/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });
      
      console.log("Direct fetch test - status:", testResponse.status);
      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error("Direct fetch test failed:", errorText);
      } else {
        console.log("Direct fetch test successful");
      }
    } catch (testError) {
      console.error("Direct fetch test error:", testError);
    }
    
    // Continue with the normal request
    const response = await apiClient.post('/api/auth/signup', backendData);
    
    // Set the token in localStorage for global access
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      
      // Add token to default headers for subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error);
    // More detailed error logging
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('Error response data:', axiosError.response.data);
        console.error('Error response status:', axiosError.response.status);
        console.error('Error response headers:', axiosError.response.headers);
      }
    }
    throw error;
  }
};

export default postSignup; 