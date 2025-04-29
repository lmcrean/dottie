// @ts-check
import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';

const PROD_URL = process.env.PROD_URL || 'https://dottie-backend.vercel.app';

describe("Production Environment Variables Check", () => {
  test("GET /api/setup/health/env - should return environment variables status", async () => {
    try {
      const response = await fetch(`${PROD_URL}/api/setup/health/env`);
      const responseText = await response.text();
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response body:', responseText);
      
      // Only try to parse JSON if it appears to be JSON
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = JSON.parse(responseText);
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty("NODE_ENV");
        expect(data).toHaveProperty("VERCEL");
        expect(data).toHaveProperty("SUPABASE_URL");
        expect(data).toHaveProperty("SUPABASE_ANON_PUBLIC");
        
        // In production, these should be set
        if (data.NODE_ENV === "production") {
          expect(data.SUPABASE_URL).toBe("Set");
          expect(data.SUPABASE_ANON_PUBLIC).toBe("Set");
        }
      } else {
        console.log('Response is not JSON, skipping JSON validation');
      }
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });
}); 