backend/models/chat/
├── chat-list/                        # BROWSE EXISTING CONVERSATIONS
│   ├── chatGetList.js               # List user's conversations (EXISTING)
│   ├── chatDelete.js                # Delete conversation (EXISTING)
│   └── chat.js                      # Chat model/schema (EXISTING)
│
└── chat-detail/                     # FULL CONVERSATION LIFECYCLE
    ├── create-conversation/         # NEW CONVERSATION FLOW
    │   ├── chatCreate.js            # Create conversation (MOVED from chat-list)
    │   ├── assessmentSetup.js       # Link assessment + get pattern
    │   ├── initialMessage.js        # Auto-trigger initial message + AI response
    │   └── createFlow.js            # Orchestrate full creation flow
    │
    ├── continue-conversation/       # ONGOING MESSAGES
    │   ├── sendMessage.js           # Send follow-up message
    │   ├── generateResponse.js      # Generate AI/mock response
    │   └── continueFlow.js          # Orchestrate follow-up flow
    │
    ├── read-conversation/
    │   ├── getConversation.js       # Read conversation (from chatRead.js)
    │   └── getWithContext.js        # Add metadata + service detection
    │
    ├── services/
    │   ├── ai/
    │   │   ├── config/
    │   │   │   ├── geminiSetup.js   # GoogleGenerativeAI setup, API config
    │   │   │   └── prompts.js       # System prompts for assessment-aware chat
    │   │   ├── generators/
    │   │   │   ├── initialAI.js     # generateInitialResponse function
    │   │   │   └── followUpAI.js    # generateFollowUpResponse function
    │   │   └── utils/
    │   │       └── aiHelpers.js     # AI utility functions
    │   ├── mock/
    │   │   ├── data/
    │   │   │   ├── responseBank.js  # All mock response arrays/objects
    │   │   │   └── keywords.js      # Keyword matching rules
    │   │   ├── generators/
    │   │   │   ├── initialMock.js   # Mock initial responses
    │   │   │   └── followUpMock.js  # Mock follow-up responses
    │   │   └── utils/
    │   │       └── mockHelpers.js   # Mock utility functions
    │   └── serviceDetector.js       # Determine AI vs mock mode
    │
    ├── shared/
    │   ├── assessment/
    │   │   ├── assessmentHelper.js  # getAssessmentPattern (EXISTING, moved)
    │   │   └── assessmentValidator.js # Validate assessment ownership
    │   └── utils/
    │       ├── messageFormatters.js    # formatUserMessage, formatAssistantMessage
    │       └── responseBuilders.js     # buildResponse, generateMessageId
    │   └── database/
    │       └── chatCreateMessage.js     # insertChatMessage
    │       └── chatUpdateMessage.js    # updates the ChatMessage and triggers a new response, (if older than most recent, will delete the following messages to start a new thread)
    │
    └── index.js
