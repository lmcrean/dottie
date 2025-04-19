// Simple script to test CORS preflight requests
import fetch from 'node-fetch';
import { URLS } from './test-utilities/urls.js';

// Production endpoints
const PROD_URL = URLS.PROD;
const FRONTEND_URL = URLS.PROD_FRONTEND;

// Test OPTIONS preflight request
async function testOptionsRequest(endpoint) {
  try {
    console.log(`\n=== Testing OPTIONS request to ${endpoint} ===`);
    
    const response = await fetch(`${PROD_URL}${endpoint}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    // Check for CORS headers
    const allowOrigin = response.headers.get('access-control-allow-origin');
    const allowMethods = response.headers.get('access-control-allow-methods');
    const allowHeaders = response.headers.get('access-control-allow-headers');
    const allowCredentials = response.headers.get('access-control-allow-credentials');
    
    console.log('\nCORS Headers:');
    console.log('- Allow Origin:', allowOrigin);
    console.log('- Allow Methods:', allowMethods);
    console.log('- Allow Headers:', allowHeaders);
    console.log('- Allow Credentials:', allowCredentials);
    
    if (response.status === 204 || response.status === 200) {
      console.log(`\n✅ OPTIONS request to ${endpoint} PASSED`);
      return true;
    } else {
      // For non-2xx responses, show more detailed error info
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Unable to read response body';
      }
      
      console.log('\nResponse body:', errorText);
      console.log(`\n❌ OPTIONS request to ${endpoint} FAILED`);
      return false;
    }
  } catch (error) {
    console.error(`\nError testing OPTIONS request to ${endpoint}:`, error);
    console.log(`\n❌ OPTIONS request to ${endpoint} FAILED with error`);
    return false;
  }
}

// Run tests for all critical endpoints
async function runTests() {
  console.log('====== TESTING CORS PREFLIGHT REQUESTS ======');
  console.log('Backend URL:', PROD_URL);
  console.log('Frontend URL:', FRONTEND_URL);
  
  // Test authentication endpoints
  await testOptionsRequest('/auth/signup');
  await testOptionsRequest('/auth/login');
  await testOptionsRequest('/auth/refresh');
  await testOptionsRequest('/auth/verify');
  await testOptionsRequest('/auth/logout');
  
  // Test user endpoints
  await testOptionsRequest('/user/me');
  
  // Test assessment endpoints
  await testOptionsRequest('/assessment/list');
  await testOptionsRequest('/assessment/send');
  
  console.log('\n====== TESTS COMPLETED ======');
}

runTests().catch(console.error); 