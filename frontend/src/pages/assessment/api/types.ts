export interface Assessment {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  // Flattened fields
  age: string;
  pattern: string;
  cycle_length: string;
  period_duration: string;
  flow_heaviness: string;
  pain_level: string;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  other_symptoms: string[];
  symptoms?: string[]; // Combined array for UI components
  recommendations: Array<{
    title: string;
    description: string;
  }>;

  // Legacy format support
  assessment_data?: {
    pattern?: string;
    age?: string;
    cycleLength?: string;
    periodDuration?: string;
    flowHeaviness?: string;
    painLevel?: string;
    symptoms?: {
      physical?: string | string[];
      emotional?: string | string[];
    };
    recommendations?: Array<{
      title: string;
      description: string;
    }>;
    date?: string;
  };
}
