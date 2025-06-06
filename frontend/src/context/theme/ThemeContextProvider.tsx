import { ThemeContext } from '@/src/context/theme/ThemeContext';
import { ReactNode, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

interface ThemeProviderProps {
  children: ReactNode;
}

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Debug function to help troubleshoot
  const applyThemeToHTML = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme based on system preference or localStorage
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      applyThemeToHTML(savedTheme === 'dark');
      return;
    }

    // Then check OS preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setIsDarkMode(prefersDark);
    applyThemeToHTML(prefersDark);
  }, []);

  // Listen for OS theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if no manual preference is saved
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        applyThemeToHTML(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = (): void => {
    const newDarkMode = !isDarkMode;
    const newTheme: Theme = newDarkMode ? 'dark' : 'light';

    setIsDarkMode(newDarkMode);
    applyThemeToHTML(newDarkMode);
    localStorage.setItem('theme', newTheme);
  };

  const setTheme = (theme: Theme): void => {
    const isDark = theme === 'dark';
    setIsDarkMode(isDark);
    applyThemeToHTML(isDark);
    localStorage.setItem('theme', theme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// export const useTheme = (): ThemeContextType => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
