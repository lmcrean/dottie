import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

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
    : [
        "https://dottie-health.vercel.app",
        "https://dottie-lmcreans-projects.vercel.app",
        "https://dottie-oi1fayiad-lmcreans-projects.vercel.app",
      ],
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
  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} in ${
        process.env.NODE_ENV || "development"
      } mode`
    );
  });
} else {
  console.log("Exporting server app for serverless deployment");
}

export default app;
