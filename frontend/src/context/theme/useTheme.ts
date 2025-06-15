import { ThemeContext } from '@/src/context/theme/ThemeContext';
import { type ThemeContextType } from '@/src/context/theme/ThemeContextProvider';
import { useContext } from 'react';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
