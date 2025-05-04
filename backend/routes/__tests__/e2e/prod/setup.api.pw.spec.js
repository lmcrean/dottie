// @ts-check
import { test, expect } from '@playwright/test';

// Target production backend
const baseUrl = 'http://dottie-backend.vercel.app';

test.describe('Setup Endpoints Tests', () => {
  test('should check API health', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/setup/health/hello`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Hello World from Dottie API!');
  });

  test('should check database connection status', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/setup/database/status`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('connected');
  });

  test('should test database hello endpoint', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/setup/database/hello`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.message).toContain('Hello World from');
    expect(data.isConnected).toBe(true);
  });
}); 