import express from 'express';
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
import userRoutes from './routes/user/index.js';
// Import other auth routes as needed
// // TODO: Fix empty import

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
