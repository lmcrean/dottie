import db from '../db/index.js';

async function addTestPatterns() {
  try {

    
    // Get conversations without assessment patterns
    const conversationsWithoutPatterns = await db('conversations')
      .whereNull('assessment_pattern')
      .limit(4); // Update a few for testing
    

    
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
      

    }
    
    // Show summary

    const allConversations = await db('conversations').select('*');
    const withPatterns = allConversations.filter(conv => conv.assessment_pattern);
    


  
    
  } catch (error) {
    console.error('Error adding test patterns:', error);
  } finally {
    await db.destroy();
  }
}

addTestPatterns(); 