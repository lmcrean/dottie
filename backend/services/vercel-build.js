console.log('Vercel Build Script: Setting up environment for deployment');

// Set VERCEL flag for database module
process.env.VERCEL = '1';
process.env.NODE_ENV = 'production';

console.log('Environment setup for Vercel deployment complete');

// No need to do anything else, as this script is just for environment setup 