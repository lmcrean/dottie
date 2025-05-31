import fetch from 'node-fetch';

const API_BASE = 'https://dottie-backend.vercel.app';

// Test Health Endpoint
async function testHealth() {
  console.log('\n🏥 Testing Health Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    console.log(`Status: ${response.status}`);
    
    // Try to parse as JSON first
    let data;
    const contentType = response.headers.get('content-type');
    console.log(`Content-Type: ${contentType}`);
    
    const text = await response.text();
    console.log(`First 200 chars of response: ${text.substring(0, 200)}...`);
    
    try {
      data = JSON.parse(text);
      console.log(`✅ Status: ${response.status}`);
      console.log(`📋 Response:`, data);
      return { success: true, status: response.status, data };
    } catch (parseError) {
      console.log(`❌ JSON Parse Error: ${parseError.message}`);
      return { success: false, error: `Invalid JSON response: ${text.substring(0, 100)}` };
    }
  } catch (error) {
    console.log(`❌ Network Error:`, error.message);
    return { success: false, error: error.message };
  }
}

// Test User Registration (simplified for debugging)
async function testUserSignup() {
  console.log('\n👤 Testing User Signup...');
  const testUser = {
    username: `test_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };
  
  try {
    const response = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });
    
    console.log(`Status: ${response.status}`);
    const contentType = response.headers.get('content-type');
    console.log(`Content-Type: ${contentType}`);
    
    const text = await response.text();
    console.log(`First 200 chars of response: ${text.substring(0, 200)}...`);
    
    try {
      const data = JSON.parse(text);
      console.log(`✅ Status: ${response.status}`);
      console.log(`📋 Response:`, data);
      return { success: true, status: response.status, data, user: testUser };
    } catch (parseError) {
      console.log(`❌ JSON Parse Error: ${parseError.message}`);
      return { success: false, error: `Invalid JSON response: ${text.substring(0, 100)}` };
    }
  } catch (error) {
    console.log(`❌ Network Error:`, error.message);
    return { success: false, error: error.message };
  }
}

// Test User Login
async function testUserLogin(credentials) {
  console.log('\n🔐 Testing User Login...');
  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });
    
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`📋 Response:`, data);
    return { success: true, status: response.status, data };
  } catch (error) {
    console.log(`❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

// Test Assessment List (requires auth)
async function testAssessmentList(token) {
  console.log('\n📊 Testing Assessment List...');
  try {
    const response = await fetch(`${API_BASE}/api/assessment/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`📋 Response:`, data);
    return { success: true, status: response.status, data };
  } catch (error) {
    console.log(`❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Production API Tests');
  console.log(`🌐 API Base URL: ${API_BASE}`);
  
  // Test 1: Health Check
  const healthResult = await testHealth();
  
  // Test 2: User Registration
  const signupResult = await testUserSignup();
  
  // Test 3: User Login (if signup successful)
  let loginResult = null;
  let token = null;
  if (signupResult.success && signupResult.status === 201) {
    loginResult = await testUserLogin(signupResult.user);
    if (loginResult.success && loginResult.data.token) {
      token = loginResult.data.token;
    }
  }
  
  // Test 4: Assessment List (if login successful)
  let assessmentResult = null;
  if (token) {
    assessmentResult = await testAssessmentList(token);
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`Health: ${healthResult.success ? '✅' : '❌'}`);
  console.log(`Signup: ${signupResult.success ? '✅' : '❌'}`);
  console.log(`Login: ${loginResult?.success ? '✅' : '❌'}`);
  console.log(`Assessment: ${assessmentResult?.success ? '✅' : '❌'}`);
  
  const allPassed = healthResult.success && signupResult.success && 
                   (loginResult?.success || false) && 
                   (assessmentResult?.success || false);
  
  console.log(`\n🎯 Overall: ${allPassed ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}`);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 