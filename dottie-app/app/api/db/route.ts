import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function GET() {
  const environment = process.env.NODE_ENV || 'development';
  
  // Only attempt to connect to SQLite in development mode
  if (environment === 'development') {
    try {
      // Open a database connection
      const db = await open({
        filename: ':memory:', // In-memory database for testing
        driver: sqlite3.Database
      });
      
      // Create a test table
      await db.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT)');
      
      // Insert a test record
      await db.run('INSERT INTO test (name) VALUES (?)', ['Dottie Test']);
      
      // Query the test record
      const result = await db.get('SELECT * FROM test WHERE name = ?', ['Dottie Test']);
      
      return NextResponse.json({
        message: `SQLite connection successful in ${environment.toUpperCase()} mode`,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('SQLite connection error:', error);
      return NextResponse.json(
        { message: `SQLite connection error: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } else {
    // In production, we might use a different database or mock response
    return NextResponse.json({
      message: `SQLite testing not available in ${environment.toUpperCase()} mode`,
      timestamp: new Date().toISOString(),
    });
  }
} 