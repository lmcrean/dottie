import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'sonner';
import { UpdateUsernameButton } from '../UpdateUsernameButton';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { updateUsername } from '../api';

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
const mockUpdateUsername = vi.mocked(updateUsername);

describe('UpdateUsernameButton', () => {
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

  it('should call refreshUser after successful username update', async () => {
    mockUpdateUsername.mockResolvedValue({
      id: '1',
      name: 'Jane Doe',
      email: 'john@example.com'
    });

    render(<UpdateUsernameButton />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /update name/i });

    // Change the username
    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateUsername).toHaveBeenCalledWith('Jane Doe');
      expect(mockRefreshUser).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Username updated successfully');
    });
  });

  it('should not call refreshUser if update fails', async () => {
    mockUpdateUsername.mockRejectedValue(new Error('Update failed'));

    render(<UpdateUsernameButton />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /update name/i });

    // Change the username
    fireEvent.change(input, { target: { value: 'Jane Doe' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockUpdateUsername).toHaveBeenCalledWith('Jane Doe');
      expect(mockRefreshUser).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith('Failed to update username');
    });
  });
}); 