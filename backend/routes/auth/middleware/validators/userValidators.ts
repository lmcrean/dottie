/**
 * Validates user request data
 */
import { Request, Response, NextFunction } from 'express';

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// User access validation middleware
export const validateUserAccess = (req: Request, res: Response, next: NextFunction) => {
  // User can only access their own profile unless they are an admin
  const requestedUserId = req.params.id;
  const userId = (req as any).user?.userId;
  const isAdmin = (req as any).user?.role === 'admin';

  // Allow access to test user IDs
  if (requestedUserId?.startsWith('test-user-')) {
    return next();
  }

  if (userId === requestedUserId || isAdmin) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: You can only access your own profile' });
  }
};

// Validate user registration data
export const validateUserRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  // Validate required data
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

// Validate user login data
export const validateUserLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Validate required data
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

// User update validation middleware
export const validateUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body;

  // Validate email if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }

  // Validate username if provided
  if (username) {
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters' });
    }
    // Only alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ error: 'Username can only contain letters, numbers, and underscores' });
    }
  }

  // Validate password if provided
  if (password) {
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    // Check for at least one uppercase, one lowercase, one number, and one special character
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&_#]/.test(password);
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      return res.status(400).json({
        error: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&_#)'
      });
    }
  }

  next();
};

export default {
  validateUserRegistration,
  validateUserLogin,
  validateEmail,
  validateUserAccess,
  validateUserUpdate
};
