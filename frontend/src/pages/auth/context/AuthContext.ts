import { AuthContextType } from '@/src/context/auth/AuthContextProvider';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
