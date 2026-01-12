# Dealership Domain

Business logic and services for dealership configuration.

## Responsibilities
- Dealership settings management
- Business information
- Location and contact details
- Operating hours configuration

## Structure
```
dealership/
  components/     ← Dealership-specific UI components
  services/       ← Dealership API calls and business logic
  hooks/          ← Dealership-related React hooks
  types.ts        ← Dealership type definitions
```

## Usage
Dealership domain should only be imported by `/settings/dealership` route.
