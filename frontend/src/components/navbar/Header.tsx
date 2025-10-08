import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { buttonVariants } from '@/src/components/buttons/buttonVariants';
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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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
          {/* Desktop Navigation - shown when not mobile and not logged in */}
          <ThemeToggle />
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

          {/* Desktop Navigation - shown when not mobile and logged in */}
          {!isMobile && isLoggedIn && (
            <nav className="flex items-center gap-6">
              <Link
                to="/assessment"
                className="text-gray-600 transition-colors hover:text-pink-600 dark:text-slate-200 dark:hover:text-pink-600"
              >
                <FileText className="h-6 w-6 text-gray-500" />
              </Link>
              <Link
                to="/chat"
                className="text-gray-600 transition-colors hover:text-pink-600 dark:text-slate-200 dark:hover:text-pink-600"
              >
                <MessageCircle className="h-6 w-6 text-gray-500" />
              </Link>
            </nav>
          )}

          {/* Show UserIcon only when logged in */}
          {isLoggedIn && <UserIcon />}

          {/* Mobile Menu Button - shown only on mobile */}
          {isMobile && (
            <button
              type="button"
              className="relative z-50 flex flex-col"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-transform duration-300 dark:bg-slate-200 ${
                  mobileMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                }`}
              ></span>
              <span
                className={`my-1 block h-0.5 w-6 bg-gray-600 transition-opacity duration-300 dark:bg-slate-200 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 bg-gray-600 transition-transform duration-300 dark:bg-slate-200 ${
                  mobileMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              ></span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Sheet/Drawer */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: mobileMenuOpen ? 'auto' : 'none' }}
            onClick={closeMobileMenu}
          />

          {/* Slide Drawer */}
          <motion.div
            className="fixed left-0 top-0 z-50 h-full w-full max-w-[100vw] border-r bg-white dark:border-slate-800 dark:bg-gray-900"
            initial={{ x: '-100%' }}
            animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
          >
            <div className="flex h-full flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b p-6 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleLogoClick}
                  className="border-none bg-transparent p-0"
                >
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
                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-5 w-5 text-gray-600 dark:text-slate-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex flex-1 flex-col items-center justify-center space-y-8 px-6 py-8">
                {!isLoggedIn ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: mobileMenuOpen ? 1 : 0,
                        y: mobileMenuOpen ? 0 : 20
                      }}
                      transition={{ delay: mobileMenuOpen ? 0.1 : 0, duration: 0.3 }}
                    >
                      <Link
                        to="/auth/sign-in"
                        className={`${buttonVariants({ variant: 'outline' })} flex w-full items-center gap-2 px-8 py-6 text-xl dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700 sm:w-auto`}
                        onClick={closeMobileMenu}
                      >
                        Sign In
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: mobileMenuOpen ? 1 : 0,
                        y: mobileMenuOpen ? 0 : 20
                      }}
                      transition={{ delay: mobileMenuOpen ? 0.2 : 0, duration: 0.3 }}
                    >
                      <Link to="/auth/sign-up" onClick={closeMobileMenu}>
                        <Button className="flex w-full items-center gap-2 bg-pink-600 px-8 py-6 text-lg text-white hover:bg-pink-700 sm:w-auto">
                          Get Started
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: mobileMenuOpen ? 1 : 0,
                        y: mobileMenuOpen ? 0 : 20
                      }}
                      transition={{ delay: mobileMenuOpen ? 0.1 : 0, duration: 0.3 }}
                    >
                      <Link
                        to="/user/profile"
                        className="flex w-full items-center gap-2 rounded-lg bg-pink-600 px-8 py-2 text-lg text-white hover:bg-pink-700 sm:w-auto"
                        onClick={closeMobileMenu}
                      >
                        <UserIcon />
                        Profile
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: mobileMenuOpen ? 1 : 0,
                        y: mobileMenuOpen ? 0 : 20
                      }}
                      transition={{ delay: mobileMenuOpen ? 0.15 : 0, duration: 0.3 }}
                    >
                      <Link
                        to="/assessment"
                        className={`${buttonVariants({ variant: 'outline' })} flex w-full items-center gap-2 px-8 py-6 text-xl dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700 sm:w-auto`}
                        onClick={closeMobileMenu}
                      >
                        <FileText className="h-6 w-6 text-gray-500" />
                        Assessment
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: mobileMenuOpen ? 1 : 0,
                        y: mobileMenuOpen ? 0 : 20
                      }}
                      transition={{ delay: mobileMenuOpen ? 0.2 : 0, duration: 0.3 }}
                    >
                      <Link
                        to="/chat"
                        className={`${buttonVariants({ variant: 'outline' })} flex w-full items-center gap-2 px-8 py-6 text-xl dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700 sm:w-auto`}
                        onClick={closeMobileMenu}
                      >
                        <MessageCircle className="h-6 w-6 text-gray-500" />
                        Chat
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Header;
