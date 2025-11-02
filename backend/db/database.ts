import knex, { Knex } from "knex";
import * as dotenv from "dotenv";
import * as path from "path";
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
const hasNeonUrl = !!process.env.NEON_DATABASE_URL;

// Database type identifier
type DbType = 'PostgreSQL (Neon)' | 'SQLite';

// Choose database based on environment
let db: Knex;

async function initDB(): Promise<Knex> {
  if (isProduction && hasNeonUrl) {
    // Production environment - use Neon PostgreSQL
    console.log("🐘 Initializing Neon PostgreSQL database...");

    db = knex({
      client: "pg",
      connection: process.env.NEON_DATABASE_URL,
      pool: {
        min: 2,
        max: 10
      },
      acquireConnectionTimeout: 10000
    });
  } else {
    // Development environment - use SQLite
    console.log("📁 Initializing SQLite database...");

    db = knex({
      client: "sqlite3",
      connection: {
        filename: dbPath,
      },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn: any, done: Function): void => {
          // Enable foreign keys in SQLite
          conn.run("PRAGMA foreign_keys = ON", done);
        },
      },
    });
  }
  return db;
}

const dbInstance: Knex = await initDB();
const dbType: DbType = isProduction && hasNeonUrl ? 'PostgreSQL (Neon)' : 'SQLite';

console.log(`✅ Database initialized: ${dbType}`);

export { dbInstance as db, dbType };
export default dbInstance;
