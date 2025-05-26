import express from 'express';
import getAllUsersRoutes from '';
import getUserRoutes from '';
import updateUserRoutes from '';
import deleteUserRoutes from '';
import updatePasswordRoutes from '';
import resetPasswordRoutes from '';

const router = express.Router();

// Mount user route modules
router.use('/', getAllUsersRoutes);
router.use('/', getUserRoutes);
router.use('/', updateUserRoutes);
router.use('/', deleteUserRoutes);
router.use('/', updatePasswordRoutes);
router.use('/', resetPasswordRoutes);

export default router; 
