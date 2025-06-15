import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_PUBLIC
);

async function checkTables() {
  try {
    // Check users table

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("count")
      .limit(1);

    if (usersError) {
      console.error("Error accessing users table:", usersError.message);
    } 

    // List all tables in the public schema

    const { data: tables, error: tablesError } = await supabase.rpc(
      "list_tables"
    );

    if (tablesError) {
      console.error("Error listing tables:", tablesError.message);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

checkTables();
