/**
 * Assessment Data Generators for Integration Tests
 */

/**
 * Generate default assessment data for testing
 * @returns {Object} Default assessment data
 */
export function generateDefaultAssessment() {
  return {
    age: "18-24",
    cycleLength: "26-30",
    periodDuration: "4-5",
    flowHeaviness: "moderate",
    painLevel: "moderate",
    symptoms: {
      physical: ["Bloating", "Headaches"],
      emotional: ["Mood swings", "Irritability"],
    },
  };
}

/**
 * Generate a more severe assessment profile
 * @returns {Object} Severe assessment data
 */
export function generateSevereAssessment() {
  return {
    age: "18-24",
    cycleLength: "31-35",
    periodDuration: "6-7",
    flowHeaviness: "heavy",
    painLevel: "severe",
    symptoms: {
      physical: ["Severe Cramps", "Nausea", "Vomiting", "Dizziness"],
      emotional: ["Depression", "Anxiety", "Mood swings", "Irritability"],
    },
  };
} 