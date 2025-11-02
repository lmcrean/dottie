/**
 * Test Health Hello Endpoint Utility for Development Testing
 * Tests the basic API health check endpoint
 */

/**
 * Test the health hello endpoint
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @returns {Promise<Object>} Response data
 */
export async function testHealthHello(request, expect) {
  console.log('🏥 Testing health hello endpoint...');
  
  try {
    const response = await request.get("/api/setup/health/hello");
    
    // Expect successful response
    expect(response.status()).toBe(200);
    
    const responseData = await response.json();
    
    // Verify response structure and content
    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toBe('Hello World from Dottie API!');
    
    console.log('✅ Health hello endpoint working correctly');
    return responseData;
    
  } catch (error) {
    console.error('❌ Health hello endpoint test failed:', error.message);
    throw error;
  }
} 