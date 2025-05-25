import db from '../db/index.js';

async function checkConversations() {
  try {
    console.log('Checking conversations table...');
    
    // Get all conversations
    const conversations = await db('conversations').select('*');
    console.log('Conversations found:', conversations.length);
    
    if (conversations.length > 0) {
      console.log('\nConversations data:');
      conversations.forEach((conv, index) => {
        console.log(`\n--- Conversation ${index + 1} ---`);
        console.log('ID:', conv.id);
        console.log('User ID:', conv.user_id);
        console.log('Assessment ID:', conv.assessment_id || 'null');
        console.log('Assessment Pattern:', conv.assessment_pattern || 'null');
        console.log('Created:', conv.created_at);
        console.log('Updated:', conv.updated_at);
      });
    }
    
    // Check table schema
    console.log('\n--- Table Schema ---');
    const columns = await db.raw('PRAGMA table_info(conversations)');
    console.log('Columns:', columns.map(col => `${col.name} (${col.type})`));
    
  } catch (error) {
    console.error('Error checking conversations:', error);
  } finally {
    await db.destroy();
  }
}

checkConversations(); 