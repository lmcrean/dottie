import React from 'react';
import { render, screen } from '@testing-library/react';
import EndpointRow from '../EndpointRow';

describe('Delete Assessment By Id EndpointRow', () => {
  it('renders correctly', () => {
    render(
      <table>
        <tbody>
          <EndpointRow />
        </tbody>
      </table>
    );
    
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByText('/api/assessment/:userId/:id')).toBeInTheDocument();
  });
}); 