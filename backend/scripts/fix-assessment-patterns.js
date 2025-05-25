import db from '../db/index.js';

async function fixAssessmentPatterns() {
  try {
    console.log('=== Fixing Assessment Patterns to Match LogicTree ===\n');
    
    // Get all conversations with patterns
    const conversationsWithPatterns = await db('conversations')
      .whereNotNull('assessment_pattern');
    
    console.log(`Found ${conversationsWithPatterns.length} conversations with patterns to update`);
    
    // Correct assessment patterns from LogicTree.md
    const correctPatterns = [
      'Regular Menstrual Cycles',
      'Irregular Timing Pattern', 
      'Heavy or Prolonged Flow Pattern',
      'Pain-Predominant Pattern',
      'Developing Pattern'
    ];
    
    // Update conversations with correct patterns
    for (let i = 0; i < conversationsWithPatterns.length; i++) {
      const conversation = conversationsWithPatterns[i];
      const correctPattern = correctPatterns[i % correctPatterns.length]; // Cycle through patterns
      
      await db('conversations')
        .where('id', conversation.id)
        .update({
          assessment_pattern: correctPattern,
          updated_at: new Date().toISOString()
        });
      
      console.log(`Updated conversation ${conversation.id.substring(0, 8)}...`);
      console.log(`  FROM: "${conversation.assessment_pattern}"`);
      console.log(`  TO:   "${correctPattern}"`);
      console.log('');
    }
    
    // Show final summary
    console.log('--- Final Patterns Summary ---');
    const updatedConversations = await db('conversations')
      .whereNotNull('assessment_pattern')
      .select('id', 'assessment_pattern');
    
    console.log(`Total conversations with patterns: ${updatedConversations.length}`);
    console.log('\nAll assessment patterns now:');
    
    updatedConversations.forEach(conv => {
      console.log(`- ${conv.id.substring(0, 8)}...: "${conv.assessment_pattern}"`);
    });
    
    // Show pattern distribution
    console.log('\nPattern distribution:');
    const patternCounts = {};
    updatedConversations.forEach(conv => {
      patternCounts[conv.assessment_pattern] = (patternCounts[conv.assessment_pattern] || 0) + 1;
    });
    
    Object.entries(patternCounts).forEach(([pattern, count]) => {
      console.log(`  ${pattern}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error fixing assessment patterns:', error);
  } finally {
    await db.destroy();
  }
}

fixAssessmentPatterns(); 