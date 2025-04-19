import React from "react";
import { Card, CardContent } from "./ui/card";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthLayout;
