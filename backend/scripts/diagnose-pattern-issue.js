import db from '../db/index.js';

/**
 * Diagnostic script to investigate why pattern field is returning as null
 * This will check the assessment creation and retrieval flow
 */
async function diagnosePatternIssue() {
  try {
    console.log('[WebServer] Starting pattern issue diagnosis...');
    
    // 1. Check existing assessments in database
    console.log('\n=== CHECKING EXISTING ASSESSMENTS ===');
    const assessments = await db('assessments')
      .select('id', 'pattern', 'age', 'cycle_length', 'period_duration', 'flow_heaviness', 'pain_level')
      .limit(5);
    
    console.log(`Found ${assessments.length} assessments in database:`);
    assessments.forEach(assessment => {
      console.log(`[WebServer] Assessment ${assessment.id}:`);
      console.log(`[WebServer]   pattern: ${assessment.pattern}`);
      console.log(`[WebServer]   age: ${assessment.age}`);
      console.log(`[WebServer]   cycle_length: ${assessment.cycle_length}`);
      console.log(`[WebServer]   flow_heaviness: ${assessment.flow_heaviness}`);
      console.log(`[WebServer]   pain_level: ${assessment.pain_level}`);
    });
    
    // 2. Test pattern calculation using same logic as frontend
    console.log('\n=== TESTING PATTERN CALCULATION ===');
    
    // Simulate the frontend pattern calculation logic
    function determinePatternBackend(assessmentData) {
      const { age, cycle_length, period_duration, flow_heaviness, pain_level } = assessmentData;
      
      // Developing Pattern (O5)
      if (age === 'under-13' || age === '13-17') {
        return 'developing';
      }
      
      // Irregular Timing Pattern (O1)
      if (cycle_length === 'irregular' || cycle_length === 'less-than-21' || cycle_length === '36-40') {
        return 'irregular';
      }
      
      // Heavy Flow Pattern (O2)
      if (flow_heaviness === 'heavy' || flow_heaviness === 'very-heavy' || period_duration === '8-plus') {
        return 'heavy';
      }
      
      // Pain-Predominant Pattern (O3)
      if (pain_level === 'severe' || pain_level === 'debilitating') {
        return 'pain';
      }
      
      // Regular Menstrual Cycles (O4)
      return 'regular';
    }
    
    // Test with the sample data from your log
    const sampleData = {
      age: "18-24",
      cycle_length: "26-30", 
      period_duration: "4-5",
      flow_heaviness: "moderate",
      pain_level: "moderate"
    };
    
    const calculatedPattern = determinePatternBackend(sampleData);
    console.log(`[WebServer] Sample data pattern calculation: ${calculatedPattern}`);
    console.log(`[WebServer] Sample data:`, JSON.stringify(sampleData, null, 2));
    
    // 3. Test creating a new assessment with pattern
    console.log('\n=== TESTING NEW ASSESSMENT CREATION ===');
    
    const testAssessmentData = {
      age: "18-24",
      pattern: calculatedPattern, // Explicitly set pattern
      cycle_length: "26-30",
      period_duration: "4-5", 
      flow_heaviness: "moderate",
      pain_level: "moderate",
      physical_symptoms: JSON.stringify(["Bloating", "Headaches"]),
      emotional_symptoms: JSON.stringify(["Mood swings", "Irritability"]),
      recommendations: JSON.stringify([])
    };
    
    console.log(`[WebServer] Creating test assessment with pattern: ${testAssessmentData.pattern}`);
    
    const testId = `diagnostic-test-${Date.now()}`;
    const testUserId = 'diagnostic-user-123';
    
    try {
      await db('assessments').insert({
        id: testId,
        user_id: testUserId,
        created_at: new Date().toISOString(),
        ...testAssessmentData
      });
      
      console.log(`[WebServer] Test assessment created with ID: ${testId}`);
      
      // Retrieve the created assessment
      const retrievedAssessment = await db('assessments')
        .where('id', testId)
        .first();
      
      console.log(`[WebServer] Retrieved assessment pattern: ${retrievedAssessment.pattern}`);
      console.log(`[WebServer] Full retrieved assessment:`, JSON.stringify(retrievedAssessment, null, 2));
      
      // Clean up test data
      await db('assessments').where('id', testId).del();
      console.log(`[WebServer] Test assessment cleaned up`);
      
    } catch (dbError) {
      console.error('[WebServer] Error creating test assessment:', dbError);
    }
    
    // 4. Check conversation assessment linking
    console.log('\n=== CHECKING CONVERSATION ASSESSMENT LINKING ===');
    
    const conversationsWithAssessments = await db('conversations')
      .whereNotNull('assessment_id')
      .select('id', 'assessment_id', 'assessment_pattern', 'assessment_object')
      .limit(3);
    
    console.log(`Found ${conversationsWithAssessments.length} conversations with assessments:`);
    conversationsWithAssessments.forEach(conv => {
      console.log(`[WebServer] Conversation ${conv.id}:`);
      console.log(`[WebServer]   assessment_id: ${conv.assessment_id}`);
      console.log(`[WebServer]   assessment_pattern: ${conv.assessment_pattern}`);
      if (conv.assessment_object) {
        const assessmentObj = typeof conv.assessment_object === 'string' 
          ? JSON.parse(conv.assessment_object) 
          : conv.assessment_object;
        console.log(`[WebServer]   assessment_object.pattern: ${assessmentObj.pattern}`);
      }
    });
    
    console.log('\n[WebServer] Pattern diagnosis complete');
    
  } catch (error) {
    console.error('[WebServer] Error in pattern diagnosis:', error);
  } finally {
    await db.destroy();
  }
}

export default diagnosePatternIssue;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  diagnosePatternIssue();
} 