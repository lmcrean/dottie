// Main User model (orchestrator)
import User from '../../../models/user/User.js';

// Services
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import

// Validators
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import

// Transformers
// TODO: Fix empty import

// Base
// TODO: Fix empty import

// Main exports - new granular structure
export {
  // Main orchestrator
  User,
  
  // Services
  CreateUser,
  ReadUser,
  UpdateEmail,
  UpdateUsername,
  UpdatePassword,
  DeleteUser,
  AuthenticateUser,
  ResetPassword,
  
  // Validators
  ValidateUserData,
  ValidateEmail,
  ValidateUsername,
  ValidatePassword,
  ValidateCredentials,
  
  // Transformers
  SanitizeUserData,
  
  // Base
  UserBase
};

// Default export is the main User orchestrator
export default User; 
