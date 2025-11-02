import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

// Create a Supabase client with service role key
const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function initializeDatabase(): Promise<void> {
  try {
    // Read the SQL schema file
    const schemaFile: string = path.join(
      process.cwd(),
      "db",
      "supabase",
      "schema",
      "supabase-schema.sql"
    );
    const schemaSql: string = fs.readFileSync(schemaFile, "utf8");

    // Split the SQL into individual statements
    const statements: string[] = schemaSql
      .split(";")
      .map((statement: string) => statement.trim())
      .filter((statement: string) => statement.length > 0);

    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement: string = statements[i];

      try {
        // Using Supabase SQL execution
        await supabase.rpc("execute_sql", { sql: statement });
      } catch (error: any) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
      }
    }

    // Verify tables exist

    const tables: string[] = [
      "users",
      "period_logs",
      "symptoms",
      "conversations",
      "chat_messages",
      "assessments",
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select("count")
          .limit(1);

        if (error) {
          console.error(`Table '${table}' verification failed:`, error.message);
        }
      } catch (error: any) {
        console.error(`Error checking table '${table}':`, error.message);
      }
    }
  } catch (error) {
    console.error("Unexpected error during initialization:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
