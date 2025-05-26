import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the root directory (relative to test-utilities)
export const rootDir = join(__dirname, '..');

// Helper to resolve paths from the root
export const resolveFromRoot = (...paths) => join(rootDir, ...paths);

// Create a require function that works with ES modules
export const requireFromRoot = createRequire(import.meta.url); 