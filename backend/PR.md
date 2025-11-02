# TypeScript Migration Plan

## Overview

This document outlines the phased approach to migrating the Dottie backend from JavaScript to TypeScript. The migration follows a **bottom-up, module-by-module** strategy to ensure stability and maintainability throughout the process.

**Total Scope**: 412 JavaScript files (244 source files, 167 test files)

---

## ✅ Phase 1: Foundation (COMPLETED)

### Files Migrated
- `config/jwt.ts` - JWT configuration with typed interfaces
- `services/logger.ts` - Logger service with typed interface
- `db/database.ts` - Database initialization with Knex types

### Infrastructure Added
- `tsconfig.json` - TypeScript configuration with ES2022 modules
- `tsconfig.test.json` - Separate test configuration
- `nodemon.json` - Watch both .js and .ts during transition
- Package dependencies: TypeScript 5.7.2, tsx, @types packages
- Build scripts: `build`, `type-check`, `dev:ts`

### Testing
- All Phase 1 files tested and running correctly
- JWT validation working as expected
- Logger output confirmed
- Database initialization verified

---

## ✅ Phase 2: Database Service Layer (Critical Infrastructure) (COMPLETED)

**Status**: COMPLETED
**Priority**: HIGH - Used by ALL models
**Completed**: 2025-11-01

### Files Migrated (17 files)
```
services/db-service/
✅ types.ts - Comprehensive type definitions (NEW)
✅ index.ts - Main DbService class and exports
✅ dbService.ts - Backward compatibility re-export
✅ findById.ts - Find by ID with generic types
✅ findBy.ts - Find by field with generic types
✅ findWhere.ts - Complex where conditions with operators
✅ exists.ts - Existence check
✅ create.ts - Create with ID sanitization
✅ update.ts - Update with generic types
✅ delete.ts - Delete with flexible options
✅ getAll.ts - Get all records
✅ createWithJson.ts - Create with JSON field handling
✅ findByIdWithJson.ts - Find by ID with JSON parsing
✅ findByFieldWithJson.ts - Find by field with JSON parsing
✅ updateWithJson.ts - Update with JSON field handling
✅ updateWhere.ts - Bulk update with where conditions
✅ getConversationsWithPreviews.ts - Specialized conversation query
```

### Key Objectives
1. **Create comprehensive DB type definitions**
   - Generic table interfaces
   - Query builder types
   - Transaction types
   - Pagination types
   - Database response types

2. **Type-safe database operations**
   - Generic `DbService<T>` class with table type parameter
   - Strongly typed CRUD operations
   - Type-safe query builders
   - Proper error typing

3. **Backward compatibility**
   - Maintain existing API surface
   - Support both .js and .ts consumers during transition
   - No breaking changes

### Migration Strategy
```typescript
// Example: Generic DbService interface
interface DbService {
  findById<T>(table: string, id: number | string): Promise<T | undefined>;
  findBy<T>(table: string, criteria: Record<string, any>): Promise<T[]>;
  create<T>(table: string, data: Partial<T>): Promise<T>;
  update<T>(table: string, id: number | string, data: Partial<T>): Promise<T>;
  delete(table: string, id: number | string): Promise<boolean>;
}

// Usage with type safety
const user = await dbService.findById<User>('users', 123);
```

### Testing Requirements
- Unit tests for each db-service method
- Integration tests with actual database
- Type checking passes
- All existing tests continue to pass
- Performance benchmarks (no regression)

### Success Criteria
✅ All 17 files migrated to TypeScript
✅ Comprehensive type definitions created
✅ Import/export compatibility verified
✅ Type-check passes with no errors (db-service specific)
✅ No runtime breaking changes - backward compatible
✅ Generic type parameters for type-safe operations
✅ Proper error handling maintained
✅ All console logging preserved for debugging

### What Was Accomplished
1. **Created comprehensive type system** (`types.ts`)
   - Generic `DbRecord` interface with flexible typing
   - Support for operator values in where conditions (`<`, `>`, `in`, `like`, etc.)
   - Type-safe query options with ordering and pagination
   - Specialized types for JSON operations and conversation previews

2. **Migrated all 16 core functions** to TypeScript
   - Maintained exact behavior and API surface
   - Added generic type parameters for compile-time safety
   - Used `any` type assertions where needed for dynamic field access
   - Preserved all error handling and logging

3. **Created main exports** (`index.ts`, `dbService.ts`)
   - Static `DbService` class with all methods
   - Individual function exports for flexibility
   - Full type exports for consumer usage
   - Backward compatibility maintained

4. **Testing & Verification**
   - Type-check passes successfully
   - Import test confirms all methods available
   - Database initialization works correctly
   - Ready for use by JavaScript and TypeScript consumers

---

## 🔄 Phase 3: Model Layer (Business Logic)

**Status**: Pending
**Estimated Time**: 3-4 weeks

### Sub-Phase 3A: User Model (Recommended Start)
**Files**: ~24 files (8 services + validators + transformers + base + orchestrator)

