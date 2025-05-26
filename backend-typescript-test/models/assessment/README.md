# Assessment Models

This directory contains the implementations for the Assessment model, which has been refactored to handle both legacy nested and new flattened data structures.

## File Structure

- **Assessment.js**: Main entry point that routes to the appropriate implementation (legacy or flattened)
- **AssessmentBase.js**: Base class with shared functionality (find, list, delete, ownership validation) 
- **LegacyAssessment.js**: Handles the nested JSON schema (`assessment_data` field)
- **FlattenedAssessment.js**: Handles the new flattened schema with top-level fields

## Architecture Explanation

### Why Split into Multiple Files?

1. **Separation of Concerns**: Each file has a clear, specific responsibility
2. **Maintainability**: Smaller, focused files are easier to understand and modify
3. **Testability**: Each implementation can be tested independently
4. **Transition Support**: Allows supporting both schemas simultaneously during migration

### Data Flow

1. API calls `Assessment.js` methods
2. `Assessment.js` determines schema format and delegates to the appropriate implementation
3. Either `LegacyAssessment.js` or `FlattenedAssessment.js` handles the operation
4. Both implementations inherit common functionality from `AssessmentBase.js`

### Schema Differences

**Legacy (Nested) Schema**:
```json
{
  "assessment_data": {
    "age": "25-34",
    "symptoms": {
      "physical": ["Bloating"],
      "emotional": ["Mood swings"]
    }
  }
}
```

**New (Flattened) Schema**:
```json
{
  "age": "25-34",
  "physical_symptoms": ["Bloating"],
  "emotional_symptoms": ["Mood swings"]
}
```

Both implementations convert database records to the same API response format for consistency.
