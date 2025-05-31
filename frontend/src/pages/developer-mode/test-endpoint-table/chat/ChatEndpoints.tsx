import React from 'react';
import { EndpointTable } from '../../page-components';
import PostChatSend from './post-chat-send/EndpointRow';
import GetChatHistory from './get-chat-history/EndpointRow';
import GetChatHistoryId from './get-chat-history-id/EndpointRow';
import DeleteChatHistoryId from './delete-chat-history-id/EndpointRow';

/**
 * Container component for AI chat endpoints
 */
export default function ChatEndpoints() {
  return (
    <EndpointTable title="AI Chat Endpoints">
      <PostChatSend />
      <GetChatHistory />
      <GetChatHistoryId />
      <DeleteChatHistoryId />
    </EndpointTable>
  );
}
