# Dottie - Menstrual Health Assessment API

## Overview

Dottie is a user-friendly application designed to help individuals understand their menstrual health better. Through a series of simple questions, Dottie collects information about your menstrual cycle and provides personalized analysis and recommendations.

## How It Works

### Assessment Process

1. **Start an Assessment**: Begin by answering questions about your menstrual health
2. **Answer Questions**: Complete a series of 6 questions about your cycle
3. **Get Personalized Results**: Receive analysis and recommendations based on your answers

### Questions Covered

- Age group
- Menstrual cycle length
- Period duration
- Flow heaviness
- Pain level
- Physical and emotional symptoms

## Features

- **Progressive Assessment**: Questions appear one at a time for a better user experience
- **Age-Appropriate Guidance**: Tailored information based on your age group
- **Symptom Analysis**: Identifies patterns in your reported symptoms
- **Personalized Recommendations**: Practical advice based on your specific situation
- **Educational Content**: Learn more about what's normal and when to seek help

## Technical Information

### API Endpoints

API endpoints cover 3 key functionalities:

1. Testing endpoints (hello and db-status)
2. User Authentication
3. Assessment

5. Initialize the database:


### Data Flow

1. Client gathers assessment data from frontend context
2. Client sends complete assessment data in one request
3. Server processes and stores the assessment
4. Client can retrieve assessment results and history

### Component Dependency Flow

Understanding how components interact is key to navigating the backend codebase. Here's the typical flow for handling an API request:

1.  **Entry Point (`server.js`)**: Receives the incoming HTTP request. Applies global middleware (e.g., CORS, logging, body parsing).
2.  **Routing (`routes/`)**: `server.js` delegates the request to the appropriate router based on the base path (e.g., `/api/auth`, `/api/assessment`). The router matches the specific path and HTTP method.
3.  **Controllers (`controllers/`)**: The matched route calls a specific controller function. Controllers are responsible for handling the request lifecycle: parsing input, validating data (potentially using helper functions/middleware), and orchestrating the response. They act as the bridge between the HTTP layer and the business logic.
4.  **Services (`services/`)**: Controllers call service functions to perform the core business logic. Services encapsulate specific operations (e.g., `createAssessment`, `findUserById`). They contain the primary logic and are decoupled from the HTTP request/response details.
5.  **Models / Database (`models/`, `db/`)**: Services interact with the database to fetch or persist data. This might be through:
    *   **Models (`models/`)**: Classes or objects representing data entities (e.g., `User`), potentially containing methods for data access logic.
    *   **DB Service (`db/index.js`, `dbService.js`)**: Direct interaction with the Knex.js instance for executing queries, using migrations, etc.
6.  **Response**: The result (data or error) flows back up the chain: DB/Model -> Service -> Controller, which then formats and sends the HTTP response back to the client via the routing layer.

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Knex.js provides a unified query interface for both SQLite and Azure SQL.
- **Database**: SQLite (Development), Azure SQL Database (Production)
- **Migrations**: Managed via Knex.js, schema defined in `db/migrations/`.
- **Testing**: Vitest (Unit/Integration), Playwright (E2E), Postman (Manual API Testing).
- **Linting/Formatting**: (Add relevant tools if used, e.g., ESLint, Prettier)

## Assessment Data Format

The assessment data is sent as a single object containing all answers:

At this point, recommendations are handled on the frontend with `if-else` statements.

```javascript
{
  "userId": "user-id",
  "assessmentData": {
    "age": "15-17",  // Options: "under_12", "12_14", "15_17", "18_24", "over_24"
    "cycleLength": "26_30",  // Options: "less_than_21", "21_25", "26_30", "31_35", "more_than_35", "irregular"
    "periodDuration": "4-5",  // Options: "1_3", "4_5", "6_7", "more_than_7"
    "flowHeaviness": "moderate",  // Options: "light", "moderate", "heavy", "very_heavy"
    "painLevel": "moderate",  // Options: "none", "mild", "moderate", "severe", "debilitating"
    "symptoms": {
      "physical": ["Bloating", "Headaches", "Fatigue"],  // Select all that apply
      "emotional": ["Mood swings", "Irritability", "Anxiety"]  // Select all that apply
    }
    "recommendations": [
      {
        "title": "Track Your Cycle",
        "description": "Keep a record of when your period starts and stops to identify patterns."
      },
      {
        "title": "Pain Management",
        "description": "Over-the-counter pain relievers like ibuprofen can help with cramps."
      }
    ]
  }
}
```

## Database Architecture

### Overview

Dottie uses a dual-database approach that simplifies local development while maintaining production readiness:

