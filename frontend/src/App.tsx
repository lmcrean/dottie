import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import SignOut from "./pages/auth/signout";

// Import account management pages
import ProfilePage from "./pages/user/profile";
import PasswordPage from "./pages/user/password";
import { Toaster } from "sonner";

// Import assessment components
import AgeVerification from "./pages/assessment/age-verification/page";
import CycleLength from "./pages/assessment/cycle-length/page";
import PeriodDuration from "./pages/assessment/period-duration/page";
import FlowLevel from "./pages/assessment/flow/page";
import PainLevel from "./pages/assessment/pain/page";
import Symptoms from "./pages/assessment/symptoms/page";
import Results from "./pages/assessment/results/page";
import ResourcesPage from "./pages/assessment/resources/page";
import HistoryPage from "./pages/assessment/history/page";
import DetailsPage from "./pages/assessment/history/[id]/page";
// Import TestPage component
import TestPage from "./test_page/page";
import ScrollToTop from "./components/scroll-to-top";
import LandingPage from "./pages/landing-page/page";
import UITestPageSwitch from "./components/navigation/UITestPageSwitch";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: {
            border: "1px solid #fce7f3",
            borderRadius: "0.75rem",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <main className="flex min-h-screen flex-col">
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/test-page" element={<TestPage />} />

            {/* Assessment routes */}
            <Route path="/assessment">
              <Route index element={<LandingPage />} />
              <Route path="age-verification" element={<AgeVerification />} />
              <Route path="cycle-length" element={<CycleLength />} />
              <Route path="period-duration" element={<PeriodDuration />} />
              <Route path="flow" element={<FlowLevel />} />
              <Route path="pain" element={<PainLevel />} />
              <Route path="symptoms" element={<Symptoms />} />
              <Route path="results" element={<Results />} />
              <Route path="resources" element={<ResourcesPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="history/:id" element={<DetailsPage />} />
            </Route>

            {/* Other routes */}
            <Route path="/test" element={<TestPage />} />

            {/* Authentication routes */}
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/signout" element={<SignOut />} />

            {/* Account management routes */}
            <Route path="/account/profile" element={<ProfilePage />} />
            <Route path="/account/password" element={<PasswordPage />} />
          </Routes>
          <UITestPageSwitch />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
