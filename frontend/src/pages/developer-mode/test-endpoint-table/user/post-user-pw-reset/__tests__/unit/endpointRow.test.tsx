import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EndpointRow from '../../EndpointRow';
import { MemoryRouter } from 'react-router-dom';

// Mock fetch
vi.stubGlobal('fetch', vi.fn());

describe('Password Reset Endpoint Row', () => {
  it('renders correctly with proper method and endpoint', () => {
    render(
      <MemoryRouter>
        <EndpointRow />
      </MemoryRouter>
    );
    
    // Check if the endpoint is displayed correctly
    expect(screen.getByText('/api/user/pw/reset')).toBeInTheDocument();
    
    // Check if the method is displayed correctly
    expect(screen.getByText('POST')).toBeInTheDocument();
    
    // Check if email input field is present but optional
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).not.toHaveAttribute('required');
  });
  
  it('shows expected response format', () => {
    render(
      <MemoryRouter>
        <EndpointRow />
      </MemoryRouter>
    );
    
    // Check if expected output is displayed
    expect(screen.getByText(/We have sent a password reset link to/i)).toBeInTheDocument();
  });
}); 