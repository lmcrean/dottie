import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { initializeDatabase } from "./services/runtime-db-setup.js";

// Load environment variables FIRST
dotenv.config();

// Import JWT configuration (validates secrets on startup)
import './config/jwt.js';

// Import route modules
import assessmentRoutes from "./routes/assessment/index.js";
import userRoutes from "./routes/user/index.js";
import authRoutes from "./routes/auth/index.js";
import setupRoutes from "./routes/setup/index.js";
import chatRoutes from "./routes/chat/index.js";
import routes from "./routes/index.js";

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

/**
 * Validate environment variables on startup
 * Ensures all critical configuration is present before starting
 */
function validateEnvironment(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical variables (missing = exit)
  const required: Record<string, string> = {
    'NODE_ENV': 'Environment detection will fail',
  };

  // Production-only requirements
  if (isProduction) {
    if (isVercel) {
      required['SUPABASE_URL'] = 'Database connection will fail';
      required['SUPABASE_ANON_PUBLIC'] = 'Database queries will fail';
    } else {
      // Add other production database requirements if needed
    }
  }

  // Optional but recommended
  const recommended: Record<string, string> = {
    'GEMINI_API_KEY': 'AI features will use mock responses',
    'LOG_LEVEL': 'Logging will use defaults',
  };

  // Validate required variables
  for (const [key, impact] of Object.entries(required)) {
    if (!process.env[key] || process.env[key] === 'undefined') {
      errors.push(`❌ Missing required variable: ${key} - ${impact}`);
    }
  }

  // Check recommended variables
  for (const [key, impact] of Object.entries(recommended)) {
    if (!process.env[key] || process.env[key] === 'undefined') {
      warnings.push(`⚠️  Missing recommended variable: ${key} - ${impact}`);
    }
  }

  // Report and exit if critical errors
  if (errors.length > 0) {
    console.error('\n🚨 ENVIRONMENT VALIDATION FAILED:\n');
    errors.forEach(err => console.error(err));
    console.error('\nServer cannot start safely. Please set required environment variables.\n');

    if (isProduction) {
      process.exit(1);
    } else {
      throw new Error('Missing required environment variables');
    }
  }

  // Report warnings but continue
  if (warnings.length > 0) {
    console.warn('\n⚠️  ENVIRONMENT WARNINGS:\n');
    warnings.forEach(warn => console.warn(warn));
    console.warn('');
  }

  console.log('✅ Environment validation passed\n');
}

// Validate environment on startup
validateEnvironment();

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
// Parse CORS origins from environment variable (set by CI/CD)
let allowedPatterns: RegExp[] = [];

if (!isDevelopment && process.env.CORS_ORIGINS) {
  try {
    const corsOrigins: string[] = JSON.parse(process.env.CORS_ORIGINS);
    allowedPatterns = corsOrigins.map(pattern => {
      // Convert wildcard patterns to regex
      // e.g., "https://dottie-app-37930--*.web.app" -> /^https:\/\/dottie-app-37930--[a-zA-Z0-9-]+\.web\.app$/
      const regexPattern = pattern
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\*/g, '[a-zA-Z0-9-]+');  // Replace * with regex pattern
      return new RegExp(`^${regexPattern}$`);
    });
    console.log('✅ Loaded CORS origins from environment:', corsOrigins);
  } catch (error: any) {
    console.error('❌ Failed to parse CORS_ORIGINS:', error.message);
  }
}

// Fallback Firebase patterns if CORS_ORIGINS not set
if (allowedPatterns.length === 0 && !isDevelopment) {
  allowedPatterns = [
    /^https:\/\/dottie-app-37930\.web\.app$/,  // Firebase main URL
    /^https:\/\/dottie-app-37930--[a-zA-Z0-9-]+\.web\.app$/,  // Firebase preview URLs
  ];
  console.log('⚠️ Using fallback Firebase CORS patterns');
}

const corsOptions: cors.CorsOptions = {
  origin: isDevelopment
    ? devOrigins
    : (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));

        // Log CORS decisions
        console.log(`CORS check for origin: ${origin} - ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
        if (!isAllowed) {
          console.log('Allowed patterns:', allowedPatterns.map(p => p.toString()));
        }

        callback(null, isAllowed);
      },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-CSRF-Token",
    "Accept-Version",
    "Content-Length",
    "Content-MD5",
    "Date",
    "X-Api-Version"
  ],
  preflightContinue: false,
};

app.use(cors(corsOptions));

// Enable pre-flight for all routes
app.options("*", cors(corsOptions));

// Routes
app.use("/api", routes);

// Health check for Vercel
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    environment: process.env.NODE_ENV || "development"
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`Error: ${message}`);
  console.error(err.stack);
  res.status(statusCode).json({ error: message });
});

/**
 * Start server with proper initialization and error handling
 */
async function startServer(): Promise<void> {
  try {
    console.log('🚀 Starting Dottie server...\n');

    // Initialize database (must succeed)
    console.log('📦 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully\n');

    // Import refresh token store for cleanup scheduling
    const { refreshTokens } = await import('./services/refreshTokenStore.js');

    // Schedule token cleanup every hour
    const cleanupInterval = setInterval(async () => {
      try {
        const expiredCount = await refreshTokens.cleanup();
        const orphanedCount = await refreshTokens.cleanupOrphanedTokens();

        if (expiredCount > 0 || orphanedCount > 0) {
          console.log(`🧹 Token cleanup: ${expiredCount} expired, ${orphanedCount} orphaned`);
        }
      } catch (error: any) {
        console.error('❌ Token cleanup failed:', error.message);
      }
    }, 60 * 60 * 1000); // Run every hour

    // Start server only if everything is ready
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🕐 Token cleanup scheduled (runs every hour)\n`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      console.log(`\n⏹️  Received ${signal}, shutting down gracefully...`);

      // Clear cleanup interval
      clearInterval(cleanupInterval);

      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('\n❌ FATAL ERROR: Server startup failed\n');
    console.error(error);

    if (isProduction) {
      console.error('\n💀 Exiting due to fatal error in production\n');
      process.exit(1);
    } else {
      console.error('\n⚠️  Development mode: Server not started\n');
      throw error;
    }
  }
}

// Start the server if we're running directly
const isMainModule = fileURLToPath(import.meta.url) === process.argv[1];

// Only start server when run directly (not when imported for testing)
if (isMainModule) {
  startServer();
} else {
  console.log("Exporting server app for serverless deployment");

  // For serverless deployment, initialize database when module is imported
  // But also fail fast if initialization fails in production
  initializeDatabase().catch((error: any) => {
    console.error("❌ Database initialization failed:", error.message);
    if (isProduction) {
      console.error('💀 Exiting due to database initialization failure in production');
      process.exit(1);
    }
  });
}

export default app;
