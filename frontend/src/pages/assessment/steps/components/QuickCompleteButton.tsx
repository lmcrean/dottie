import { useLocation, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { Button } from '@/src/components/buttons/button';

export default function QuickCompleteButton() {
  const location = useLocation();
  const navigate = useNavigate();

  // This condition determines if the button is shown, targeting the age-verification step.
  const isTargetStep = location.pathname === '/assessment/age-verification';

  const handleQuickResponse = () => {
    const params = new URLSearchParams(location.search);
    params.set('mode', 'quickresponse');
    navigate(`${location.pathname}?${params.toString()}`);
  };

  if (!isTargetStep) {
    return null;
  }

  return (
    <Button
      className="mb-2 flex items-center gap-2 rounded-full bg-gray-800/90 px-4 py-2 text-white shadow-lg transition-all hover:bg-gray-900"
      onClick={handleQuickResponse}
    >
      <Zap className="h-5 w-5" fill="yellow" strokeWidth={0} />
      <span className="hidden text-base font-bold sm:inline">Quick Complete</span>
    </Button>
  );
}
