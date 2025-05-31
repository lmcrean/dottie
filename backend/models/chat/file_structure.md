backend/models/chat/chat-detail/

├── shared/
│   ├── database/
│   │   ├── chatCreate.js                   # 38 lines - Chat creation logic
│   │   └── chatOperations.js               # 266 lines - Database operations
│   ├── create-conversation/
│   │   ├── createFlow.js                   # 108 lines - Conversation creation flow
│   │   └── assessment/
│   │       ├── assessmentSetupContext.js   # 56 lines - Assessment context setup
│   │       ├── assessmentValidator.js      # 130 lines - Assessment validation logic
│   │       └── assessmentGetPattern.js     # 27 lines - Pattern retrieval
│   ├── utils/
│   │   └── configHelper.js                 # 211 lines - Configuration utilities
│   └── alerts/
│       └── errorHandler.js                 # 96 lines - Centralized error handling
├── chatbot-message/
│   ├── ResponseCoordinator.js              # 266 lines - Response coordination logic
│   └── services/
│       ├── serviceDetector.js              # 228 lines - Service detection logic
│       ├── generators/
│       │   └── BaseGenerator.js            # 183 lines - Base generator class
│       ├── mock/
│       │   └── generators/
│       │       ├── followUpMock.js         # 207 lines - Mock follow-up responses
│       │       └── initialMock.js          # 112 lines - Mock initial responses
│       └── ai/
│           └── generators/
│               ├── followUpAI.js           # 247 lines - AI follow-up responses
│               └── initialAI.js            # 106 lines - AI initial responses
├── read-chat-detail/
│   ├── getWithContext.js                   # 248 lines - Read with context logic
│   └── getConversation.js                  # 91 lines - Simplified read interface
├── delete-chat-detail/
│   └── chatDelete.js                       # 51 lines - Chat deletion logic
├── __tests__/
│   ├── mockResponseService.test.js         # 129 lines - Mock service tests
│   └── aiResponseService.test.js           # 161 lines - AI service tests
└── README.md                               # 116 lines - Documentation