# Integrations Domain

Business logic and services for third-party integrations.

## Responsibilities
- Integration configuration
- OAuth flows
- API key management
- Webhook configuration
- Connected service status

## Structure
```
integrations/
  components/     ← Integration-specific UI components
  services/       ← Integration API calls and business logic
  hooks/          ← Integration-related React hooks
  types.ts        ← Integration type definitions
```

## Usage
Integrations domain should only be imported by `/settings/integrations` route.
