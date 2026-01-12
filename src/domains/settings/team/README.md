# Team Domain

Business logic and services for team management.

## Responsibilities
- Team member management
- Role and permission assignment
- User invitations
- Access control

## Structure
```
team/
  components/     ← Team-specific UI components
  services/       ← Team API calls and business logic
  hooks/          ← Team-related React hooks
  types.ts        ← Team type definitions
```

## Usage
Team domain should only be imported by `/settings/team` route.
