/**
 * Simple Fix Schema Script
 * 
 * This script uses the sqlite3 package directly to fix the database schema.
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the path to the SQLite database file
const dbPath = path.join(__dirname, '..', 'dev.sqlite3');



// Check if the database file exists
if (!fs.existsSync(dbPath)) {
  console.error('Database file does not exist:', dbPath);
  process.exit(1);
}

// Open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }

});

// Run the schema updates
db.serialize(() => {
  // First, drop the assessments table if it exists
  db.run('DROP TABLE IF EXISTS assessments', (err) => {
    if (err) {
      console.error('Error dropping assessments table:', err.message);
      return;
    }


    // Create the assessments table with the correct schema
    const createTable = `
      CREATE TABLE assessments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        age TEXT,
        pattern TEXT,
        cycle_length TEXT,
        period_duration TEXT,
        flow_heaviness TEXT,
        pain_level TEXT,
        physical_symptoms TEXT,
        emotional_symptoms TEXT,
        recommendations TEXT,
        assessment_data TEXT
      );
    `;

    db.run(createTable, (err) => {
      if (err) {
        console.error('Error creating assessments table:', err.message);
        return;
      }


      // Verify the schema
      db.all('PRAGMA table_info(assessments);', (err, rows) => {
        if (err) {
          console.error('Error getting table info:', err.message);
          return;
        }
        

        rows.forEach((row) => {

        });

        // Close the database
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
            return;
          }

        });
      });
    });
  });
}); 