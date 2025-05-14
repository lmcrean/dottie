import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AssessmentEndpoints from '../../AssessmentEndpoints';

describe('AssessmentEndpoints', () => {
  it('renders the assessment endpoints table with correct title', () => {
    render(<AssessmentEndpoints />);
    expect(screen.getByText('Assessment Endpoints')).toBeInTheDocument();
  });

  it('renders the POST /api/assessment/send endpoint correctly', () => {
    render(<AssessmentEndpoints />);
    
    // Find by button with correct test-id
    const button = screen.getByTestId('test-post -api-assessment-send-button');
    expect(button).toBeInTheDocument();
    
    // Check that the button contains the correct text
    expect(button).toHaveTextContent('POST');
    expect(button).toHaveTextContent('/api/assessment/send');
    
    // Check that it shows it requires authentication
    const authText = button.parentElement?.querySelector('.text-yellow-400');
    expect(authText).toHaveTextContent('Requires authentication');
  });

  it('renders the GET /api/assessment/list endpoint correctly', () => {
    render(<AssessmentEndpoints />);
    
    const button = screen.getByTestId('test-get -api-assessment-list-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('GET');
    expect(button).toHaveTextContent('/api/assessment/list');
    
    const authText = button.parentElement?.querySelector('.text-yellow-400');
    expect(authText).toHaveTextContent('Requires authentication');
  });

  it('renders the GET /api/assessment/:id endpoint correctly', () => {
    render(<AssessmentEndpoints />);
    
    const button = screen.getByTestId('test-get -api-assessment-:id-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('GET');
    expect(button).toHaveTextContent('/api/assessment/:id');
    
    const authText = button.parentElement?.querySelector('.text-yellow-400');
    expect(authText).toHaveTextContent('Requires authentication');
  });

  it('renders the DELETE /api/assessment/:id endpoint correctly', () => {
    render(<AssessmentEndpoints />);
    
    const button = screen.getByTestId('test-delete -api-assessment-:userid-:id-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('DELETE');
    expect(button).toHaveTextContent('/api/assessment/:userId/:id');
    
    const authText = button.parentElement?.querySelector('.text-yellow-400');
    expect(authText).toHaveTextContent('Requires authentication');
  });
}); 