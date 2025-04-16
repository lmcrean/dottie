import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Vite not nextjs
import { Wrench, Zap } from "lucide-react"; // Or use emoji directly
import { ChatModal } from "@/src/pages/chat/page";
import { Button } from "@/src/components/ui/!to-migrate/button";

export default function UITestPageSwitch() {
  const location = useLocation();
  const isTestPage = location.pathname === "/test-page";
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsChatOpen(true)}
        className="flex items-center gap-2 bg-gray-800/90 hover:bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg transition-all"
      >
        <Zap className="h-4 w-4" fill="yellow" strokeWidth={0} />
        <span className="hidden sm:inline font-bold">Quick Complete</span>
      </Button>
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
      {isChatOpen && (
        <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </div>
  );
}
