# Expected Output: Assessment to Chat Data Flow

This document outlines the expected data structures and API responses at each step of the assessment to chat flow.

## Assessment Completion Flow

### 1. Assessment Data Submission

**Input**: `POST /api/assessment/send`

```typescript
{
  assessmentData: {
    age: "18-24" | "25-plus" | "13-17" | "under-13",
    cycle_length: "21-25" | "26-30" | "31-35" | "36-40" | "less-than-21" | "irregular",
    period_duration: "1-3" | "4-5" | "6-7" | "8-plus" | "varies",
    flow_heaviness: "light" | "moderate" | "heavy" | "very-heavy" | "varies",
    pain_level: "no-pain" | "mild" | "moderate" | "severe" | "debilitating",
    physical_symptoms: ["bloating", "headaches", "fatigue", ...],
    emotional_symptoms: ["irritability", "anxiety", "mood-swings", ...],
    other_symptoms: "Additional symptoms description",
    pattern: "regular" | "irregular" | "heavy" | "pain" | "developing",
    recommendations: [
      {
        id: "track_cycle",
        title: "Track Your Cycle",
        description: "Keep a record of when your period starts..."
      }
    ]
  }
}
```

**Expected Response**:

```typescript
{
  id: "assessment_12345",
  user_id: "user_67890",
  age: "18-24",
  cycle_length: "26-30",
  period_duration: "4-5",
  flow_heaviness: "moderate",
  pain_level: "mild",
  physical_symptoms: ["bloating", "fatigue"],
  emotional_symptoms: ["mood-swings"],
  other_symptoms: "Occasional headaches",
  pattern: "regular",
  recommendations: [...],
  created_at: "2024-01-15T10:30:00Z",
}
```

---

## Chat Creation Flow

### 2. New Chat Creation

**Input**: `POST /api/chat`

```typescript
{
  assessment_id: "assessment_12345",
  initial_message: "Hi! I've just completed my menstrual health assessment (ID: assessment_12345). My results show: Regular Menstrual Cycles. Can you tell me more about what this means and provide personalized recommendations?"
}
```

**Expected Response**:

```typescript
{
  id: "chat_54321",
  user_id: "user_67890",
  assessment_id: "assessment_12345",
  created_at: "2024-01-15T10:35:00Z",
  updated_at: "2024-01-15T10:35:00Z"
}
```

### 3. Initial Message Sending

**Input**: `POST /api/chat/chat_54321/message/initial`

```typescript
{
  message: "Hi! I've just completed my menstrual health assessment (ID: assessment_12345). My results show: Regular Menstrual Cycles. Can you tell me more about what this means and provide personalized recommendations?",
  assessment_id: "assessment_12345",
  is_initial: true
}
```

**Expected Response**:

```typescript
{
  id: "message_98765",
  chat_id: "chat_54321",
  role: "user",
  content: "Hi! I've just completed my menstrual health assessment...",
  created_at: "2024-01-15T10:35:30Z",
  assessment_context: {
    assessment_id: "assessment_12345",
    pattern: "regular",
    key_findings: [
      "Normal cycle length (26-30 days)",
      "Moderate flow",
      "Mild pain levels"
    ]
  }
}
```

---

## Chat Loading Flow

### 4. Conversation History Retrieval

**Request**: `GET /api/chat/history/chat_54321`

**Expected Response**:

```typescript
{
  id: "chat_54321",
  assessment_id: "assessment_12345",
  messages: [
    {
      id: "message_98765",
      role: "user",
      content: "Hi! I've just completed my menstrual health assessment...",
      created_at: "2024-01-15T10:35:30Z"
    },
    {
      id: "message_98766",
      role: "assistant",
      content: "Hello! I'd be happy to help you understand your assessment results...",
      created_at: "2024-01-15T10:36:00Z"
    }
  ]
}
```

### 5. Assessment Detail Retrieval

**Request**: `GET /assessment/getDetail/assessment_12345`

