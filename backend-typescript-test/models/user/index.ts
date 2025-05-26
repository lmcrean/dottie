// Main User model (orchestrator)
import User from './User.ts';

// Services
import CreateUser from './services/CreateUser.ts';
import ReadUser from './services/ReadUser.ts';
import UpdateEmail from './services/UpdateEmail.ts';
import UpdateUsername from './services/UpdateUsername.ts';
import UpdatePassword from './services/UpdatePassword.ts';
import DeleteUser from './services/DeleteUser.ts';
import AuthenticateUser from './services/AuthenticateUser.ts';
import ResetPassword from './services/ResetPassword.ts';

// Validators
import ValidateUserData from './validators/ValidateUserData.ts';
import ValidateEmail from './validators/ValidateEmail.ts';
import ValidateUsername from './validators/ValidateUsername.ts';
import ValidatePassword from './validators/ValidatePassword.ts';
import ValidateCredentials from './validators/ValidateCredentials.ts';

// Transformers
import SanitizeUserData from './transformers/SanitizeUserData.ts';

// Base
import UserBase from './base/UserBase.ts';

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
