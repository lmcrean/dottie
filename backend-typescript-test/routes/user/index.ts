import express from 'express';
import getAllUsersRoutes from './get-all-users/route.js';
import getUserRoutes from './get-user/route.js';
import updateUserRoutes from './update-user/route.js';
import deleteUserRoutes from './delete-user/route.js';
import updatePasswordRoutes from './update-password/route.js';
import resetPasswordRoutes from './reset-password/route.js';

const router = express.Router();

// Mount user route modules
router.use('/', getAllUsersRoutes);
router.use('/', getUserRoutes);
router.use('/', updateUserRoutes);
router.use('/', deleteUserRoutes);
router.use('/', updatePasswordRoutes);
router.use('/', resetPasswordRoutes);

export default router; 