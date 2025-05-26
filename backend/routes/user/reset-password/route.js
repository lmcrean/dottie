import express from 'express';
import { requestPasswordReset, completePasswordReset } from './controller.js';
import { validateResetPasswordRequest, validateResetPasswordCompletion } from '../../auth/middleware/validators/resetPasswordValidators.js';

const router = express.Router();

// POST - Request password reset (send email with token)
router.post('/pw/reset', validateResetPasswordRequest, requestPasswordReset);

// POST - Complete password reset with new password
router.post('/pw/reset-complete', validateResetPasswordCompletion, completePasswordReset);

export default router; 