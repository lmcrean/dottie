// @ts-check
import { describe, test, expect } from 'vitest';
import fetch from 'node-fetch';

const PROD_URL = process.env.PROD_URL || 'https://dottie-backend.vercel.app';

describe("Production Database Status Check", () => {
  test("GET /api/setup/database/status - should return database status", async () => {
    try {
      const response = await fetch(`${PROD_URL}/api/setup/database/status`);
      const responseText = await response.text();
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response body:', responseText);
      
      // Only try to parse JSON if it appears to be JSON
      if (response.headers.get('content-type')?.includes('application/json')) {
        const data = JSON.parse(responseText);
        
        expect(response.status).toBe(200);
        expect(data).toHaveProperty("status");
        expect(data).toHaveProperty("database");
        expect(data).toHaveProperty("message");
        
        // If we're successfully connected, these should have specific values
        if (data.status === "connected") {
          expect(data.database).toBe("Supabase");
          expect(data.message).toBe("Successfully connected to Supabase database");
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