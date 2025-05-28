import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to check if table has specific column
async function checkTableColumn(tableName, columnName) {
  try {
    // Use raw SQL query to check column existence
    const { data, error } = await supabase.rpc('check_column_exists', {
      table_name: tableName,
      column_name: columnName
    });

    if (error) {
      // If RPC not available, try another approach (for Supabase without custom functions)
      console.error(`Error checking ${columnName} in ${tableName}:`, error);
      
      // Try to select the column to see if it exists
      const { data: checkData, error: checkError } = await supabase
        .from(tableName)
        .select(columnName)
        .limit(1);
      
      if (checkError && checkError.message.includes("column")) {
        console.log(`❌ Column ${columnName} does not exist in ${tableName}`);
        return false;
      } else {
        console.log(`✅ Column ${columnName} exists in ${tableName}`);
        return true;
      }
    }
    
    if (data) {
      console.log(`✅ Column ${columnName} exists in ${tableName}`);
      return true;
    } else {
      console.log(`❌ Column ${columnName} does not exist in ${tableName}`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking column ${columnName} in ${tableName}:`, error);
    return false;
  }
}

// Function to add column if it doesn't exist
async function addColumnIfNeeded(tableName, columnName, columnType) {
  const exists = await checkTableColumn(tableName, columnName);
  
  if (!exists) {
    console.log(`Adding ${columnName} column to ${tableName}...`);
    
    // Use raw SQL query to add column
    const { error } = await supabase.rpc('execute_sql', {
      sql: `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXISTS ${columnName} ${columnType};`
    });
    
    if (error) {
      console.error(`Error adding column ${columnName} to ${tableName}:`, error);
      return false;
    }
    
    console.log(`✅ Added ${columnName} column to ${tableName}`);
    return true;
  }
  
  return exists;
}

// Function to check table's existence
async function checkTableExists(tableName) {
  try {
    // Try to query the table
    const { data, error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log(`❌ Table ${tableName} does not exist`);
      return false;
    } else {
      console.log(`✅ Table ${tableName} exists`);
      return true;
    }
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Main function to check and update schema
async function checkAndUpdateSchema() {
  console.log('Checking Supabase schema...');
  
  // Check conversations table
  const conversationsExists = await checkTableExists('conversations');
  
  if (conversationsExists) {
    // Check and add preview column if needed
    const previewExists = await addColumnIfNeeded('conversations', 'preview', 'text');
    
    if (previewExists) {
      console.log('Schema is up to date!');
    } else {
      console.error('Failed to update schema. Please check the logs.');
    }
  } else {
    console.error('Conversations table does not exist. Please run database initialization first.');
  }
}

// Run the main function
checkAndUpdateSchema()
  .catch(error => {
    console.error('Error checking schema:', error);
    process.exit(1);
  }); 