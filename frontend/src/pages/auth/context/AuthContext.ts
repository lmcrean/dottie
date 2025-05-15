import { AuthContextType } from '@/src/pages/auth/context/AuthContextProvider';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
