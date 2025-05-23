# Update Email Button

This directory contains the email update functionality, split from the combined account update form for better UX.

## Components

- `UpdateEmailButton.tsx` - Standalone email update component with integrated form and logic
- `api/` - Contains the API calls specific to email updates

## Usage

```tsx
import { UpdateEmailButton } from '@/src/pages/user/profile/components/buttons/update-email';

<UpdateEmailButton variant="primary" />;
```

## Features

- Real-time email validation with visual feedback
- Prevents unnecessary API calls when value hasn't changed
- Automatic error handling and user feedback
- Reset to original value on error
- Inline form with update button next to input field
- Visual validation states (red border for invalid email)

## API

The API calls are self-contained within this button component to keep the functionality modular.
