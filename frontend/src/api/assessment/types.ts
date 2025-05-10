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
  recommendations: Array<{
    title: string;
    description: string;
  }>;
  
  // For backward compatibility during transition to flattened structure
  assessment_data?: {
    date: string;
    pattern: string;
    age: string;
    cycleLength: string;
    periodDuration: string;
    flowHeaviness: string;
    painLevel: string;
    symptoms: {
      physical: string[];
      emotional: string[];
    };
    recommendations: Array<{
      title: string;
      description: string;
    }>;
  };
}
