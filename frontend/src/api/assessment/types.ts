export interface Assessment {
  id: string;
  user_id: string;
  created_at: number;
  updated_at: number;
  assessment_data: {
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
