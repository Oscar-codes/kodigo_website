# Kodigo Corporate Website (kodigo.org) Frontend Baseline

## Purpose

This file preserves the frontend delivery scope of the **corporate website** `kodigo-web`. Use it as the immutable baseline when creating or updating `docs/FRONTEND_PRD.md`.

It replaces the original Self-Learning platform baseline (S0-05 ... S5-04), which tracked a different product (LMS: video player, quiz, sandbox, creator studio) and does not apply to this repository.

The baseline was defined on 2026-10-08 from the original project brief: build kodigo.org from the Eduhall template (kept in `../eduall/` as reference only), with React + TypeScript + Vite, styled-components, React Router, and a single data source for bootcamps. No hour estimates exist; do not invent them.

## Baseline frontend tickets

| ID | Task | Priority | Dependencies | Definition of Done |
|---|---|---|---|---|
| W-01 | Project base, centralized theme and fonts | High | Matimo font files | Vite/TS project builds and typechecks; theme holds brand colors, typography, spacing, radii, breakpoints; global CSS limited to reset + fonts; Matimo (Regular/SemiBold/Bold) loads from `public/fonts` |
| W-02 | Base UI components | High | W-01 | Container, Section, Button, Card and PageHeader exist as styled-components using only theme tokens and are reused by 2+ pages |
| W-03 | Layout and navigation | High | W-02 | Header/Footer/Layout with Inicio, Bootcamps, Nosotros, Profesional; dropdowns for Bootcamps and Profesional; working mobile menu; keyboard accessible (aria-expanded, Escape); active-route state |
| W-04 | Routing and data layer | High | W-03 | Declarative routes `/`, `/bootcamps`, `/bootcamps/:slug`, `/nosotros/`, `/profesional`, `/profesional/:slug`, 404; navigation and bootcamp pages generated from one data source; no per-bootcamp duplicated code |
| W-05 | Home page | High | W-02, W-03, W-10 | Central title, three benefit columns, CTA at foot, following the brand composition; official copy and icons (no placeholder content) |
| W-06 | Bootcamps listing | High | W-04 | Cards for all 10 programs from the data source, each linking to its detail; official descriptions |
| W-07 | Bootcamp detail page | High | W-04, official content | Each bootcamp page shows its official syllabus/curriculum, duration, requirements and enrollment action |
| W-08 | Nosotros page | Medium | W-02, official content | Page at `/nosotros/` with official institutional content, using adapted Eduhall sections as decided |
| W-09 | Profesional section | Medium | W-04, official content | PPD and Alianzas pages with official content; new subsections addable by data only |
| W-10 | Brand assets | Medium | Official assets | Official logo SVG, line-icon set (thin stroke, lilac/white), and imagery integrated with `alt` text |
| W-11 | Responsive and accessibility verification | Medium | W-05..W-09 | Verified at 360/768/1024/1440 widths; semantic HTML, alt text, focus visibility, color contrast and keyboard navigation checked |
| W-12 | Quality and release readiness | Medium | W-11 | Lint, typecheck and build pass in CI; page titles and meta tags per route; production deployment configured |

## Adjacent release gate

| ID | Task | Dependency | DoD |
|---|---|---|---|
| W-QA-01 | Internal Kodigo review of content and design | W-12 | Consolidated and prioritized feedback from the Kodigo team |

Track it as an adjacent gate, not as one of the 12 baseline tickets.

## External dependencies

| ID | Provider | Dependency |
|---|---|---|
| X-01 | Kodigo brand | Matimo font files (Regular, SemiBold, Bold) in `.woff2` |
| X-02 | Kodigo brand | Official logo (SVG) and iconography |
| X-03 | Kodigo academics | Official bootcamp content (descriptions, syllabus, duration, requirements) |
| X-04 | Kodigo management | Content for Nosotros, PPD and Alianzas |
| X-05 | Kodigo management | Decision: is "Full Stack Jr" and "Full Stack AI Jr" one program or two |
| X-06 | Infra | Hosting/domain and enrollment destination (form or external platform) |

## Milestone gates

| Milestone | Planned meaning |
|---|---|
| M0 | Project skeleton: theme, base components, build green (W-01, W-02) |
| M1 | Navigable site structure: layout, routing, data layer (W-03, W-04) |
| M2 | All sections with official content and assets (W-05..W-10) |
| M3 | Verified, accessible and deployed (W-11, W-12, W-QA-01) |

## Stack and delivery assumptions

- React 18 + TypeScript + Vite, React Router 7, styled-components 6.
- No CSS framework (Bootstrap and Tailwind are out of scope).
- Eduhall (`../eduall/`) is a reference for layout patterns and assets only; its components are rewritten, never copied.
- Brand identity: background `#2E3142`, text `#F5F6FE`, secondary `#7380E5`, primary `#4B4AF1`, accent `#AF94F8`; button gradient `#4B4AF1 -> #7380E5`; Matimo typography.

## Product behaviors that may appear as derived gaps

- Lead capture / enrollment form behind the CTA
- Link or access point to the Self-Learning platform
- Legal pages (privacy, terms)
- Analytics and cookie consent
- Contact page
