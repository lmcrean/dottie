import React, { useEffect, useState } from 'react';
import { User, List, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi } from '@/src/pages/assessment/api';
import { getConversationsList } from '@/src/pages/chat/sidebar/api/get-list/getConversationsList';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';

const UserIcon: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [hasHistory, setHasHistory] = useState(false);
  const [hasConversations, setHasConversations] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkHistory = async () => {
      try {
        // Check assessment history
        const assessments = await assessmentApi.list();
        setHasHistory(Array.isArray(assessments) && assessments.length > 0);

        // Check conversation history
        const conversations = await getConversationsList();
        setHasConversations(Array.isArray(conversations) && conversations.length > 0);
      } catch (error) {
        console.error('Error fetching history:', error);
        setHasHistory(false);
        setHasConversations(false);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      checkHistory();
    }
  }, [isAuthenticated]);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 Using window.location.href to navigate to: /user/profile');
    navigate('/user/profile');
  };

  const handleHistoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 Using window.location.href to navigate to: /assessment/history');
    navigate('/assessment/history');
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 Using window.location.href to navigate to: /chat');
    navigate('/chat');
  };

  const handleNavigation = () => {
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <button type="button" onClick={handleNavigation} className="text-gray-500">
        not authenticated
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4 text-gray-500">
      {!loading && hasConversations && (
        <button
          type="button"
          onClick={handleChatClick}
          title="Chat with Dottie"
          className="text-sm font-medium hover:text-pink-600"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}
      {!loading && hasHistory && (
        <button
          type="button"
          onClick={handleHistoryClick}
          title="Assessment History"
          className="text-sm font-medium hover:text-pink-600"
        >
          <List className="h-5 w-5" />
        </button>
      )}
      <button
        type="button"
        onClick={handleProfileClick}
        title="Profile"
        className="hover:text-pink-600"
      >
        <User className="h-5 w-5" />
      </button>
    </div>
  );
};

export default UserIcon;