```
models/user/
├── base/
│   └── UserBase.js → UserBase.ts
├── validators/
│   ├── validateEmail.js → validateEmail.ts
│   ├── validateUsername.js → validateUsername.ts
│   ├── validatePassword.js → validatePassword.ts
│   └── [more validators]
├── transformers/
│   ├── sanitizeUserData.js → sanitizeUserData.ts
│   ├── formatUserResponse.js → formatUserResponse.ts
│   └── [more transformers]
├── services/
│   ├── CreateUser.js → CreateUser.ts
│   ├── ReadUser.js → ReadUser.ts
│   ├── UpdateEmail.js → UpdateEmail.ts
│   ├── UpdateUsername.js → UpdateUsername.ts
│   ├── UpdatePassword.js → UpdatePassword.ts
│   ├── DeleteUser.js → DeleteUser.ts
│   ├── AuthenticateUser.js → AuthenticateUser.ts
│   └── ResetPassword.js → ResetPassword.ts
└── User.js → User.ts (orchestrator)
```

#### Key Type Definitions
```typescript
// User domain types
interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

interface UserCreateInput {
  username: string;
  email: string;
  password: string;
}

interface UserPublic {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

// Validation types
type ValidationResult<T> =
  | { valid: true; data: T }
  | { valid: false; errors: string[] };

// Service interfaces
interface ICreateUser {
  execute(input: UserCreateInput): Promise<User>;
}
```

#### Migration Order
1. **Base & Types** - UserBase.ts, type definitions
2. **Validators** - All validation functions with proper typing
3. **Transformers** - Data transformation with type safety
4. **Services** - One service at a time, test each
5. **Orchestrator** - User.ts main class

#### Testing Requirements
- 117 existing test files for User model
- All tests must pass after migration
- Add type-specific tests
- Integration tests with db-service

### Sub-Phase 3B: Assessment Model
**Files**: ~20 files (5 services + validators + transformers + base + orchestrator)

```
models/assessment/
├── base/AssessmentBase.js → AssessmentBase.ts
├── validators/ → validators/*.ts
├── transformers/ → transformers/*.ts
├── services/
│   ├── CreateAssessment.js → CreateAssessment.ts
│   ├── FindAssessment.js → FindAssessment.ts
│   ├── UpdateAssessment.js → UpdateAssessment.ts
│   ├── DeleteAssessment.js → DeleteAssessment.ts
│   └── RouteAssessment.js → RouteAssessment.ts
└── Assessment.js → Assessment.ts
```

#### Key Type Definitions
```typescript
interface Assessment {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  assessment_data: AssessmentData; // JSON field
  created_at: Date;
  updated_at: Date;
}

interface AssessmentData {
  symptoms: string[];
  severity: 'low' | 'medium' | 'high';
  notes?: string;
  // ... other assessment-specific fields
}
```

### Sub-Phase 3C: Chat Model (Most Complex)
**Files**: ~28 files (complex nested structure)

```
models/chat/
├── conversation/
│   ├── services/ → *.ts
│   └── index.js → index.ts
├── message/
│   ├── services/ → *.ts
│   └── index.js → index.ts
├── list/
│   ├── services/ → *.ts
│   └── index.js → index.ts
└── index.js → index.ts
```

#### Key Type Definitions
```typescript
interface Conversation {
  id: number;
  user_id: number;
  assessment_id?: number;
  created_at: Date;
  updated_at: Date;
}

interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: Date;
}
```

---

## 🔄 Phase 4: Routes & Server (API Layer)

**Status**: Pending
**Estimated Time**: 2-3 weeks

### Files to Migrate (~75 route files + server.js)

```
routes/
├── auth/
│   ├── login/
│   │   ├── controller.js → controller.ts
│   │   └── route.js → route.ts
│   ├── signup/
│   ├── logout/
│   ├── refresh/
│   ├── verify/
│   └── index.js → index.ts
├── user/
│   ├── get-all/
│   ├── get-user/
│   ├── update/
│   ├── delete/
│   └── index.js → index.ts
├── assessment/
│   ├── create/
│   ├── getList/
│   ├── getDetail/
│   ├── delete/
│   └── index.js → index.ts
├── chat/
│   ├── send-message/
│   ├── get-history/
│   ├── get-conversation/
│   ├── delete-conversation/
│   └── index.js → index.ts
├── setup/
│   └── index.js → index.ts
├── index.js → index.ts
└── middleware/
    └── auth.js → auth.ts
```

