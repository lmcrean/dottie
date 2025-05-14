import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ApiResponse from '../ApiResponse';

// Mock the JsonDisplay component
vi.mock('../JsonDisplay', () => ({
  default: ({ data }: { data: any }) => (
    <div data-testid="json-display" data-content={JSON.stringify(data)}>
      JsonDisplay Mock
    </div>
  ),
}));

describe('ApiResponse Component', () => {
  it('should render idle state when no data and status is idle', () => {
    render(<ApiResponse data={null} status="idle" />);
    
    expect(screen.getByText('No response yet. Click the endpoint button to test.')).toBeInTheDocument();
  });

  it('should render error state with error message from response data', () => {
    const errorData = {
      response: {
        data: {
          error: 'API request failed'
        },
        status: 500
      }
    };
    
    render(<ApiResponse data={errorData} status="error" />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByTestId('json-display')).toBeInTheDocument();
    
    // Verify error data is correctly formatted and passed to JsonDisplay
    const jsonDisplay = screen.getByTestId('json-display');
    const passedData = JSON.parse(jsonDisplay.getAttribute('data-content') || '{}');
    expect(passedData.error).toBe('API request failed');
    expect(passedData.status).toBe(500);
  });
  
  it('should render error state with message property if no response.data.error', () => {
    const errorData = {
      message: 'Network Error'
    };
    
    render(<ApiResponse data={errorData} status="error" />);
    
    const jsonDisplay = screen.getByTestId('json-display');
    const passedData = JSON.parse(jsonDisplay.getAttribute('data-content') || '{}');
    expect(passedData.error).toBe('Network Error');
  });
  
  it('should render error state with fallback message if no error details present', () => {
    render(<ApiResponse data={{}} status="error" />);
    
    const jsonDisplay = screen.getByTestId('json-display');
    const passedData = JSON.parse(jsonDisplay.getAttribute('data-content') || '{}');
    expect(passedData.error).toBe('An error occurred');
  });

  it('should render success state with original data', () => {
    const successData = { result: 'success', value: 42 };
    
    render(<ApiResponse data={successData} status="success" />);
    
    expect(screen.getByText('Success')).toBeInTheDocument();
    
    const jsonDisplay = screen.getByTestId('json-display');
    const passedData = JSON.parse(jsonDisplay.getAttribute('data-content') || '{}');
    expect(passedData).toEqual(successData);
  });

  it('should render partial success state with original data', () => {
    const partialData = { result: 'partial', value: 21 };
    
    render(<ApiResponse data={partialData} status="partial" />);
    
    expect(screen.getByText('Partial Success')).toBeInTheDocument();
    
    const jsonDisplay = screen.getByTestId('json-display');
    const passedData = JSON.parse(jsonDisplay.getAttribute('data-content') || '{}');
    expect(passedData).toEqual(partialData);
  });

  it('should render just JsonDisplay if status is not recognized', () => {
    const someData = { value: 'test' };
    
    // @ts-ignore - intentionally using an invalid status for test
    render(<ApiResponse data={someData} status="unknown" />);
    
    expect(screen.queryByText('Success')).not.toBeInTheDocument();
    expect(screen.queryByText('Error')).not.toBeInTheDocument();
    expect(screen.queryByText('Partial Success')).not.toBeInTheDocument();
    
    const jsonDisplay = screen.getByTestId('json-display');
    const passedData = JSON.parse(jsonDisplay.getAttribute('data-content') || '{}');
    expect(passedData).toEqual(someData);
  });
}); 