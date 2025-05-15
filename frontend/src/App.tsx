import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './globals.css';
import SignIn from './pages/auth/sign-in';
import SignUp from './pages/auth/sign-up';
import SignOut from './pages/auth/signout';

// Import account management pages
import ProfilePage from './pages/user/profile';
import PasswordPage from './pages/user/password';
import { Toaster } from 'sonner';

// Import assessment components
import AgeVerification from './pages/assessment/steps/age-verification/page';
import CycleLength from './pages/assessment/steps/cycle-length/page';
import PeriodDuration from './pages/assessment/steps/period-duration/page';
import FlowLevel from './pages/assessment/steps/flow/page';
import PainLevel from './pages/assessment/steps/pain/page';
import Symptoms from './pages/assessment/steps/symptoms/page';
import Results from './pages/assessment/results/page';
import ResourcesPage from './pages/assessment/resources/page';
import HistoryPage from './pages/assessment/history/page';
import DetailsPage from './pages/assessment/history/[id]/page';

// Import TestPage component
import TestPage from './pages/developer-mode/page';
import ScrollToTop from './pages/developer-mode/page-components/scroll-to-top';
import LandingPage from './pages/landing-page/page';
import UITestPageSwitch from './components/developer-utils/UITestPageSwitch';

import Header from './components/navbar/Header';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Dark mode
import { ThemeProvider } from './context/theme/ThemeContextProvider';
import { ReactElement } from 'react';
import { useAuth } from '@/src/pages/auth/context/useAuthContext';
import { AssessmentResultProvider } from '@/src/pages/assessment/context/AssessmentResultProvider';

function AppContent(): ReactElement {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 dark:from-gray-900 dark:from-70% dark:to-gray-800">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            border: '1px solid #fce7f3',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <Header isLoggedIn={isAuthenticated} />
        <main className="flex min-h-screen flex-col">
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/test-page" element={<TestPage />} />

            {/* Assessment routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/assessment">
                <Route index element={<LandingPage />} />
                <Route
                  path="age-verification"
                  element={
                    <AssessmentResultProvider>
                      <AgeVerification />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="cycle-length"
                  element={
                    <AssessmentResultProvider>
                      <CycleLength />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="period-duration"
                  element={
                    <AssessmentResultProvider>
                      <PeriodDuration />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="flow"
                  element={
                    <AssessmentResultProvider>
                      <FlowLevel />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="pain"
                  element={
                    <AssessmentResultProvider>
                      <PainLevel />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="symptoms"
                  element={
                    <AssessmentResultProvider>
                      <Symptoms />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="results"
                  element={
                    <AssessmentResultProvider>
                      <Results />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="resources"
                  element={
                    <AssessmentResultProvider>
                      <ResourcesPage />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="history"
                  element={
                    <AssessmentResultProvider>
                      <HistoryPage />
                    </AssessmentResultProvider>
                  }
                />
                <Route
                  path="history/:id"
                  element={
                    <AssessmentResultProvider>
                      <DetailsPage />
                    </AssessmentResultProvider>
                  }
                />
              </Route>
            </Route>

            {/* Other routes */}
            <Route path="/test" element={<TestPage />} />

            {/* Authentication routes */}
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/signout" element={<SignOut />} />

            {/* User routes */}
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/password" element={<PasswordPage />} />
          </Routes>
          <UITestPageSwitch />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default function App(): ReactElement {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
