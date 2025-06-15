import React from 'react';
import { Button } from '@/src/components/buttons/button';
import { MessageSquare, Trash2, Target } from 'lucide-react';
import { ConversationListItem } from '../../types';
import { formatDate, truncatePreview, formatAssessmentPattern } from '../utils/formatting';

interface ConversationItemProps {
  conversation: ConversationListItem;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: (conversation: ConversationListItem) => void;
  onDelete: (conversationId: string, e: React.MouseEvent) => void;
}

export function ConversationItem({
  conversation,
  isSelected,
  isDeleting,
  onSelect,
  onDelete
}: ConversationItemProps) {
  return (
    <div
      onClick={() => onSelect(conversation)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(conversation);
        }
      }}
      role="button"
      tabIndex={0}
      className={`group relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
        isSelected
          ? 'border border-pink-200 bg-pink-50 dark:border-pink-800 dark:bg-pink-900/20'
          : 'border border-transparent'
      }`}
    >
      {/* Conversation Content */}
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          {/* Header with date */}
          <div className="mb-1 flex items-center gap-2">
            <MessageSquare className="h-3 w-3 flex-shrink-0 text-pink-600" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatDate(conversation.last_message_date)}</span>
            </div>
          </div>

          {/* Assessment Pattern - Prominent Display */}
          {conversation.assessment_pattern && (
            <div className="mb-2 flex items-center gap-2 rounded-md bg-purple-50 px-2 py-1 dark:bg-purple-900/20">
              <Target className="h-3 w-3 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {formatAssessmentPattern(conversation.assessment_pattern)}
              </span>
            </div>
          )}

          {/* Preview text */}
          <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
            {truncatePreview(conversation.preview, 50)}
          </div>

          {/* Message count */}
          <div className="text-xs text-gray-500">
            {conversation.message_count} message
            {conversation.message_count !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => onDelete(conversation.id, e)}
          disabled={isDeleting}
          className="h-6 w-6 p-0 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 top-0 w-1 rounded-r bg-pink-600"></div>
      )}
    </div>
  );
}
