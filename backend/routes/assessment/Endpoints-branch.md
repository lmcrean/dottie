# Assessment Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/assessment/send` | POST | Send assessment results from frontend context, generates a new assessmentId |
| `/api/assessment/list` | GET | Get list of all assessments for the authenticated user |
| `/api/assessment/:id` | GET | Get detailed view of a specific assessment by ID |
| `/api/assessment/:id` | DELETE | Delete a specific assessment by ID |

## Request Examples

```javascript
// Send assessment
fetch("/api/assessment/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-access-token"
  },
  body: JSON.stringify({
    userId: "user-123",
    assessmentData: {
      age: "18-24",
      cycleLength: "26-30",
      periodDuration: "4-5",
      flowHeaviness: "moderate",
      painLevel: "moderate",
      symptoms: {
        physical: ["Bloating", "Headaches"],
        emotional: ["Mood swings", "Irritability"]
      }
    }
  })
});

// Get assessment list
fetch("/api/assessment/list", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});

// Get specific assessment
fetch("/api/assessment/assessment-123", {
  headers: {
    "Authorization": "Bearer your-access-token"
  }
});
``` 