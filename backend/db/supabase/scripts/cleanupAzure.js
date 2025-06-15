import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Update .env file to remove Azure SQL related variables
const envPath = path.join(rootDir, ".env");
try {
  let envContent = fs.readFileSync(envPath, "utf8");

  // Add a comment explaining the migration
  envContent = envContent.replace(
    /# Azure SQL Server Configuration[\s\S]*?(?=\n\n|\n#)/g,
    "# Azure SQL Server Configuration has been removed\n# Application now uses Supabase\n"
  );

  // Remove Azure SQL related variables
  envContent = envContent.replace(/AZURE_SQL_SERVER=.*\n/g, "");
  envContent = envContent.replace(/AZURE_SQL_DATABASE=.*\n/g, "");
  envContent = envContent.replace(/AZURE_SQL_USER=.*\n/g, "");
  envContent = envContent.replace(/AZURE_SQL_PASSWORD=.*\n/g, "");
  envContent = envContent.replace(/AZURE_SQL_CONNECTION_STRING=.*\n/g, "");

  fs.writeFileSync(envPath, envContent);
} catch (error) {
  console.error("Error updating .env file:", error);
}

// List files to be deleted
const filesToDelete = [
  path.join(rootDir, "db", "index.js"),
  // Add more files if needed
];

// Delete files
filesToDelete.forEach((file) => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);

    }
  } catch (error) {
    console.error(`Error deleting file ${file}:`, error);
  }
});
