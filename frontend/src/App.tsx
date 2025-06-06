import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './globals.css';
import SignIn from './pages/auth/sign-in/sign-in';
import SignUp from './pages/auth/sign-up/sign-up';
import SignOut from './pages/auth/components/modal-confirm/signout';

// Import account management pages
import ProfilePage from './pages/user/profile/profile';
import PasswordPage from './pages/user/password/password';

// Import assessment components
import AgeVerification from './pages/assessment/steps/1-age-verification/page';
import CycleLength from './pages/assessment/steps/2-cycle-length/page';
import PeriodDuration from './pages/assessment/steps/3-period-duration/page';
import FlowLevel from './pages/assessment/steps/4-flow/page';
import PainLevel from './pages/assessment/steps/5-pain/page';
import Symptoms from './pages/assessment/steps/6-symptoms/page';
import CalculatePattern from './pages/assessment/steps/7-calculate-pattern/page';
import GenerateRecommendations from './pages/assessment/steps/8-generate-recommendation/page';
import SaveAssessment from './pages/assessment/steps/9-save/page';
import Results from './pages/assessment/detail/page';
import ResourcesPage from './pages/assessment/components/resources/page';
import HistoryPage from './pages/assessment/list/page';
import DetailsPage from './pages/assessment/detail/page';

// Import chat components
import ChatPage from './pages/chat/page';

// Import TestPage component
import TestPage from './pages/developer-mode/page';
import ScrollToTop from './pages/developer-mode/page-components/scroll-to-top';
import LandingPage from './pages/landing-page/page';
import { AppLayout } from './components/layouts/AppLayout';

import { ProtectedRoute } from './routes/ProtectedRoute';

// Dark mode
import { ThemeProvider } from './context/theme/ThemeContextProvider';
import { ReactElement } from 'react';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';

function AppContent(): ReactElement {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/test-page" element={<TestPage />} />
          <Route path="/test" element={<TestPage />} />

          {/* Authentication routes */}
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/signout" element={<SignOut />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* Assessment routes */}
            <Route path="/assessment" element={<LandingPage />} />
            <Route
              path="/assessment/age-verification"
              element={
                <AssessmentResultProvider>
                  <AgeVerification />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/cycle-length"
              element={
                <AssessmentResultProvider>
                  <CycleLength />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/period-duration"
              element={
                <AssessmentResultProvider>
                  <PeriodDuration />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/flow"
              element={
                <AssessmentResultProvider>
                  <FlowLevel />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/pain"
              element={
                <AssessmentResultProvider>
                  <PainLevel />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/symptoms"
              element={
                <AssessmentResultProvider>
                  <Symptoms />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/calculate-pattern"
              element={
                <AssessmentResultProvider>
                  <CalculatePattern />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/generate-recommendations"
              element={
                <AssessmentResultProvider>
                  <GenerateRecommendations />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/save"
              element={
                <AssessmentResultProvider>
                  <SaveAssessment />
                </AssessmentResultProvider>
              }
            />
            {/* Assessment results routes - handle both with and without ID */}
            <Route
              path="/assessment/results"
              element={
                <AssessmentResultProvider>
                  <Results />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/results/:id"
              element={
                <AssessmentResultProvider>
                  <Results />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/resources"
              element={
                <AssessmentResultProvider>
                  <ResourcesPage />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/history"
              element={
                <AssessmentResultProvider>
                  <HistoryPage />
                </AssessmentResultProvider>
              }
            />
            <Route
              path="/assessment/history/:id"
              element={
                <AssessmentResultProvider>
                  <DetailsPage />
                </AssessmentResultProvider>
              }
            />

            {/* Chat routes */}
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:conversationId" element={<ChatPage />} />

            {/* User routes */}
            <Route path="/user/profile" element={<ProfilePage />} />
            <Route path="/user/password" element={<PasswordPage />} />
          </Route>
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default function App(): ReactElement {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
