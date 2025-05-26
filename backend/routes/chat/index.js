import express from 'express';
import sendMessageRoute from './send-message/route.js';
import getHistoryRoute from './get-history/route.js';
import getConversationRoute from './get-conversation/route.js';
import deleteConversationRoute from './delete-conversation/route.js';
import createChatRoute from './create-chat/route.js';
import sendInitialMessageRoute from './send-initial-message/route.js';
import sendFollowUpMessageRoute from './send-follow-up-message/route.js';

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