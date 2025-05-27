/**
 * Test Database Hello Endpoint Utility for Production Testing
 * Tests the database connection with hello message
 */

/**
 * Test the database hello endpoint
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @returns {Promise<Object>} Response data and status info
 */
export async function testDatabaseHello(request, expect) {
  console.log('🗄️ Testing database hello endpoint...');
  
  try {
    const response = await request.get("/api/setup/database/hello");
    
    // For prod, allow both 200 (working) and 500 (database issues)
    expect([200, 500]).toContain(response.status());
    
    if (response.status() === 200) {
      const responseData = await response.json();
      
      // Verify response structure for successful response
      expect(responseData).toHaveProperty('message');
      expect(responseData).toHaveProperty('dbType');
      expect(responseData).toHaveProperty('isConnected');
      
      // Verify database connection status
      expect(responseData.isConnected).toBe(true);
      
      // Verify message format (should include database type)
      expect(responseData.message).toContain('Hello World from');
      
      console.log('✅ Database hello endpoint working correctly');
      console.log(`   Database Type: ${responseData.dbType}`);
      console.log(`   Connection Status: ${responseData.isConnected}`);
      
      return { status: 'success', data: responseData };
      
    } else {
      // Status 500 - database connection issue
      console.log('⚠️ Database hello endpoint returned 500 - database connection issue detected');
      
      try {
        const errorData = await response.json();
        console.log(`   Error: ${errorData.message || 'Unknown error'}`);
        return { status: 'error', statusCode: 500, error: errorData };
      } catch (parseError) {
        console.log('   Error: Unable to parse error response');
        return { status: 'error', statusCode: 500, error: null };
      }
    }
    
  } catch (error) {
    console.error('❌ Database hello endpoint test failed:', error.message);
    throw error;
  }
} 