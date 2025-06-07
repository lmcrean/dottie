import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UITestPageSwitch from '../UITestPageSwitch';

describe('UITestPageSwitch', () => {
  it('shows Test Page link when on landing page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('shows Back to UI link when on test page', () => {
    render(
      <MemoryRouter initialEntries={['/test-page']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    expect(screen.getByText('Back to UI')).toBeInTheDocument();
  });

  it('shows Quick Complete button on age verification page', () => {
    render(
      <MemoryRouter initialEntries={['/assessment/age-verification']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    expect(screen.getByText('Quick Complete')).toBeInTheDocument();
  });

  it('adds quickresponse mode to URL when Quick Complete is clicked', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/assessment/age-verification']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    
    const quickCompleteButton = screen.getByText('Quick Complete');
    fireEvent.click(quickCompleteButton);
    
    // Check if the URL contains the quickresponse mode
    expect(window.location.search).toContain('mode=quickresponse');
  });
}); 