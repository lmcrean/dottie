import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..", "..", "..");

// Step 1: Check that Supabase environment variables are set
const requiredEnvVars = ["SUPABASE_ANON_PUBLIC", "SUPABASE_SERVICE_ROLE_KEY"];

// Load .env file manually to check variables
const envPath = path.join(rootDir, ".env");
let envVars = {};

try {
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");

  for (const line of lines) {
    if (line.trim() && !line.startsWith("#")) {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("="); // Handle values that might contain = character

      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    }
  }

  const missingEnvVars = requiredEnvVars.filter((envVar) => !envVars[envVar]);

  if (missingEnvVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
    console.error(
      "Please add these variables to your .env file and try again."
    );
    process.exit(1);
  }
} catch (error) {
  console.error("Error reading .env file:", error);
  process.exit(1);
}

// Step 2: Install Supabase client library

try {
  execSync("npm install @supabase/supabase-js", {
    cwd: rootDir,
    stdio: "inherit",
  });
} catch (error) {
  console.error("Error installing Supabase client library:", error);
  process.exit(1);
}

// Step 3: Verify connection to Supabase

try {
  // Run the initialization script - this will display schema instructions
  // and verify connection to Supabase
  execSync("node db/supabase/scripts/initSupabaseTables.js", {
    cwd: rootDir,
    stdio: "inherit",
  });

  // Wait 5 seconds to give user time to cancel

  execSync('node -e "setTimeout(() => {}, 5000)"', { stdio: "inherit" });
} catch (error) {
  console.error("Error verifying Supabase connection:", error);
  process.exit(1);
}

// Step 4: Run tests to verify Supabase connection

try {
  execSync(
    "npx vitest run routes/setup/__tests__/unit/success/SupabaseConnection.test.js",
    {
      cwd: rootDir,
      stdio: "inherit",
    }
  );
} catch (error) {
  console.error("Supabase connection tests failed:", error);
  console.error("Please check your Supabase configuration and try again.");
  process.exit(1);
}

// Step 5: Clean up Azure SQL related code

try {
  execSync("node db/supabase/scripts/cleanupAzure.js", {
    cwd: rootDir,
    stdio: "inherit",
  });
} catch (error) {
  console.error("Error cleaning up Azure SQL related code:", error);
  process.exit(1);
}
