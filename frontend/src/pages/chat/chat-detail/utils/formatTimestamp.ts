/**
 * Format timestamp for chat message display
 * @param timestamp - ISO timestamp string
 * @returns Formatted time string
 */
export const formatMessageTimestamp = (timestamp?: string): string => {
  if (!timestamp) {
    return 'Just now';
  }

  try {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - messageDate.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // Less than 1 minute ago
    if (diffInSeconds < 60) {
      return 'Just now';
    }

    // Less than 1 hour ago
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }

    // Less than 24 hours ago
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    // Less than 7 days ago
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    // More than 7 days ago - show date
    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === messageDate.toDateString();
    const isThisYear = messageDate.getFullYear() === now.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (isYesterday) {
      const time = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `Yesterday ${time}`;
    }

    if (isThisYear) {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};
