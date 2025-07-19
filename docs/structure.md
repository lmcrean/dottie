# Project Structure

```
backend/                   # Node.js/Express API
├── routes/               # API endpoints
│   ├── auth/            # Authentication routes
│   ├── assessment/      # Assessment CRUD operations
│   ├── chat/            # AI chat conversations
│   └── user/            # User profile management
├── models/              # Data models
├── db/                  # Database setup and migrations
├── middleware/          # Express middleware
├── services/            # Business logic services
└── Dockerfile           # Multi-stage Node.js build

frontend/                 # React/Vite frontend
├── src/
│   ├── api/            # API client layer
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-based page components
│   ├── context/        # React contexts
│   ├── hooks/          # Custom React hooks
│   └── styles/         # Global styles and Tailwind config
├── public/             # Static assets
└── vite.config.ts      # Vite configuration

shared/                   # Shared utilities and types
└── types/               # TypeScript type definitions
    ├── api.ts          # API response types
    ├── user.ts         # User-related types
    └── assessment.ts   # Assessment types

tests/                    # Integration tests
├── backend/             # Node.js API integration tests
│   ├── auth/           # Authentication tests
│   ├── api/            # API endpoint tests
│   └── setup/          # Test setup and utilities
└── frontend/            # React integration tests
    ├── components/     # Component tests
    ├── hooks/          # Hook tests
    └── utils/          # Test utilities

e2e/                      # Playwright E2E tests
├── tests/                # Test scenarios
├── fixtures/             # Test data with environment-aware URLs
├── utils/                # Test helpers and global setup
├── playwright.config.api.local.ts           # API-only local tests
├── playwright.config.api.production.branch.ts  # API-only branch tests
├── playwright.config.api.production.main.ts    # API-only main tests
├── playwright.config.web.local.ts           # Full web+API local tests
├── playwright.config.web.production.branch.ts  # Full web+API branch tests
├── playwright.config.web.production.main.ts    # Full web+API main tests
├── global-setup.api.local.ts               # API service health check (local)
├── global-setup.api.production.branch.ts   # API service health check (branch)
├── global-setup.api.production.main.ts     # API service health check (main)
├── global-setup.web.local.ts               # Both services health check (local)
├── global-setup.web.production.branch.ts   # Both services health check (branch)
└── global-setup.web.production.main.ts     # Both services health check (main)

docs/                     # Project documentation
├── README.md            # Documentation index
├── overview.md          # Project status and architecture
├── testing.md           # Testing strategy and configurations
├── structure.md         # This file - codebase organization
├── development.md       # Development commands and workflows
└── deployment.md        # Deployment configuration
```