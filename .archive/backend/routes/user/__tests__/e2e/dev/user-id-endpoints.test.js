import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
const TEST_USER_ID = 'test-user-123';
const TEST_TOKEN = 'Bearer test-token-123';

describe('User ID endpoints', () => {
  // Skip tests if API is not available
  beforeAll(async () => {
    try {
      await fetch(`${API_URL}/setup/health/hello`);
    } catch (error) {
      console.error('API server is not running. Skipping e2e tests.');
      // Skip all tests in this file
      process.env.SKIP_TESTS = 'true';
    }
  });

  // Only run tests if API is available
  const shouldSkipTests = () => process.env.SKIP_TESTS === 'true';

  describe('PUT /api/user/me', () => {
    it('should update a user successfully', async () => {
      if (shouldSkipTests()) return;

      const updateData = {
        name: 'Updated Test User',
        email: 'updated@example.com'
      };

      const response = await fetch(`${API_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': TEST_TOKEN
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('id', TEST_USER_ID);
      expect(data).toHaveProperty('name', updateData.name);
      expect(data).toHaveProperty('email', updateData.email);
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should delete a user successfully', async () => {
      if (shouldSkipTests()) return;

      const response = await fetch(`${API_URL}/user/${TEST_USER_ID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': TEST_TOKEN
        }
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('message', `User ${TEST_USER_ID} deleted successfully`);
      expect(data).toHaveProperty('success', true);
    });
  });
}); 