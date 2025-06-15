import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    ignores: [
      '**/*.config.js',
      '*config.ts',
      '!**/eslint.config.js',
      'dist/',
      'tsconfig.json',
      'test-backend-connection.js',
      ' **/*.test.ts',
      '**/*.test.tsx,',
      '**/__tests__/**',
      '**/tests/**',
      '**/test_page/**'
    ]
  },
  {
    files: ['e2e/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      js,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      jsxA11y.flatConfigs.recommended,
      prettier
    ],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      'no-unused-vars': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '/^_/u'
        }
      ],
      'no-undef': 'error',
      'no-console': 'off',
      'react/button-has-type': 'error',
      'react/react-in-jsx-scope': ['off'],
      'unused-imports/no-unused-imports': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
  }
]);
