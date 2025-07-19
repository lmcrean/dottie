# Development Guide

## Development Commands
- **Backend**: `npm run dev` (from backend/ directory) - Node.js/Express with nodemon
- **Frontend**: `npm run dev` (from frontend/ directory) - React/Vite dev server
- **Build**: `npm run build` (Backend: TypeScript compilation, Frontend: Vite production build)
- **Docker**: `docker build -t api -f backend/Dockerfile .` (from root)
- **Full Stack**: `npm run dev` (from frontend/ directory) - Runs both frontend and backend

## Port Configuration
- **Frontend**: 3000 (default), 3005 (E2E mode)
- **Backend**: 5000 (Windows/Linux), 5001 (macOS default), 5005 (E2E mode)

## Database Commands
- **Migrations**: `npm run db:migrate` (from backend/ directory)
- **Reset**: `npm run db:reset` (from backend/ directory)
- **Setup**: Knex.js migrations for schema management