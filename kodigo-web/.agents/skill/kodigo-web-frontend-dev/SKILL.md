---
name: kodigo-web-frontend-dev
description: Implement tickets W-01 to W-12 of the Kodigo corporate website (kodigo-web) with React + TypeScript + styled-components, translating Eduhall template patterns (Bootstrap/CSS) and Tailwind/HTML/CSS snippets into styled-components, and keeping the .agents skills and docs/FRONTEND_PRD.md in sync. Use when asked to work on a W-xx ticket, build or adapt a page/section/component, convert Bootstrap or Tailwind markup to styled-components, or add/maintain skills under .agents.
---

# Kodigo Web Frontend Dev

## Stack decision (read first)

`kodigo-web` ships **React 18 + TypeScript + Vite + React Router 7 + styled-components 6**. Bootstrap and Tailwind are **out of scope for shipped code**.

They still matter as *input*: Eduhall (`../eduall/`) is Bootstrap 5 + custom utility CSS, and users may paste Tailwind or plain HTML/CSS. Treat all of them as sources to translate, never as dependencies to install.

| Input | What to do |
|---|---|
| Bootstrap markup/classes | Translate to styled-components using `references/stack-translation.md` |
| Tailwind classes | Translate the same way (spacing unit already matches `theme.space`) |
| Plain HTML/CSS | Convert to semantic JSX + a styled component |
| Eduhall component | Rewrite; never copy classes, `jQuery`, `AOS`, `slick` or global CSS |

If a user explicitly asks to add Bootstrap or Tailwind to the project, stop and ask: it contradicts the baseline (`references/frontend-baseline.md` of the tracker skill) and requires a recorded scope change in `docs/FRONTEND_PRD.md`.

## Workflow for a ticket

1. Read the ticket in `docs/FRONTEND_PRD.md` (section 3) and its DoD in `.agents/skill/kodigo-frontend-prd-tracker/references/frontend-baseline.md`.
2. Read the matching playbook in `references/ticket-playbooks.md`.
3. Check blockers in the PRD section 5 (X-xx). Do not invent content, assets or fonts; use placeholders marked `PROVISIONAL` and report them.
4. Implement following the code rules below.
5. Verify: `npm run lint`, `npx tsc -b` and `npm test` (build + browser + importer tests; see `tests/README.md`). For UI changes also look at the affected routes at 360/768/1024/1440 px (screenshots) and add or extend a test in `tests/e2e` for new behavior. State plainly what was not verified.
6. Update `docs/FRONTEND_PRD.md` (status, evidence, changelog) using the `kodigo-frontend-prd-tracker` skill and run its validator.

## Code rules

- Functional components with hooks; small, single-purpose, typed props (`interface`), stable `key`s (never array index for data lists).
- Styles only in styled-components. Global CSS is limited to reset and `@font-face` in `src/styles/GlobalStyle.tsx`.
- Use **theme tokens only** (`theme.colors`, `theme.space(n)`, `theme.radii`, `theme.weights`, `media.up/down`). If a value is missing, add a token to `src/styles/theme.ts` instead of hard-coding it.
- Transient props with `$` prefix for style-only props (`$open`, `$variant`).
- Content lives in `src/data/`, never inline in JSX, so pages are generated from data. One source of truth per concept (bootcamps, navigation, professional sections).
- Accessibility: semantic landmarks, one `h1` per page, `alt` on images, `aria-expanded`/`aria-controls` on disclosure controls, visible focus, keyboard operability, no color-only meaning.
- Design (decided 2026-10-08): follow Eduhall Home 3 "University" with Kodigo violet. Light page (`bg` white, alternating `surface`), headings `heading` `#222E48`, body `text` `#576070`, main color `main` `#4B4AF1` (hover `mainHover`), navy `#071431` for the banner and footer, Inter typeface, 120 px section rhythm, 16 px card radius, pill buttons (`ButtonLink`, `arrow` adds the up-right arrow), section titles with icon label (`SectionTitle label`). Orange/green only as soft backgrounds; for TEXT use `orangeText`/`greenText`/`yellowText`. Official icons (lilac/white strokes) go on a dark tile (`brandDark`). Dark logo on the light header, white logo on the navy footer. Do not reintroduce the old dark theme.
- Imports through the `@/` alias. Path conventions: `components/ui`, `components/layout`, `components/sections`, `pages`, `data`, `styles`.
- Motion and cards (Eduhall, adopted 2026-10-08): use `Reveal` (`direction` up/down/left/right/zoom, `index` to stagger), `SectionTitle` (bounce entrance), `Float` and the keyframes in `src/styles/effects.ts` (`flipInY`, `upDown`, `scalation`, `spin`, `bounceIn*`); cards use `Card` (Eduhall `box-shadow-md`, 0.2 s linear hover, violet border) and the bootcamp card follows `course-item` (zoom x1.1 on hover), steps follow `item-hover`. Animate only `transform`/`opacity`; any hidden/initial state must live inside `@media (prefers-reduced-motion: no-preference)`; never put backticks inside CSS comments of a styled-components template; do not animate hero text (LCP). Do not preload the hero photo or the font (measured: it worsens FCP). See `docs/EDUHALL_ADAPTATION_PLAN.md`.
- Sample content: texts, figures, logos or testimonials that are not official go ONLY in `src/data/demo/` (modo demo, `npm run dev:demo`), always labeled "de ejemplo". Never put them in real data or JSX. Sections driven by `src/data/content.ts` render only when their data exists. `tests/e2e/no-demo.test.mjs` must keep passing (demo content must not reach the production bundle). Use literal objects (no function calls) in demo data so the build can drop it.
- Do not add dependencies without saying why; prefer none.

## Working with `.agents`

See `references/agents-conventions.md` for how skills in `.agents/skill/` are structured, how to add one, and how they relate to the PRD.

## Reporting

End each ticket session with: what changed (file links), what was verified and how, what remains, new blockers, and the PRD status change with reason.
