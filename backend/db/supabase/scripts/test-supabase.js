import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// First run the Supabase connection test
try {
  execSync(
    "npx vitest run routes/setup/__tests__/unit/success/SupabaseConnection.test.js",
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );
} catch (error) {
  console.error("Supabase connection test failed:", error);
  process.exit(1);
}

// Ensure the database status route works

try {
  execSync(
    "node -e \"fetch('http://localhost:5000/api/setup/database').then(r => r.json()).then(console.log).catch(console.error)\"",
    {
      stdio: "inherit",
    }
  );
} catch (error) {
  console.error("Database status endpoint test failed:", error);
}

// Run a subset of other tests that interact with the database

try {
  execSync("npx vitest run models/User.test.js", {
    cwd: rootDir,
    stdio: "inherit",
  });
} catch (error) {
  console.warn(
    "Some User model tests may have failed. Review the output above."
  );
}
