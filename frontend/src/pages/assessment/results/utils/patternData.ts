import { MenstrualPattern } from '@/src/context/assessment/types';

export interface PatternInfo {
  title: string;
  description: string;
  icon: string;
  recommendations: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export const patternData: Record<MenstrualPattern, PatternInfo> = {
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
        icon: '💊',
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
