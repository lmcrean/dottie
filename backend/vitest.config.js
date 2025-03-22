import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/*.spec.{js,ts}', '**/playwright-*.{js,ts}', '**/node_modules/**', '**/dist/**', '**/test-results/**', '**/playwright-report/**'],
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
}); 