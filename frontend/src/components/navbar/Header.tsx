import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { useIsMobile } from '@/src/hooks/use-mobile';
import UserIcon from '@/src/components/navbar/UserIcon';
import ThemeToggle from '@/src/components/theme/ThemeToggle';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🚀 Using window.location.href to navigate to: /');
    window.location.href = '/';
  };
  return (
    <>
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
          {isMobile && !isLoggedIn && (
            <button
              type="button"
              className="flex flex-col"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-transform duration-300 ${mobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}
              ></span>
              <span
                className={`my-1 block h-0.5 w-6 bg-gray-600 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-transform duration-300 ${mobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}
              ></span>
            </button>
          )}{' '}
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Menu Dropdown - only for non-logged in users */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && !isLoggedIn && (
          <motion.div
            layout
            className="absolute left-0 right-0 top-[76px] z-40 border-b border-b-slate-800 bg-white dark:bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center py-2">
              <Link
                to="/auth/sign-in"
                className="py-2 text-gray-600 transition-colors hover:text-pink-600 dark:text-slate-200 dark:hover:text-pink-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link to="/auth/sign-up" className="py-2" onClick={() => setMobileMenuOpen(false)}>
                <Button className="bg-pink-600 text-white hover:bg-pink-700">Get Started</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
