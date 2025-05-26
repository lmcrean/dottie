import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

// Create a Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function initializeDatabase() {
  try {
    // Read the SQL schema file
    const schemaFile = path.join(
      process.cwd(),
      "db",
      "supabase",
      "schema",
      "supabase-schema.sql"
    );
    const schemaSql = fs.readFileSync(schemaFile, "utf8");

    // Split the SQL into individual statements
    const statements = schemaSql
      .split(";")
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        // Using Supabase SQL execution
        await supabase.rpc("execute_sql", { sql: statement });
      } catch (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
      }
    }

    // Verify tables exist

    const tables = [
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
      } catch (error) {
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
