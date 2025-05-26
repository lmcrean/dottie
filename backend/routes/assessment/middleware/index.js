import { verifyToken } from '../../auth/middleware/index.js';

// Re-export auth middleware to maintain compatibility
export const authenticateToken = verifyToken; 