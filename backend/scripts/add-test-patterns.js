import db from '../db/index.js';

async function addTestPatterns() {
  try {
    console.log('=== Adding Test Assessment Patterns to Existing Conversations ===\n');
    
    // Get conversations without assessment patterns
    const conversationsWithoutPatterns = await db('conversations')
      .whereNull('assessment_pattern')
      .limit(4); // Update a few for testing
    
    console.log(`Found ${conversationsWithoutPatterns.length} conversations without patterns`);
    
    // Test patterns to add
    const testPatterns = [
      'regular_moderate_flow',
      'irregular_heavy_flow', 
      'regular_light_flow',
      'irregular_moderate_flow'
    ];
    
    // Update conversations with test patterns
    for (let i = 0; i < conversationsWithoutPatterns.length && i < testPatterns.length; i++) {
      const conversation = conversationsWithoutPatterns[i];
      const pattern = testPatterns[i];
      
      await db('conversations')
        .where('id', conversation.id)
        .update({
          assessment_pattern: pattern,
          updated_at: new Date().toISOString()
        });
      
      console.log(`Updated conversation ${conversation.id} with pattern: ${pattern}`);
    }
    
    // Show summary
    console.log('\n--- Updated Conversations Summary ---');
    const allConversations = await db('conversations').select('*');
    const withPatterns = allConversations.filter(conv => conv.assessment_pattern);
    
    console.log(`Total conversations: ${allConversations.length}`);
    console.log(`With patterns: ${withPatterns.length}`);
    
    if (withPatterns.length > 0) {
      console.log('\nAll conversations with patterns:');
      withPatterns.forEach(conv => {
        console.log(`- ${conv.id.substring(0, 8)}...: "${conv.assessment_pattern}"`);
      });
    }
    
  } catch (error) {
    console.error('Error adding test patterns:', error);
  } finally {
    await db.destroy();
  }
}

addTestPatterns(); 