/**
 * Test Database Hello Endpoint Utility for Development Testing
 * Tests the database connection with hello message
 */

import { getExpectedDbType } from '../utils/environment-config.js';

/**
 * Test the database hello endpoint
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @returns {Promise<Object>} Response data
 */
export async function testDatabaseHello(request, expect) {
  console.log('🗄️ Testing database hello endpoint...');
  
  try {
    const response = await request.get("/api/setup/database/hello");
    
    // Expect successful response
    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    
    // Verify response structure
    expect(responseData).toHaveProperty('message');
    expect(responseData).toHaveProperty('dbType');
    expect(responseData).toHaveProperty('isConnected');
    
    // Verify database connection status
    expect(responseData.isConnected).toBe(true);
    
    // Get expected database type for current environment
    const expectedDbType = getExpectedDbType();
    
    // Verify database type (environment-specific)
    expect(responseData.dbType).toBe(expectedDbType);
    
    // Verify message format (should include database type)
    expect(responseData.message).toContain('Hello World from');
    
    console.log('✅ Database hello endpoint working correctly');
    console.log(`   Database Type: ${responseData.dbType}`);
    console.log(`   Connection Status: ${responseData.isConnected}`);
    
    return responseData;
    
  } catch (error) {
    console.error('❌ Database hello endpoint test failed:', error.message);
    throw error;
  }
} 