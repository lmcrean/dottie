import db from '../db/index.js';

async function checkConversations() {
  try {

    
    // Get all conversations
    const conversations = await db('conversations').select('*');

    
    
    // Check table schema

    const columns = await db.raw('PRAGMA table_info(conversations)');

    
  } catch (error) {
    console.error('Error checking conversations:', error);
  } finally {
    await db.destroy();
  }
}

checkConversations(); 