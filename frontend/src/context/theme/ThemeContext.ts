import { type ThemeContextType } from '@/src/context/theme/ThemeContextProvider';
import { createContext } from 'react';

// type ThemeContextType = {
//   isDarkMode: boolean;
//   toggleTheme: () => void;
//   setTheme: (theme: Theme) => void;
// };

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
