const sql = require('mssql');

let pool = null;

/**
 * Connect to Azure SQL Database
 * @returns {Object} - Database connection pool
 */
async function connect() {
  if (pool) {
    return pool;
  }

  try {
    // Connection string or config should come from environment variables
    const config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      options: {
        encrypt: true,
        trustServerCertificate: false
      }
    };

    pool = await sql.connect(config);
    
    // Add a query method to simplify database operations
    pool.query = async (sqlQuery, params = {}) => {
      const request = pool.request();
      
      // Add parameters
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
      
      const result = await request.query(sqlQuery);
      return result.recordset;
    };
    
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

/**
 * Close the database connection
 */
async function close() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

module.exports = {
  connect,
  close
}; 