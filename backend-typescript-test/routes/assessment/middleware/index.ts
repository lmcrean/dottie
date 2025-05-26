import { verifyToken } from '../../auth/middleware/index.ts';

// Re-export auth middleware to maintain compatibility
export const authenticateToken = verifyToken; 
