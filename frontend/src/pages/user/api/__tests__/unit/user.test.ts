import { vi, describe, it, expect, beforeEach } from 'vitest';
import { userApi } from '../..';
import { apiClient } from '../../../../../api/core/apiClient';

// Correctly mock the API client - both default and named export
vi.mock('../../../core/apiClient', () => {
  const mockClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: mockClient,
    apiClient: mockClient
  };
});

// Mock the resetPassword method if it's missing from the userApi -> ! Removed to test the actual function!
// if (!userApi.resetPassword) {
//   userApi.resetPassword = async (data: { email: string }) => {
//     const response = await apiClient.post('/api/user/pw/reset', data);
//     return response.data;
//   };
// }

describe('User API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch the current user profile', async () => {
      const mockData = { id: '1', name: 'Test User', email: 'test@example.com' };
      (apiClient.get as any).mockResolvedValueOnce({ data: mockData });
      
      const result = await userApi.current();
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/user/me');
      expect(result).toEqual(mockData);
    });
  });

  describe('updateUser', () => {
    it('should update a user profile', async () => {
      const mockId = '1';
      const mockInput = { name: 'Updated Name' };
      const mockResponse = { id: mockId, name: 'Updated Name', email: 'test@example.com' };
      (apiClient.put as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await userApi.update(mockId, mockInput);
      
      expect(apiClient.put).toHaveBeenCalledWith(`/api/user/${mockId}`, mockInput);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockId = '1';
      (apiClient.delete as any).mockResolvedValueOnce({});
      
      await userApi.delete(mockId);
      
      expect(apiClient.delete).toHaveBeenCalledWith(`/api/user/${mockId}`);
    });
  });

  describe('resetPassword', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
  
    it('should request a password reset', async () => {
      const mockInput = { email: 'test@example.com' };
      const mockResponse = { message: 'If a user with that email exists, a password reset link has been sent' };
  
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
  
      const result = await userApi.passwordReset.request(mockInput);
  
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/password/reset', mockInput);
      expect(result).toEqual(mockResponse);
    });
  
    it('should handle failure when requesting a password reset', async () => {
      const mockInput = { email: 'test@example.com' };
      const mockError = new Error('Failed to process password reset request');
  
      (apiClient.post as any).mockRejectedValueOnce(mockError);
  
      await expect(userApi.passwordReset.request(mockInput)).rejects.toThrow('Failed to process password reset request');
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/password/reset', mockInput);
    });
  
    it('should complete a password reset', async () => {
      const mockInput = { token: 'abc123', newPassword: 'newpassword123', confirmPassword:'newpassword123' };
      const mockResponse = { message: 'Password has been reset successfully' };
  
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
  
      const result = await userApi.passwordReset.complete(mockInput);
  
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/password/reset/complete', mockInput);
      expect(result).toEqual(mockResponse);
    });
  
    it('should handle failure when completing a password reset', async () => {
      const mockInput = { token: 'abc123', newPassword: 'newpassword123', confirmPassword:'newpassword123' };
      const mockError = new Error('Invalid or expired reset token');
  
      (apiClient.post as any).mockRejectedValueOnce(mockError);
  
      await expect(userApi.passwordReset.complete(mockInput)).rejects.toThrow('Invalid or expired reset token');
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/password/reset/complete', mockInput);
    });
  });
  
  


  describe('updatePassword', () => {
    it('should update the user password', async () => {
      const mockInput = { currentPassword: 'old', newPassword: 'new' };
      const mockResponse = { 
        message: 'Password updated successfully',
        updated_at: expect.any(String)
      };
  
      (apiClient.post as any).mockResolvedValueOnce({ data: mockResponse });
      
      const result = await userApi.updatePassword(mockInput);
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/pw/update', mockInput);
      expect(result).toEqual(mockResponse);
    });
  
    it('should handle incorrect current password', async () => {
      const mockInput = { currentPassword: 'wrong', newPassword: 'new' };
      const mockError = new Error('Current password is incorrect');
  
      (apiClient.post as any).mockRejectedValueOnce(mockError);
  
      await expect(userApi.updatePassword(mockInput))
        .rejects.toThrow('Current password is incorrect');
      expect(apiClient.post).toHaveBeenCalledWith('/api/user/pw/update', mockInput);
    });
  });
}); 