import { useTheme } from '@/src/context/theme/useTheme';
import { SunIcon, MoonIcon } from 'lucide-react';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-gray-300 bg-gray-200 p-2 text-gray-800 hover:text-yellow-600 dark:border dark:border-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:hover:text-yellow-400"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
};

export default ThemeToggle;
