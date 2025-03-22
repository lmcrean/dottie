import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import TestPage from '../../page';

// Import jest-dom matchers
import '@testing-library/jest-dom';

// Mock axios
vi.mock('axios');

// Define proper mock type for Axios
type MockedAxios = {
  get: ReturnType<typeof vi.fn>;
};

const mockedAxios = axios as unknown as MockedAxios;

// Mock environment
vi.mock('process', () => ({
  env: {
    NODE_ENV: 'development'
  }
}));

describe('TestPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the correct environment heading', () => {
    // The environment is mocked to 'development'
    render(<TestPage />);
    
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/now testing in/i);
    expect(heading).toHaveTextContent(/test/i);
  });

  it('handles API test button click correctly', async () => {
    // Setup
    const mockApiResponse = {
      data: {
        message: 'API test successful',
        timestamp: new Date().toISOString()
      }
    };
    
    // Mock the axios.get response
    mockedAxios.get.mockResolvedValueOnce(mockApiResponse);
    
    // Render
    render(<TestPage />);
    
    // Click the API test button
    const apiButton = screen.getByRole('button', { name: /test api message/i });
    
    await act(async () => {
      fireEvent.click(apiButton);
    });
    
    // Wait for the response to be displayed
    await waitFor(() => {
      expect(screen.getByText('API test successful')).toBeInTheDocument();
    });
    
    // Verify axios was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/message');
  });

  it('handles DB test button click correctly', async () => {
    // Setup
    const mockDbResponse = {
      data: {
        message: 'SQLite connection successful',
        data: { id: 1, name: 'Dottie Test' },
        timestamp: new Date().toISOString()
      }
    };
    
    mockedAxios.get.mockResolvedValueOnce(mockDbResponse);
    
    // Render
    render(<TestPage />);
    
    // Click the DB test button
    const dbButton = screen.getByRole('button', { name: /test sqlite connection/i });
    
    await act(async () => {
      fireEvent.click(dbButton);
    });
    
    // Wait for the response to be displayed
    await waitFor(() => {
      expect(screen.getByText('SQLite connection successful')).toBeInTheDocument();
    });
    
    // Verify axios was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/db');
  });

  it('handles API error correctly', async () => {
    // Setup
    const errorMessage = 'Network Error';
    const axiosError = new Error(errorMessage);
    // @ts-ignore - add isAxiosError property to simulate an Axios error
    axiosError.isAxiosError = true;
    
    mockedAxios.get.mockRejectedValueOnce(axiosError);
    
    // Render
    render(<TestPage />);
    
    // Click the API test button
    const apiButton = screen.getByRole('button', { name: /test api message/i });
    
    await act(async () => {
      fireEvent.click(apiButton);
    });
    
    // Wait for the error to be displayed
    await waitFor(() => {
      expect(screen.getByText('An unknown error occurred')).toBeInTheDocument();
    });
  });
}); 