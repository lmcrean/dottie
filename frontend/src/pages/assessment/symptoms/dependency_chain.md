# Symptoms Data Dependency Chain

This document explains how symptom data flows through the Dottie application.

## Flow Overview 🔗

1. Symptoms selection in `symptoms/page.tsx`
2. Session storage intermediate storage
3. Results processing in `results/page.tsx`
4. API request via `assessment/requests/postSend/Request.ts`
5. Backend processing in `backend/models/assessment/FlattenedAssessment.js`
6. Database storage
7. API response to get request
8. Display in `history/[id]/page.tsx`

## Detailed Flow

### 1. Symptoms Selection (`symptoms/page.tsx`)

- User selects symptoms from categorized lists (physical vs emotional)
- Selected symptoms are stored as IDs in `physicalSymptoms` and `emotionalSymptoms` state arrays
- On continue:
  - IDs are mapped to label strings
  - All symptoms are combined into a single array and stored in `sessionStorage` as "symptoms"
  - A categorized format is also stored as "symptoms_categorized" with separate arrays for physical, emotional, and other symptoms
  
```typescript
// Combine all symptoms
const allSymptoms = [
  ...physicalSymptoms.map((id) => /* map to labels */),
  ...emotionalSymptoms.map((id) => /* map to labels */),
  ...(otherSymptoms ? [otherSymptoms] : []),
];

// Save to sessionStorage - flat array
sessionStorage.setItem("symptoms", JSON.stringify(allSymptoms));

// Save categorized - with structure
sessionStorage.setItem("symptoms_categorized", JSON.stringify({
  physical: physicalLabels,
  emotional: emotionalLabels,
  other: otherSymptoms ? [otherSymptoms] : []
}));
```

### 2. Results Processing (`results/page.tsx`)

- Component loads data from sessionStorage, including symptoms
- The pre-categorized symptoms are loaded from "symptoms_categorized" 
- When the user saves results, a structured assessment object is created with separate arrays for physical and emotional symptoms
- The `transformToFlattenedFormat` function (from `AssessmentResultContext`) converts this into the flattened API format

```typescript
// Load data from sessionStorage
const storedSymptoms = sessionStorage.getItem("symptoms");
const storedCategorizedSymptoms = sessionStorage.getItem("symptoms_categorized");

// Create assessment object
const assessmentResult = {
  // ...other fields
  symptoms: {
    physical: [...categorizedSymptoms.physical, ...categorizedSymptoms.other],
    emotional: categorizedSymptoms.emotional,
  },
  // ...recommendations
};

// Transform to API format
const assessment = transformToFlattenedFormat(assessmentResult);
```

### 3. Context Layer (`hooks/use-assessment-result.ts`)

- The `transformToFlattenedFormat` function in the `useAssessmentResult` hook converts the nested structure into the flattened format required by the API
- It extracts the symptoms from the nested structure and creates flat arrays for API submission

```typescript
// Function to transform assessment result to flattened format for API submission
const transformToFlattenedFormat = useCallback((result: AssessmentResult) => {
  return {
    // ...other fields
    physical_symptoms: result.symptoms.physical,
    emotional_symptoms: result.symptoms.emotional,
    // ...other fields
  };
}, []);
```

### 4. API Request (`api/assessment/requests/postSend/Request.ts`)

- The flattened assessment object is passed to the `postSend` function
- This function sends a POST request to the `/api/assessment/send` endpoint
- The data is wrapped in an `assessmentData` property to match the backend structure

```typescript
export const postSend = async (
  assessmentData: Omit<Assessment, "id" | "user_id" | "created_at" | "updated_at">
): Promise<Assessment> => {
  // Send assessment data
  const response = await apiClient.post("/api/assessment/send", {
    assessmentData: assessmentData,
  });
  
  return response.data;
};
```

### 5. Backend Processing (`backend/routes/assessment/create/controller.js`)

- The assessment controller extracts the data from the request
- For flattened format, it passes the data to the `Assessment.create` method
- This will route to `FlattenedAssessment.create` for new format data

```javascript
// Create assessment using the model layer
const newAssessment = await Assessment.create(assessmentData, userId);
```

### 6. Database Storage (`backend/models/assessment/FlattenedAssessment.js`)

- The `FlattenedAssessment` class formats the data for storage
- Array fields like `physical_symptoms` and `emotional_symptoms` are stringified for database storage
- When the data is retrieved, these JSON strings are parsed back into arrays

```javascript
// Array fields as JSON strings
physical_symptoms: physical_symptoms ? JSON.stringify(physical_symptoms) : null,
emotional_symptoms: emotional_symptoms ? JSON.stringify(emotional_symptoms) : null,
```

### 7. API Response and History Retrieval

- When requesting assessment details, the `getById` API endpoint fetches the data
- The response includes `physical_symptoms` and `emotional_symptoms` as arrays
- The history detail page handles both data formats (legacy and flattened)

### 8. Display in History Details (`history/[id]/page.tsx`)

- The page checks both data formats: legacy (nested) and flattened
- For flattened format, it extracts symptoms directly from the root assessment object
- The symptoms are then displayed in the UI grouped by type

```typescript
// Extract data using the correct path based on format
let physicalSymptoms: string[] = [];
let emotionalSymptoms: string[] = [];

if (hasLegacyFormat) {
  physicalSymptoms = assessmentData.symptoms?.physical || [];
  emotionalSymptoms = assessmentData.symptoms?.emotional || [];
} else if (hasFlattenedFormat) {
  physicalSymptoms = assessment?.physical_symptoms || [];
  emotionalSymptoms = assessment?.emotional_symptoms || [];
}
```

## Common Issues

### Missing or Empty Symptoms

If symptoms are not appearing in the history view, check:

1. **Session Storage**: Verify that symptoms and symptoms_categorized are properly stored in session storage
2. **API Request**: Check network tab to ensure the POST request includes physical_symptoms and emotional_symptoms
3. **API Response**: Verify that the GET response for assessment details includes the symptoms arrays
4. **JSON Parsing**: Ensure array fields are properly stringified before storage and parsed after retrieval

### Symptoms Not Categorized Correctly

If symptoms appear but in the wrong category:

1. **Initial Categorization**: Check symptoms page to ensure correct symptom ids are added to the right arrays
2. **Session Storage Structure**: Verify the categorized data structure in "symptoms_categorized"
3. **Results Creation**: Check that the data is assembled correctly in the results page
4. **Transformation**: Verify the transformToFlattenedFormat function preserves the categories 