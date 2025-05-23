# Delete Account Button

This directory contains the delete account functionality, refactored from the larger profile components.

## Components

- `DeleteAccountButton.tsx` - The standalone delete account button with integrated logic
- `DeleteAccountSection.tsx` - A wrapper component that includes the button with proper danger zone styling
- `api/` - Contains the API calls specific to account deletion

## Usage

### Basic Button

```tsx
import { DeleteAccountButton } from '@/src/pages/user/components/buttons/delete-account';

<DeleteAccountButton variant="danger" />;
```

### Full Section (with warning text)

```tsx
import { DeleteAccountSection } from '@/src/pages/user/components/buttons/delete-account';

<DeleteAccountSection />;
```

## API

The API calls are self-contained within this button component to keep the functionality modular.
