# Ticket playbooks (W-01 to W-12)

DoD text is authoritative in `../../kodigo-frontend-prd-tracker/references/frontend-baseline.md`. Current status is in `docs/FRONTEND_PRD.md`. Each playbook below says how to work, not what the status is.

## W-01 Project base, theme and fonts
- Files: `src/styles/theme.ts`, `src/styles/GlobalStyle.tsx`, `public/fonts/`, `index.html`.
- Fonts: expected files `Matimo-Regular.woff2`, `Matimo-SemiBold.woff2`, `Matimo-Bold.woff2` in `public/fonts/` (weights 400/600/700). Never substitute another font silently. If only `.ttf/.otf` is supplied, convert to `.woff2` or adjust `@font-face` formats.
- New visual values become tokens in `theme.ts`, including alpha colors currently hard-coded as `rgba(...)`.
- Verify: `npx tsc -b`, `npm run build`, then in the browser `document.fonts.check('700 1em Matimo')` and the Network tab shows no 404s.

## W-02 Base UI components
- Files: `src/components/ui/*`, `src/components/sections/PageHeader.tsx`.
- Add a component only if used (or clearly about to be used) by 2+ places. Props typed; no content inside.
- Verify visually in each page that uses them; hover/focus states present.

## W-03 Layout and navigation
- Files: `src/components/layout/*`, `src/data/navigation.ts`.
- Menu items come only from `navigation.ts`. Keep: `aria-expanded`, Escape closes, active state, mobile toggle under 992px.
- Verify with keyboard only (Tab, Enter, Escape) and at 360px; add outside-click closing if missing.

## W-04 Routing and data layer
- Files: `src/App.tsx`, `src/data/*`, `src/pages/*`.
- A new page = route in `App.tsx` + page component + data entry. Unknown slugs render `NotFoundPage`.
- `/nosotros/` trailing slash: router treats both equally; canonical redirect is a hosting decision (X-06).

## W-05 Home
- Brand composition: central title, benefits in three columns, CTA at the foot. Copy and icons are official or `PROVISIONAL`.
- Icons: inline SVG, thin stroke, lilac `accent` + white `text`. No icon fonts.

## W-06 Bootcamps listing
- Data only from `src/data/bootcamps.json` (typed in `bootcamps.ts`). Never hand-write a card per bootcamp. Official content is loaded from `content/bootcamps.csv` with `npm run content:check` / `npm run content:import`; do not edit the JSON by hand.
- Do not edit the 10 slugs without recording it in the PRD (they are URLs).

## W-07 Bootcamp detail
- The `Bootcamp` interface already has the detail fields (syllabus, duration, modality, level, requirements, enrollmentUrl); if a new field is needed, add it to the interface, the importer (`scripts/import-bootcamps.mjs`), the CSV template and `content/README.md` together. Missing optional fields must not render empty headings.
- Enrollment action depends on X-06; use a clearly marked placeholder.

## W-08 Nosotros
- Eduhall references: `AboutOne`, `CounterOne`, `TestimonialsOne`. Rewrite per `stack-translation.md`; counters use real numbers supplied by Kodigo, never invented.

## W-09 Profesional
- Subsections are data-driven from `src/data/professional.ts`. Known gap: `navigation.ts` duplicates the list; derive the menu from `professional.ts` when touching this.

## W-10 Brand assets
- Source files come in `Recursos kodigo/` (outside the repo). Never commit the originals (29 MB); run `npm run assets:build` to generate optimized files into `src/assets/` and `public/` (logo, favicons, icons, partner logos) and commit those.
- Import images with Vite (`import x from "@/assets/..."` or `import.meta.glob`) so they get hashed names and immutable caching; `public/` is only for files that need fixed URLs (favicons).
- Every informative image has `alt`, decorative images `alt=""`; always give `width`/`height` to avoid layout shift. Third-party logos go on a light card. Do not ship Eduhall assets as Kodigo branding.
- Do not place photos of people without their names/roles and written consent (see `docs/SOLICITUD_DE_INSUMOS.md`).

## W-11 Responsive and accessibility verification
- Check 360/768/1024/1440 widths, keyboard, focus visibility, heading order, contrast (`#7380E5` on `#2E3142` for small text needs measurement). Record the results in the PRD, not just a status change.

## W-12 Quality and release
- ESLint (`npm run lint`), per-route meta (`usePageMeta`) and the test suite (`npm test`) exist. Before closing any ticket run `npm run lint`, `npx tsc -b` and `npm test`. Pending: favicon (X-02), CI (lint + typecheck + `npm test`) and deployment with an SPA rewrite rule, all per X-06. Keep the lint rule that forbids expression-bodied `useEffect`.

## Cross-ticket rules
- Content gaps are reported, not invented.
- A ticket is never `Done` with `PROVISIONAL` content or without verification evidence.
