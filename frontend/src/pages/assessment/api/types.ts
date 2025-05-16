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
  other_symptoms: string;
  recommendations: Array<{
    title: string;
    description: string;
  }>;

  // Legacy format support
  assessment_data?: {
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
