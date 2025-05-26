/**
 * Validates user update request data
 */
export const validateUserUpdate = (req, res, next) => {
  const { username, email, age } = req.body;
  
  // Validate required data
  if (!username && !email && !age) {
    return res.status(400).json({ error: 'At least one field to update is required' });
  }
  
  // Validate email format if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }
  
  // Validate age if provided
  if (age && !['under_18', '18_24', '25_34', '35_44', '45_54', '55_plus'].includes(age)) {
    return res.status(400).json({ error: 'Invalid age value' });
  }
  
  next();
};

export default validateUserUpdate; 