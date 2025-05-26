import sql from "mssql";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function createAzureDatabase() {
  const config = {
    server: process.env.AZURE_SQL_SERVER,
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  };

  try {
    // Connect to master database to create our application database
    const pool = await sql.connect({
      ...config,
      database: "master",
    });

    const dbName = process.env.AZURE_SQL_DATABASE;

    // Check if database exists
    const result = await pool
      .request()
      .input("dbName", sql.VarChar, dbName)
      .query(
        `SELECT COUNT(*) as count FROM sys.databases WHERE name = @dbName`
      );

    const exists = result.recordset[0].count > 0;

    if (!exists) {
      await pool.request().query(`CREATE DATABASE [${dbName}]`);
    }

    await pool.close();
  } catch (error) {
    console.error("Error creating Azure SQL database:", error);
  }
}

// Run the function if this script is executed directly
if (process.argv[1].includes("createAzureDb.js")) {
  createAzureDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

export default createAzureDatabase;
