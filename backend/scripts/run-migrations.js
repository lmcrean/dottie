import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create knex instance
const knexInstance = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/database.sqlite')
  },
  useNullAsDefault: true
});

// Function to run migrations
async function runMigrations() {
  try {
    console.log('Running migrations...');
    const migrations = await knexInstance.migrate.latest({
      directory: path.join(__dirname, '../db/migrations')
    });
    
    console.log('Migrations completed!');
    console.log('Migrations run:', migrations[1]);
    
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

// Run migrations
runMigrations(); 