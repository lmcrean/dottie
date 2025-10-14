import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { useIsMobile } from '@/src/hooks/use-mobile';
import UserIcon from '@/src/components/navbar/UserIcon';
import ThemeToggle from '@/src/components/theme/ThemeToggle';

import {
  Sheet,
  // SheetClose,
  SheetContent,
  // SheetDescription,
  // SheetFooter,
  SheetHeader,
  // SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetTitle
} from '@/src/components/ui/sheet';

interface HeaderProps {
  logoSrc?: string;
  appName?: string;
  isLoggedIn?: boolean;
}

const Header = ({
  logoSrc = '/logo/logo-mascot.svg',
  appName = 'Dottie',
  isLoggedIn = false
}: HeaderProps) => {
  const isMobile = useIsMobile();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 Using window.location.href to navigate to: /');
    window.location.href = '/';
  };
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b p-6 backdrop-blur-sm dark:border-b-slate-800">
      <button type="button" onClick={handleLogoClick} className="border-none bg-transparent p-0">
        <motion.div
          className="flex cursor-pointer items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={logoSrc} alt={`${appName} Logo`} className="h-auto w-6" />
          <span className="pl-2 text-xl font-bold text-pink-600">{appName}</span>
        </motion.div>
      </button>

      {/* Right side container for all controls */}
      <div className="flex items-center gap-4">
        {/* Desktop Navigation - shown when not mobile */}
        {!isMobile && !isLoggedIn && (
          <nav className="flex items-center gap-6">
            <Link
              to="/auth/sign-in"
              className="text-gray-600 transition-colors hover:text-pink-600 dark:text-slate-200 dark:hover:text-pink-600"
            >
              Sign In
            </Link>
            <Link to="/auth/sign-up">
              <Button className="bg-pink-600 text-white hover:bg-pink-700">Get Started</Button>
            </Link>
          </nav>
        )}

        {/* Show UserIcon only when logged in */}
        {isLoggedIn && <UserIcon />}

        {/* Mobile Menu Button - shown only on mobile and when not logged in */}
        <ThemeToggle />

        {isMobile && !isLoggedIn && (
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className="flex flex-col" aria-label="Toggle mobile menu">
                <span
                  className={`$} block h-0.5 w-6 bg-gray-600 transition-transform duration-300`}
                ></span>
                <span
                  className={`my-1 block h-0.5 w-6 bg-gray-600 transition-opacity duration-300`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-gray-600 transition-transform duration-300`}
                ></span>
              </button>
            </SheetTrigger>

            <SheetContent side="left" className="bg-white dark:bg-slate-900">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 pt-8">
                <SheetClose asChild>
                  <Link
                    to="/auth/sign-in"
                    className="text-left text-lg text-gray-600 transition-colors hover:text-pink-600 dark:text-slate-200 dark:hover:text-pink-600"
                  >
                    Sign In
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link to="/auth/sign-up" className="text-left">
                    <Button className="w-full bg-pink-600 text-white hover:bg-pink-700">
                      Get Started
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
