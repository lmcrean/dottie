import { Recommendation } from '.';

export const RECOMMENDATIONS: Record<string, Recommendation> = {
  // General recommendations -- always show
  track_cycle: {
    id: 'track_cycle',
    title: 'Track Your Cycle',
    description: 'Keep a record of when your period starts and stops to identify patterns.'
  },

  // Pattern-specific recommendations based on logic tree outcomes
  irregular_consult: {
    id: 'irregular_consult',
    title: 'Consult a Healthcare Provider',
    description: 'Irregular cycles may need medical evaluation to identify underlying causes.'
  },
  heavy_iron: {
    id: 'heavy_iron',
    title: 'Iron-Rich Diet',
    description: 'Consider increasing iron intake through diet or supplements to prevent anemia.'
  },
  pain_management: {
    id: 'pain_management',
    title: 'Pain Management',
    description: 'Over-the-counter pain relievers like ibuprofen can help with cramps.'
  },
  regular_maintenance: {
    id: 'regular_maintenance',
    title: 'Maintain Healthy Habits',
    description:
      'Your cycles are healthy and regular. Continue maintaining good sleep, nutrition, and exercise habits.'
  },
  developing_patience: {
    id: 'developing_patience',
    title: 'Be Patient',
    description:
      "Your cycles are still establishing. It's normal for them to be irregular during adolescence."
  }
};
