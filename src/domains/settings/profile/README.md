# Profile Domain

Business logic and services for user profile management.

## Responsibilities
- User profile data management
- Profile updates and validation
- Personal preferences
- Avatar/photo management

## Structure
```
profile/
  components/     ← Profile-specific UI components
  services/       ← Profile API calls and business logic
  hooks/          ← Profile-related React hooks
  types.ts        ← Profile type definitions
```

## Usage
Profile domain should only be imported by `/settings/profile` route.
