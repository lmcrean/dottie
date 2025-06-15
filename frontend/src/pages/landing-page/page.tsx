import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Brain, BookOpen } from 'lucide-react';
import { Button } from '@/src/components/buttons/button';
import DottieMascot3D from '@/src/pages/landing-page/DottieMascot3D';
import ErrorBoundary from '@/src/components/alerts/ErrorBoundary';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';

// import { ReactElement } from 'react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
              <motion.div
                className="space-y-8 text-left"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  transform: 'translateY(200px)'
                }}
                animate={{ opacity: 1, scale: 1, transform: 'translateY(0)' }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 className="text-5xl font-bold leading-tight text-gray-900 dark:text-slate-100 md:text-6xl">
                  Your Personal
                  <motion.span
                    initial={{ color: '#111827' }}
                    animate={{ color: '#db2777' }}
                    transition={{ duration: 3, ease: 'easeInOut' }}
                  >
                    {' '}
                    Menstrual Health{' '}
                  </motion.span>
                  Companion
                </motion.h1>
                <p className="text-xl text-gray-600 dark:text-slate-200 md:text-2xl">
                  Track, understand, and take control of your menstrual health journey with
                  AI-powered insights and personalized guidance.
                </p>

                {!isAuthenticated && (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link to="/auth/sign-up">
                      <Button className="w-full bg-pink-600 px-8 py-6 text-lg text-white hover:bg-pink-700 sm:w-auto">
                        Start Your Journey
                      </Button>
                    </Link>
                    <Link to="/auth/sign-in">
                      <Button
                        variant="outline"
                        className="w-full px-8 py-6 text-lg dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700 sm:w-auto"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link to="/assessment/age-verification">
                      <Button className="w-full bg-pink-600 px-8 py-6 text-lg text-white hover:bg-pink-700 sm:w-auto">
                        Go to Assessment
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="h-[500px] w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <ErrorBoundary>
                  <DottieMascot3D />
                </ErrorBoundary>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20">
          <motion.div
            className="mx-auto max-w-6xl"
            initial={{ opacity: 0, scale: 0.5, transform: 'translateY(200px)' }}
            animate={{ opacity: 1, scale: 1, transform: 'translateY(0)' }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
              How Dottie Helps You
            </h2>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <motion.div
                className="rounded-2xl bg-pink-50 p-8 transition-colors hover:bg-pink-100"
                whileHover={{ scale: 1.03 }}
              >
                <Calendar className="mb-6 h-12 w-12 text-pink-600" />
                <h3 className="mb-4 text-xl font-bold dark:text-gray-900">Track Your Cycle</h3>
                <p className="leading-relaxed text-gray-600">
                  Monitor your menstrual patterns with precision and predict your next period with
                  AI-powered insights.
                </p>
              </motion.div>
              <motion.div
                className="rounded-2xl bg-pink-50 p-8 transition-colors hover:bg-pink-100"
                whileHover={{ scale: 1.03 }}
              >
                <Brain className="mb-6 h-12 w-12 text-pink-600" />
                <h3 className="mb-4 text-xl font-bold dark:text-gray-900">
                  Get Personalized Insights
                </h3>
                <p className="leading-relaxed text-gray-600">
                  Receive tailored recommendations and understand your unique patterns through
                  advanced analytics.
                </p>
              </motion.div>
              <motion.div
                className="rounded-2xl bg-pink-50 p-8 transition-colors hover:bg-pink-100"
                whileHover={{ scale: 1.03 }}
              >
                <BookOpen className="mb-6 h-12 w-12 text-pink-600" />
                <h3 className="mb-4 text-xl font-bold dark:text-gray-900">Stay Informed</h3>
                <p className="leading-relaxed text-gray-600">
                  Access comprehensive educational resources and expert advice about menstrual
                  health.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section - Only show when not authenticated */}
        {!isAuthenticated && (
          <section className="px-6 py-20">
            <motion.div
              className="mx-auto max-w-4xl text-center"
              initial={{
                opacity: 0,
                scale: 0.5,
                transform: 'translateY(150px)'
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                transform: 'translateY(0)'
              }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-8 text-3xl font-bold md:text-4xl">Ready to Take Control?</h2>
              <p className="mb-12 text-xl text-gray-600 dark:text-slate-200">
                Join thousands of users who trust Dottie for their menstrual health journey.
              </p>
              <Link to="/auth/sign-up">
                <Button className="bg-pink-600 px-8 py-6 text-lg text-white hover:bg-pink-700">
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </section>
        )}
      </main>

      <footer className="border-t py-8 dark:border-t-slate-700">
        <div className="mx-auto max-w-6xl px-6 text-center text-gray-600 dark:text-slate-200">
          <p>© {new Date().getFullYear()} Dottie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
