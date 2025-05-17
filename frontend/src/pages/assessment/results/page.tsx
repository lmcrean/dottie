import { Link } from 'react-router-dom';
import { Button } from '@/src/components/buttons/button';
import { Card } from '@/src/components/ui/card';
import { MessageCircle } from 'lucide-react';

import { useState, useEffect } from 'react';
import { ChatModal } from '@/src/pages/chat/page';
import { FullscreenChat } from '@/src/pages/chat/FullScreenChat';
import { useAssessmentData } from '../context/hooks/useAssessmentData';
import { ResultsTable } from './components/ResultsTable';
import { SaveResults } from './components/save-results-button/SaveResultsButton';
import { PATTERN_DATA } from '../context/types/recommendations';
import { DeterminedPattern } from '../components/results-table';

export default function ResultsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreenChatOpen, setIsFullscreenChatOpen] = useState(false);
  const assessmentData = useAssessmentData();

  // Force progress bars to update when values change
  useEffect(() => {
    // Trigger a re-render when these values change
    const progressElements = document.querySelectorAll('.bg-pink-600.h-2.rounded-full');
    if (progressElements.length > 0) {
      // This forces a style recalculation
      progressElements.forEach((el) => {
        el.classList.remove('bg-pink-500');
        setTimeout(() => el.classList.add('bg-pink-500'), 0);
      });
    }
  }, [
    assessmentData.age,
    assessmentData.cycle_length,
    assessmentData.period_duration,
    assessmentData.flow_heaviness,
    assessmentData.pain_level
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-4xl flex-1 p-6">
        <div className="mb-8 h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 w-full rounded-full bg-pink-500 transition-all duration-500"></div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold dark:text-slate-100">Your Assessment Results</h1>
          <p className="text-gray-600 dark:text-slate-200">
            {" Based on your responses, here's what we've found about your menstrual health."}
          </p>
        </div>

        <DeterminedPattern pattern={assessmentData.pattern} />

        <Card className="mb-8 w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800">
          <ResultsTable
            data={assessmentData}
            setIsClamped={assessmentData.setIsClamped}
            setExpandableSymptoms={assessmentData.setExpandableSymptoms}
          />
        </Card>

        <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            className="flex items-center justify-center gap-2 bg-pink-600 px-6 py-6 text-lg text-white hover:bg-pink-700"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="h-5 w-5" />
            Chat with Dottie
          </Button>
          <SaveResults />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link to="/assessment/history">
            <Button
              variant="outline"
              className="flex items-center px-6 py-6 text-lg dark:bg-gray-900 dark:text-pink-600 dark:hover:text-pink-700"
            >
              View History
            </Button>
          </Link>
        </div>
      </main>

      {isChatOpen &&
        (isFullscreenChatOpen ? (
          <FullscreenChat
            onClose={() => setIsChatOpen(false)}
            setIsFullscreen={setIsFullscreenChatOpen}
            initialMessage={`Hi! I've just completed my menstrual health assessment. My results show: ${PATTERN_DATA[assessmentData.pattern].title}. Can you tell me more about what this means?`}
          />
        ) : (
          <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            setIsFullscreen={setIsFullscreenChatOpen}
            initialMessage={`Hi! I've just completed my menstrual health assessment. My results show: ${PATTERN_DATA[assessmentData.pattern].title}. Can you tell me more about what this means?`}
          />
        ))}
    </div>
  );
}
