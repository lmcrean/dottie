# validation for Creating a new conversation

when a conversation is created it MUST have the following:

1. an **assessment_id** (in frontend, user can only start a chat from the assessment detail page, which requires an assessment_id, so we can pass this to the post request as a parameter)
2. an **assessment_object** (this can be retrieved from the assessment_id in the database, specifically the model in `backend/models/assessment/Assessment.js`)

example:

```json
{
    "assessment_id": "3243-234234-234234-234234",
    "assessment_object": {
          id: "3243-234234-234234-234234",
          user_id: "user_abc_123",
          created_at: "2023-10-26T10:00:00.000Z",
          age: 25,
          pattern: "pattern_1234567890",
          cycle_length: 28,
          period_duration: 5,
          flow_heaviness: "medium",
          pain_level: 3,
          physical_symptoms: ["bloating", "headache"],
          emotional_symptoms: ["mood swings"],
          other_symptoms: "fatigue",
          recommendations: [
              { title: "Drink more water", description: "Stay hydrated throughout the day." },
              { title: "Gentle exercise", description: "Yoga or light walking can help." }
          ]
      }
```



