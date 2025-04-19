// Simple script to test production endpoints directly
import fetch from 'node-fetch';

// Production endpoint
const PROD_URL = 'https://dottie-backend-lmcreans-projects.vercel.app/api';

// Test signup
async function testSignup() {
  try {
    // Generate unique test data
    const timestamp = Date.now();
    const userData = {
      username: `testuser_${timestamp}`,
      email: `test_${timestamp}@example.com`,
      password: "Password123!",
      age: "18_24"
    };

    console.log('Testing signup with:', userData);

    // Send request
    const response = await fetch(`${PROD_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://dottie-lmcreans-projects.vercel.app'
      },
      body: JSON.stringify(userData)
    });

    // Log status
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Check content type before parsing JSON
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
      console.log('Response:', result);
    } else {
      // Handle non-JSON response
      result = await response.text();
      console.log('Non-JSON Response:', result.substring(0, 200) + '...');
    }
    
    if (response.status === 201) {
      console.log('✅ Signup test PASSED');
      return result;
    } else {
      console.log('❌ Signup test FAILED');
      return null;
    }
  } catch (error) {
    console.error('Error testing signup:', error);
    console.log('❌ Signup test FAILED with error');
    return null;
  }
}

// Test login
async function testLogin(email, password) {
  try {
    console.log(`Testing login with email: ${email}`);
    
    const response = await fetch(`${PROD_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://dottie-lmcreans-projects.vercel.app'
      },
      body: JSON.stringify({ email, password })
    });

    // Log status
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Check content type before parsing JSON
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
      console.log('Response contains token:', !!result.token);
    } else {
      // Handle non-JSON response
      result = await response.text();
      console.log('Non-JSON Response:', result.substring(0, 200) + '...');
      return null;
    }
    
    if (response.status === 200 && result.token) {
      console.log('✅ Login test PASSED');
      return result.token;
    } else {
      console.log('❌ Login test FAILED');
      return null;
    }
  } catch (error) {
    console.error('Error testing login:', error);
    console.log('❌ Login test FAILED with error');
    return null;
  }
}

// Test user details
async function testGetUserDetails(token) {
  try {
    console.log('Testing get user details with token');
    
    const response = await fetch(`${PROD_URL}/user/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://dottie-lmcreans-projects.vercel.app'
      }
    });

    // Log status
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Check content type before parsing JSON
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
      console.log('Response:', result);
    } else {
      // Handle non-JSON response
      result = await response.text();
      console.log('Non-JSON Response:', result.substring(0, 200) + '...');
    }
    
    if (response.status === 200) {
      console.log('✅ Get user details test PASSED');
      return true;
    } else {
      console.log('❌ Get user details test FAILED');
      return false;
    }
  } catch (error) {
    console.error('Error testing user details:', error);
    console.log('❌ Get user details test FAILED with error');
    return false;
  }
}

// Test OPTIONS preflight request specifically
async function testOptionsRequest(endpoint) {
  try {
    console.log(`Testing OPTIONS request to ${endpoint}`);
    
    const response = await fetch(`${PROD_URL}${endpoint}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://dottie-lmcreans-projects.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    // Check for CORS headers
    const allowOrigin = response.headers.get('access-control-allow-origin');
    const allowMethods = response.headers.get('access-control-allow-methods');
    const allowHeaders = response.headers.get('access-control-allow-headers');
    
    console.log('CORS Headers:');
    console.log('- Allow Origin:', allowOrigin);
    console.log('- Allow Methods:', allowMethods);
    console.log('- Allow Headers:', allowHeaders);
    
    if (response.status === 204 || response.status === 200) {
      console.log(`✅ OPTIONS request to ${endpoint} PASSED`);
      return true;
    } else {
      console.log(`❌ OPTIONS request to ${endpoint} FAILED`);
      return false;
    }
  } catch (error) {
    console.error(`Error testing OPTIONS request to ${endpoint}:`, error);
    console.log(`❌ OPTIONS request to ${endpoint} FAILED with error`);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('====== TESTING PRODUCTION ENDPOINTS ======');
  
  // Test OPTIONS requests first
  await testOptionsRequest('/auth/signup');
  await testOptionsRequest('/user/me');
  
  // Test signup
  const user = await testSignup();
  if (!user) return;
  
  // Test login with created user
  const token = await testLogin(user.email, 'Password123!');
  if (!token) return;
  
  // Test getting user details
  await testGetUserDetails(token);
  
  console.log('====== TESTS COMPLETED ======');
}

runTests().catch(console.error); 