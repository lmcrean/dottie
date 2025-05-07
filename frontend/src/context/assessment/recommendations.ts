import { Recommendation } from './types';

export const RECOMMENDATIONS: Record<string, Recommendation> = {
  // General recommendations
  track_cycle: {
    id: 'track_cycle',
    title: 'Track Your Cycle',
    description: 'Keep a record of when your period starts and stops to identify patterns.',
    category: 'general',
    priority: 1
  },

  // Pattern-specific recommendations
  irregular_consult: {
    id: 'irregular_consult',
    title: 'Consult a Healthcare Provider',
    description: 'Irregular cycles may need medical evaluation to identify underlying causes.',
    category: 'pattern',
    priority: 2
  },
  heavy_iron: {
    id: 'heavy_iron',
    title: 'Iron-Rich Diet',
    description: 'Consider increasing iron intake through diet or supplements to prevent anemia.',
    category: 'pattern',
    priority: 2
  },
  pain_management: {
    id: 'pain_management',
    title: 'Pain Management',
    description: 'Over-the-counter pain relievers like ibuprofen can help with cramps.',
    category: 'pattern',
    priority: 2
  },
  regular_maintenance: {
    id: 'regular_maintenance',
    title: 'Maintain Healthy Habits',
    description:
      'Your cycles are healthy and regular. Continue maintaining good sleep, nutrition, and exercise habits.',
    category: 'pattern',
    priority: 1
  },
  developing_patience: {
    id: 'developing_patience',
    title: 'Be Patient',
    description:
      "Your cycles are still establishing. It's normal for them to be irregular during adolescence.",
    category: 'pattern',
    priority: 1
  },

  // Physical symptom recommendations
  fatigue_rest: {
    id: 'fatigue_rest',
    title: 'Rest and Sleep',
    description: 'Ensure you get adequate rest and maintain a regular sleep schedule.',
    category: 'physical',
    priority: 2
  },
  nausea_management: {
    id: 'nausea_management',
    title: 'Nausea Management',
    description: 'Try eating small, frequent meals and staying hydrated. Ginger tea may help.',
    category: 'physical',
    priority: 2
  },
  headache_management: {
    id: 'headache_management',
    title: 'Headache Relief',
    description:
      'Stay hydrated, reduce screen time, and consider over-the-counter pain relievers if needed.',
    category: 'physical',
    priority: 2
  },
  back_pain_management: {
    id: 'back_pain_management',
    title: 'Back Pain Relief',
    description:
      'Try gentle stretching, heat therapy, and maintaining good posture to manage back pain.',
    category: 'physical',
    priority: 2
  },
  breast_tenderness: {
    id: 'breast_tenderness',
    title: 'Breast Tenderness Care',
    description: 'Wear a supportive bra and consider over-the-counter pain relievers if needed.',
    category: 'physical',
    priority: 2
  },

  // Emotional symptom recommendations
  emotional_support: {
    id: 'emotional_support',
    title: 'Emotional Support',
    description:
      'Consider talking to a counselor or joining a support group about emotional symptoms.',
    category: 'emotional',
    priority: 2
  },
  stress_management: {
    id: 'stress_management',
    title: 'Stress Management',
    description:
      'Practice relaxation techniques like deep breathing, meditation, or gentle exercise.',
    category: 'emotional',
    priority: 1
  },
  mood_tracking: {
    id: 'mood_tracking',
    title: 'Track Your Moods',
    description: 'Keep a mood journal to identify patterns and triggers for emotional changes.',
    category: 'emotional',
    priority: 1
  },

  // Lifestyle recommendations
  exercise: {
    id: 'exercise',
    title: 'Regular Exercise',
    description:
      'Light to moderate exercise can help manage symptoms and improve overall well-being.',
    category: 'lifestyle',
    priority: 1
  },
  nutrition: {
    id: 'nutrition',
    title: 'Balanced Nutrition',
    description: 'Maintain a balanced diet rich in fruits, vegetables, and whole grains.',
    category: 'lifestyle',
    priority: 1
  },
  sleep_hygiene: {
    id: 'sleep_hygiene',
    title: 'Good Sleep Hygiene',
    description: 'Maintain a consistent sleep schedule and create a relaxing bedtime routine.',
    category: 'lifestyle',
    priority: 1
  }
};
