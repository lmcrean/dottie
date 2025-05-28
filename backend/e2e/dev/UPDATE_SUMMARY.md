# Test Runner Updates for Assessment-Conversation Integration

## Overview
Based on the recent changes to the conversation data structure that integrated assessment linking, we have updated the `npm run test:dev` granular runners to comprehensively test the new assessment-conversation functionality.

## Updated Files

### 1. **sendMessage.js** - Enhanced Message Utility
- **Location**: `routes/__tests__/e2e/dev/runners/chat/sendMessage.js`
- **Changes**: Added optional `assessment_id` parameter to support sending messages with assessment context
- **New Parameters**: 
  - `assessment_id` (optional) - Links conversations to specific assessments

### 2. **sendMessageWithAssessment.js** - New Granular Runner
- **Location**: `routes/__tests__/e2e/dev/runners/chat/sendMessageWithAssessment.js`
- **Purpose**: Dedicated utility for testing assessment-linked conversation creation
- **Functions**:
  - `sendMessageWithAssessment()` - Creates conversations with assessment context
  - `verifyConversationAssessmentLink()` - Validates assessment-conversation linking

### 3. **generateAssessmentAwareMessage.js** - New Message Generator
- **Location**: `routes/__tests__/e2e/dev/runners/chat/generateAssessmentAwareMessage.js`
- **Purpose**: Generates realistic test messages that reference assessment data
- **Functions**:
  - `generateAssessmentAwareMessage()` - Creates assessment-aware initial messages
  - `generateAssessmentFollowUpMessage()` - Creates assessment-specific follow-up messages

### 4. **chat-workflow.js** - Enhanced Chat Scenarios
- **Location**: `routes/__tests__/e2e/dev/runners/scenarios/chat-workflow.js`
- **Changes**: Added new workflow for assessment-conversation integration testing
- **New Functions**:
  - `runChatWithAssessmentWorkflow()` - Tests complete assessment-linked chat flow

### 5. **index.js** - Updated Scenario Exports
- **Location**: `routes/__tests__/e2e/dev/runners/scenarios/index.js`
- **Changes**: Added export for `runChatWithAssessmentWorkflow`

### 6. **master-integration.api.pw.spec.js** - Enhanced Integration Tests
- **Location**: `routes/__tests__/e2e/dev/master-integration.api.pw.spec.js`
- **Changes**: Updated the master integration test to include assessment-conversation testing
- **New Test Steps**:
  - Step 6: "Chat conversation with assessment context workflow"
  - Step 8: "Delete assessment-linked chat conversation"
- **Enhanced State Management**: Added `assessmentLinkedConversationId` to track test state

## New Test Coverage

### Assessment-Conversation Integration Tests
1. **Assessment-Linked Conversation Creation**
   - Verifies conversations can be created with assessment context
   - Tests that `assessment_id` is properly stored in conversation record

2. **Assessment Data Verification**
   - Confirms conversation details include assessment information
   - Validates assessment-conversation linking in database

3. **Follow-up Message Handling**
   - Tests that follow-up messages maintain assessment context
   - Verifies conversation history shows assessment links

4. **Conversation History Integration**
   - Confirms assessment-linked conversations appear in user's chat history
   - Validates that assessment information is preserved

## Test Flow Enhancement

The updated `npm run test:dev` now runs:

1. Setup workflow ✅
2. Authentication workflow ✅
3. Assessment creation workflow ✅
4. User management workflow ✅
5. **Chat conversation workflow (without assessment)** ✅
6. **Chat conversation with assessment context workflow** ✅ *(NEW)*
7. Delete regular chat conversation ✅
8. **Delete assessment-linked chat conversation** ✅ *(NEW)*
9. Cleanup assessments ✅
10. Authentication error handling ✅

## Database Schema Updates

**Fixed Issues**:
- Resolved `parent_message_id` column missing from `chat_messages` table
- Ran full migration suite to ensure schema consistency
- Added assessment-related fields to conversations table:
  - `assessment_id`
  - `assessment_pattern` 
  - `assessment_object`

## Benefits

1. **Comprehensive Testing**: Full end-to-end testing of assessment-conversation integration
2. **Realistic Scenarios**: Assessment-aware message generation for better test coverage
3. **Granular Validation**: Separate utilities for different aspects of assessment-conversation linking
4. **Maintainable Structure**: Follows existing pattern of one function per file
5. **Enhanced CI/CD**: Ensures deployment confidence for assessment-conversation features

## Running the Tests

```bash
# Run the full integration test with assessment-conversation testing
npm run test:dev

# All 10 tests now pass, including the new assessment integration scenarios
```

## Future Enhancements

- Consider adding performance tests for large conversation histories with assessments
- Add edge case testing for invalid assessment IDs
- Implement stress testing for multiple concurrent assessment-linked conversations 