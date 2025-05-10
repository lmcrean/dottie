# Components vs. Pages definition

This repository uses the following definitions for components and pages:

- Components are reusable UI elements that can be used across multiple pages.
- Pages are the main components that make up the application. They are the entry point for each route.

# new file structure

the new file structure is as follows, it aims to be more direct than the legacy file structure.

frontend/src/components/
├── alerts/ # Error states, loading indicators, toasts
├── buttons/ # button components
├── developer-utils/ # developer utilities incl. UI Mode switch, Quick Complete button
├── navbar/ # Navbar component
├── theme/ # Theme-related components to toggle dark and light mode
├── variants/ # Design system variations in tailwind css
├── user-inputs/ # User input components
├── ui/ # everything else, including legacy components

# legacy file structure

this file structure is for reference and should be updated to the new file structure.

frontend/src/components/
├── navigation/ # Navigation components and page movement
├── ui/ # everything else, including legacy components
├── AnimatedLogo.tsx
├── AuthLayout.tsx
├── DottieMascot3D.tsx
├── ErrorBoundary.tsx
├── scroll-to-top.tsx
├── ThemeToggle.tsx
