# Dottie - Menstrual Health Assessment API

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
