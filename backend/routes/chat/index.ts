import express from 'express';
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import

const router = express.Router();

// Configure routes
router.use('/send', sendMessageRoute);
router.use('/history', getHistoryRoute);
router.use('/history', getConversationRoute);
router.use('/history', deleteConversationRoute);

// New routes for frontend integration
router.use('/', createChatRoute);
router.use('/', sendInitialMessageRoute);
router.use('/', sendFollowUpMessageRoute);

export default router; 
