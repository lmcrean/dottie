import express from 'express';
import sendMessageRoute from '';
import getHistoryRoute from '';
import getConversationRoute from '';
import deleteConversationRoute from '';
import createChatRoute from '';
import sendInitialMessageRoute from '';
import sendFollowUpMessageRoute from '';

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
