# createAssessmentConversation Integration Tests

## Overview

This directory contains integration unit tests for the `createAssessmentConversation` function, which is responsible for creating conversations linked to menstrual health assessments and triggering initial chat interactions.

## Test Files

**`createAssessmentConversation.test.js`** - Main test coordinator (under 100 lines)
**`runners/`** - Individual test runner files (each under 100 lines):
- `successfulCreation.js` - Successful conversation creation scenarios
- `errorHandling.js` - Error handling and edge cases
- `databaseSequence.js` - Database operations sequence validation
- `assessmentIntegration.js` - Assessment data integration tests

## Function Under Test

The `createAssessmentConversation` function in `../createFlow.js` performs the following operations:

1. Creates an empty conversation in the database
2. Links the conversation to a user ID
3. Stores the entire assessment object (including symptoms, pattern, recommendations)
4. Triggers a default user message
5. Enables chatbot response generation (mock or AI)

## Test Validation Requirements

The tests validate all the requirements specified:

### ✅ 1. Empty Conversation Created
- Verifies that a new conversation is created in the database
- Ensures the conversation has a unique ID
- Confirms the conversation starts empty (no prior messages)

### ✅ 2. Has user_id
- Validates that the conversation is properly linked to the user
- Ensures the user_id is passed correctly to database operations
- Verifies ownership relationship

### ✅ 3. Has Entire Assessment Object Stored
- Tests that the full assessment data is accessible through the conversation
- Validates symptoms (physical, emotional, other)
- Confirms pattern, cycle data, pain levels, etc. are preserved
- Tests recommendations storage
- Verifies assessment ID linkage

### ✅ 4. Triggers Default User Message
- Confirms that an initial user message is created automatically
- Validates message content (not strict about exact wording)
- Ensures message is properly formatted with role, content, timestamp
- Tests message linking to conversation and user

### ✅ 5. Chatbot Response is Triggered
- Verifies that the system is set up to generate chatbot responses
- Tests both mock and AI response pathways (not strict about implementation)
- Confirms async response capability
- Validates response generation infrastructure

## Test Structure

### Runner Architecture

The tests are split into focused runner files to maintain the <100 line limit per file:

1. **`successfulCreation.js`** (81 lines) - Happy path scenarios
2. **`errorHandling.js`** (65 lines) - Failure scenarios and edge cases  
3. **`databaseSequence.js`** (72 lines) - Order of operations validation
4. **`assessmentIntegration.js`** (81 lines) - Complex data handling

### Main Test Coordinator

**`createAssessmentConversation.test.js`** (68 lines) - Imports and runs all runners with shared mock data

### Mock Strategy

The tests use comprehensive mocking coordinated in the main file:
- **DbService** - Database operations
- **Logger** - Logging functionality  
- **createConversation** - Conversation creation
- **createInitialMessage** - User message creation
- **UUID generation** - Consistent test IDs

### Test Data

Includes realistic mock data:
- Complete assessment objects with all symptoms
- Various menstrual patterns (regular, irregular, heavy, pain, developing)
- Complex symptom arrays and recommendations
- Proper timestamp formatting

## Running the Tests

### All Tests (Recommended)
```bash
# Run all tests through main coordinator
npx vitest run backend/models/chat/conversation/create-new-conversation/__tests__/createAssessmentConversation.test.js

# Run with watch mode
npx vitest watch backend/models/chat/conversation/create-new-conversation/__tests__/createAssessmentConversation.test.js
```

### Individual Runner Files
```bash
# Run specific test categories (if needed for debugging)
npx vitest run backend/models/chat/conversation/create-new-conversation/__tests__/runners/successfulCreation.js
npx vitest run backend/models/chat/conversation/create-new-conversation/__tests__/runners/errorHandling.js
npx vitest run backend/models/chat/conversation/create-new-conversation/__tests__/runners/databaseSequence.js
npx vitest run backend/models/chat/conversation/create-new-conversation/__tests__/runners/assessmentIntegration.js
```

### All Conversation Tests
```bash
# Run all tests in this directory
npm test backend/models/chat/conversation/create-new-conversation/__tests__/

# Run with coverage
npx vitest run --coverage backend/models/chat/conversation/create-new-conversation/__tests__/
```

### Debug Mode
```bash
# Run with verbose output
npx vitest run --reporter=verbose backend/models/chat/conversation/create-new-conversation/__tests__/createAssessmentConversation.test.js

# Run specific test case
npx vitest run -t "should create empty conversation with user_id"
```

## Test Scenarios Covered

### Core Functionality
- Basic conversation creation with assessment linkage
- User message generation with default content
- Complete data object handling
- Response system initialization

### Error Handling
- Database connection failures
- Message creation failures  
- Missing or invalid user IDs
- Missing or invalid assessment IDs

### Data Integration
- Multiple assessment patterns
- Complex symptom arrays
- Full recommendation objects
- Timestamp validation

### Sequence Validation
- Correct order of database operations
- Proper dependency chain execution
- Async operation coordination

## Assertions Tested

### Data Integrity
- Conversation ID generation and uniqueness
- User ID linkage and validation
- Assessment ID storage and retrieval
- Complete assessment object preservation

### Message Creation
- Initial message structure validation
- Content existence (flexible on exact wording)
- Role assignment (user/assistant)
- Timestamp formatting

### System Integration
- Database operation coordination
- Logging functionality
- Error propagation
- Response generation setup

## Test File Size and Organization

Following project conventions:
- **File size**: Under 100 lines per logical unit (test groups are appropriately sized)
- **One function per file**: Each test focuses on a single aspect of functionality
- **Descriptive naming**: Test names clearly indicate the action being validated

## Dependencies

The tests mock all external dependencies:
- `@/services/dbService.js` - Database operations
- `@/services/logger.js` - Logging service
- `../../database/chatCreate.js` - Conversation creation
- `../../../message/user-message/add-message/create-initial-message/createInitialMessage.js` - Message creation

## Configuration

Uses standard vitest configuration from `backend/vitest.config.js`:
- Node environment
- 60-second timeout
- Standard alias resolution
- Coverage reporting enabled

## Debugging Tips

### Common Issues
1. **Mock import paths** - Ensure relative paths match actual file structure
2. **Async operations** - Use proper await/async in test setup
3. **Mock timing** - Clear mocks between tests to avoid interference

### Debug Helpers
```javascript
// Add to test for debugging
console.log('Result:', JSON.stringify(result, null, 2));
console.log('Mock calls:', mockFunction.mock.calls);
```

### Vitest UI
```bash
# Run with UI for visual debugging
npx vitest --ui
```

## Future Enhancements

Potential test expansions:
- Performance testing for large assessment objects
- Concurrent conversation creation testing
- Integration with real database (separate test suite)
- End-to-end chatbot response validation

## Related Files

### Main Files
- `../createFlow.js` - Function under test
- `../../database/chatCreate.js` - Database operations
- `../../../message/` - Message handling logic
- `../../../../assessment/` - Assessment data structures

### Test Architecture
- `createAssessmentConversation.test.js` - Main test coordinator
- `runners/successfulCreation.js` - Success scenario tests
- `runners/errorHandling.js` - Error handling tests
- `runners/databaseSequence.js` - Operation sequence tests
- `runners/assessmentIntegration.js` - Data integration tests 