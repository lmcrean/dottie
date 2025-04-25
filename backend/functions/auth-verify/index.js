const { authenticateToken } = require('../shared/middleware');

module.exports = async function (context, req) {
  context.log('Token verification function processed a request');

  // First authenticate the request
  const isAuthenticated = await authenticateToken(req, context);
  if (!isAuthenticated) {
    return; // Response is already set by the authenticateToken function
  }

  // If we get here, authentication was successful
  context.res = {
    status: 200,
    body: { 
      authenticated: true,
      user: { 
        id: req.user.id, 
        email: req.user.email,
        // Add timestamp to show when verification was performed
        verified_at: new Date().toISOString()
      } 
    }
  };
}; 