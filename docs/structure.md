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

e2e/                      # Playwright E2E tests (unified structure)
├── frontend/             # Frontend E2E tests
│   ├── README-Operations-Architecture.md
│   ├── master-integration-operations.spec.ts
│   ├── runners/          # Test runners organized by feature
│   │   ├── assessment/   # Assessment flow tests
│   │   ├── auth/         # Authentication tests
│   │   ├── chat/         # Chat functionality tests
│   │   ├── landing/      # Landing page tests
│   │   └── user/         # User profile tests
│   └── utils/            # Frontend test utilities
├── backend/              # Backend API E2E tests
│   ├── dev/              # Development environment tests
│   │   └── runners/      # API test runners by feature
│   ├── prod/             # Production environment tests
│   └── utils/            # Backend test utilities
├── playwright.frontend.local.ts            # Frontend local development configuration
├── playwright.backend.local.ts             # Backend local development configuration
├── playwright.frontend.production.branch.ts # Frontend branch deployment configuration
├── playwright.backend.production.branch.ts  # Backend branch deployment configuration
├── playwright.frontend.production.main.ts   # Frontend production deployment configuration
├── playwright.backend.production.main.ts    # Backend production deployment configuration
├── global-setup.ts                         # Global test setup
└── global-teardown.ts                      # Global test teardown

docs/                     # Project documentation
├── README.md            # Documentation index
├── overview.md          # Project status and architecture
├── testing.md           # Testing strategy and configurations
├── structure.md         # This file - codebase organization
├── development.md       # Development commands and workflows
└── deployment.md        # Deployment configuration
```