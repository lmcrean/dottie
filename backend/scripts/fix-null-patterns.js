import db from '../db/index.js';

/**
 * Fix assessments that have null patterns by calculating patterns based on assessment data
 */
async function fixNullPatterns() {
  try {
    console.log('[WebServer] Starting null pattern fix...');
    
    // Pattern calculation logic (matches frontend)
    function calculatePattern(assessmentData) {
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
      
      // Regular Menstrual Cycles (O4) - default
      return 'regular';
    }
    
    // Find assessments with null patterns
    const nullPatternAssessments = await db('assessments')
      .whereNull('pattern')
      .orWhere('pattern', '')
      .select('id', 'age', 'cycle_length', 'period_duration', 'flow_heaviness', 'pain_level');
    
    console.log(`[WebServer] Found ${nullPatternAssessments.length} assessments with null/empty patterns`);
    
    let updatedCount = 0;
    
    for (const assessment of nullPatternAssessments) {
      const calculatedPattern = calculatePattern(assessment);
      
      console.log(`[WebServer] Assessment ${assessment.id}:`);
      console.log(`[WebServer]   Current pattern: ${assessment.pattern || 'null'}`);
      console.log(`[WebServer]   Calculated pattern: ${calculatedPattern}`);
      console.log(`[WebServer]   Data: age=${assessment.age}, cycle_length=${assessment.cycle_length}, flow=${assessment.flow_heaviness}, pain=${assessment.pain_level}`);
      
      // Update the assessment with calculated pattern
      await db('assessments')
        .where('id', assessment.id)
        .update({
          pattern: calculatedPattern,
          updated_at: new Date().toISOString()
        });
      
      updatedCount++;
      console.log(`[WebServer]   ✅ Updated assessment ${assessment.id} with pattern: ${calculatedPattern}`);
    }
    
    console.log(`\n[WebServer] Updated ${updatedCount} assessments with calculated patterns`);
    
    // Verify the updates
    console.log('\n=== VERIFICATION ===');
    const verificationAssessments = await db('assessments')
      .whereIn('id', nullPatternAssessments.map(a => a.id))
      .select('id', 'pattern');
    
    console.log('[WebServer] Verification of updated assessments:');
    verificationAssessments.forEach(assessment => {
      console.log(`[WebServer]   ${assessment.id}: pattern = ${assessment.pattern}`);
    });
    
    // Update any conversations that reference these assessments
    console.log('\n=== UPDATING CONVERSATIONS ===');
    const conversationsToUpdate = await db('conversations')
      .whereIn('assessment_id', nullPatternAssessments.map(a => a.id))
      .select('id', 'assessment_id');
    
    console.log(`[WebServer] Found ${conversationsToUpdate.length} conversations to update`);
    
    for (const conversation of conversationsToUpdate) {
      const assessment = await db('assessments')
        .where('id', conversation.assessment_id)
        .select('pattern')
        .first();
      
      if (assessment?.pattern) {
        await db('conversations')
          .where('id', conversation.id)
          .update({
            assessment_pattern: assessment.pattern,
            updated_at: new Date().toISOString()
          });
        
        console.log(`[WebServer]   ✅ Updated conversation ${conversation.id} with pattern: ${assessment.pattern}`);
      }
    }
    
    console.log('\n[WebServer] Null pattern fix complete!');
    
  } catch (error) {
    console.error('[WebServer] Error fixing null patterns:', error);
  } finally {
    await db.destroy();
  }
}

export default fixNullPatterns;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixNullPatterns();
} 