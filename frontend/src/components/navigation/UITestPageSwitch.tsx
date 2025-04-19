import { Link, useLocation, useNavigate } from "react-router-dom"; // Vite not nextjs
import { Wrench, Zap } from "lucide-react"; // Or use emoji directly
import { Button } from "@/src/components/ui/!to-migrate/button";

export default function UITestPageSwitch() {
  const location = useLocation();
  const navigate = useNavigate();
  const isTestPage = location.pathname === "/test-page";
  const isAgeVerificationPage =
    location.pathname === "/assessment/age-verification";

  const handleQuickResponse = () => {
    const params = new URLSearchParams(location.search);
    params.set("mode", "quickresponse");

    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isAgeVerificationPage ? (
        <Button
          className="flex items-center gap-2 bg-gray-800/90 hover:bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg transition-all mb-2"
          onClick={handleQuickResponse}
        >
          <Zap className="h-5 w-5" fill="yellow" strokeWidth={0} />
          <span className="hidden sm:inline font-bold text-base">
            Quick Complete
          </span>
        </Button>
      ) : null}

      <Link
        to={isTestPage ? "/" : "/test-page"}
        className="flex items-center gap-2 bg-gray-800/90 hover:bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg transition-all"
      >
        {isTestPage ? (
          <>
            <span>🎨</span>
            <span className="hidden sm:inline font-bold">Back to UI</span>
          </>
        ) : (
          <>
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline font-bold">Developer Mode</span>
          </>
        )}
      </Link>
    </div>
  );
}
