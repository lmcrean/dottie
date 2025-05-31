import { db } from '../db/index.js';
import { addPreviewToConversations } from '../db/migrations/20240528_add_preview_to_conversations.js';

/**
 * Run the add preview column migration directly
 */
async function addPreviewColumn() {
  try {
    console.log('Adding preview column to conversations table...');
    
    await addPreviewToConversations(db);
    
    console.log('Successfully added preview column to conversations table');
    process.exit(0);
  } catch (error) {
    console.error('Error adding preview column:', error);
    process.exit(1);
  }
}

// Run the migration
addPreviewColumn(); 