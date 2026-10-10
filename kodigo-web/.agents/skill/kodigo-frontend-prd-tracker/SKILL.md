---
name: kodigo-frontend-prd-tracker
description: Maintain a living frontend PRD and ticket inventory for the Kodigo corporate website (kodigo-web, kodigo.org) using the baseline in references/frontend-baseline.md as immutable scope and the current repository as implementation evidence. Use when asked to list frontend tickets, show progress, update docs/FRONTEND_PRD.md, find blockers or missing coverage, or prepare release status for the website.
---

# Kodigo Frontend PRD Tracker (Corporate Website)

## Goal

Maintain `docs/FRONTEND_PRD.md` as the single living frontend delivery record for `kodigo-web`.

Use the tickets in `references/frontend-baseline.md` (W-01 ... W-12) as baseline scope. Treat IDs, DoD, priority and dependencies as source-of-truth planning data. Determine current status only from repository evidence.

This skill was adapted from the Self-Learning platform tracker; that baseline (S0-05 ... S5-04) no longer applies here.

## Operating rules

1. Preserve every baseline ticket ID. Never rename, delete, or silently merge them.
2. Separate **planned scope** from **current implementation evidence**.
3. Never mark a ticket `Done` because files merely exist. Require evidence that its DoD is satisfied.
4. Content tickets (W-05 ... W-09) are not `Done` while they contain placeholder copy. Placeholders are marked `PROVISIONAL` in code; search for that token.
5. Do not invent content, hours or external decisions. Record missing assets/content as external dependencies (X-xx) or blockers.
6. Surface requirements not represented in the baseline as `FE-GAP-001`, `FE-GAP-002`, ... Never count them in baseline metrics.
7. Prefer repository evidence over comments or stale documentation.
8. Keep the PRD useful for both engineering execution and management review.

## Workflow

1. Read `references/frontend-baseline.md` and `references/status-rules.md`.
2. Inspect the repository: `package.json`, `src/styles/`, `src/data/`, `src/components/`, `src/pages/`, `src/App.tsx`, `public/fonts/`, `public/` assets, tests, lint config, CI config. Run `npx tsc -b` and `npm run build` and record the result. `grep -r PROVISIONAL src` lists open placeholder content.
3. Build an evidence map per ticket (paths, components, routes, missing pieces, blockers).
4. Assign status and progress using only `Not started`, `In progress`, `Blocked`, `Ready for QA`, `Done` and progress `0, 25, 50, 75, 100`.
5. Create or update `docs/FRONTEND_PRD.md` following `references/prd-template.md`, preserving the changelog.
6. Detect derived gaps (see baseline list).
7. Run `python .agents/skill/kodigo-frontend-prd-tracker/scripts/validate_prd.py docs/FRONTEND_PRD.md` from `kodigo-web/` and fix failures.
8. Report: baseline tickets done/total, progress index, in-progress tickets, blockers, next recommended ticket; point to `docs/FRONTEND_PRD.md`.

## Ticket completion discipline

A ticket is `Done` only when its DoD is satisfied, the project builds and typechecks, loading/empty/error states are handled where relevant, and there is verification evidence (visual/responsive/a11y check for UI tickets, recorded in the PRD).

If implementation exists but an external dependency (X-xx) prevents completion, use `Blocked` and keep the last earned progress.

## Scope change handling

Record differences under `Implementation notes` (architectural substitution, scope reduction, scope addition). Do not rewrite baseline text.

## Output style

Write the PRD in English; keep Spanish route names and UI labels as they appear in the product. Be evidence-driven, compact and actionable. Prefer tables for tracking and short sections for detail.
