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
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
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
