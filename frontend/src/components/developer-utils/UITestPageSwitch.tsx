import { Link, useLocation } from 'react-router-dom'; // Vite not nextjs. useNavigate and Button removed.
import { Wrench } from 'lucide-react'; // Zap removed
// Button import removed
import QuickCompleteButton from '@/src/pages/assessment/steps/components/QuickCompleteButton';

export default function UITestPageSwitch() {
  const location = useLocation();
  // navigate removed
  const isTestPage = location.pathname === '/test-page';
  // isAgeVerificationPage removed

  // handleQuickResponse function removed

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <QuickCompleteButton />
      {/* Quick Complete Button and its conditional rendering removed */}

      <Link
        to={isTestPage ? '/' : '/test-page'}
        className="flex items-center gap-2 rounded-full bg-gray-800/90 px-4 py-2 text-white shadow-lg transition-all hover:bg-gray-900"
      >
        {isTestPage ? (
          <>
            <span>🎨</span>
            <span className="hidden font-bold sm:inline">Back to UI</span>
          </>
        ) : (
          <>
            <Wrench className="h-4 w-4" />
            <span className="hidden font-bold sm:inline">Developer Mode</span>
          </>
        )}
      </Link>
    </div>
  );
}
