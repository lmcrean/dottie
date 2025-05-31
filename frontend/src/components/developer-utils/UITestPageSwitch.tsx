import { Link, useLocation } from 'react-router-dom'; // Vite not nextjs. useNavigate and Button removed.
import { Wrench } from 'lucide-react'; // Zap removed
// Button import removed
import QuickCompleteButton from '@/src/pages/assessment/steps/components/QuickCompleteButton';

export default function UITestPageSwitch() {
  const location = useLocation();
  // navigate removed
  const isTestPage = location.pathname === '/test-page';
  // isAgeVerificationPage removed

  // Check if we're in a development environment (localhost)
  const isLocalhost = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.startsWith('192.168.') ||
     window.location.hostname.startsWith('10.') ||
     window.location.hostname.startsWith('172.'));

  // handleQuickResponse function removed

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Only show QuickCompleteButton in localhost/development environments */}
      {isLocalhost && <QuickCompleteButton />}
      {/* Developer Mode toggle button hidden - only keeping QuickCompleteButton for testing */}
      {/* 
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
      */}
    </div>
  );
}
