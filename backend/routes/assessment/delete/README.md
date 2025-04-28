# Assessment Delete Endpoint

## Overview
This endpoint deletes a specific assessment by its ID. Access is restricted to the assessment owner.

## Request
- **Method**: DELETE
- **Endpoint**: `/api/assessment/:userId/:assessmentId`
- **Authentication**: Required (JWT token)
- **URL Parameters**:
  - `userId`: ID of the user who owns the assessment
  - `assessmentId`: ID of the assessment to delete

## Response

### Success (200 OK)
```json
{
  "message": "Assessment deleted successfully"
}
```

### Error Responses
- **403 Forbidden**: Unauthorized access (user does not own the assessment)
- **404 Not Found**: Assessment not found
- **500 Internal Server Error**: Server-side error

## Notes
- The endpoint validates ownership of the assessment before allowing deletion
- For test users with IDs starting with 'test-', it may attempt direct database access if the USE_LEGACY_DB_DIRECT environment variable is set to 'true'
- The deletion process includes:
  1. Checking if the assessment exists and belongs to the user
  2. For database storage, deleting associated symptoms first (due to foreign key constraints)
  3. Deleting the assessment record 