// Script to update Supabase schema
import { exec } from 'child_process';

// Set Supabase URL and service role key
process.env.SUPABASE_URL = 'https://nooizeyjujtddtxkirof.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vb2l6ZXlqdWp0ZGR0eGtpcm9mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDU2MDcwNywiZXhwIjoyMDYwMTM2NzA3fQ.OTFix5L3nLFlWsc4fLpfg9StIXFfwypIpCqBDeOM57I';

console.log('Running schema update with environment variables set:');
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL}`);
console.log(`SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 15)}...`);

// Import and run the update schema script
import('./db/supabase/scripts/runSchemaUpdate.js')
  .then(() => {
    console.log('Schema update script imported and executed');
  })
  .catch(error => {
    console.error('Error running schema update:', error);
  }); 