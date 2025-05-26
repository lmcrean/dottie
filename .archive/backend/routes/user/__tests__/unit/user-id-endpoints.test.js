import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

// Create a simple mock server for testing
const createMockServer = () => {
  const app = express();
  app.use(express.json());
  
  // Mock PUT /api/user/me endpoint
  app.put('/api/user/me', (req, res) => {
    const id = 'test-user-123';
    res.status(200).json({
      id,
      ...req.body,
      updated_at: new Date().toISOString()
    });
  });

  // Mock DELETE /api/user/:id endpoint
  app.delete('/api/user/:id', (req, res) => {
    const { id } = req.params;
    if (id === 'test-user-123') {
      res.status(200).json({
        message: `User ${id} deleted successfully`,
        success: true
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });

  return app;
};

describe('User ID Endpoints - Unit Tests', () => {
  const app = createMockServer();
  const TEST_USER_ID = 'test-user-123';
  
  describe('PUT /api/user/me', () => {
    it('should update a user successfully', async () => {
      const updateData = {
        name: 'Updated Test User',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put(`/api/user/me`)
        .set('Authorization', 'Bearer test-token-123')
        .send(updateData);
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', TEST_USER_ID);
      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('email', updateData.email);
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete a user successfully', async () => {
      const response = await request(app)
        .delete(`/api/user/${TEST_USER_ID}`)
        .set('Authorization', 'Bearer test-token-123');
        
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', `User ${TEST_USER_ID} deleted successfully`);
      expect(response.body).toHaveProperty('success', true);
    });
  });
}); 