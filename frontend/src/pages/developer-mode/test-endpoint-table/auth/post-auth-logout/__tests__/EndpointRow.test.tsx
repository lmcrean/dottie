import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../EndpointRow';

describe('Post Auth Logout EndpointRow', () => {
  it('renders correctly', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/api/auth/logout')).toBeInTheDocument();
  });
}); 