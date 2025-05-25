import db from '../db/index.js';
import { createConversation, getAssessmentPattern } from '../models/chat/chat.js';

async function testAssessmentLinking() {
  try {
    console.log('=== Testing Assessment Linking ===\n');
    
    // First, let's see if there are any assessments in the database
    const assessments = await db('assessments').select('*').limit(5);
    console.log(`Found ${assessments.length} assessments in database`);
    
    if (assessments.length > 0) {
      const testAssessment = assessments[0];
      console.log('\nUsing test assessment:');
      console.log('ID:', testAssessment.id);
      console.log('User ID:', testAssessment.user_id);
      console.log('Pattern:', testAssessment.pattern);
      
      // Test getting assessment pattern
      console.log('\n--- Testing getAssessmentPattern ---');
      const pattern = await getAssessmentPattern(testAssessment.id);
      console.log('Retrieved pattern:', pattern);
      
      // Test creating conversation with assessment
      console.log('\n--- Testing createConversation with assessment ---');
      const conversationId = await createConversation(
        testAssessment.user_id, 
        testAssessment.id
      );
      
      console.log('Created conversation ID:', conversationId);
      
      // Verify the conversation was created with assessment data
      const createdConversation = await db('conversations')
        .where('id', conversationId)
        .first();
        
      console.log('\nCreated conversation data:');
      console.log('ID:', createdConversation.id);
      console.log('User ID:', createdConversation.user_id);
      console.log('Assessment ID:', createdConversation.assessment_id);
      console.log('Assessment Pattern:', createdConversation.assessment_pattern);
      
    } else {
      console.log('No assessments found in database to test with');
      
      // Create a test conversation without assessment
      console.log('\n--- Testing createConversation without assessment ---');
      const conversationId = await createConversation('test-user-id');
      console.log('Created conversation ID:', conversationId);
    }
    
    // Check all conversations now
    console.log('\n--- All Conversations Summary ---');
    const allConversations = await db('conversations').select('*');
    console.log(`Total conversations: ${allConversations.length}`);
    
    const withAssessments = allConversations.filter(conv => conv.assessment_id);
    console.log(`With assessments: ${withAssessments.length}`);
    
    const withPatterns = allConversations.filter(conv => conv.assessment_pattern);
    console.log(`With patterns: ${withPatterns.length}`);
    
    if (withPatterns.length > 0) {
      console.log('\nConversations with patterns:');
      withPatterns.forEach(conv => {
        console.log(`- ${conv.id}: pattern="${conv.assessment_pattern}"`);
      });
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  } finally {
    await db.destroy();
  }
}

testAssessmentLinking(); 