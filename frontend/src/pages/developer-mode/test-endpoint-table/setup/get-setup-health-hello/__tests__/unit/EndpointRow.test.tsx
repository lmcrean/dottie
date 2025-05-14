import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../../EndpointRow';

describe('Get Setup Health Hello EndpointRow', () => {
  it('renders with correct method and endpoint', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/setup/health/hello')).toBeInTheDocument();
  });
  
  it('displays the expected output', () => {
    render(<EndpointRow />);
    
    // Check if the expected JSON output is displayed
    expect(screen.getByText(/"message":/)).toBeInTheDocument();
    expect(screen.getByText(/"Hello World from Dottie API!"/)).toBeInTheDocument();
  });
}); 