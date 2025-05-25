# Chat Detail Services

This directory contains the core chat functionality for the Dottie application, including database operations and AI response generation.

## Overview

The chat system is designed to work for both:
- **Production environments** with access to Gemini API keys for real AI responses
- **Development environments** without API keys, providing meaningful placeholder responses

## Architecture

### Database Operations
- `assessmentHelper.js` - Retrieves assessment patterns for conversation context
- `chatCreateMessage.js` - Inserts chat messages into the database  
- `chatRead.js` - Retrieves conversations and messages
- `chatUpdate.js` - Updates conversation metadata and assessment links

### AI Response Generation
- `aiResponseService.js` - Core AI response generation using Gemini API
- `mockResponseService.js` - Intelligent placeholder responses for developers
- `conversationService.js` - High-level orchestration of chat flow

## For Developers (Mock Mode)

When the `GEMINI_API_KEY` environment variable is not available, the system automatically switches to mock mode:

```javascript
// Automatically detects missing API key
const isMockMode = !process.env.GEMINI_API_KEY;
```

### Mock Response Features
- **Context-aware responses** based on message keywords (pain, cramps, etc.)
- **Different response types** for initial, follow-up, and assessment-linked messages
- **Professional health guidance** maintaining the Dottie persona
- **Clear developer notifications** indicating when mock responses are being used

### Example Mock Response
```
"For menstrual pain, some find relief with over-the-counter pain relievers, heating pads, or gentle yoga. If pain is severe or disruptive to daily life, it's important to consult with a healthcare provider.

*Note: This is a placeholder response for developers. In production with API keys, you would receive personalized AI responses.*"
```

## For Production (Real AI Mode)

When the Gemini API key is available, the system provides:
- **Full Gemini AI integration** using the latest model (`gemini-2.0-flash`)
- **Conversation context** maintained across messages
- **Assessment integration** for personalized responses
- **Safety controls** and content filtering
- **Graceful fallback** to mock responses if API fails

## Usage Examples

### High-level Service (Recommended)
```javascript
import { processInitialMessage } from '../../../models/chat/chat.js';

const response = await processInitialMessage(
  conversationId, 
  userId, 
  message, 
  assessmentId
);
```

### Low-level Services
```javascript
import { generateResponse, isInMockMode } from '../../../models/chat/chat.js';

const aiResponse = await generateResponse(message, conversationHistory);
const mockMode = isInMockMode();
```

## Environment Variables

The system checks for API keys in this order:
1. `process.env.GEMINI_API_KEY`
2. `process.env.VITE_GEMINI_API_KEY`

If neither is found, mock mode is automatically enabled.

## Benefits for Open Source Development

- **No API key required** for basic development and testing
- **Meaningful responses** that demonstrate chat functionality
- **Easy transition** from mock to production mode
- **Consistent interface** regardless of mode
- **Educational value** for developers learning about the system

## Controller Integration

Controllers can now be simplified to focus on HTTP handling:

```javascript
// Before: Complex AI logic mixed with HTTP handling
export const sendMessage = async (req, res) => {
  // 100+ lines of Gemini integration...
};

// After: Clean separation of concerns
export const sendMessage = async (req, res) => {
  try {
    const result = await processMessage(conversationId, userId, message);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

## Testing

Both mock and real AI modes are designed to be easily testable, with clear interfaces and predictable outputs. 