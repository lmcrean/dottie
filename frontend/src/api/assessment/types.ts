export interface Assessment {
  id: string;
  userId: string;
  createdAt: string;
  
  // Flattened fields (previously nested in assessment_data)
  age: string;
  pattern: string;
  cycleLength: string;
  periodDuration: string;
  flowHeaviness: string;
  painLevel: string;
  physical_symptoms: string[];
  emotional_symptoms: string[];
  
  // Recommendations remain nested but at level 1
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
