import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackButton } from '../BackButton';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const mockNavigate = vi.fn();

describe('BackButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('navigates to the specified destination when clicked', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <BackButton destination="/test-destination" />
      </MemoryRouter>
    );
    
    // Find the button and click it
    const button = screen.getByTestId('back-button');
    fireEvent.click(button);
    
    // Assert
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/test-destination');
  });
  
  it('renders with custom text when provided', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <BackButton destination="/test" text="Go Back" />
      </MemoryRouter>
    );
    
    // Assert
    const button = screen.getByTestId('back-button');
    expect(button.textContent).toContain('Go Back');
  });
  
  it('renders with "Back" text by default', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <BackButton destination="/test" />
      </MemoryRouter>
    );
    
    // Assert
    const button = screen.getByTestId('back-button');
    expect(button.textContent).toContain('Back');
  });
  
  it('can have a custom data-testid', () => {
    // Arrange & Act
    render(
      <MemoryRouter>
        <BackButton destination="/test" dataTestId="custom-back-button" />
      </MemoryRouter>
    );
    
    // Assert
    expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
    const button = screen.getByTestId('custom-back-button');
    expect(button).toBeInTheDocument();
  });
}); 