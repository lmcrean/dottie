import { type AuthContextType } from '@/src/context/AuthContextProvider';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
