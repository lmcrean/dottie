const { connect } = require('../db');

/**
 * Find a user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User object or null if not found
 */
async function getUserByEmail(email) {
  const db = await connect();
  
  try {
    const user = await db.query(
      'SELECT * FROM users WHERE email = @email',
      { email }
    );
    
    return user[0] || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user
 */
async function createUser(userData) {
  const db = await connect();
  
  try {
    const result = await db.query(
      `INSERT INTO users (email, password_hash, username, created_at)
       VALUES (@email, @password_hash, @username, @created_at)
       RETURNING *`,
      {
        email: userData.email,
        password_hash: userData.password_hash,
        username: userData.username,
        created_at: new Date().toISOString()
      }
    );
    
    return result[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} - User object or null if not found
 */
async function getUserById(id) {
  const db = await connect();
  
  try {
    const user = await db.query(
      'SELECT * FROM users WHERE id = @id',
      { id }
    );
    
    return user[0] || null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

module.exports = {
  getUserByEmail,
  createUser,
  getUserById
}; 