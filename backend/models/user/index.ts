// Main User model (orchestrator)
import User from '../../../models/user/User.js';

// Services
import CreateUser from '';
import ReadUser from '';
import UpdateEmail from '';
import UpdateUsername from '';
import UpdatePassword from '';
import DeleteUser from '';
import AuthenticateUser from '';
import ResetPassword from '';

// Validators
import ValidateUserData from '';
import ValidateEmail from '';
import ValidateUsername from '';
import ValidatePassword from '';
import ValidateCredentials from '';

// Transformers
import SanitizeUserData from '';

// Base
import UserBase from '';

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
