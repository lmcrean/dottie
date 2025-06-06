/**
 * Database Inspection Script
 * Inspects the current state of the SQLite database
 */

import db from '../db/database.js';

async function inspectDatabase() {
  try {
    console.log('🔍 Inspecting SQLite Database...\n');

    // 1. Show all tables
    console.log('📊 Available Tables:');
    const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    console.log('');

    // 2. Check conversations table structure
    console.log('🏗️  Conversations Table Structure:');
    const conversationsInfo = await db.raw("PRAGMA table_info(conversations)");
    console.table(conversationsInfo);
    console.log('');

    // 3. Check recent conversations with assessment data
    console.log('💬 Recent Conversations (last 10):');
    const recentConversations = await db('conversations')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(10);
    
    if (recentConversations.length > 0) {
      console.table(recentConversations.map(conv => ({
        id: conv.id,
        user_id: conv.user_id?.substring(0, 8) + '...',
        assessment_id: conv.assessment_id || 'null',
        assessment_pattern: conv.assessment_pattern || 'null',
        has_assessment_object: conv.assessment_object ? 'yes' : 'no',
        created_at: conv.created_at
      })));
    } else {
      console.log('   No conversations found');
    }
    console.log('');

    // 3.5. Check assessment_object contents for the first conversation
    if (recentConversations.length > 0) {
      console.log('🧬 Assessment Object Details (first conversation):');
      const firstConv = recentConversations[0];
      if (firstConv.assessment_object) {
        try {
          const assessmentObj = JSON.parse(firstConv.assessment_object);
          console.log(`   Assessment ID: ${assessmentObj.id || 'not found'}`);
          console.log(`   Pattern: ${assessmentObj.pattern || 'not found'}`);
          console.log(`   Total Score: ${assessmentObj.total_score || 'not found'}`);
          console.log(`   Questions Count: ${assessmentObj.questions?.length || 'not found'}`);
          console.log(`   Full Object:`, JSON.stringify(assessmentObj, null, 2));
        } catch (error) {
          console.log(`   Error parsing assessment_object: ${error.message}`);
        }
      }
      console.log('');
    }

    // 4. Check assessments table if it exists
    try {
      console.log('📋 Recent Assessments (last 5):');
      const recentAssessments = await db('assessments')
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(5);
      
      if (recentAssessments.length > 0) {
        console.table(recentAssessments.map(assess => ({
          id: assess.id,
          user_id: assess.user_id?.substring(0, 8) + '...',
          pattern: assess.pattern || 'null',
          score: assess.total_score || 'null',
          created_at: assess.created_at
        })));
      } else {
        console.log('   No assessments found');
      }
    } catch (error) {
      console.log('   Assessments table not found or error:', error.message);
    }
    console.log('');

    // 5. Check chat_messages table (correct table name)
    try {
      console.log('💌 Recent Chat Messages (last 5):');
      const recentMessages = await db('chat_messages')
        .select('*')
        .orderBy('created_at', 'desc')
        .limit(5);
      
      if (recentMessages.length > 0) {
        console.table(recentMessages.map(msg => ({
          id: msg.id,
          conversation_id: msg.conversation_id,
          sender: msg.sender,
          message_preview: msg.message?.substring(0, 50) + '...',
          created_at: msg.created_at
        })));
      } else {
        console.log('   No chat messages found');
      }
    } catch (error) {
      console.log('   Chat messages table not found or error:', error.message);
    }
    console.log('');

    // 6. Show counts
    console.log('📈 Table Counts:');
    try {
      const conversationCount = await db('conversations').count('* as count').first();
      console.log(`   Conversations: ${conversationCount.count}`);
    } catch (error) {
      console.log(`   Conversations: Error - ${error.message}`);
    }

    try {
      const assessmentCount = await db('assessments').count('* as count').first();
      console.log(`   Assessments: ${assessmentCount.count}`);
    } catch (error) {
      console.log(`   Assessments: Error - ${error.message}`);
    }

    try {
      const messageCount = await db('chat_messages').count('* as count').first();
      console.log(`   Chat Messages: ${messageCount.count}`);
    } catch (error) {
      console.log(`   Chat Messages: Error - ${error.message}`);
    }

    // 7. Check for conversation-message relationships
    if (recentConversations.length > 0) {
      console.log('');
      console.log('🔗 Conversation-Message Relationships:');
      for (const conv of recentConversations.slice(0, 3)) {
        try {
          const messageCount = await db('chat_messages')
            .where('conversation_id', conv.id)
            .count('* as count')
            .first();
          console.log(`   Conversation ${conv.id}: ${messageCount.count} messages`);
        } catch (error) {
          console.log(`   Conversation ${conv.id}: Error - ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error inspecting database:', error);
  } finally {
    await db.destroy();
  }
}

inspectDatabase().catch(console.error); 