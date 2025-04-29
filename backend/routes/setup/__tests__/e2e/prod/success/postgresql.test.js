// @ts-check
import { describe, test, expect, beforeAll } from 'vitest';
import supertest from 'supertest';
import { URLS } from '../../../../../../test-utilities/urls.js';

// Use the production URL directly
const API_URL = 'https://dottie-backend.vercel.app';

// Create a supertest instance
const request = supertest(API_URL);

beforeAll(() => {
  console.log(`Testing against production API: ${API_URL}`);
});

describe("Production API Endpoints Tests", () => {
  // Test the hello endpoint
  test("GET /api/setup/health/hello - should return Hello World message", async () => {
    const response = await request.get("/api/setup/health/hello");
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Hello World from Dottie API!");
    console.log("✅ Hello endpoint test passed:", response.body);
  });
  
  // Test the health check endpoint
  test("GET /api/health - should return OK", async () => {
    const response = await request.get("/api/health");
    console.log("Health check response:", response.status, response.body);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
  });
  
  // Inspect database status endpoint for routing issues
  test("GET /api/setup/database/status - investigate routing issues", async () => {
    try {
      const response = await request.get("/api/setup/database/status");
      console.log("Response status:", response.status);
      console.log("Response body:", response.body);
      
      // Try to extract any error details
      if (response.status === 404) {
        console.log("Route not found. This could indicate:");
        console.log("1. The endpoint is not defined in production");
        console.log("2. The route might be disabled in the Vercel deployment");
        console.log("3. There might be a routing configuration difference");
      }
    } catch (error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          body: error.response.body,
        } : 'No response'
      });
    }
    
    // Check deployed environment variables (safely)
    try {
      const envResponse = await request.get("/api/setup/health/env");
      console.log("Environment info:", envResponse.status, 
        envResponse.body ? {
          nodeEnv: envResponse.body.NODE_ENV,
          hasSupabaseUrl: !!envResponse.body.SUPABASE_URL,
          hasSupabaseKey: !!envResponse.body.SUPABASE_ANON_PUBLIC,
          isVercel: envResponse.body.VERCEL
        } : 'No data');
    } catch (error) {
      console.log("Environment check error:", error.message);
    }
  });

  // Test alternative API paths
  test("Explore alternative API paths", async () => {
    // Check if /api/supabase or similar paths exist
    const pathsToTry = [
      "/api/supabase/status",
      "/api/db/status",
      "/api/v1/setup/database/status"
    ];
    
    for (const path of pathsToTry) {
      try {
        const response = await request.get(path);
        console.log(`Path ${path} status:`, response.status);
        if (response.status === 200) {
          console.log(`Found working path: ${path}`, response.body);
        }
      } catch (error) {
        // Just log the status
        console.log(`Path ${path} error:`, error.response?.status || error.message);
      }
    }
  });
}); 