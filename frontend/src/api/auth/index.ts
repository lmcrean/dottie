import {
  postLogin,
  postSignup,
  postLogout,
  postRefreshToken,
  getTokenVerification
} from './requests';

// Export types
export * from './types';

// Export schemas
export * from './schemas';

// Export individual endpoints
export {
  postLogin as login,
  postSignup as signup,
  postLogout as logout,
  postRefreshToken as refreshToken,
  getTokenVerification as verifyToken
};

// Auth API object for backward compatibility
export const authApi = {
  login: postLogin,
  signup: postSignup,
  logout: postLogout,
  refreshToken: postRefreshToken,
  verifyToken: getTokenVerification
};

export default authApi;
