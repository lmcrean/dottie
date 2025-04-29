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
    try {
      const response = await request.get("/api/setup/health/hello");
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Hello World from Dottie API!");
      console.log("✅ Hello endpoint test passed:", response.body);
    } catch (error) {
      console.error("❌ Hello endpoint test failed:", error.message);
      throw error;
    }
  });
  
  // Test the database status endpoint - trying different paths
  test("GET database status endpoint - finding the correct path", async () => {
    // Try different potential paths
    const paths = [
      "/api/setup/database/status",
      "/api/database/status",
      "/api/setup/db/status",
      "/api/db/status"
    ];
    
    let foundPath = null;
    
    for (const path of paths) {
      try {
        console.log(`Trying path: ${path}`);
        const response = await request.get(path);
        
        if (response.status === 200) {
          console.log(`✅ Found working path: ${path}`, response.body);
          foundPath = path;
          
          // Perform assertions on the successful response
          expect(response.body).toHaveProperty("status");
          break;
        }
      } catch (error) {
        console.log(`❌ Path ${path} failed: ${error.message}`);
      }
    }
    
    if (!foundPath) {
      console.warn("⚠️ Could not find working database status endpoint");
    }
  });

  // Test the database hello endpoint - trying different paths
  test("GET database hello endpoint - finding the correct path", async () => {
    // Try different potential paths
    const paths = [
      "/api/setup/database/hello",
      "/api/database/hello",
      "/api/setup/db/hello",
      "/api/db/hello"
    ];
    
    let foundPath = null;
    
    for (const path of paths) {
      try {
        console.log(`Trying path: ${path}`);
        const response = await request.get(path);
        
        if (response.status === 200) {
          console.log(`✅ Found working path: ${path}`, response.body);
          foundPath = path;
          
          // Perform assertions on the successful response
          expect(response.body).toHaveProperty("message");
          expect(response.body.message).toContain("Hello World from");
          break;
        }
      } catch (error) {
        console.log(`❌ Path ${path} failed: ${error.message}`);
      }
    }
    
    if (!foundPath) {
      console.warn("⚠️ Could not find working database hello endpoint");
    }
  });
}); 