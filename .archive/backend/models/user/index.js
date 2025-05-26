// Main User model (orchestrator)
import User from './User.js';

// Services
import CreateUser from './services/CreateUser.js';
import ReadUser from './services/ReadUser.js';
import UpdateEmail from './services/UpdateEmail.js';
import UpdateUsername from './services/UpdateUsername.js';
import UpdatePassword from './services/UpdatePassword.js';
import DeleteUser from './services/DeleteUser.js';
import AuthenticateUser from './services/AuthenticateUser.js';
import ResetPassword from './services/ResetPassword.js';

// Validators
import ValidateUserData from './validators/ValidateUserData.js';
import ValidateEmail from './validators/ValidateEmail.js';
import ValidateUsername from './validators/ValidateUsername.js';
import ValidatePassword from './validators/ValidatePassword.js';
import ValidateCredentials from './validators/ValidateCredentials.js';

// Transformers
import SanitizeUserData from './transformers/SanitizeUserData.js';

// Base
import UserBase from './base/UserBase.js';

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