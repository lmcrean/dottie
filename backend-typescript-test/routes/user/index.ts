import express from 'express';
import getAllUsersRoutes from './get-all-users/route.ts';
import getUserRoutes from './get-user/route.ts';
import updateUserRoutes from './update-user/route.ts';
import deleteUserRoutes from './delete-user/route.ts';
import updatePasswordRoutes from './update-password/route.ts';
import resetPasswordRoutes from './reset-password/route.ts';

const router = express.Router();

// Mount user route modules
router.use('/', getAllUsersRoutes);
router.use('/', getUserRoutes);
router.use('/', updateUserRoutes);
router.use('/', deleteUserRoutes);
router.use('/', updatePasswordRoutes);
router.use('/', resetPasswordRoutes);

export default router; 
