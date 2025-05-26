import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations
);

// Function to verify connection to Supabase
async function verifyConnection() {
  try {
    // Try a simple API call that doesn't depend on table existence
    const { error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    // Now try to create a healthcheck table
    try {
      // This might fail if the table doesn't exist yet, which is expected
      await supabase.from("healthcheck").select("count").limit(1);
    } catch (tableError) {
      console.log(
        "Healthcheck table does not exist yet. This is expected if running for first time."
      );
    }
  } catch (error) {
    console.error("Error connecting to Supabase:", error);
    process.exit(1);
  }
}

// Run the function
verifyConnection();
