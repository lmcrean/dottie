# SendInitialMessageButton Component

A React component that provides a "Chat with Dottie" button that:

1. **Opens FullScreenChat directly** - No modal, goes straight to fullscreen chat
2. **Creates a new chat conversation** - Uses the `createNewChat` API
3. **Sends an initial message** - Automatically sends a message with assessment context

## Usage

```tsx
import { SendInitialMessageButton } from '@/src/pages/chat/components/buttons/chat-detail/send-initial-message';

// Basic usage (without assessment)
<SendInitialMessageButton pattern="regular" />

// With assessment ID (recommended)
<SendInitialMessageButton
  assessmentId="assessment-123"
  pattern="irregular"
  className="custom-styles"
  disabled={false}
/>
```

## Props

| Prop           | Type               | Default     | Description                                   |
| -------------- | ------------------ | ----------- | --------------------------------------------- |
| `assessmentId` | `string?`          | `undefined` | Optional assessment ID to link the chat       |
| `pattern`      | `MenstrualPattern` | `'regular'` | The menstrual pattern from assessment results |
| `className`    | `string`           | `''`        | Additional CSS classes                        |
| `disabled`     | `boolean`          | `false`     | Whether the button is disabled                |

## Behavior

1. **Click Handler**: When clicked, the button:

   - Shows loading state with spinner
   - Creates a new chat via `createNewChat` API
   - Sends initial message via `sendInitialMessage` API (if `assessmentId` provided)
   - Opens `FullscreenChat` component
   - Shows error toast if any step fails

2. **Initial Message**: Generated based on assessment context:

   ```
   "Hi! I've just completed my menstrual health assessment (ID: {assessmentId}).
   My results show: {pattern title}. Can you tell me more about what this means
   and provide personalized recommendations?"
   ```

3. **Loading State**: Button shows spinner and "Starting Chat..." text while processing

4. **Error Handling**: Shows toast notification if chat creation or message sending fails

## Dependencies

- `createNewChat` API function
- `sendInitialMessage` API function
- `FullscreenChat` component
- `PATTERN_DATA` for pattern titles
- `toast` for error notifications

## Integration

Currently integrated in:

- `frontend/src/pages/assessment/detail/page.tsx` - Assessment results page

Replaces the old "Chat with Dottie" buttons that used `ChatModal` and manual state management.
