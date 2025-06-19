import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { initializeDatabase } from "./services/runtime-db-setup.js";

// Import route modules
import assessmentRoutes from "./routes/assessment/index.js";
import userRoutes from "./routes/user/index.js";
import authRoutes from "./routes/auth/index.js";
import setupRoutes from "./routes/setup/index.js";
import chatRoutes from "./routes/chat/index.js";
import routes from "./routes/index.js";

// Load environment variables
dotenv.config();

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

// Check for required environment variables in production
if (isProduction && isVercel) {
  const requiredEnvVars = ["SUPABASE_URL", "SUPABASE_ANON_PUBLIC"];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
    process.exit(1);
  }
}

// Create Express app
const app = express();
const isMac = process.platform === 'darwin';
const PORT = process.env.PORT || (isMac ? 5001 : 5000);



// Determine environment
const isDevelopment = process.env.NODE_ENV !== "production";

// Middleware
app.use(express.json());
app.use(cookieParser());


const devPorts = [3000, 3001, 3005, 5001, 5005, 5173];

const devOrigins = devPorts.flatMap(port => [
  `http://localhost:${port}`,
  `http://127.0.0.1:${port}`
]);

// Configure CORS
const corsOptions = {
  origin: isDevelopment
    ? devOrigins
    : (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow all Vercel preview and production URLs for your project
        const allowedPatterns = [
          /^https:\/\/dottie-health\.vercel\.app$/,
          /^https:\/\/dottie-lmcreans-projects\.vercel\.app$/,
          /^https:\/\/dottie-[a-zA-Z0-9-]+\.lmcreans-projects\.vercel\.app$/,  // Preview deployments
          /^https:\/\/dottie-git-[a-zA-Z0-9-]+\.lmcreans-projects\.vercel\.app$/,  // Git branch deployments
          /^https:\/\/dottie-[a-zA-Z0-9-]+-lmcreans-projects\.vercel\.app$/ // Branch deployments with different format
        ];
        
        const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));
        
        // Log CORS decisions in development/debugging
        console.log(`CORS check for origin: ${origin} - ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
        if (!isAllowed) {
          console.log('Allowed patterns:', allowedPatterns.map(p => p.toString()));
        }
        
        callback(null, isAllowed);
      },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Enable pre-flight for all routes
app.options("*", cors(corsOptions));

// Routes
app.use("/api", routes);

// Health check for Vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Server is running",
    environment: process.env.NODE_ENV || "development"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error: ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({ error: message });
});

// Start the server if we're running directly
const isMainModule = fileURLToPath(import.meta.url) === process.argv[1];

// Only start server when run directly (not when imported for testing)
if (isMainModule) {
  // Start server
  app.listen(PORT, async () => {
    console.log(
      `Server running on port ${PORT} in ${
        process.env.NODE_ENV || "development"
      } mode`
    );
    
    // Initialize database on server startup
    await initializeDatabase();
  });
} else {
  console.log("Exporting server app for serverless deployment");
  
  // For serverless deployment, initialize database when module is imported
  initializeDatabase().catch(error => {
    console.error("Database initialization failed:", error.message);
  });
}

export default app;
