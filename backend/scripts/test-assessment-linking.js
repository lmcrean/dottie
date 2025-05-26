import db from '../db/index.js';
import { createConversation, getAssessmentPattern } from '../models/chat/chat.js';

async function testAssessmentLinking() {
  try {

    
    // First, let's see if there are any assessments in the database
    const assessments = await db('assessments').select('*').limit(5);

    
    if (assessments.length > 0) {
      const testAssessment = assessments[0];




      
      // Test getting assessment pattern

      const pattern = await getAssessmentPattern(testAssessment.id);

      
      // Test creating conversation with assessment

      const conversationId = await createConversation(
        testAssessment.user_id, 
        testAssessment.id
      );
      

      
      // Verify the conversation was created with assessment data
      const createdConversation = await db('conversations')
        .where('id', conversationId)
        .first();
        





      
    } else {

      
      // Create a test conversation without assessment

      const conversationId = await createConversation('test-user-id');

    }
    
    // Check all conversations now

    const allConversations = await db('conversations').select('*');

    
    const withAssessments = allConversations.filter(conv => conv.assessment_id);

    
    const withPatterns = allConversations.filter(conv => conv.assessment_pattern);

    
    if (withPatterns.length > 0) {

      withPatterns.forEach(conv => {

      });
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await db.destroy();
  }
}

testAssessmentLinking(); 