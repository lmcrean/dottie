/**
 * Refresh Token Store Service
 *
 * Provides database-backed storage for refresh tokens with the following features:
 * - Persistent storage across server restarts
 * - Horizontal scaling support
 * - Token revocation capabilities
 * - Automatic cleanup of expired tokens
 * - Security through token hashing
 */

import bcrypt from 'bcrypt';
import { db } from '../db/database.js';

/**
 * Number of salt rounds for bcrypt hashing
 * Using 12 rounds as per OWASP recommendations
 */
const BCRYPT_ROUNDS = 12;

/**
 * Add a refresh token to the database
 *
 * @param {string} token - The raw refresh token
 * @param {string} userId - The user ID associated with this token
 * @param {number} expiresInDays - Number of days until token expires (default: 7)
 * @returns {Promise<void>}
 */
export async function add(token, userId, expiresInDays = 7) {
  try {
    // Hash the token before storing
    const tokenHash = await bcrypt.hash(token, BCRYPT_ROUNDS);

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Insert into database
    await db('refresh_tokens').insert({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt
    });
  } catch (error) {
    console.error('Error adding refresh token:', error);
    throw new Error('Failed to store refresh token');
  }
}

/**
 * Check if a refresh token exists and is valid
 *
 * @param {string} token - The raw refresh token to check
 * @param {string} [userId] - Optional user ID to narrow search (improves performance)
 * @returns {Promise<boolean>} True if token exists and is valid, false otherwise
 */
export async function has(token, userId = null) {
  try {
    // Build query with optional userId filter for performance
    let query = db('refresh_tokens')
      .where('expires_at', '>', new Date());

    // If userId provided, narrow search to only this user's tokens
    if (userId) {
      query = query.where('user_id', userId);
    }

    // Get tokens with safety limit
    const tokens = await query
      .select('id', 'token_hash', 'user_id')
      .limit(100); // Safety limit to prevent excessive iterations

    // Compare the token against each stored hash
    for (const stored of tokens) {
      const isMatch = await bcrypt.compare(token, stored.token_hash);
      if (isMatch) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking refresh token:', error);
    return false;
  }
}

/**
 * Delete a specific refresh token
 *
 * @param {string} token - The raw refresh token to delete
 * @returns {Promise<boolean>} True if token was found and deleted, false otherwise
 */
export async function deleteToken(token) {
  try {
    // Get all tokens
    const tokens = await db('refresh_tokens').select('id', 'token_hash');

    // Find and delete the matching token
    for (const stored of tokens) {
      const isMatch = await bcrypt.compare(token, stored.token_hash);
      if (isMatch) {
        await db('refresh_tokens').where('id', stored.id).del();
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error deleting refresh token:', error);
    return false;
  }
}

/**
 * Delete all refresh tokens for a specific user
 * Useful for logging out a user from all devices
 *
 * @param {string} userId - The user ID
 * @returns {Promise<number>} Number of tokens deleted
 */
export async function deleteAllForUser(userId) {
  try {
    const deletedCount = await db('refresh_tokens')
      .where('user_id', userId)
      .del();

    return deletedCount;
  } catch (error) {
    console.error('Error deleting user tokens:', error);
    throw new Error('Failed to delete user tokens');
  }
}

/**
 * Clean up expired tokens
 * Should be run periodically (e.g., via cron job)
 *
 * @returns {Promise<number>} Number of tokens cleaned up
 */
export async function cleanup() {
  try {
    const deletedCount = await db('refresh_tokens')
      .where('expires_at', '<', new Date())
      .del();

    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} expired refresh tokens`);
    }

    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    throw new Error('Failed to cleanup expired tokens');
  }
}

/**
 * Get the total count of active refresh tokens
 *
 * @returns {Promise<number>} Total number of non-expired tokens
 */
export async function getActiveTokenCount() {
  try {
    const result = await db('refresh_tokens')
      .where('expires_at', '>', new Date())
      .count('* as count')
      .first();

    return parseInt(result.count) || 0;
  } catch (error) {
    console.error('Error getting token count:', error);
    return 0;
  }
}

/**
 * Get the count of active tokens for a specific user
 *
 * @param {string} userId - The user ID
 * @returns {Promise<number>} Number of active tokens for this user
 */
export async function getActiveTokenCountForUser(userId) {
  try {
    const result = await db('refresh_tokens')
      .where('user_id', userId)
      .where('expires_at', '>', new Date())
      .count('* as count')
      .first();

    return parseInt(result.count) || 0;
  } catch (error) {
    console.error('Error getting user token count:', error);
    return 0;
  }
}

/**
 * Clean up orphaned tokens (tokens belonging to deleted users)
 * Useful for SQLite where foreign key constraints may not be enforced
 *
 * @returns {Promise<number>} Number of orphaned tokens cleaned up
 */
export async function cleanupOrphanedTokens() {
  try {
    const deletedCount = await db('refresh_tokens')
      .whereNotExists(function() {
        this.select('*')
          .from('users')
          .whereRaw('users.id = refresh_tokens.user_id');
      })
      .del();

    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} orphaned refresh tokens`);
    }

    return deletedCount;
  } catch (error) {
    console.error('Error cleaning orphaned tokens:', error);
    throw new Error('Failed to cleanup orphaned tokens');
  }
}

// Export all functions
export const refreshTokens = {
  add,
  has,
  delete: deleteToken,
  deleteAllForUser,
  cleanup,
  cleanupOrphanedTokens,
  getActiveTokenCount,
  getActiveTokenCountForUser,
};

export default refreshTokens;