- **Development**: SQLite (local file-based database)
- **Production**: Azure SQL Database (cloud-based)

This architecture allows developers to work without setting up an external database server, while ensuring a smooth transition to the cloud for production.

### Data Models

The database includes the following core tables (defined in `db/migrations/`):

- **users**: User account information (id, username, email, password_hash, age)
- **assessments**: Assessment results (id, user_id, date, result_category, recommendations, plus fields for each answer)
- **period_logs**: (Optional/Future) Menstrual cycle tracking (id, user_id, start_date, end_date, flow_level)
- **symptoms**: (Optional/Future) Symptom tracking (id, user_id, date, type, severity, notes)

*Note: `period_logs` and `symptoms` might be future enhancements or managed differently.*

#### Environment Configuration

The database connection is determined by environment variables (`db/index.js`):
- `NODE_ENV=development`: Uses SQLite (default)
- `NODE_ENV=production` + `AZURE_SQL_CONNECTION_STRING`: Uses Azure SQL

### Project Structure

```
backend/
├── controllers/        # Request handlers (e.g., assessmentController.js, authController.js)
├── db/                 # Database config, migrations, seeds, connection setup (index.js)
├── middleware/         # Express middleware (e.g., authentication, error handling)
├── models/             # Data models/abstractions (e.g., User.js - if used)
├── routes/             # API route definitions (e.g., assessmentRoutes.js, authRoutes.js)
├── scripts/            # Utility scripts (e.g., initDb.js)
├── services/           # Business logic layer (e.g., assessmentService.js, authService.js)
├── test-utilities/     # Helper functions/fixtures for tests
├── tests/              # Automated tests (unit, integration, e2e)
│   ├── unit/           # Tests for individual functions/modules
│   └── e2e/            # End-to-end tests using Playwright
├── .env                # Local environment variables (ignored by git)
├── .env-layout.txt     # Template for environment variables
├── .gitignore          # Specifies intentionally untracked files that Git should ignore
├── package.json        # Project metadata, dependencies, scripts
├── package-lock.json   # Records exact versions of dependencies
├── playwright.config.js # Configuration for Playwright E2E tests
├── README.md           # This file
├── server.js           # Main application entry point, sets up Express app
├── start-server.ps1    # Windows PowerShell script to start server
├── vercel.json         # Configuration for deploying to Vercel
└── vitest.config.js    # Configuration for Vitest unit/integration tests
```

### Component Dependency Flow

Understanding how components interact is key. Here's the typical flow for handling an API request:

1.  **Entry Point (`server.js`)**: Receives the HTTP request. Applies global middleware (CORS, logging, body parsing).
2.  **Routing (`routes/`)**: `server.js` delegates to routers based on the path (e.g., `/api/auth`, `/api/assessment`). The router matches the specific endpoint and HTTP method.
3.  **Middleware (`middleware/`)**: Route-specific middleware (like authentication checks) may run.
4.  **Controllers (`controllers/`)**: The matched route calls a controller function. Controllers handle request/response, parse/validate input, and call services.
5.  **Services (`services/`)**: Contain the core business logic, decoupled from HTTP. They orchestrate operations and interact with the database layer.
6.  **Models / Database (`models/`, `db/`)**: Services use the Knex instance (`db/index.js` or `services/dbService.js`) or potentially models (`models/`) to interact with the database (fetch/persist data).
7.  **Response**: Results flow back up: DB -> Service -> Controller, which sends the HTTP response.

This layered approach aids testability and maintenance. Dependencies primarily flow downwards.

## API Endpoints

The API covers Testing, User Authentication, and Assessments.

| Endpoint                        | Method | Description                                      | Requires Auth |
| ------------------------------- | ------ | ------------------------------------------------ | ------------- |
| `/api/hello`                    | GET    | Test endpoint to verify API is working           | No            |
| `/api/db-status`                | GET    | Check database connection status                 | No            |
| `/api/auth/signup`              | POST   | Register a new user                              | No            |
| `/api/auth/login`               | POST   | Authenticate user and get access token           | No            |
| `/api/auth/logout`              | POST   | Logout user (invalidates token server-side?)     | Yes           |
| `/api/auth/users`               | GET    | Get list of all users (Requires Admin role?)     | Yes           |
| `/api/auth/users/:id`           | GET    | Get user by ID (Admin or self?)                  | Yes           |
| `/api/auth/users/:id`           | PUT    | Update a user (Admin or self?)                   | Yes           |
| `/api/auth/users/:id`           | DELETE | Delete a user (Admin or self?)                   | Yes           |
| `/api/assessment/send`          | POST   | Submit completed assessment answers              | Yes           |
| `/api/assessment/list`          | GET    | Get summary list of assessments for current user | Yes           |
| `/api/assessment/:id`           | GET    | Get detailed view of a specific assessment       | Yes           |

