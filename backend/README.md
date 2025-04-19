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

| Endpoint                                | Method | Description                                       |
| --------------------------------------- | ------ | ------------------------------------------------- |
| `/api/hello`                            | GET    | Test endpoint to verify API is working            |
| `/api/db-status`                        | GET    | Check database connection status                  |
| `/api/auth/signup`                      | POST   | Register a new user account, create new user                       |
| `/api/auth/login`                       | POST   | Authenticate user and get access token           |
| `/api/auth/logout`                      | POST   | Logout user and invalidate token                 |
| `/api/auth/users`                            | GET    | Get list of all users                             |
| `/api/auth/users/:id`                        | GET    | Get user by ID                                    |
| `/api/auth/users/:id`                        | PUT    | Update a user                                     |
| `/api/auth/users/:id`                        | DELETE | Delete a user                                     |
| `/api/assessment/send`               | POST   | Send assessment results from frontend context     |
| `/api/assessment/list`                  | GET    | Get list of all assessments for current user      |
| `/api/assessment/:id`                   | GET    | Get detailed view of a specific assessment        |


### Data Flow

1. Client gathers assessment data from frontend context
2. Client sends complete assessment data in one request
3. Server processes and stores the assessment
4. Client can retrieve assessment results and history

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

The database includes the following tables:

- **users**: User account information (id, username, email, password_hash, age)
- **period_logs**: Menstrual cycle tracking (id, user_id, start_date, end_date, flow_level)
- **symptoms**: Symptom tracking (id, user_id, date, type, severity, notes)
- **assessments**: Assessment results (id, user_id, date, result_category, recommendations)

### Technology Stack

- **ORM**: Knex.js provides a unified query interface for both SQLite and Azure SQL
- **Migrations**: Database schema defined in `db/migrations/initialSchema.js`
- **Configuration**: Environment-based configuration in `db/index.js`

### Environment Configuration

The database connection is determined by environment variables:
- `NODE_ENV=development`: Uses SQLite (default)
- `NODE_ENV=production` + `AZURE_SQL_CONNECTION_STRING`: Uses Azure SQL

## Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dottie.git
```

2. Navigate to the project directory:

```bash
cd dottie/backend
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:
   - Copy `.env-layout.txt` to `.env`
   - Update values as needed

5. Initialize the database:

```bash
npm run db:init
```

6. Start the development server:

```bash
npm run dev
```

7. The API will be available at `http://localhost:5000`

## Testing

The codebase is set up with a comprehensive test suite organized by test type:

```
tests/
├── unit/          # Unit tests for individual components
├── e2e/           # End-to-end tests
│   ├── dev/       # Development environment tests (SQLite)
│   └── prod/      # Production environment tests (Azure SQL)
```

### Running Tests

Run all tests:

```bash
npm test
```

Run specific test types:

```bash
# Unit tests only
npm run test:unit

# All end-to-end tests
npm run test:e2e

# Development environment tests
npm run test:e2e:dev

# Production environment tests
npm run test:e2e:prod
```

You can also manually test using Postman by importing the collection file `Dottie-API.postman_collection.json`.

## Project Structure

```
backend/
├── controllers/        # Request handlers
│   └── assessmentController.js
├── db/                 # Database configuration
│   ├── index.js        # Connection setup
│   └── migrations/     # Schema definitions
├── models/             # Data models
│   └── User.js
├── services/           # Business logic
│   ├── dbService.js    # Database operations
│   └── assessmentService.js
├── routes/             # API route definitions
│   ├── assessmentRoutes.js
│   └── userRoutes.js
├── scripts/            # Utility scripts
│   └── initDb.js
├── tests/              # Test files (organized by type)
│   ├── unit/           # Unit tests
│   └── e2e/            # End-to-end tests
├── .env                # Environment variables (not in repo)
├── .env-layout.txt     # Environment template
└── server.js           # Main application entry point
```

## For Developers

### Frontend Integration

#### Submitting Assessment Data

```javascript
const submitAssessment = async (assessmentData) => {
  const response = await fetch("http://localhost:5000/api/assessment/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer your-access-token"
    },
    body: JSON.stringify(assessmentData)
  });
  return await response.json();
};
```

#### Getting Assessment History

```javascript
const getAssessmentHistory = async () => {
  const response = await fetch("http://localhost:5000/api/assessment/list", {
    headers: {
      "Authorization": "Bearer your-access-token"
    }
  });
  return await response.json();
};
```

#### Getting Assessment Details

```javascript
const getAssessmentDetails = async (assessmentId) => {
  const response = await fetch(`http://localhost:5000/api/assessment/${assessmentId}`, {
    headers: {
      "Authorization": "Bearer your-access-token"
    }
  });
  return await response.json();
};
```
