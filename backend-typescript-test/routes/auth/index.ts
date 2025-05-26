import express from 'express';
import loginRoutes from './login/route.ts';
import logoutRoutes from './logout/route.ts';
import signupRoutes from './signup/route.ts';
import refreshRoutes from './refresh/route.ts';
import verifyRoutes from './verify/route.ts';
import userRoutes from '../user/index.ts';
// Import other auth routes as needed
// import resetPasswordRoutes from './resetPassword/route.ts';

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
