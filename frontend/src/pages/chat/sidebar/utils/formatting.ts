export const formatDate = (dateString: string) => {
  if (!dateString) {
    return 'Unknown date';
  }

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string provided to formatDate:', dateString);
    return 'Invalid date';
  }

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffHours = diffTime / (1000 * 60 * 60);
  const diffDays = Math.floor(diffHours / 24);

  // If less than 24 hours ago, show specific time (e.g., 13:45, 16:23)
  if (diffHours < 24 && diffHours >= 0) {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // If yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // If within this year but more than 1 day ago
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
  }

  // If more than 1 year ago, include shortened year
  const yearSuffix = date.getFullYear().toString().slice(-2);
  return (
    date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    }) + ` '${yearSuffix}`
  );
};

export const truncatePreview = (text: string, maxLength: number = 60) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatAssessmentPattern = (pattern: string | undefined) => {
  if (!pattern) return null;

  // Convert snake_case or camelCase to readable format
  return pattern
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
