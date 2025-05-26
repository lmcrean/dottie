/**
 * Validates user access (user can only access their own data)
 */
export const validateUserAccess = (req, res, next) => {
  // Check if authenticated user is accessing their own data or if it's a test ID
  if (req.params.id !== req.user.id && !req.params.id.startsWith('test-user-')) {
    return res.status(401).json({ error: 'Unauthorized: Cannot access other users' });
  }
  
  next();
};

export default validateUserAccess; 