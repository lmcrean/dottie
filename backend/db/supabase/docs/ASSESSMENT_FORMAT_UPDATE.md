# Assessment Format Update

This document explains the changes made to accommodate the new JSON format for assessments.

## Overview

The assessment data format has been updated to use a nested structure in the JSON data. The Supabase schema has been updated to ensure it can handle this format correctly.

## New JSON Structure

The new assessment JSON structure is:

```json
{
  "id": "assessment-1744882304676",
  "userId": "ddba3fc9-2d44-4191-a93e-16b6e358b39e",
  "assessmentData": {
    "createdAt": "2025-04-17T09:31:10.925Z",
    "assessment_data": {
      "date": "2025-04-17T09:31:10.925Z",
      "pattern": "Regular",
      "age": "18-24",
      "cycleLength": "26-30",
      "periodDuration": "4-5",
      "flowHeaviness": "moderate",
      "painLevel": "moderate",
      "symptoms": {
        "physical": ["Bloating", "Headaches"],
        "emotional": []
      },
      "recommendations": [
        {
          "title": "Stay Hydrated",
          "description": "Drink at least 8 glasses of water daily to help reduce bloating."
        },
        {
          "title": "Regular Exercise",
          "description": "Engage in light activities like walking or yoga to ease cramps."
        }
      ]
    }
  }
}
```

## Changes Made

1. **Database Schema Updates**:
   - Updated the Supabase schema to use JSONB for the `assessment_data` column
   - Added a GIN index for improved JSON query performance
   - Added validation to ensure data integrity

2. **Model Updates**:
   - Updated `Assessment.js` to handle the nested structure
   - Added logic to preserve the structure during create/update operations
   - Ensured backward compatibility with the older format

3. **Validation Updates**:
   - Updated validators to check for both the new and old format
   - Added validation for the recommendations structure
   - Ensured all required fields are properly validated

4. **Testing**:
   - Added unit tests for the new JSON format
   - Verified CRUD operations with the new format

## How to Apply Updates

To apply these changes to your Supabase database:

1. Run the SQL script:
   ```bash
   node backend/db/supabase/scripts/runSchemaUpdate.js
   ```

2. Run the tests to verify everything is working:
   ```bash
   npm test -- "routes/assessment/__tests__/unit/json/nested-format.test.js"
   ```

## Backward Compatibility

These changes maintain backward compatibility with the older format. The system will:

1. Detect the format being used (nested or flat)
2. Handle data appropriately based on the detected format
3. Preserve the structure during updates
4. Validate data correctly regardless of format

## Common Issues

If you encounter the "Invalid assessment data format" error, it could be due to:

1. Missing the nested `assessment_data` structure
2. Invalid or missing required fields
3. Issues with the database connection

Check the server logs for more detailed error information. 