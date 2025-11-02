// Script to test Supabase connection directly
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_PUBLIC!
);

async function testConnection(): Promise<void> {
  try {
    // Test authentication API (should always work)
    const authResponse = await supabase.auth.getSession();

    // Try to access the healthcheck table
    try {
      const { data, error } = await supabase
        .from("healthcheck")
        .select("*")
        .limit(1);

      if (error) {
        console.error("Error accessing healthcheck table:", error);
      }
    } catch (error) {
      console.error("Exception accessing healthcheck table:", error);
    }
  } catch (error) {
    console.error("Error testing Supabase connection:", error);
  }
}

testConnection();
