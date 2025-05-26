// This file is used by tests to reference the main server.js file
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a require function
const require = createRequire(import.meta.url);

// Resolve the path to the main server.js
const serverPath = resolve(__dirname, '../../server.js');

// Import and re-export the default export from the main server.js
export { default } from '../../server.js'; 