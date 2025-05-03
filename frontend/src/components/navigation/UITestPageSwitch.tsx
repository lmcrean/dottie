import { Link, useLocation, useNavigate } from 'react-router-dom'; // Vite not nextjs
import { Wrench, Zap } from 'lucide-react'; // Or use emoji directly
import { Button } from '@/src/components/ui/!to-migrate/button';

export default function UITestPageSwitch() {
  const location = useLocation();
  const navigate = useNavigate();
  const isTestPage = location.pathname === '/test-page';
  const isAgeVerificationPage = location.pathname === '/assessment/age-verification';

  const handleQuickResponse = () => {
    const params = new URLSearchParams(location.search);
    params.set('mode', 'quickresponse');

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isAgeVerificationPage ? (
        <Button
          className="mb-2 flex items-center gap-2 rounded-full bg-gray-800/90 px-4 py-2 text-white shadow-lg transition-all hover:bg-gray-900"
          onClick={handleQuickResponse}
        >
          <Zap className="h-5 w-5" fill="yellow" strokeWidth={0} />
          <span className="hidden text-base font-bold sm:inline">Quick Complete</span>
        </Button>
      ) : null}

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
