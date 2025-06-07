import knex from "knex";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Determine paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);
const dbPath = path.join(rootDir, "dev.sqlite3");

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

// Choose database based on environment
let db;

async function initDB() {
  if (isProduction && isVercel) {
    // Production environment - use Supabase

    // Import Supabase shim
    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_ANON_PUBLIC
      );

      // Import the Supabase shim
      const supabaseModule = await import("./supabaseShim.js");
      db = supabaseModule.default;
    } catch (error) {
      console.error("Error initializing Supabase:", error);
      throw error;
    }
  } else {
    // Development environment - use SQLite

    db = knex({
      client: "sqlite3",
      connection: {
        filename: dbPath,
      },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn, done) => {
          // Enable foreign keys in SQLite
          conn.run("PRAGMA foreign_keys = ON", done);
        },
      },
    });
  }
  return db;
}

const dbInstance = await initDB();
const dbType = isProduction && isVercel ? 'Supabase' : 'SQLite';

export { dbInstance as db, dbType };
export default dbInstance;
