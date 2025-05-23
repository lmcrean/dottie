# Update Username Button

This directory contains the username update functionality, split from the combined account update form for better UX.

## Components

- `UpdateUsernameButton.tsx` - Standalone username update component with integrated form and logic
- `api/` - Contains the API calls specific to username updates

## Usage

```tsx
import { UpdateUsernameButton } from '@/src/pages/user/profile/components/buttons/update-username';

<UpdateUsernameButton variant="primary" />;
```

## Features

- Real-time input validation
- Prevents unnecessary API calls when value hasn't changed
- Automatic error handling and user feedback
- Reset to original value on error
- Inline form with update button next to input field

## API

The API calls are self-contained within this button component to keep the functionality modular.
