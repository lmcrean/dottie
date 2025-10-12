import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UITestPageSwitch from '../UITestPageSwitch';

describe('UITestPageSwitch', () => {
  // Tests for removed functionality (Test Page/Back to UI links) have been removed
  // since that functionality is now commented out in the component

  it('renders without crashing on landing page', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('renders without crashing on test page', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/test-page']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });

  it('shows Quick Complete button on age verification page', () => {
    render(
      <MemoryRouter initialEntries={['/assessment/age-verification']}>
        <UITestPageSwitch />
      </MemoryRouter>
    );
    // QuickCompleteButton uses "Quick Complete" text but it's hidden on small screens (sm:inline)
    // Check for the button by its role instead
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gray-800/90');
  });
}); 