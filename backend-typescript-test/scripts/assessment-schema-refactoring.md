# Assessment Schema Refactoring: Flattening Nested Structure

This document explains the refactoring of the assessment data structure from a nested JSON format to a flattened structure implemented by `updateAssessmentSchemaToFlattened.js`.

## Dependency Chain

The refactoring follows this dependency chain:

1. **Script**: `updateAssessmentSchemaToFlattened.js` 
   - Entry point for running the migration

2. **Migration**: `updateFlattenedAssessmentSchema.js`
   - Implements the actual schema changes
   - Adds new columns to flatten the structure
   - Converts camelCase to snake_case for consistency

3. **Model**: `Assessment.js` 
   - Handles backward compatibility for existing data
   - Provides methods to work with both old and new formats

4. **Database**: SQLite 
   - Stores the assessment data with the new flattened structure

## JSON Structure Before and After

### Before: Nested Structure

```json
{
  "id": "uuid-here",
  "user_id": "user-uuid-here",
  "assessment_data": {
    "age": "25-34",
    "pattern": "regular",
    "cycleLength": "26-30",
    "periodDuration": "4-5",
    "flowHeaviness": "moderate",
    "painLevel": "moderate",
    "symptoms": {
      "physical": ["Bloating", "Headaches"],
      "emotional": ["Mood swings", "Irritability"]
    },
    "recommendations": [
      {
        "title": "Recommendation 1",
        "description": "Description for recommendation 1"
      },
      {
        "title": "Recommendation 2",
        "description": "Description for recommendation 2"
      }
    ]
  },
  "created_at": "2023-01-01T00:00:00.000Z",
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

### After: Flattened Structure

```json
{
  "id": "uuid-here",
  "user_id": "user-uuid-here",
  "created_at": "2023-01-01T00:00:00.000Z",
  "age": "25-34",
  "pattern": "regular",
  "cycle_length": "26-30",
  "period_duration": "4-5",
  "flow_heaviness": "moderate",
  "pain_level": "moderate",
  "physical_symptoms": ["Bloating", "Headaches"],
  "emotional_symptoms": ["Mood swings", "Irritability"],
  "recommendations": [
    {
      "title": "Recommendation 1",
      "description": "Description for recommendation 1"
    },
    {
      "title": "Recommendation 2",
      "description": "Description for recommendation 2"
    }
  ],
  "updated_at": "2023-01-01T00:00:00.000Z"
}
```

## Key Changes

1. **Field Flattening**: All fields previously nested under `assessment_data` are now at the top level
   - Removes one level of nesting complexity 

2. **Naming Convention**: Changed from camelCase to snake_case
   - Example: `cycleLength` → `cycle_length`
   - Used consistent naming throughout the database

3. **Symptoms Separation**: 
   - Before: Symptoms were nested under `symptoms.physical` and `symptoms.emotional`
   - After: Separate top-level fields `physical_symptoms` and `emotional_symptoms`

4. **Date Field**: 
   - Changed `date` to `created_at` for consistency
   - Both created_at and updated_at are maintained

## Benefits

- **Simpler Data Structure**: Easier to query and work with
- **Improved Performance**: Less parsing of nested JSON
- **Better Database Design**: Follows database normalization principles
- **Consistent Naming**: All fields follow snake_case convention
- **Frontend Compatibility**: Maintains compatibility with existing frontend code during transition

## Migration Strategy

The migration is designed to be non-destructive and handles both existing and new data:
- For existing tables, it adds new columns without dropping data
- For new installations, it creates the table with the flattened structure
- The Application Model provides backward compatibility to handle both formats 