**Expected Response**:

```typescript
{
  id: "assessment_12345",
  age: 22,
  pattern: "regular",
  cycle_length: 28,
  period_duration: 5,
  flow_heaviness: "moderate",
  pain_level: 3,
  physical_symptoms: ["bloating", "fatigue", "breast-tenderness"],
  emotional_symptoms: ["mood-swings", "irritability"],
  other_symptoms: ["occasional headaches"],
  recommendations: [
    {
      title: "Track Your Cycle",
      description: "Regular tracking will help you understand your patterns better..."
    },
    {
      title: "Exercise Regularly",
      description: "Light to moderate exercise can help reduce menstrual pain..."
    },
    {
      title: "Maintain a Balanced Diet",
      description: "Foods rich in iron, calcium, and omega-3 fatty acids..."
    }
  ]
}
```

---

## Pattern Data Context

### 6. Pattern Information (from PATTERN_DATA)

**For Pattern: "regular"**:

```typescript
{
  title: "Regular Menstrual Cycles",
  description: "Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.",
  icon: "/patternDataIcons/regularMenstrualCycles.svg",
  recommendations: [
    {
      icon: "📅",
      title: "Track Your Cycle",
      description: "Regular tracking will help you understand your patterns better..."
    },
    {
      icon: "🏃‍♀️",
      title: "Exercise Regularly",
      description: "Light to moderate exercise can help reduce menstrual pain..."
    }
  ]
}
```

**For Pattern: "irregular"**:

```typescript
{
  title: "Irregular Timing Pattern",
  description: "Your cycle length is outside the typical range, which may indicate hormonal fluctuations.",
  icon: "/patternDataIcons/irregularTimingPattern.svg",
  recommendations: [
    {
      icon: "📅",
      title: "Track Your Cycle",
      description: "Keeping a detailed record can help identify patterns..."
    },
    {
      icon: "👩‍⚕️",
      title: "Consult a Healthcare Provider",
      description: "If your cycles are consistently irregular..."
    }
  ]
}
```

---

## Error Handling

### Common Error Responses

**Authentication Error**:

```typescript
{
  status: 401,
  error: "User ID not found. Please login again."
}
```

**Validation Error**:

```typescript
{
  status: 400,
  error: "Assessment data is required"
}
```

**Not Found Error**:

```typescript
{
  status: 404,
  error: "Conversation not found"
}
```

**Server Error**:

```typescript
{
  status: 500,
  error: "Failed to create chat. Please try again."
}
```

---

## UI State Management

### Component State Expectations

**SendInitialMessageButton State**:

```typescript
{
  isLoading: false,
  isFullscreenChatOpen: false,
  currentChatId: null | "chat_54321"
}
```

**useChatState Hook State**:

```typescript
{
  messages: [
    { role: "user", content: "..." },
    { role: "assistant", content: "..." }
  ],
  input: "",
  isLoading: false,
  currentConversationId: "chat_54321",
  assessmentId: "assessment_12345"
}
```

**AssessmentDataDisplay State**:

```typescript
{
  isExpanded: false,
  assessmentData: { /* full assessment object */ },
  isLoading: false
}
```

---

## Console Log Outputs

### Expected Console Messages

**Chat Creation**:

```
[SendInitialMessageButton] Creating new chat with assessment ID: assessment_12345
[createNewChat] User ID user_67890 found. Creating chat with: {assessment_id: "assessment_12345", initial_message: "..."}
[createNewChat] Successfully created chat: {id: "chat_54321", ...}
```

**Message Sending**:

```
[SendInitialMessageButton] Sending initial message
[sendInitialMessage] User ID user_67890 found. Sending message to chat chat_54321
[sendInitialMessage] Successfully sent initial message: {id: "message_98765", ...}
```

**Chat Loading**:

```
[useChatState] Selected conversation: {id: "chat_54321", ...}
Error fetching assessment data: Assessment not found (if assessment missing)
```
