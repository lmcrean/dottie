import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/!to-migrate/button';
import { useIsMobile } from '@/src/hooks/use-mobile';
import UserIcon from "@/src/components/navigation/UserIcon";

interface HeaderProps {
    logoSrc?: string;
    appName?: string;
    isLoggedIn?: boolean;
}

const Header = ({
    logoSrc = "/logo-mascot.png",
    appName = "Dottie",
    isLoggedIn = false
}: HeaderProps) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <div>
                <header className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                    <Link to="/">
                        <motion.div
                            className="flex items-center gap-2 cursor-pointer"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <img src={logoSrc} alt={`${appName} Logo`} className="w-6 h-auto" />
                            <span className="font-bold text-xl text-pink-600 pl-2">{appName}</span>
                        </motion.div>
                    </Link>
                    {/* Desktop Navigation - shown when not mobile */}
                    {!isMobile && (
                        <nav className="flex items-center gap-6">
                            {!isLoggedIn ? (
                                <>
                                    <Link
                                        to="/auth/sign-in"
                                        className="text-gray-600 hover:text-pink-600 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link to="/auth/sign-up">
                                        <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            ) : null}
                        </nav>
                    )}

                    {/* Mobile Menu Button - shown only on mobile and when not logged in */}
                    {isMobile && !isLoggedIn && (
                        <button
                            className="flex flex-col mr-3"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                        >
                            <span
                                className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-gray-600 my-1 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}
                            ></span>
                            <span
                                className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                            ></span>
                        </button>
                    )}

                    {/* Mobile Menu Dropdown - only for non-logged in users */}
                    <AnimatePresence>
                        {isMobile && mobileMenuOpen && !isLoggedIn && (
                            <motion.div
                                layout
                                className="absolute top-full left-0 right-0 bg-white border-b z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="flex flex-col py-2 justify-center items-center">
                                    <Link
                                        to="/auth/sign-in"
                                        className="text-gray-600 hover:text-pink-600 transition-colors py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/auth/sign-up"
                                        className="py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {/* Show UserIcon only when logged in */}
                    {isLoggedIn && <UserIcon />}
                </header>
            </div>
        </>
    );
};

export default Header;