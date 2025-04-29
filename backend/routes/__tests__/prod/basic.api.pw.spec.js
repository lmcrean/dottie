// @ts-check
import { test, expect } from '@playwright/test';

// Target production backend
const baseUrl = 'http://dottie-backend.vercel.app';

test.describe('Basic API Endpoints Tests', () => {
  // Test root endpoint if it exists
  test('should access root endpoint', async ({ request }) => {
    const response = await request.get(`${baseUrl}/api`);
    
    expect(response.status()).toBe(200);
  });
  
  // Add any other basic API endpoints that should be tested
  // but are not part of other specific categories
}); 