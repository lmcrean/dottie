import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EndpointRow from '../../EndpointRow';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch
vi.stubGlobal('fetch', vi.fn());

describe('Password Reset Endpoint Row', () => {
  it('renders correctly with proper method and endpoint', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <EndpointRow />
          </tbody>
        </table>
      </MemoryRouter>
    );
    
    // Check if the endpoint is displayed correctly
    expect(screen.getByText('/api/user/pw/reset')).toBeInTheDocument();
    
    // Check if the method is displayed correctly
    expect(screen.getByText('POST')).toBeInTheDocument();
    
    // Check button exists
    const button = screen.getByTestId('test-post -api-user-pw-reset-button');
    expect(button).toBeInTheDocument();
  });
  
  it('shows expected response format', () => {
    render(
      <MemoryRouter>
        <table>
          <tbody>
            <EndpointRow />
          </tbody>
        </table>
      </MemoryRouter>
    );
    
    // Check if expected output is displayed
    expect(screen.getByText(/We have sent a password reset link to/i)).toBeInTheDocument();
  });
}); 