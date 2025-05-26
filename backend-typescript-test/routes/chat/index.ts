import express from 'express';
import sendMessageRoute from './send-message/route.ts';
import getHistoryRoute from './get-history/route.ts';
import getConversationRoute from './get-conversation/route.ts';
import deleteConversationRoute from './delete-conversation/route.ts';
import createChatRoute from './create-chat/route.ts';
import sendInitialMessageRoute from './send-initial-message/route.ts';
import sendFollowUpMessageRoute from './send-follow-up-message/route.ts';

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
