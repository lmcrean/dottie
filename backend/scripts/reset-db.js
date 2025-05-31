/**
 * Reset SQLite Database
 * 
 * This script deletes the current SQLite database file and recreates it
 * by running the initialization script. It's useful for testing when schema changes
 * have been made.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import initializeSQLiteDatabase from '../db/init-sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = path.join(__dirname, '..');
const dbPath = path.join(rootDir, "dev.sqlite3");

// Delete the existing database file if it exists
if (fs.existsSync(dbPath)) {

  try {
    fs.unlinkSync(dbPath);

  } catch (error) {
    console.error("Error deleting database file:", error);
    process.exit(1);
  }
} else {

}

// Set TEST_MODE to true to ensure test schema is used
process.env.TEST_MODE = "true";


// Initialize the database from scratch

try {
  await initializeSQLiteDatabase();

} catch (error) {
  console.error("Error initializing database:", error);
  process.exit(1);
}

