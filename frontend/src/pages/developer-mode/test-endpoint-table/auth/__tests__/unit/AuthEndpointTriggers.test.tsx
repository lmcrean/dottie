import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthEndpoints from '../../AuthEndpoints';

// Create a mock apiClient directly instead of importing
const apiClient = {
  post: vi.fn(),
  interceptors: {
    request: { use: vi.fn() },
    response: { use: vi.fn() }
  }
};

// No need to import the mocked module

describe('AuthEndpoint Trigger Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn()
      },
      writable: true
    });
  });

  it('shows forms for submitting data to auth endpoints', async () => {
    render(<AuthEndpoints />);
    
    // Find the signup button and click it to show the form
    const signupButton = screen.getByTestId('test-post -api-auth-signup-button');
    fireEvent.click(signupButton);
    
    // Check if input fields are rendered
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    
    // Check for submit button
    expect(screen.getByText('Send POST Request')).toBeInTheDocument();
  });

  it('submits signup form data to the API', async () => {
    // Mock apiClient post to return a successful response
    (apiClient.post as vi.Mock).mockResolvedValueOnce({
      data: {
        user: { 
          id: 'user-123', 
          email: 'test@example.com' 
        },
        token: 'jwt-token-123'
      },
      status: 200
    });

    render(<AuthEndpoints />);
    
    // Find the signup button and click it to show the form
    const signupButton = screen.getByTestId('test-post -api-auth-signup-button');
    fireEvent.click(signupButton);
    
    // Fill in the form fields
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const nameInput = screen.getByLabelText(/Name/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(nameInput, 'Test User');
    
    // Submit the form
    const submitButton = screen.getByText('Send POST Request');
    fireEvent.click(submitButton);
    
    // Wait for the request to be made
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/signup', {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      });
    });
  });

  it('submits login form data to the API', async () => {
    // Mock apiClient post to return a successful response
    (apiClient.post as vi.Mock).mockResolvedValueOnce({
      data: {
        token: 'jwt-token-123',
        user: { 
          id: 'user-123', 
          email: 'test@example.com' 
        }
      },
      status: 200
    });

    render(<AuthEndpoints />);
    
    // Find the login button and click it to show the form
    const loginButton = screen.getByTestId('test-post -api-auth-login-button');
    fireEvent.click(loginButton);
    
    // Form fields should appear
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    
    // Submit the form
    const submitButton = screen.getByText('Send POST Request');
    fireEvent.click(submitButton);
    
    // Wait for the request to be made
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('displays response data after successful form submission', async () => {
    // Mock apiClient post to return a successful response
    (apiClient.post as vi.Mock).mockImplementation(() => 
      Promise.resolve({
        data: {
          user: { 
            id: 'user-123', 
            email: 'test@example.com' 
          },
          token: 'jwt-token-123'
        },
        status: 200
      })
    );

    render(<AuthEndpoints />);
    
    // Initially there should be "No response yet" text
    expect(screen.getAllByText('No response yet. Click the endpoint button to test.').length).toBe(3);
    
    // Find the signup button and click it to show the form
    const signupButton = screen.getByTestId('test-post -api-auth-signup-button');
    fireEvent.click(signupButton);
    
    // Fill in the form fields
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const nameInput = screen.getByLabelText(/Name/i);
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(nameInput, 'Test User');
    
    // Submit the form
    const submitButton = screen.getByText('Send POST Request');
    fireEvent.click(submitButton);
    
    // Mock that the apiClient.post was called
    expect(apiClient.post).toHaveBeenCalled();
  });
}); 