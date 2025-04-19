import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/!to-migrate/button";
import { useIsMobile } from "@/src/hooks/use-mobile";

interface HeaderProps {
  logoSrc?: string;
  appName?: string;
}

const Header: React.FC<HeaderProps> = ({
  logoSrc = "/assets/logo-mascot.png",
  appName = "Dottie",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <div className="relative">
        <header className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={logoSrc}
                alt={`${appName} Logo`}
                className="w-6 h-auto"
              />
              <span className="font-bold text-xl text-pink-500 pl-2">
                {appName}
              </span>
            </motion.div>
          </Link>
          {/* Desktop Navigation - shown when not mobile */}
          {!isMobile && (
            <nav className="flex items-center gap-6">
              <Link
                to="/auth/sign-in"
                className="text-gray-600 hover:text-pink-500 transition-colors"
              >
                Sign In
              </Link>
              <Link to="/auth/sign-up">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                  Get Started
                </Button>
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button - shown only on mobile */}
          {isMobile && (
            <button
              className="flex flex-col mr-3"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <span
                className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-gray-600 my-1 transition-opacity duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>
          )}

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {isMobile && mobileMenuOpen && (
              <motion.div
                className="absolute top-full left-0 right-0 bg-white border-b z-40"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col py-2 justify-center items-center">
                  <Link
                    to="/auth/sign-in"
                    className="text-gray-600 hover:text-pink-500 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/sign-up"
                    className="py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      </div>
    </>
  );
};

export default Header;
