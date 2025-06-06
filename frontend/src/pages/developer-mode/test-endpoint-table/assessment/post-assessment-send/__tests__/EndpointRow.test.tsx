import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../EndpointRow';

describe('Post Assessment Send EndpointRow', () => {
  it('renders correctly', () => {
    render(<EndpointRow />);
    
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/api/assessment/send')).toBeInTheDocument();
  });
}); 