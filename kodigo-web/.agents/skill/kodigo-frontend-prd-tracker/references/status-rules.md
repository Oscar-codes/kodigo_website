# Frontend Ticket Status Rules

## Status definitions

### Not started — 0%
Use when there is no meaningful implementation evidence for the ticket.

### In progress — 25% or 50%
Use 25% when scaffolding, routes, types, or isolated components exist but the user flow is not functional.

Use 50% when the primary UI flow exists but integration, important states, or major DoD items are missing.

### Blocked — keep the last earned progress value
Use when meaningful implementation exists but completion cannot proceed because of a missing API, infrastructure capability, product decision, or another ticket dependency.

State the blocker explicitly.

### Ready for QA — 75%
Use when the planned frontend behavior and integration are implemented, the project builds/typechecks, and only formal QA/acceptance remains.

### Done — 100%
Use only when the original DoD is satisfied and there is evidence of integrated behavior plus appropriate verification.

## Evidence strength

Prefer evidence in this order:

1. Working route/user flow plus integration tests or E2E tests
2. Integrated implementation plus unit/component tests
3. Integrated implementation visible in route/components/services
4. Isolated components or mocks
5. TODOs, comments, issue text, or documentation only

Documentation alone never proves completion.

## Baseline metrics

Report at least two metrics when useful:

- **Ticket completion:** Done baseline tickets / 12
- **Progress index:** average of the 12 baseline ticket percentages

Do not include `FE-GAP-*` tickets in baseline metrics unless the user explicitly asks for expanded-scope progress.

## Dependency rule

A ticket may be `Ready for QA` or `Done` only if required dependency behavior is available in the current environment or replaced by an explicitly approved equivalent.

Placeholder (PROVISIONAL) content is acceptable for scaffolding but does not satisfy a DoD that requires official content or assets.
