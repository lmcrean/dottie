# Operations Architecture for E2E Testing

## Overview

This document explains the new operations-based architecture for end-to-end testing in the frontend application.

## Architecture Pattern

```
master-integration-operations.spec.ts
    ↓
./runners/operations/Assessment.ts
    ↓
./runners/assessment/get-assessment-list.ts
./runners/assessment/create-assessment.ts
./runners/assessment/get-assessment-detail.ts
./runners/assessment/delete-assessment.ts
```

## Directory Structure

```
frontend/e2e/
├── master-integration-operations.spec.ts   # New main test file
├── runners/
│   ├── operations/                          # Operations controllers
│   │   ├── Assessment.ts                    # Assessment operations orchestrator
│   │   ├── Chat.ts                         # Chat operations orchestrator
│   │   └── User.ts                         # User operations orchestrator
│   ├── assessment/                         # Specific assessment runners
│   │   ├── get-assessment-list.ts          # Test assessment list page
│   │   ├── create-assessment.ts            # Test assessment creation
│   │   ├── get-assessment-detail.ts        # Test assessment detail view
│   │   └── delete-assessment.ts            # Test assessment deletion
│   ├── chat/                              # Specific chat runners
│   │   ├── get-chat-history.ts            # Test chat history
│   │   ├── create-conversation.ts         # Test conversation creation
│   │   ├── send-message.ts                # Test message sending
│   │   └── delete-conversation.ts         # Test conversation cleanup
│   ├── user/                              # Specific user runners
│   │   ├── get-user-profile.ts            # Test user profile view
│   │   └── update-user-profile.ts         # Test profile updates
│   └── auth/                              # Existing auth runners (reused)
│       └── index.ts
```

## Test Flow

### 1. Authentication Setup
- Uses existing `runAuthTests()` from auth runners
- Establishes user session and tokens
- Updates shared test state

### 2. Assessment Operations
- **List**: Navigate to assessment list page, verify rendering
- **Create**: Complete assessment flow (reusing existing assessment steps)
- **Detail**: View assessment detail page, **detect rendering bug**
- **Cleanup**: Delete created assessments

### 3. Chat Operations  
- **History**: View chat history/conversation list
- **Create**: Start new conversation
- **Message**: Send test messages
- **Cleanup**: Delete test conversations

### 4. User Operations
- **Profile**: View user profile page
- **Update**: Modify profile information
- **Verify**: Confirm updates were saved

### 5. Final Cleanup
- Remove all test data in reverse order
- Generate test summary and screenshots

## Key Features

### Operations Controllers
- Centralized orchestration of related test operations
- Clear separation of concerns
- Easy to extend and maintain
- Consistent error handling and reporting

### Specific Runners
- Single-responsibility functions
- Reusable across different test scenarios
- Detailed logging and screenshot capture
- Robust error handling

### Shared State Management
- Persistent test state across all operations
- Easy tracking of created resources
- Automatic cleanup of test data

## Running the Tests

```bash
# Run the new operations-based integration test
cd frontend
npm run test:dev

# Run the old assessment flow test (for comparison)
npm run test:dev:old

# Run with verbose output
npx playwright test e2e/master-integration-operations.spec.ts --headed --timeout=600000 --reporter=list
```

## Test Output

The test generates:
- **Screenshots**: Sequential screenshots in `test_screenshots/operations_integration/`
- **Summary**: JSON summary file with test results and metadata
- **Console logs**: Detailed progress logging with emojis for easy scanning

## Expected Behavior

The test is designed to:
1. ✅ **Pass authentication** - This should work reliably
2. ⚠️ **Detect assessment bug** - Will identify the results rendering issue mentioned
3. 🔄 **Continue on failures** - Won't stop at first failure, provides full picture
4. 📸 **Capture comprehensive screenshots** - For designer team and debugging

## Bug Detection

The test specifically looks for the reported bug:
> "no assessment results rendering on results detail page"

The `get-assessment-detail.ts` runner includes specific checks for:
- Results container presence
- Assessment data elements
- Error states or stuck loading indicators
- Logs "🐛 BUG DETECTED" when results are missing

## Extending the Architecture

### Adding New Operations
1. Create new operation controller in `runners/operations/`
2. Add specific runners in appropriate subdirectory
3. Import and integrate into `master-integration-operations.spec.ts`

### Adding New Runners
1. Create runner file with consistent interface
2. Include proper error handling and screenshots
3. Export function for use by operations controllers
4. Add to appropriate operation controller

### Example: Adding Email Operations
```typescript
// runners/operations/Email.ts
export class EmailOperations {
  async runCompleteFlow() {
    // Orchestrate email-related tests
  }
}

// runners/email/send-email.ts
export async function sendEmail(page, state, emailData) {
  // Specific email sending test
}
```

## Integration with CI/CD

This architecture supports:
- GitHub Actions integration for PR checks
- Automated screenshot generation for design reviews
- Comprehensive test reporting for debugging
- Parallel execution potential (future enhancement)

## Benefits

1. **Clear Architecture**: Easy to understand and extend
2. **Modular Design**: Operations and runners are independently maintainable
3. **Comprehensive Coverage**: Tests all major user flows
4. **Debugging Friendly**: Detailed logging and screenshots
5. **Team Collaboration**: Clear structure for multiple developers
6. **Bug Detection**: Specifically designed to catch integration issues

## Future Enhancements

- Parallel test execution for faster runs
- Integration with external reporting tools
- Automated bug report generation
- Performance metrics collection
- Cross-browser testing support 