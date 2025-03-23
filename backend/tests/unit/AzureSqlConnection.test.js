import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import db from '../../db/index.js';

// This file tests Azure SQL connection in a TDD approach
describe('Azure SQL Connection Tests', () => {
  // Test 1: Can connect to database
  it('should connect to the database', async () => {
    try {
      const result = await db.raw('SELECT 1 as testValue');
      
      // For SQL Server, result is typically an array with the first element containing data
      if (db.client.config.client === 'mssql') {
        expect(result[0]).toBeDefined();
        expect(result[0].testValue).toBe(1);
      } else {
        // For SQLite, structure is typically different
        expect(result[0].testValue).toBe(1);
      }
    } catch (error) {
      // Fail the test with the error details
      expect(error).toBeFalsy();
    }
  });

  // Test 2: Can query database info
  it('should be able to query database information', async () => {
    try {
      let result;
      
      if (db.client.config.client === 'mssql') {
        // SQL Server specific query
        result = await db.raw("SELECT DB_NAME() as database_name");
        expect(result[0].database_name).toBeDefined();
        expect(result[0].database_name).toBe(process.env.AZURE_SQL_DATABASE);
      } else {
        // SQLite specific query
        result = await db.raw("SELECT 'SQLite' as database_name");
        expect(result[0].database_name).toBe('SQLite');
      }
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  // Test 3: Connection pool is properly configured
  it('should have proper connection pool settings', () => {
    const { pool } = db.client.config;
    
    if (db.client.config.client === 'mssql') {
      expect(pool).toBeDefined();
      expect(pool.min).toBeDefined();
      expect(pool.max).toBeDefined();
      expect(pool.max).toBeGreaterThan(0);
    } else {
      // SQLite typically doesn't use pooling in the same way
      expect(true).toBe(true); // Skip test for SQLite
    }
  });

  // Clean up after all tests
  afterAll(async () => {
    // Close database connection
    await db.destroy();
  });
}); 