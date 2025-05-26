import db from '../db/index.js';

async function fixAssessmentPatterns() {
  try {

    
    // Get all conversations with patterns
    const conversationsWithPatterns = await db('conversations')
      .whereNotNull('assessment_pattern');
    

    
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
      




    }
    
    // Show final summary

    const updatedConversations = await db('conversations')
      .whereNotNull('assessment_pattern')
      .select('id', 'assessment_pattern');
    


    
    updatedConversations.forEach(conv => {

    });
    
    // Show pattern distribution

    const patternCounts = {};
    updatedConversations.forEach(conv => {
      patternCounts[conv.assessment_pattern] = (patternCounts[conv.assessment_pattern] || 0) + 1;
    });
    
    Object.entries(patternCounts).forEach(([pattern, count]) => {

    });
    
  } catch (error) {
    console.error('Error fixing assessment patterns:', error);
  } finally {
    await db.destroy();
  }
}

fixAssessmentPatterns(); 