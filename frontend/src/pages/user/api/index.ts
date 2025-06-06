import {
  getCurrentUser,
  putUpdate,
  deleteUser,
  postPasswordUpdate,
  requestPasswordReset,
  completePasswordReset
} from './requests';

// Export types
export * from './types';

// Export individual endpoints
export {
  getCurrentUser,
  putUpdate as updateUser,
  deleteUser,
  postPasswordUpdate as updatePassword,
  requestPasswordReset,
  completePasswordReset
};

// User API object for backward compatibility
export const userApi = {
  current: getCurrentUser,
  update: putUpdate,
  delete: deleteUser,
  updatePassword: postPasswordUpdate,
  passwordReset: {
    request: requestPasswordReset,
    complete: completePasswordReset
  }
};

export default userApi;
