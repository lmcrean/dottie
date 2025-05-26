/**
 * Reset password request validation middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {void}
 */
export const validateResetPasswordRequest = (req, res, next) => {
  const { email } = req.body;
  
  // Email is optional now
  if (!email) {
    return next();
  }
  
  // Validate email format if provided
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }
  
  next();
};

/**
 * Reset password completion validation middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {void}
 */
export const validateResetPasswordCompletion = (req, res, next) => {
  const { token, newPassword } = req.body;
  
  // Check if required fields are present
  if (!token) {
    return res.status(400).json({ 
      error: 'Reset token is required' 
    });
  }
  
  if (!newPassword) {
    return res.status(400).json({ 
      error: 'New password is required' 
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
  
  next();
}; 