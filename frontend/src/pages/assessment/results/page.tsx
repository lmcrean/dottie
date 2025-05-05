import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { MessageCircle, Save, Share2, Download } from 'lucide-react';

import { useEffect, useState } from 'react';
import { ChatModal } from '@/src/pages/chat/page';
import { FullscreenChat } from '@/src/pages/chat/FullScreenChat';
import { toast } from 'sonner';
import { Assessment } from '@/src/api/assessment/types';
import { postSend } from '@/src/api/assessment/requests/postSend/Request';
import { useAuth } from '@/src/context/auth/useAuthContext';
import { useAssessmentResult } from '@/src/hooks/use-assessment-result';

// Define the types of menstrual patterns as per LogicTree.md
type MenstrualPattern = 'regular' | 'irregular' | 'heavy' | 'pain' | 'developing';

interface PatternInfo {
  title: string;
  description: string;
  icon: string;
  recommendations: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const patternData: Record<MenstrualPattern, PatternInfo> = {
  regular: {
    title: 'Regular Menstrual Cycles',
    description:
      'Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.',
    icon: '/patternDataIcons/regularMenstrualCycles.svg',
    recommendations: [
      {
        icon: '📅',
        title: 'Track Your Cycle',
        description:
          'Regular tracking will help you understand your patterns better and predict your next period.'
      },
      {
        icon: '🏃‍♀️',
        title: 'Exercise Regularly',
        description: 'Light to moderate exercise can help reduce menstrual pain and improve mood.'
      },
      {
        icon: '❤️',
        title: 'Maintain a Balanced Diet',
        description:
          'Foods rich in iron, calcium, and omega-3 fatty acids can help manage period symptoms.'
      },
      {
        icon: '🌙',
        title: 'Prioritize Sleep',
        description:
          'Aim for 8-10 hours of sleep, especially during your period when fatigue is common.'
      }
    ]
  },
  irregular: {
    title: 'Irregular Timing Pattern',
    description:
      'Your cycle length is outside the typical range, which may indicate hormonal fluctuations.',
    icon: '/patternDataIcons/irregularTimingPattern.svg',
    recommendations: [
      {
        icon: '📅',
        title: 'Track Your Cycle',
        description:
          'Keeping a detailed record can help identify patterns and share with healthcare providers.'
      },
      {
        icon: '👩‍⚕️',
        title: 'Consult a Healthcare Provider',
        description:
          'If your cycles are consistently irregular, consider discussing with a healthcare provider.'
      },
      {
        icon: '🥗',
        title: 'Focus on Nutrition',
        description: 'A balanced diet can help support hormonal balance and regulate cycles.'
      },
      {
        icon: '🧘‍♀️',
        title: 'Stress Management',
        description:
          'High stress can affect your cycle. Consider yoga, meditation, or other relaxation techniques.'
      }
    ]
  },
  heavy: {
    title: 'Heavy or Prolonged Flow Pattern',
    description:
      'Your flow is heavier or longer than typical, which could impact your daily activities.',
    icon: '/patternDataIcons/heavyOrProlongedFlowPattern.svg',
    recommendations: [
      {
        icon: '🍳',
        title: 'Iron-rich Foods',
        description:
          'Include lean red meat, spinach, beans, and fortified cereals to prevent iron deficiency.'
      },
      {
        icon: '💧',
        title: 'Stay Hydrated',
        description: 'Drink plenty of water to help replace fluids lost during your period.'
      },
      {
        icon: '👩‍⚕️',
        title: 'Medical Evaluation',
        description:
          'If your flow regularly soaks through pads/tampons hourly, consult a healthcare provider.'
      },
      {
        icon: '⏰',
        title: 'Plan Ahead',
        description: 'Keep extra supplies and a change of clothes available during heavy flow days.'
      }
    ]
  },
  pain: {
    title: 'Pain-Predominant Pattern',
    description:
      'Your menstrual pain is higher than typical and may interfere with daily activities.',
    icon: '/patternDataIcons/painPredominantPattern.svg',
    recommendations: [
      {
        icon: '🔥',
        title: 'Heat Therapy',
        description: 'Apply a heating pad to your lower abdomen to help relieve menstrual cramps.'
      },
      {
        icon: '��',
        title: 'Pain Management',
        description:
          'Over-the-counter pain relievers like ibuprofen can help reduce pain and inflammation.'
      },
      {
        icon: '🧘‍♀️',
        title: 'Gentle Exercise',
        description:
          'Light activities like walking or stretching can help alleviate menstrual pain.'
      },
      {
        icon: '👩‍⚕️',
        title: 'Medical Support',
        description:
          'If pain is severe, talk to a healthcare provider about additional treatment options.'
      }
    ]
  },
  developing: {
    title: 'Developing Pattern',
    description:
      'Your cycles are still establishing a regular pattern, which is normal during adolescence.',
    icon: '/patternDataIcons/developingPattern.svg',
    recommendations: [
      {
        icon: '⏱️',
        title: 'Be Patient',
        description:
          "It's normal for your cycle to be irregular during adolescence. It can take 2-3 years to establish a regular pattern."
      },
      {
        icon: '📅',
        title: 'Track Your Cycle',
        description: 'Start keeping a record of your periods to observe patterns as they develop.'
      },
      {
        icon: '🧠',
        title: 'Learn About Your Body',
        description: "Understanding menstrual health can help you recognize what's normal for you."
      },
      {
        icon: '👩‍👧',
        title: 'Talk to Someone You Trust',
        description: 'Discuss concerns with a parent, school nurse, or healthcare provider.'
      }
    ]
  }
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { result, transformToFlattenedFormat } = useAssessmentResult();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreenChatOpen, setIsFullscreenChatOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [pattern, setPattern] = useState<MenstrualPattern>('regular');
  const [age, setAge] = useState<string | null>(null);
  const [cycleLength, setCycleLength] = useState<string | null>(null);
  const [periodDuration, setPeriodDuration] = useState<string | null>(null);
  const [flowLevel, setFlowLevel] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<{ physical: string[]; emotional: string[] }>({
    physical: [],
    emotional: []
  });

  useEffect(() => {
    // Load data from session storage when component mounts
    const storedAge = sessionStorage.getItem('age');
    const storedCycleLength = sessionStorage.getItem('cycleLength');
    const storedPeriodDuration = sessionStorage.getItem('periodDuration');
    const storedFlowLevel = sessionStorage.getItem('flowHeaviness');
    const storedPainLevel = sessionStorage.getItem('painLevel');
    const storedSymptoms = sessionStorage.getItem('symptoms');

    // Helper function to safely parse JSON or return default
    const parseJSON = <T,>(jsonString: string | null, defaultValue: T): T => {
      if (!jsonString) return defaultValue;
      try {
        return JSON.parse(jsonString) as T;
      } catch {
        return defaultValue;
      }
    };

    // Set state from session storage
    setAge(parseJSON(storedAge, null));
    setCycleLength(parseJSON(storedCycleLength, null));
    setPeriodDuration(parseJSON(storedPeriodDuration, null));
    setFlowLevel(parseJSON(storedFlowLevel, null));
    setPainLevel(parseJSON(storedPainLevel, null));
    setSymptoms(parseJSON(storedSymptoms, { physical: [], emotional: [] }));

    // Determine pattern based on stored values (simplified logic)
    let determinedPattern: MenstrualPattern = 'regular';
    // Simplified checks based on typical values, removing containsAny
    if (storedCycleLength?.includes('irregular') || storedCycleLength?.includes('less-than-21')) {
      determinedPattern = 'irregular';
    } else if (storedFlowLevel?.includes('heavy') || storedFlowLevel?.includes('very-heavy')) {
      determinedPattern = 'heavy';
    } else if (storedPainLevel?.includes('severe') || storedPainLevel?.includes('debilitating')) {
      determinedPattern = 'pain';
    } else if (storedAge?.includes('under-13') || storedAge?.includes('13-17')) {
      determinedPattern = 'developing';
    }
    setPattern(determinedPattern);

    // The following code for categorizing symptoms is not used, so we'll remove it
  }, []); // Removed symptoms dependency since we're not using categorizedSymptoms

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
  }, [age, cycleLength, periodDuration, flowLevel, painLevel]);

  // Function to handle saving assessment results
  const handleSaveResults = async () => {
    setIsSaving(true);

    // Add null check for result before transforming
    if (!result) {
      toast.error('Assessment data is not available.');
      setIsSaving(false);
      return;
    }

    try {
      // Create assessment data object using the flattened format from the hook
      const assessmentPayload = transformToFlattenedFormat(result); // Now result is guaranteed non-null

      // Ensure user_id is included (assuming user context provides it)
      const finalPayload: Omit<Assessment, 'id' | 'created_at' | 'updated_at'> & {
        user_id: string;
      } = {
        ...assessmentPayload,
        user_id: user?.id || '' // Corrected key: userId -> user_id. Get user ID from auth context
      };

      if (!finalPayload.user_id) {
        toast.error('User not found. Please login again.');
        setIsSaving(false);
        return;
      }

      // Type assertion might be needed if postSend expects slightly different structure
      // For now, assume postSend accepts this payload
      const savedAssessment = await postSend(finalPayload as Omit<Assessment, 'id'>);

      toast.success('Assessment saved successfully!');
      navigate(`/assessment/history/${savedAssessment.id}`);
    } catch (error) {
      console.error('Failed to save assessment:', error);
      toast.error('Failed to save assessment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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

        <Card className="mb-8 w-full border shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-slate-800">
          <CardContent className="pb-8 pt-8">
            <div className="mb-8 text-center">
              <img
                src={patternData[pattern].icon}
                className="mx-auto mb-2 h-24 w-24"
                alt="menstrual-pattern-icon"
              />
              <h2 className="mb-2 text-2xl font-bold text-pink-600">
                {patternData[pattern].title}
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-slate-200">
                {patternData[pattern].description}
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 dark:text-gray-900 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <img src="/resultAssets/time.svg" className="h-[55px] w-[55px]" alt="time-icon" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">Age Range</h3>
                  <p className="text-gray-600">{age || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <img
                    src="/resultAssets/calendar.svg"
                    className="h-[55px] w-[55px]"
                    alt="calendar-icon"
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">Cycle Length</h3>
                  <p className="text-gray-600">{cycleLength || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <img src="/resultAssets/drop.svg" className="h-[55px] w-[55px]" alt="drop-icon" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">Period Duration</h3>
                  <p className="text-gray-600">{periodDuration || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <img
                    src="/resultAssets/d-drop.svg"
                    className="h-[55px] w-[55px]"
                    alt="d-drop-icon"
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">Flow Level</h3>
                  <p className="text-gray-600">{flowLevel || 'Not specified'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <img
                    src="/resultAssets/emotion.svg"
                    className="h-[55px] w-[55px]"
                    alt="emotion-icon"
                  />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-medium">Pain Level</h3>
                  <p
                    className={`font-medium ${
                      pattern === 'pain'
                        ? 'text-red-600'
                        : pattern === 'heavy'
                          ? 'text-orange-600'
                          : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {painLevel || 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex w-full max-w-full items-start gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <img
                    src="/resultAssets/track-time.svg"
                    className="h-[55px] w-[55px]"
                    alt="track-time-icon"
                  />
                </div>
                <div className="flex-1 overflow-x-auto">
                  <h3 className="mb-2 text-lg font-medium">Symptoms</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {symptoms?.physical?.length > 0
                      ? symptoms.physical.join(', ')
                      : 'None specified'}
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mb-4 text-xl font-bold">Recommendations</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {patternData[pattern].recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="rounded-xl border p-4 transition-colors duration-300 hover:bg-pink-50 dark:border-slate-800 dark:hover:text-gray-900"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{rec.icon}</div>
                    <div>
                      <h4 className="text-lg font-medium">{rec.title}</h4>
                      <p className="text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            className="flex items-center justify-center gap-2 bg-pink-600 px-6 py-6 text-lg text-white hover:bg-pink-700"
            onClick={() => setIsChatOpen(true)}
          >
            <MessageCircle className="h-5 w-5" />
            Chat with Dottie
          </Button>
          <Button
            className="flex items-center justify-center gap-2 border border-pink-200 bg-white px-6 py-6 text-lg text-pink-600 hover:bg-pink-50"
            onClick={handleSaveResults}
            disabled={isSaving}
          >
            <Save className="h-5 w-5 hover:text-pink-700" />
            {isSaving ? 'Saving...' : 'Save Results'}
          </Button>
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

          <div className="hidden gap-4">
            <Button variant="outline" className="flex items-center gap-2 px-6 py-6 text-lg">
              <Share2 className="h-5 w-5" />
              Share
            </Button>
            <Button variant="outline" className="flex items-center gap-2 px-6 py-6 text-lg">
              <Download className="h-5 w-5" />
              Download
            </Button>
          </div>
        </div>
      </main>

      {isChatOpen &&
        (isFullscreenChatOpen ? (
          <FullscreenChat
            onClose={() => setIsChatOpen(false)}
            setIsFullscreen={setIsFullscreenChatOpen}
            initialMessage={`Hi! I've just completed my menstrual health assessment. My results show: ${patternData[pattern].title}. Can you tell me more about what this means?`}
          />
        ) : (
          <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            setIsFullscreen={setIsFullscreenChatOpen}
            initialMessage={`Hi! I've just completed my menstrual health assessment. My results show: ${patternData[pattern].title}. Can you tell me more about what this means?`}
          />
        ))}
    </div>
  );
}
