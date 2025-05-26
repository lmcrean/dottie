import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      '**/*.api.pw.spec.{js,ts}', 
      '**/playwright/**',
      '**/node_modules/**'
    ],
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 60000,
    globalSetup: './test-utilities/setupDb.js',
    // Match anything with 'dev' in the file path or test name
    includeMatch: [
      // Include tests with 'dev' in the file path
      { name: 'dev', pattern: '**/dev/**' },
      { name: 'unit', pattern: '**/unit/**' },
      { name: 'e2e', pattern: '**/e2e/**' },
      { name: 'prod', pattern: '**/prod/**' }
    ],
    // Alias to make imports work properly
    alias: {
      '@': resolve(__dirname, './'),
      '@models': resolve(__dirname, './models'),
      '@controllers': resolve(__dirname, './controllers'),
      '@routes': resolve(__dirname, './routes'),
      '@test-utils': resolve(__dirname, './test-utilities'),
    }
  },
}); 