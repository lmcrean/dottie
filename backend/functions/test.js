/**
 * Simple test script to test Azure Functions locally
 * 
 * Usage: node test.js
 */

const http = require('http');

// Collection of test cases
const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/api/health',
    headers: {},
    body: null,
    expected: 200
  },
  {
    name: 'Signup - Valid User',
    method: 'POST',
    path: '/api/auth/signup',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      username: `test_user_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'Password123!'
    },
    expected: 201
  },
  {
    name: 'Login - Valid Credentials',
    method: 'POST',
    path: '/api/auth/login',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      email: 'test_login@example.com',
      password: 'Password123!'
    },
    expected: 200,
    storeTokens: true
  },
  {
    name: 'Verify Token - Valid Token',
    method: 'GET',
    path: '/api/auth/verify',
    headers: {
      'Authorization': 'Bearer {token}'
    },
    body: null,
    expected: 200,
    useStoredToken: true
  },
  {
    name: 'Token Refresh - Valid Token',
    method: 'POST',
    path: '/api/auth/refresh',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      refreshToken: '{refreshToken}'
    },
    expected: 200,
    useStoredRefreshToken: true,
    storeTokens: true
  },
  {
    name: 'Logout - Valid Token',
    method: 'POST',
    path: '/api/auth/logout',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer {token}'
    },
    body: {
      refreshToken: '{refreshToken}'
    },
    expected: 200,
    useStoredToken: true,
    useStoredRefreshToken: true
  }
];

// Store tokens from login responses
const storage = {
  token: null,
  refreshToken: null
};

/**
 * Run a single test
 * @param {Object} test - Test case
 * @returns {Promise<boolean>} - Success/failure
 */
function runTest(test) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Running test: ${test.name}`);
    
    // Prepare request headers
    const headers = { ...test.headers };
    
    // Inject tokens if needed
    if (test.useStoredToken && headers.Authorization) {
      headers.Authorization = headers.Authorization.replace('{token}', storage.token || '');
    }
    
    // Prepare request body
    let body = test.body;
    if (body) {
      if (test.useStoredRefreshToken && body.refreshToken) {
        body.refreshToken = storage.refreshToken || '';
      }
      body = JSON.stringify(body);
    }
    
    // Create request options
    const options = {
      hostname: 'localhost',
      port: 7071,
      path: test.path,
      method: test.method,
      headers
    };
    
    const req = http.request(options, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        const statusCode = res.statusCode;
        
        console.log(`Status: ${statusCode}`);
        
        if (body) {
          try {
            const parsedBody = JSON.parse(body);
            console.log('Response:', JSON.stringify(parsedBody, null, 2));
            
            // Store tokens if needed
            if (test.storeTokens && parsedBody.token) {
              storage.token = parsedBody.token;
              console.log('✅ Token stored');
            }
            
            if (test.storeTokens && parsedBody.refreshToken) {
              storage.refreshToken = parsedBody.refreshToken;
              console.log('✅ Refresh token stored');
            }
          } catch (e) {
            console.log('Response:', body);
          }
        }
        
        const success = statusCode === test.expected;
        console.log(success ? '✅ PASSED' : '❌ FAILED');
        
        resolve(success);
      });
    });
    
    req.on('error', (error) => {
      console.error('Error:', error.message);
      console.log('❌ FAILED');
      resolve(false);
    });
    
    if (body) {
      req.write(body);
    }
    
    req.end();
  });
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting test run...');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const success = await runTest(test);
    success ? passed++ : failed++;
  }
  
  console.log(`\n🏁 Test run complete: ${passed} passed, ${failed} failed`);
}

// Run the tests
runTests(); 