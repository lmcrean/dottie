import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// Determine paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);
const dbPath = path.join(rootDir, "dev.sqlite3");

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

// Set up the appropriate database
if (!isProduction || !isVercel) {
  // Check if SQLite database exists
  if (!fs.existsSync(dbPath)) {
    try {
      execSync("npm run db:init:sqlite", { stdio: "inherit", cwd: rootDir });
    } catch (error) {
      console.error("Error initializing SQLite database:", error);
      process.exit(1);
    }
  }
} else {

  // No initialization needed for Supabase as it's managed externally
}
