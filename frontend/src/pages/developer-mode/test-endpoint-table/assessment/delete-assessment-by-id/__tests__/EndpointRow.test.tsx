import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../EndpointRow';

describe('Delete Assessment By Id EndpointRow', () => {
  it('renders correctly', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByText('/api/assessment/:id')).toBeInTheDocument();
  });
}); 