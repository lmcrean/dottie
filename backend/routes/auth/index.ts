import express from 'express';
import loginRoutes from '';
import logoutRoutes from '';
import signupRoutes from '';
import refreshRoutes from '';
import verifyRoutes from '';
import userRoutes from './routes/user/index.js';
// Import other auth routes as needed
// import resetPasswordRoutes from '';

const router = express.Router();

// Mount auth route modules
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/signup', signupRoutes);
router.use('/refresh', refreshRoutes);
router.use('/verify', verifyRoutes);
// Mount user routes to maintain compatibility with tests
router.use('/users', userRoutes);
// Mount other auth routes
// router.use('/reset-password', resetPasswordRoutes);

export default router; 
