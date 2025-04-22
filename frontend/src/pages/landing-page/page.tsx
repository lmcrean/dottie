import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Brain, BookOpen } from "lucide-react";
import { Button } from "@/src/components/ui/!to-migrate/button";
import DottieMascot3D from "@/src/components/DottieMascot3D";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import { useAuth } from "@/src/context/AuthContext";

export default function LandingPage(): JSX.Element {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="text-left space-y-8"
                initial={{
                  opacity: 0,
                  scale: 0.5,
                  transform: "translateY(200px)",
                }}
                animate={{ opacity: 1, scale: 1, transform: "translateY(0)" }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-slate-100 leading-tight">
                  Your Personal
                  <motion.span
                    initial={{ color: "#111827" }}
                    animate={{ color: "#db2777" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    {" "}
                    Menstrual Health{" "}
                  </motion.span>
                  Companion
                </motion.h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-200">
                  Track, understand, and take control of your menstrual health
                  journey with AI-powered insights and personalized guidance.
                </p>

                {!isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/auth/sign-up">
                      <Button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-6">
                        Start Your Journey
                      </Button>
                    </Link>
                    <Link to="/auth/sign-in">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto text-lg px-8 py-6 dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/assessment/age-verification">
                      <Button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-6">
                        Go to Assessment
                      </Button>
                    </Link>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="w-full h-[500px]"
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
        <section className="py-20 px-6">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.5, transform: "translateY(200px)" }}
            animate={{ opacity: 1, scale: 1, transform: "translateY(0)" }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              How Dottie Helps You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <motion.div
                className="p-8 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors"
                whileHover={{ scale: 1.03 }}
              >
                <Calendar className="h-12 w-12 text-pink-600 mb-6" />
                <h3 className="font-bold dark:text-gray-900 text-xl mb-4">Track Your Cycle</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your menstrual patterns with precision and predict
                  your next period with AI-powered insights.
                </p>
              </motion.div>
              <motion.div
                className="p-8 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors"
                whileHover={{ scale: 1.03 }}
              >
                <Brain className="h-12 w-12 text-pink-600 mb-6" />
                <h3 className="font-bold dark:text-gray-900 text-xl mb-4">
                  Get Personalized Insights
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive tailored recommendations and understand your unique
                  patterns through advanced analytics.
                </p>
              </motion.div>
              <motion.div
                className="p-8 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors"
                whileHover={{ scale: 1.03 }}
              >
                <BookOpen className="h-12 w-12 text-pink-600 mb-6" />
                <h3 className="font-bold dark:text-gray-900 text-xl mb-4">Stay Informed</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access comprehensive educational resources and expert advice
                  about menstrual health.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section - Only show when not authenticated */}
        {!isAuthenticated && (
          <section className="py-20 px-6">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{
                opacity: 0,
                scale: 0.5,
                transform: "translateY(150px)",
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                transform: "translateY(0)",
              }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Ready to Take Control?
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-200 mb-12">
                Join thousands of users who trust Dottie for their menstrual
                health journey.
              </p>
              <Link to="/auth/sign-up">
                <Button className="bg-pink-600 hover:bg-pink-700 text-white text-lg px-8 py-6">
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </section>
        )}
      </main>

      <footer className="border-t py-8 dark:border-t-slate-700">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600 dark:text-slate-200">
          <p>© {new Date().getFullYear()} Dottie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
