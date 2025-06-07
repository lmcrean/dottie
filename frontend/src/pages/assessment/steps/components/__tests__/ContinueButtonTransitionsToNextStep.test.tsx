import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContinueButton } from '../ContinueButton';

describe('ContinueButton', () => {
  it('calls onContinue when clicked and enabled', () => {
    // Arrange
    const mockNavigate = vi.fn();
    
    // Act
    render(<ContinueButton isEnabled={true} onContinue={mockNavigate} />);
    
    // Find the button and click it
    const button = screen.getByTestId('continue-button');
    fireEvent.click(button);
    
    // Assert
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should not call onContinue when disabled', () => {
    // Arrange
    const mockNavigate = vi.fn();
    
    // Act
    render(<ContinueButton isEnabled={false} onContinue={mockNavigate} />);
    
    // Find the button and click it
    const button = screen.getByTestId('continue-button');
    fireEvent.click(button);
    
    // Assert
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('renders with custom text when provided', () => {
    // Arrange & Act
    render(<ContinueButton isEnabled={true} onContinue={() => {}} text="Finish Assessment" />);
    
    // Assert
    const button = screen.getByTestId('continue-button');
    expect(button.textContent).toContain('Finish Assessment');
  });

  it('renders with "Continue" text by default', () => {
    // Arrange & Act
    render(<ContinueButton isEnabled={true} onContinue={() => {}} />);
    
    // Assert
    const button = screen.getByTestId('continue-button');
    expect(button.textContent).toContain('Continue');
  });

  it('is disabled when isEnabled is false', () => {
    // Arrange & Act
    render(<ContinueButton isEnabled={false} onContinue={() => {}} />);
    
    // Assert
    const button = screen.getByTestId('continue-button');
    expect(button).toBeDisabled();
  });

  it('is enabled when isEnabled is true', () => {
    // Arrange & Act
    render(<ContinueButton isEnabled={true} onContinue={() => {}} />);
    
    // Assert
    const button = screen.getByTestId('continue-button');
    expect(button).not.toBeDisabled();
  });
});
