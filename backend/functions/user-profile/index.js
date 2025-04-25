const { authenticateToken } = require('../shared/middleware');
const { getUserById } = require('../shared/models/user');

module.exports = async function (context, req) {
  context.log('User profile function processed a request');

  // Authenticate the request
  const isAuthenticated = await authenticateToken(req, context);
  if (!isAuthenticated) {
    return; // Response is already set by the authenticateToken function
  }

  try {
    // Get user from database
    const user = await getUserById(req.user.id);
    
    if (!user) {
      context.res = {
        status: 404,
        body: { error: 'User not found' }
      };
      return;
    }
    
    // Remove sensitive information
    const { password_hash, ...userProfile } = user;
    
    context.res = {
      status: 200,
      body: userProfile
    };
  } catch (error) {
    context.log.error('Error retrieving user profile:', error);
    
    context.res = {
      status: 500,
      body: { error: 'Failed to retrieve user profile' }
    };
  }
}; 