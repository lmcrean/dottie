import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..', '..', '..');

console.log('=== MIGRATION TO SUPABASE ===');
console.log('This script will migrate the database from Azure SQL to Supabase.\n');

// Step 1: Check that Supabase environment variables are set
console.log('Step 1: Checking Supabase environment variables...');
const requiredEnvVars = [
  'SUPABASE_ANON_PUBLIC',
  'SUPABASE_SERVICE_ROLE_KEY'
];

// Load .env file manually to check variables
const envPath = path.join(rootDir, '.env');
let envVars = {};

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');  // Handle values that might contain = character
      
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  }
  
  const missingEnvVars = requiredEnvVars.filter(envVar => !envVars[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please add these variables to your .env file and try again.');
    process.exit(1);
  }
  
  console.log('All required environment variables are set!');
} catch (error) {
  console.error('Error reading .env file:', error);
  process.exit(1);
}

// Step 2: Install Supabase client library
console.log('\nStep 2: Installing Supabase client library...');
try {
  execSync('npm install @supabase/supabase-js', { 
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('Supabase client library installed successfully!');
} catch (error) {
  console.error('Error installing Supabase client library:', error);
  process.exit(1);
}

// Step 3: Verify connection to Supabase
console.log('\nStep 3: Verifying connection to Supabase...');
try {
  // Run the initialization script - this will display schema instructions 
  // and verify connection to Supabase
  execSync('node db/supabase/scripts/initSupabaseTables.js', { 
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('Supabase connection verified successfully!');
  
  console.log('\nIMPORTANT: Make sure you have created all the necessary tables in Supabase dashboard.');
  console.log('See the SUPABASE_MIGRATION.md file for the required schema details.');
  console.log('Press Ctrl+C to cancel if you need to create these tables first.');
  
  // Wait 5 seconds to give user time to cancel
  console.log('Waiting 5 seconds before proceeding...');
  execSync('node -e "setTimeout(() => {}, 5000)"', { stdio: 'inherit' });
} catch (error) {
  console.error('Error verifying Supabase connection:', error);
  process.exit(1);
}

// Step 4: Run tests to verify Supabase connection
console.log('\nStep 4: Running tests to verify Supabase implementation...');
try {
  execSync('npx vitest run routes/setup/__tests__/unit/success/SupabaseConnection.test.js', { 
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('Supabase connection tests passed!');
} catch (error) {
  console.error('Supabase connection tests failed:', error);
  console.error('Please check your Supabase configuration and try again.');
  process.exit(1);
}

// Step 5: Clean up Azure SQL related code
console.log('\nStep 5: Cleaning up Azure SQL related code...');
try {
  execSync('node db/supabase/scripts/cleanupAzure.js', { 
    cwd: rootDir,
    stdio: 'inherit'
  });
  console.log('Azure SQL cleanup completed successfully!');
} catch (error) {
  console.error('Error cleaning up Azure SQL related code:', error);
  process.exit(1);
}

console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY ===');
console.log('Your application is now configured to use Supabase instead of Azure SQL.');
console.log('Next steps:');
console.log('1. Make sure you have created all required tables in the Supabase dashboard');
console.log('2. Start your application with "npm run dev" to test the connection');
console.log('3. Update your deployment environment variables if deploying to Vercel or other platforms');
console.log('4. See db/supabase/docs/SUPABASE_MIGRATION.md for more details on the migration'); 