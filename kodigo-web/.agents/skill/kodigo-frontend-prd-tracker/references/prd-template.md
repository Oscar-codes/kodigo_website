# Frontend PRD Template

Create or maintain `docs/FRONTEND_PRD.md` with the following structure.

```markdown
# Kodigo Website (kodigo.org) — Frontend Living PRD

_Last updated: YYYY-MM-DD_

## 1. Executive status

- Baseline frontend tickets: 12
- Done: X/12
- Progress index: XX%
- Current focus: ...
- Main blocker: ...
- Next dependency-ordered ticket: ...

## 2. Baseline ticket tracker

| ID | Scope | Status | Progress | Priority | Dependency state | Evidence | Next action |
|---|---|---|---:|---|---|---|---|
| W-01 | ... | ... | ... | ... | ... | `path` | ... |

## 3. Ticket details

### W-01 — Project base, centralized theme and fonts

**Original DoD:** ...

**Current implementation:**
- ...

**Evidence:**
- `path/to/file`

**Missing to satisfy DoD:**
- ...

**Dependencies / blockers:**
- ...

**Implementation notes:**
- Architecture substitutions or scope differences.

Repeat for all 12 baseline tickets.

## 4. Adjacent release gate

### W-QA-01 — Internal Kodigo review
- Status: ...
- Evidence: ...
- Open feedback: ...

## 5. Dependency and blocker register

| Dependency | Needed by | State | Evidence / issue | Action |
|---|---|---|---|---|

## 6. Derived frontend gaps

| ID | Gap | Source/evidence | Related baseline ticket | Release relevance | Status |
|---|---|---|---|---|---|

If no derived gaps exist, write `No derived gaps identified from the currently available evidence.`

## 7. Milestone readiness

| Milestone | Planned outcome | Frontend readiness | Missing |
|---|---|---|---|

## 8. Current delivery focus

### Now
- ...

### Next
- ...

### Blocked
- ...

## 9. Changelog

### YYYY-MM-DD
- Updated ...
- Status changed ... because ...
- Added derived gap ...
```

## Editing rules

- Preserve previous changelog entries.
- Update `Last updated` on every material change.
- Keep evidence paths relative to repository root.
- Do not paste large code blocks into the PRD.
- Prefer one precise evidence path over many weak paths.
- If status decreases because code regressed or a dependency disappeared, record the downgrade in the changelog.