*Note: Specific authorization logic (e.g., Admin vs. User) should be verified in the route/middleware definitions.*

## Data Flow & Format

### Assessment Data Flow

1.  Client (Frontend) gathers all assessment answers.
2.  Client sends the complete assessment data object to `POST /api/assessment/send`.
3.  Backend (`assessmentController.js` -> `assessmentService.js`) validates and stores the assessment data in the `assessments` table.
4.  Client can retrieve history (`GET /api/assessment/list`) or details (`GET /api/assessment/:id`).

### Assessment Data Format (Payload for `POST /api/assessment/send`)

The backend expects a JSON object containing the user's answers. The `userId` is typically inferred from the authentication token on the backend, not sent in the payload.

*Note: Recommendations are generated on the frontend based on the assessment data retrieved; the backend primarily stores the raw answers.*

```javascript
{
  // "userId": "user-id", // Usually inferred from auth token server-side
  "assessmentData": {
    "age": "15-17",          // Example value
    "cycleLength": "26_30",    // Example value
    "periodDuration": "4-5",   // Example value
    "flowHeaviness": "moderate", // Example value
    "painLevel": "moderate",   // Example value
    "symptoms": {           // Example value
      "physical": ["Bloating", "Headaches", "Fatigue"],
      "emotional": ["Mood swings", "Irritability", "Anxiety"]
    }
    // "recommendations": [] // This is handled by frontend
  }
}
```

## Testing

The codebase is set up with a comprehensive test suite organized by test type:

```
tests/
├── unit/          # Unit tests for individual functions/modules
├── e2e/           # End-to-end tests using Playwright
│   ├── dev/       # E2E tests against SQLite
│   └── prod/      # E2E tests potentially against Azure SQL
```

### Running Tests

- Run all tests (likely configured in `package.json`'s `test` script): `npm test`
- Unit/Integration tests (Vitest): `npm run test:unit` (or similar script)
- End-to-End tests (Playwright): `npm run test:e2e` (or similar)
- Run E2E tests for dev environment: `npm run test:e2e:dev`
- Run E2E tests for prod environment: `npm run test:e2e:prod`

Manual API testing can be performed using the Postman collection: `Dottie-API.postman_collection.json`.

## For Frontend Developers (API Interaction Examples)

Code snippets illustrating how to call the backend API. Ensure you handle token management (acquisition, refresh, secure storage) and error responses appropriately.

### Submitting Assessment Data

```javascript
const submitAssessment = async (assessmentData, authToken) => {
  const payload = { assessmentData }; // userId is inferred server-side
  try {
    const response = await fetch("http://localhost:5000/api/assessment/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      // Handle HTTP errors (e.g., 401 Unauthorized, 400 Bad Request)
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Returns the saved assessment details
  } catch (error) {
    console.error("Failed to submit assessment:", error);
    // Handle/display error appropriately in the UI
    throw error;
  }
};
```

### Getting Assessment History

```javascript
const getAssessmentHistory = async (authToken) => {
  try {
    const response = await fetch("http://localhost:5000/api/assessment/list", {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Returns an array of assessment summaries
  } catch (error) {
    console.error("Failed to get assessment history:", error);
    throw error;
  }
};
```

### Getting Assessment Details

```javascript
const getAssessmentDetails = async (assessmentId, authToken) => {
  try {
    const response = await fetch(`http://localhost:5000/api/assessment/${assessmentId}`, {
      headers: {
        "Authorization": `Bearer ${authToken}`
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return await response.json(); // Returns the detailed assessment object
  } catch (error) {
    console.error(`Failed to get assessment details for ID ${assessmentId}:`, error);
    throw error;
  }
};
```

---

## Application Context (Original Purpose - Less Relevant for Backend Dev)

Dottie is designed as a user-friendly application to help individuals understand their menstrual health via a question-based assessment.

### How It Originally Worked (Frontend Driven)

1.  **Start Assessment**: User initiates the process.
2.  **Answer Questions**: Frontend presents questions sequentially.
3.  **Get Personalized Results**: Frontend logic generates recommendations based on the answers collected *before* submitting to the backend.

### Original Features (Mostly Frontend Implementation)

-   Progressive Assessment UI
-   Age-Appropriate Guidance Logic
-   Symptom Analysis Logic
-   Personalized Recommendation Generation
-   Educational Content Display

### Original Questions Covered (Handled by Frontend)

-   Age group
-   Menstrual cycle length
-   Period duration
-   Flow heaviness
-   Pain level
-   Physical and emotional symptoms selection
