# Assessment Models

This directory contains the implementations for the Assessment model using a flattened data structure.

## File Structure

- **Assessment.js**: Main entry point for all assessment operations
- **services/**: Directory containing service implementations
  - **RouteAssessment.js**: Routes assessment operations to appropriate handlers
  - **CreateAssessment.js**: Handles assessment creation
  - **UpdateAssessment.js**: Handles assessment updates
  - **FindAssessment.js**: Handles assessment retrieval
- **transformers/**: Data transformation utilities
  - **TransformApiToDb.js**: Transforms API data to database format
  - **TransformDbToApi.js**: Transforms database records to API format
- **validators/**: Validation logic
- **base/**: Base utilities

## Architecture

The assessment model uses a clean, simple architecture:

1. API calls `Assessment.js` methods
2. `Assessment.js` delegates to `RouteAssessment.js`
3. `RouteAssessment.js` routes to appropriate service (`CreateAssessment`, `UpdateAssessment`, etc.)
4. Services use transformers to convert between API and database formats

## Data Schema

**Current Schema**:
```json
{
  "age": "25-34",
  "pattern": "regular",
  "cycle_length": "26-30",
  "period_duration": "4-5",
  "flow_heaviness": "moderate",
  "pain_level": "mild",
  "physical_symptoms": ["Bloating"],
  "emotional_symptoms": ["Mood swings"],
  "recommendations": [...]
}
```

All database records use flattened fields for optimal performance and simplicity.