### Key Type Definitions
```typescript
import { Request, Response, NextFunction } from 'express';

// Extend Express Request with typed user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

// Typed route handlers
type AsyncRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

// API response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Migration Strategy
1. **Middleware first** - `middleware/auth.ts`
2. **Route by domain** - Auth → User → Assessment → Chat → Setup
3. **Controller then route** - For each endpoint
4. **Aggregation** - Index files last
5. **Server** - `server.ts` as final step

### Testing Requirements
- All e2e Playwright tests must pass
- All route unit tests must pass
- No breaking changes to API contracts
- Request/response types validated

---

## 🔄 Phase 5: Tests & Migrations (Final Phase)

**Status**: Pending
**Estimated Time**: 2-3 weeks

### Files to Migrate (167 test files + 12 migrations)

```
__tests__/ (117 files)
├── unit/*.test.js → *.test.ts
├── dev/*.test.js → *.test.ts
└── integration/*.test.js → *.test.ts

e2e/ (50 files)
├── dev/*.spec.js → *.spec.ts
└── prod/*.spec.js → *.spec.ts

db/migrations/ (12 files)
├── initialSchema.js → initialSchema.ts
├── assessmentSchema.js → assessmentSchema.ts
└── [10 more migrations]
```

### Testing Framework Updates
```typescript
// Vitest with TypeScript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { User } from '../models/user/User';

describe('User Service', () => {
  it('should create user with correct types', async () => {
    const userData: UserCreateInput = {
      username: 'test',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await createUser(userData);
    expect(user).toBeDefined();
    expect(user.id).toBeTypeOf('number');
  });
});
```

### Migration Strategy
- Update `vitest.config.js` for TypeScript
- Update Playwright config for TypeScript
- Migrate test utilities first
- Migrate tests alongside their source modules
- Update test database scripts

---

## Migration Workflow

### For Each Phase

1. **Preparation**
   - Review existing .js files
   - Identify dependencies
   - Plan type definitions

2. **Migration**
   - Create .ts file alongside .js
   - Add type annotations
   - Update imports
   - Test in isolation

3. **Validation**
   - Run `npm run type-check`
   - Run unit tests
   - Run integration tests
   - Manual testing

4. **Commit**
   - Commit working .ts files
   - Keep .js files for now
   - Document in commit message

5. **Cleanup (After Full Phase Complete)**
   - Remove .js files
   - Update imports to .ts
   - Final validation

---

## Type Strictness Progression

Start with loose type checking, gradually tighten:

### Phase 1-2 (Current)
```json
{
  "strict": false,
  "noImplicitAny": false,
  "strictNullChecks": false
}
```

### Phase 3-4
```json
{
  "strict": false,
  "noImplicitAny": true,
  "strictNullChecks": false
}
```

### Phase 5 (Final)
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true
}
```

---

## Risk Mitigation

### High-Risk Areas
1. **DbService** - Used everywhere, must be perfect
2. **Auth middleware** - Security critical
3. **Chat model** - Complex nested structure

### Mitigation Strategies
- Extensive testing before deployment
- Gradual rollout (feature flags if needed)
- Monitor error rates in production
- Keep .js fallbacks during transition
- Pair programming for critical modules

---

## Success Metrics

- ✅ 100% of source files migrated (244 files)
- ✅ 100% of test files migrated (167 files)
- ✅ All tests passing
- ✅ Type-check passes with strict mode enabled
- ✅ No runtime performance regression
- ✅ Zero production incidents related to migration
- ✅ Developer experience improved (better autocomplete, fewer bugs)

---

## Timeline Summary

| Phase | Duration | Files | Status |
|-------|----------|-------|--------|
| Phase 1: Foundation | Week 1 | 3 files | ✅ COMPLETE |
| Phase 2: DB Service | Week 2 | 17 files | ✅ COMPLETE |
| Phase 3A: User Model | Weeks 4-5 | 24 files | 🔄 Pending |
| Phase 3B: Assessment Model | Week 6 | 20 files | 🔄 Pending |
| Phase 3C: Chat Model | Week 7 | 28 files | 🔄 Pending |
| Phase 4: Routes & Server | Weeks 8-10 | 76 files | 🔄 Pending |
| Phase 5: Tests & Migrations | Weeks 11-12 | 179 files | 🔄 Pending |

**Total Estimated Timeline**: 10-12 weeks

---

## Tools & Resources

### Development Tools
- **TypeScript**: 5.7.2
- **tsx**: Runtime TypeScript execution
- **Vitest**: Test framework with TS support
- **Playwright**: E2E testing with TS support

### Type Definitions
- @types/node
- @types/express
- @types/bcrypt
- @types/jsonwebtoken
- @types/cors
- @types/cookie-parser
- @types/pg
- @types/uuid
- @types/supertest

### Useful Commands
```bash
npm run type-check      # Type-check without compilation
npm run build           # Compile TypeScript to JavaScript
npm run dev:ts          # Run development server with tsx
npm test                # Run all tests
npm run test:unit       # Run unit tests only
```

---

## Notes

- All .js files remain in place during migration for safety
- Each phase is independently deployable
- Type strictness increases gradually
- Comprehensive testing at each step
- No breaking changes to existing APIs
- ES Modules already in use (no CJS conversion needed)

---

## Next Steps

After Phase 2 completion:
1. Begin Phase 3A - User Model migration (recommended start)
2. Create comprehensive User domain type definitions
3. Migrate validators, transformers, services, and orchestrator
4. Extensive testing before proceeding to other models
5. Continue with Assessment and Chat models
6. Create separate PR for each major phase for easier review

---

**Last Updated**: 2025-11-01
**Migration Lead**: TypeScript Migration Team
**Status**: Phase 1 & 2 Complete, Phase 3A Ready to Begin
