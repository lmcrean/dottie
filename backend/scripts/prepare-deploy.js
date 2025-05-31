import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('Preparing for production deployment...');

// Check for .env file
const envPath = path.join(rootDir, '.env');
let envContent = '';

try {
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found .env file');
  } else {
    console.log('⚠️ No .env file found, creating one');
    envContent = '';
  }
} catch (error) {
  console.error('Error reading .env file:', error);
  process.exit(1);
}

// Ensure DB_TYPE is set to supabase for production
if (!envContent.includes('DB_TYPE=supabase')) {
  console.log('Adding DB_TYPE=supabase to .env file');
  envContent += '\nDB_TYPE=supabase';
}

// Write updated .env file
try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated .env file with production settings');
} catch (error) {
  console.error('Error writing .env file:', error);
  process.exit(1);
}

// Update package.json to include the prepare-deploy script in vercel-build
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check if vercel-build already includes prepare-deploy
  if (packageJson.scripts['vercel-build'] && !packageJson.scripts['vercel-build'].includes('prepare-deploy')) {
    packageJson.scripts['vercel-build'] = 'node scripts/prepare-deploy.js && ' + packageJson.scripts['vercel-build'];
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json to run prepare-deploy before vercel-build');
  } else {
    console.log('✅ package.json already configured correctly');
  }
} catch (error) {
  console.error('Error updating package.json:', error);
}

// Add script to create a .env.production file for Vercel
const envProductionPath = path.join(rootDir, '.env.production');
const envProductionContent = 'DB_TYPE=supabase\n';

try {
  fs.writeFileSync(envProductionPath, envProductionContent);
  console.log('✅ Created .env.production file for Vercel');
} catch (error) {
  console.error('Error creating .env.production file:', error);
}

console.log('✅ Deployment preparation complete!');
console.log('You can now deploy to Vercel with:');
console.log('  vercel --prod'); 