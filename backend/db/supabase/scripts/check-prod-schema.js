import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables - will work with .env and .env.local if present
dotenv.config();

async function checkProdSchema() {
  try {
    // Get the production API URL from the test config
    const apiUrl = process.env.VERCEL_URL || 'https://dottie-backend-lmcreans-projects.vercel.app';
    



    // Step 1: Register a test user to get a token

    const testUser = {
      username: `schema_check_${Date.now()}`,
      email: `schema.check.${Date.now()}@example.com`,
      password: 'TestPassword123!#@'
    };
    
    let userId;
    let token;
    
    try {
      const registerResponse = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      
      const registerData = await registerResponse.json();

      
      if (registerResponse.status !== 201) {
        throw new Error(`Failed to register: ${registerResponse.status}`);
      }
      
      userId = registerData.id;

      
      // Step 2: Login to get token

      const loginResponse = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });
      
      const loginData = await loginResponse.json();
      
      if (loginResponse.status !== 200) {
        throw new Error(`Failed to login: ${loginResponse.status}`);
      }
      
      token = loginData.token;

      
      // Step 3: Create a simple assessment to test the schema

      const assessmentResponse = await fetch(`${apiUrl}/assessment/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assessmentData: {
            age: '18-24',
            cycle_length: '26-30',
            period_duration: '4-5',
            flow_heaviness: 'moderate',
            pain_level: 'moderate',
            physical_symptoms: ['Bloating', 'Headaches'],
            emotional_symptoms: ['Mood swings', 'Irritability']
          }
        })
      });
      
      const assessmentData = await assessmentResponse.json();

      
      if (assessmentResponse.status !== 201) {
        console.error('Assessment creation failed with status:', assessmentResponse.status);
        if (assessmentData.details) {
          console.error('Error details:', assessmentData.details);
          
          // Extract schema information from the error message
          if (assessmentData.details.includes('schema cache')) {
            const schemaError = assessmentData.details;

            
            // Try to determine the columns that are missing or incorrect
            const missingColumnMatch = schemaError.match(/Could not find the '([^']+)' column/);
            if (missingColumnMatch) {


            }
          }
        }
      } else {

      }
      
      // Step 4: Clean up by deleting the test user

      const deleteResponse = await fetch(`${apiUrl}/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      

      
    } catch (error) {
      console.error('Error during schema check:', error);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the schema check
checkProdSchema(); 