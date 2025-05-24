import React from 'react';
import { Card, CardContent } from '../../components/ui/card';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md border dark:border-slate-800">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthLayout;
