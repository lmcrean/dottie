import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'sonner';
import { UpdateEmailButton } from '../UpdateEmailButton';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { updateEmail } from '../api';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn()
  }
}));

vi.mock('@/src/pages/auth/context/useAuthContext');
vi.mock('../api');

const mockUseAuth = vi.mocked(useAuth);
const mockUpdateEmail = vi.mocked(updateEmail);

describe('UpdateEmailButton', () => {
  const mockRefreshUser = vi.fn();
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      refreshUser: mockRefreshUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updatePassword: vi.fn(),
      clearError: vi.fn()
    });
  });

  it('should call refreshUser after successful email update', async () => {
    mockUpdateEmail.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john.new@example.com'
    });

    render(<UpdateEmailButton />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /update email/i });

    // Change the email
    fireEvent.change(input, { target: { value: 'john.new@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateEmail).toHaveBeenCalledWith('john.new@example.com');
      expect(mockRefreshUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Email updated successfully');
    });
  });

  it('should not call refreshUser if update fails', async () => {
    mockUpdateEmail.mockRejectedValue(new Error('Update failed'));

    render(<UpdateEmailButton />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /update email/i });

    // Change the email
    fireEvent.change(input, { target: { value: 'john.new@example.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateEmail).toHaveBeenCalledWith('john.new@example.com');
      expect(mockRefreshUser).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Failed to update email');
    });
  });

  it('should validate email format', async () => {
    render(<UpdateEmailButton />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /update email/i });

    // Enter invalid email
    fireEvent.change(input, { target: { value: 'invalid-email' } });
    
    // Button should be disabled for invalid email
    expect(button).toBeDisabled();
    
    // Should show validation message
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  it('should not allow update with same email', async () => {
    render(<UpdateEmailButton />);

    const button = screen.getByRole('button', { name: /update email/i });

    // Button should be disabled when email hasn't changed
    expect(button).toBeDisabled();

    // Click button (should not trigger update)
    fireEvent.click(button);

    expect(mockUpdateEmail).not.toHaveBeenCalled();
  });
}); 