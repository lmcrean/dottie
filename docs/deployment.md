# Deployment Configuration

## Deployment Targets
- **API**: Google Cloud Run via Docker (Node.js/Express)
- **Web**: Google Cloud Run (React/Vite static files)
- **CI/CD**: GitHub Actions with automated testing pipeline
- **E2E Testing**: Automated against deployed services using environment variables

## Build Process
- **Backend**: `npm run build` (TypeScript compilation)
- **Frontend**: `npm run build` (Vite production build)
- **Docker**: Multi-stage Node.js builds for API deployment
- **Assets**: Static assets served from Google Cloud CDN