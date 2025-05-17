import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, beforeEach, vi } from 'vitest';
import EndpointRow from '../../../EndpointRow';
import { apiClient } from '../../../../../../../../api';

// Mock the API client
vi.mock('../../../../../../../../api', () => ({
  apiClient: {
    get: vi.fn().mockImplementation((url) => {
      if (url === '/api/setup/health/hello') {
        return Promise.resolve({ data: { message: "Hello World from Dottie API!" } });
      }
      return Promise.resolve({ data: { mocked: true, url } });
    }),
    post: vi.fn().mockResolvedValue({ data: { success: true } }),
    put: vi.fn().mockResolvedValue({ data: { success: true } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true } })
  }
}));

describe('Get Setup Health Hello EndpointRow with Mock API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component correctly', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/setup/health/hello')).toBeInTheDocument();
    expect(screen.getByText(/"message":/)).toBeInTheDocument();
    expect(screen.getByText(/"Hello World from Dottie API!"/)).toBeInTheDocument();
  });

  it('makes an API call when button is clicked (mock)', async () => {
    render(<EndpointRow />);
    
    // Find and click the endpoint button
    const button = screen.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
    fireEvent.click(button);
    
    // Verify that the mocked API was called with the correct endpoint
    expect(apiClient.get).toHaveBeenCalledWith('/api/setup/health/hello');
    
    // Wait for the response to appear
    await waitFor(() => {
      // Check for success status
      expect(screen.getByText(/success/i)).toBeInTheDocument();
      
      // Check for message in response
      const responseText = screen.getAllByText(/"Hello World from Dottie API!"/i);
      expect(responseText.length).toBeGreaterThanOrEqual(1);
    });
  });
}); 