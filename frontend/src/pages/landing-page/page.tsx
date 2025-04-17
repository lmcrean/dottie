import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DotIcon, Calendar, Brain, BookOpen } from "lucide-react";
import { Button } from "@/src/components/ui/!to-migrate/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-pink-50">
      <header className="flex items-center justify-between p-6 border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <motion.div
          className="flex items-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DotIcon className="h-6 w-6 text-pink-500 fill-pink-500" />
          <img src="/chatb.png" alt="Dottie Logo" className="w-10 h-10" />
          <span className="font-bold text-xl text-pink-500">Dottie</span>
        </motion.div>
        <nav className="hidden md:flex items-center gap-6">
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
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your Personal
                <span className="text-pink-500"> Menstrual Health </span>
                Companion
              </motion.h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Track, understand, and take control of your menstrual health
                journey with AI-powered insights and personalized guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to="/auth/sign-up">
                  <Button className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-6">
                    Start Your Journey
                  </Button>
                </Link>
                <Link to="/auth/sign-in">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-lg px-8 py-6"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-white">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
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
                <Calendar className="h-12 w-12 text-pink-500 mb-6" />
                <h3 className="font-bold text-xl mb-4">Track Your Cycle</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your menstrual patterns with precision and predict
                  your next period with AI-powered insights.
                </p>
              </motion.div>
              <motion.div
                className="p-8 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-colors"
                whileHover={{ scale: 1.03 }}
              >
                <Brain className="h-12 w-12 text-pink-500 mb-6" />
                <h3 className="font-bold text-xl mb-4">
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
                <BookOpen className="h-12 w-12 text-pink-500 mb-6" />
                <h3 className="font-bold text-xl mb-4">Stay Informed</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access comprehensive educational resources and expert advice
                  about menstrual health.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-pink-50 to-white">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of users who trust Dottie for their menstrual
              health journey.
            </p>
            <Link to="/auth/sign-up">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-6">
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Dottie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
