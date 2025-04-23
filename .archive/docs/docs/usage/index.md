---
sidebar_position: 1
---

# Usage Guide

This guide covers how to use and interact with Dottie after deployment.

## User Interface

Dottie provides several interfaces for interaction:

### Web Interface

The primary interface for Dottie is a web-based chat application built with Streamlit:

1. Navigate to your Dottie web application URL
2. Sign in with your credentials (if authentication is enabled)
3. Start a conversation by typing in the chat box
4. Upload images or files by clicking the attachment button
5. Switch between text and voice input using the microphone button

### Mobile Experience

Dottie is mobile-responsive and provides a consistent experience across devices:

1. Access the same URL from your mobile browser
2. Use the microphone for hands-free interaction
3. Take photos directly from your mobile device for analysis

## Conversation Capabilities

### Starting a Conversation

A typical Dottie conversation follows this pattern:

1. Start with a greeting ("Hello", "Hi Dottie")
2. Describe your symptoms or health question
3. Provide additional details when prompted
4. Receive analysis and recommendations

### Symptom Description

For best results when describing symptoms:

- Be specific about the location and nature of pain or discomfort
- Mention when symptoms started and how they've changed
- Describe any factors that make symptoms better or worse
- Include relevant medical history

### Image Analysis

When using images with Dottie:

1. Ensure images are clear and well-lit
2. Center the area of concern in the frame
3. Take multiple angles if needed
4. Follow Dottie's guidance for optimal image capture

## Administrator Features

### Analytics Dashboard

Administrators can access analytics through a dedicated dashboard:

1. Navigate to the admin URL provided during setup
2. Sign in with admin credentials
3. View usage statistics, common questions, and system health

### Content Management

To update Dottie's knowledge base:

1. Access the admin section
2. Navigate to "Content Management"
3. Add, edit, or remove information
4. Publish changes to make them immediately available

## API Integration

For developers looking to integrate with Dottie:

### Authentication

```bash
curl -X POST https://dottie-api.azurewebsites.net/auth/token \
  -H "Content-Type: application/json" \
  -d '{"client_id": "your-client-id", "client_secret": "your-client-secret"}'
```

### Starting a Conversation

```bash
curl -X POST https://dottie-api.azurewebsites.net/conversations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'
```

### Sending a Message

```bash
curl -X POST https://dottie-api.azurewebsites.net/conversations/{conversation_id}/messages \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "I have a headache and fever", "type": "text"}'
```

## Troubleshooting

Common issues and their solutions:

1. **Connection issues**: Check your internet connection and verify Azure service health
2. **Authentication failures**: Ensure your credentials are correct and not expired
3. **Slow responses**: Large files or complex queries may take longer to process
4. **Image recognition errors**: Make sure images are clear, well-lit, and properly framed

## Getting Support

If you encounter issues not covered in this guide:

1. Check the [FAQ](./faq.md) for common questions
2. Contact support at support@dottie-health.example.com
3. For urgent issues, use the emergency support line provided during onboarding 