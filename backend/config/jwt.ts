import * as crypto from 'crypto';

/**
 * JWT Configuration and Secret Validation
 *
 * This module ensures that JWT secrets are properly configured before the application starts.
 * It prevents the use of weak default secrets and enforces proper environment configuration.
 */

/**
 * Token expiry configuration
 */
interface TokenExpiry {
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
}

/**
 * JWT Configuration interface
 */
interface JWTConfig {
  readonly JWT_SECRET: string | undefined;
  readonly REFRESH_SECRET: string | undefined;
  generateJTI(): string;
  TOKEN_EXPIRY: TokenExpiry;
}

// Validate secrets on module load
function validateJWTSecrets(): void {
  let JWT_SECRET = process.env.JWT_SECRET;
  let REFRESH_SECRET = process.env.REFRESH_SECRET;

  const errors: string[] = [];
  const isTestEnv = process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

  // Check if secrets are missing
  if (!JWT_SECRET || JWT_SECRET === 'undefined') {
    errors.push('JWT_SECRET environment variable is not set');
  }

  if (!REFRESH_SECRET || REFRESH_SECRET === 'undefined') {
    errors.push('REFRESH_SECRET environment variable is not set');
  }

  // Check if secrets are too weak (for production)
  if (process.env.NODE_ENV === 'production') {
    if (JWT_SECRET && JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET must be at least 32 characters in production');
    }

    if (REFRESH_SECRET && REFRESH_SECRET.length < 32) {
      errors.push('REFRESH_SECRET must be at least 32 characters in production');
    }
  }

  // Check if secrets are the same (security issue)
  if (JWT_SECRET && REFRESH_SECRET && JWT_SECRET === REFRESH_SECRET) {
    errors.push('JWT_SECRET and REFRESH_SECRET must be different');
  }

  if (errors.length > 0) {
    // In test environments, generate temporary secrets instead of failing
    if (isTestEnv) {
      console.warn('⚠️ JWT secrets not configured - generating temporary test secrets');
      process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
      process.env.REFRESH_SECRET = crypto.randomBytes(32).toString('hex');
      console.log('✅ JWT test secrets generated');
      return;
    }

    console.error('\n❌ JWT CONFIGURATION ERROR:\n');
    errors.forEach(error => console.error(`   - ${error}`));
    console.error('\nThe application cannot start without proper JWT configuration.');
    console.error('Please set JWT_SECRET and REFRESH_SECRET in your environment variables.\n');

    if (process.env.NODE_ENV === 'production') {
      console.error('💀 Exiting due to critical security misconfiguration in production\n');
      process.exit(1);
    } else {
      throw new Error('Missing required JWT secrets');
    }
  }

  console.log('✅ JWT secrets validated successfully');
}

// Run validation (this must happen before we try to access the secrets)
validateJWTSecrets();

// Create an object to hold secrets with getters that always read from process.env
// This ensures they reflect any changes made by the validation function
const jwtConfig: JWTConfig = {
  get JWT_SECRET(): string | undefined {
    return process.env.JWT_SECRET;
  },
  get REFRESH_SECRET(): string | undefined {
    return process.env.REFRESH_SECRET;
  },
  generateJTI(): string {
    return crypto.randomBytes(16).toString('hex');
  },
  TOKEN_EXPIRY: {
    ACCESS_TOKEN: '15m',  // Access tokens should be short-lived
    REFRESH_TOKEN: '7d',  // Refresh tokens can be longer
  }
};

// Export both named exports (for direct imports) and default export
export const JWT_SECRET: string | undefined = jwtConfig.JWT_SECRET;
export const REFRESH_SECRET: string | undefined = jwtConfig.REFRESH_SECRET;

/**
 * Generate a cryptographically secure JWT ID
 * @returns {string} A unique, secure JWT ID
 */
export function generateJTI(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Get recommended JWT token expiry times
 */
export const TOKEN_EXPIRY: TokenExpiry = {
  ACCESS_TOKEN: '15m',  // Access tokens should be short-lived
  REFRESH_TOKEN: '7d',  // Refresh tokens can be longer
};

/**
 * Get JWT_SECRET with guaranteed string type (throws if not set)
 */
export function getJWTSecret(): string {
  const secret = jwtConfig.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
}

/**
 * Get REFRESH_SECRET with guaranteed string type (throws if not set)
 */
export function getRefreshSecret(): string {
  const secret = jwtConfig.REFRESH_SECRET;
  if (!secret) {
    throw new Error('REFRESH_SECRET is not configured');
  }
  return secret;
}

export default jwtConfig;
