import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../EndpointRow';

describe('Get Assessment By Id EndpointRow', () => {
  it('renders correctly', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/assessment/:id')).toBeInTheDocument();
  });
}); 