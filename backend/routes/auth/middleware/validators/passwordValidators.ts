/**
 * Password update request validation middleware
 */
import { Request, Response, NextFunction } from 'express';

export const validatePasswordUpdate = (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;

  // Check if the required fields are present
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      error: 'Both current password and new password are required'
    });
  }

  // Validate new password format
  if (newPassword.length < 8) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long'
    });
  }

  // Check for at least one uppercase, one lowercase, one number, and one special character
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[@$!%*?&_#]/.test(newPassword);

  if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
    return res.status(400).json({
      error: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&_#)'
    });
  }

  // Ensure new password is different from current password
  if (currentPassword === newPassword) {
    return res.status(400).json({
      error: 'New password must be different from current password'
    });
  }

  next();
};
