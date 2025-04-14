/**
 * Pattern Determination Test Script
 * 
 * This script manually tests the pattern determination logic from the assessment results page
 * to ensure it properly follows the decision tree in LogicTree.md
 */

// Helper function to normalize string values
const normalizeValue = (value) => {
  if (!value) return "";
  return value.trim().toLowerCase();
};

// Helper function to check if a string contains any keywords
const containsAny = (value, keywords) => {
  if (!value) return false;
  const normalized = normalizeValue(value);
  return keywords.some(keyword => normalized.includes(keyword));
};

// Core logic from the results page
const determinePattern = (data) => {
  // Extract values
  const { age, cycleLength, periodDuration, flowLevel, painLevel, cyclePredictable } = data;
  const path = [];
  
  // Q1: Is cycle length between 21-45 days?
  const isCycleLengthNormal = !(
    containsAny(cycleLength, ["irregular"]) ||
    containsAny(cycleLength, ["less than 21", "<21"]) ||
    containsAny(cycleLength, ["more than 45", ">45", "45+"])
  );
  path.push(`Q1: Cycle length normal? ${isCycleLengthNormal}`);

  if (!isCycleLengthNormal) {
    // O1: Irregular Timing Pattern
    path.push(`O1: Assigning pattern = "irregular"`);
    return { pattern: "irregular", path };
  } 
  
  // Q2: Does period last between 2-7 days?
  const isPeriodDurationNormal = !(
    containsAny(periodDuration, ["more than 7", ">7", "8+", "8 days", "8-plus"])
  );
  path.push(`Q2: Period duration normal? ${isPeriodDurationNormal}`);

  if (!isPeriodDurationNormal) {
    // O2: Heavy or Prolonged Flow Pattern
    path.push(`O2: Assigning pattern = "heavy" (duration)`);
    return { pattern: "heavy", path };
  } 
  
  // Q3: Is flow light to moderate?
  const isFlowNormal = !(
    containsAny(flowLevel, ["heavy", "very heavy"])
  );
  path.push(`Q3: Flow normal? ${isFlowNormal}`);

  if (!isFlowNormal) {
    // O2: Heavy or Prolonged Flow Pattern
    path.push(`O2: Assigning pattern = "heavy" (flow)`);
    return { pattern: "heavy", path };
  } 
  
  // Q4: Is menstrual pain none to moderate?
  const isPainNormal = !(
    containsAny(painLevel, ["severe", "debilitating"])
  );
  path.push(`Q4: Pain normal? ${isPainNormal}`);

  if (!isPainNormal) {
    // O3: Pain-Predominant Pattern
    path.push(`O3: Assigning pattern = "pain"`);
    return { pattern: "pain", path };
  } 
  
  // Q5: Has cycle been predictable for at least 3 months?
  path.push(`Q5: Checking cycle predictability...`);
  if (containsAny(cyclePredictable, ["no", "false"])) {
    // O5: Developing Pattern - cycles not predictable
    path.push(`O5: Assigning pattern = "developing" (explicitly not predictable)`);
    return { pattern: "developing", path };
  } else if (containsAny(cyclePredictable, ["yes", "true"])) {
    // O4: Regular Menstrual Cycles - cycles are predictable
    path.push(`O4: Assigning pattern = "regular" (explicitly predictable)`);
    return { pattern: "regular", path };
  } else {
    // We don't have explicit predictability data, so infer based on age
    path.push(`No explicit predictability data, inferring from age: ${age}`);
    // If age is adolescent (12-17), assume developing, otherwise assume regular
    if (containsAny(age, ["12-14", "15-17", "13-17", "12", "13", "14", "15", "16", "17", "teen", "adolescent"])) {
      // O5: Developing Pattern
      path.push(`O5: Assigning pattern = "developing" (based on adolescent age)`);
      return { pattern: "developing", path };
    } else {
      // O4: Regular Menstrual Cycles
      path.push(`O4: Assigning pattern = "regular" (default for non-adolescent)`);
      return { pattern: "regular", path };
    }
  }
};

// Test cases
const testCases = [
  {
    name: "Irregular cycle length",
    data: {
      age: "25-35 years",
      cycleLength: "Irregular",
      periodDuration: "4-5 days",
      flowLevel: "Moderate",
      painLevel: "Mild"
    },
    expected: "irregular"
  },
  {
    name: "Long period duration",
    data: {
      age: "25-35 years",
      cycleLength: "26-30 days",
      periodDuration: "8+ days",
      flowLevel: "Moderate",
      painLevel: "Mild"
    },
    expected: "heavy"
  },
  {
    name: "Heavy flow",
    data: {
      age: "25-35 years",
      cycleLength: "26-30 days",
      periodDuration: "4-5 days",
      flowLevel: "Heavy",
      painLevel: "Mild"
    },
    expected: "heavy"
  },
  {
    name: "Severe pain",
    data: {
      age: "25-35 years",
      cycleLength: "26-30 days",
      periodDuration: "4-5 days",
      flowLevel: "Moderate",
      painLevel: "Severe"
    },
    expected: "pain"
  },
  {
    name: "Adolescent with otherwise normal metrics (should be developing)",
    data: {
      age: "13-17 years",
      cycleLength: "26-30 days",
      periodDuration: "4-5 days",
      flowLevel: "Moderate",
      painLevel: "Mild"
    },
    expected: "developing"
  },
  {
    name: "Adult with normal metrics (should be regular)",
    data: {
      age: "25-35 years",
      cycleLength: "26-30 days",
      periodDuration: "4-5 days",
      flowLevel: "Moderate",
      painLevel: "Mild"
    },
    expected: "regular"
  },
  {
    name: "Adult with unpredictable cycles (should be developing)",
    data: {
      age: "25-35 years",
      cycleLength: "26-30 days",
      periodDuration: "4-5 days",
      flowLevel: "Moderate",
      painLevel: "Mild",
      cyclePredictable: "No"
    },
    expected: "developing"
  },
  {
    name: "Adolescent with predictable cycles (should be regular)",
    data: {
      age: "13-17 years",
      cycleLength: "26-30 days",
      periodDuration: "4-5 days",
      flowLevel: "Moderate",
      painLevel: "Mild",
      cyclePredictable: "Yes"
    },
    expected: "regular"
  }
];

// Run the tests
console.log("Running pattern determination tests...\n");
let passed = 0;
let failed = 0;

testCases.forEach((test, index) => {
  const result = determinePattern(test.data);
  const success = result.pattern === test.expected;
  
  console.log(`Test ${index + 1}: ${test.name}`);
  console.log(`  Input: ${JSON.stringify(test.data, null, 2)}`);
  console.log(`  Decision Path:`);
  result.path.forEach(step => console.log(`    ${step}`));
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Actual: ${result.pattern}`);
  console.log(`  Result: ${success ? 'PASS' : 'FAIL'}`);
  console.log("");
  
  if (success) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log(`Total: ${testCases.length}`); 