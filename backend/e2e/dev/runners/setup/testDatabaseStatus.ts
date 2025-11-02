/**
 * Test Database Status Endpoint Utility for Development Testing
 * Tests the database connection status check
 */

/**
 * Test the database status endpoint
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @returns {Promise<Object>} Response data
 */
export async function testDatabaseStatus(request, expect) {
  console.log('⚡ Testing database status endpoint...');
  
  try {
    const response = await request.get("/api/setup/database/status");
    
    // For dev environment, expect successful response (stricter requirements)
    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    
    // Verify response structure
    expect(responseData).toHaveProperty('status');
    
    // For dev environment, expect connected status
    expect(responseData.status).toBe('connected');
    
    console.log('✅ Database status endpoint working correctly');
    console.log(`   Status: ${responseData.status}`);
    
    return responseData;
    
  } catch (error) {
    console.error('❌ Database status endpoint test failed:', error.message);
    throw error;
  }
} 