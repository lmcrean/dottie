import { ReactElement, ReactNode } from 'react';
import { Toaster } from 'sonner';
import Header from '@/src/components/navbar/Header';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import UITestPageSwitch from '@/src/components/developer-utils/UITestPageSwitch';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps): ReactElement {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:from-70% dark:to-gray-800">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            border: '1px solid #fce7f3',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        }}
      />
      <Header isLoggedIn={isAuthenticated} />
      <main className="flex min-h-screen flex-col">
        {children}
        <UITestPageSwitch />
      </main>
    </div>
  );
}
