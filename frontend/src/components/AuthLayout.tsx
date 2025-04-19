import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <img src="/chatb.png" alt="Dottie Logo" className="w-8 h-8" />
          <span className="font-semibold text-pink-500">Dottie</span>
        </div>
        <Link to="/" className="text-gray-500">
          X
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AuthLayout;
