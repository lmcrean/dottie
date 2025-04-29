// @ts-check
import { test, expect } from '@playwright/test';

// Target production backend
const baseUrl = 'http://dottie-backend.vercel.app';

test.describe('Basic API Endpoints Tests', () => {
  // Test the hello endpoint since the root API endpoint returns 404
  test('should check API health via hello endpoint', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api/setup/health/hello`);
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Hello World from Dottie API!');
  });
}); 