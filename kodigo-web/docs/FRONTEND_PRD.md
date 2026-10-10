# Kodigo Website (kodigo.org) — Frontend Living PRD

_Last updated: 2026-10-08_

## 1. Executive status

- Baseline frontend tickets: 12
- Done: 3/12
- Progress index: 67%
- Current focus: the visual design now follows Eduhall (Home 3 "University": light header, dark photo banner, overlapping info cards, tinted sections, navy footer) with Kodigo's violet as the main color, rebuilt in styled-components; remaining work needs official copy, vector files, the typography decision (X-09) and a few decisions (where photos go, team/workshops sections).
- Main blocker: the Matimo font (X-01), official bootcamp/institutional content (X-03, X-04) and vector files (X-02) are not available in the repository. Brand decision X-07 (contrast) is resolved; hosting decided (GitHub + Railway, X-06).
- Next dependency-ordered ticket: W-01 (Matimo font) and W-06/W-07 (bootcamp CSV) are the highest-impact inputs; W-10 can finish once SVG files and the section design (X-08) arrive.
- Build evidence: `npm run lint`, `npx tsc -b` and `npm test` pass (2026-10-08): 30 importer checks + browser checks against the production server (`serve`), 0 axe violations. Layout/navigation verified in Edge with 18 automated browser checks (2026-10-08); content tickets not yet verified visually.

## 2. Baseline ticket tracker

| ID | Scope | Status | Progress | Priority | Dependency state | Evidence | Next action |
|---|---|---|---:|---|---|---|---|
| W-01 | Project base, theme, fonts | Blocked | 50% | High | X-09: Matimo (brand guide) vs Inter (Eduhall design) | `src/styles/theme.ts`, `src/main.tsx` | Decide the typography; if Matimo stays, add the `.woff2` files and re-wire `@font-face` |
| W-02 | Base UI components | Done | 100% | High | W-01 partially met | `src/components/ui/` | None; contrast issue tracked in W-11 |
| W-03 | Layout and navigation | Done | 100% | High | W-02 met | `src/components/layout/Header.tsx` | None |
| W-04 | Routing and data layer | Done | 100% | High | W-03 met | `src/App.tsx`, `src/data/` | Hosting SPA fallback and optional trailing-slash redirect handled under W-12 / X-06 |
| W-05 | Home page | In progress | 50% | High | W-10 and official copy missing | `src/pages/HomePage.tsx`, `src/components/sections/` | Replace benefits copy; official content for Steps/Partners/Testimonials/FAQ (they appear only when content exists) |
| W-06 | Bootcamps listing | In progress | 50% | High | W-04 met; X-03, X-05 missing | `src/pages/BootcampsPage.tsx` | Fill `content/bootcamps.csv` with official data; resolve Full Stack decision |
| W-07 | Bootcamp detail page | Blocked | 50% | High | X-03, X-06 missing | `src/pages/BootcampDetailPage.tsx`, `src/components/sections/BootcampInfo.tsx` | Populate official data in `src/data/bootcamps.ts`; set `siteConfig.enrollmentUrl` |
| W-08 | Nosotros page | Blocked | 50% | Medium | X-04 missing | `src/pages/AboutPage.tsx`, `src/components/sections/{AboutContent,Stats}.tsx` | Official institutional text and figures (with source/date) in `src/data/content.ts` |
| W-09 | Profesional section | Blocked | 50% | Medium | X-04 missing (PPD copy); Alianzas logos received | `src/pages/ProfessionalPage.tsx`, `src/components/sections/Partners.tsx`, `content/partners.csv` | Confirm partner names/permissions; official PPD and Alianzas copy |
| W-10 | Brand assets | Blocked | 50% | Medium | Vector files (SVG) and image placement decisions pending | `scripts/build-assets.mjs`, `src/assets/` | Request SVG logo/icons; decide where the photos go (see `docs/SOLICITUD_DE_INSUMOS.md`) |
| W-11 | Responsive and accessibility verification | Ready for QA | 75% | Medium | X-07 resolved; W-05..W-09 content incomplete | `tests/e2e/a11y-axe.test.mjs`, `tests/e2e/responsive.test.mjs` | Manual screen-reader pass; re-run after official content and images (alt text) |
| W-12 | Quality and release readiness | Ready for QA | 75% | Medium | First CI run and Railway deploy pending (need GitHub/Railway) | `.github/workflows/ci.yml`, `railway.json`, `nixpacks.toml`, `public/serve.json` | Push to GitHub, confirm green CI, connect Railway (see `docs/DEPLOY.md`) |

## 3. Ticket details

### W-01 — Project base, centralized theme and fonts

**Original DoD:** Vite/TS project builds and typechecks; theme holds brand colors, typography, spacing, radii, breakpoints; global CSS limited to reset + fonts; Matimo (Regular/SemiBold/Bold) loads from `public/fonts`.

**Current implementation:**
- Vite 6 + TypeScript strict project; styled-components 6; `@/` alias.
- Theme with the full brand palette, weights, radii, breakpoints and `media` helpers.
- `GlobalStyle` contains only reset, focus style, reduced-motion and `@font-face` declarations.

**Evidence:**
- `src/styles/theme.ts` (all colors incl. alpha variants are tokens; no hex/rgba outside it)
- `src/styles/GlobalStyle.tsx` (`@font-face` weights read from `theme.weights`)
- `public/fonts/README.md` (expected filenames and verification procedure)

**Missing to satisfy DoD:**
- The DoD names Matimo. Since the design decision of 2026-10-08 (follow Eduhall) the site uses **Inter** (Eduhall's typeface, self-hosted with `@fontsource-variable/inter`, no Google requests) and the Matimo `@font-face` wiring was removed. Either the user confirms Inter (then the DoD wording changes through a recorded scope change) or Matimo is brought back with the `.woff2` files (see `public/fonts/README.md`).

**Dependencies / blockers:**
- X-09 (typography decision); X-01 only if Matimo stays.

**Implementation notes:**
- Scope addition: `prefers-reduced-motion` handling in the global reset.
- 2026-10-08 design change: the theme was rewritten with values measured from the Eduhall template (Inter, 120 px sections, 16 px card radius, pill buttons, navy footer `#071431`, heading `#222E48`, body `#576070`) and Kodigo's violet `#4B4AF1` replacing Eduhall's blue. Orange and green are used only as soft backgrounds; their text variants are darkened for AA contrast.

### W-02 — Base UI components

**Original DoD:** Container, Section, Button, Card and PageHeader exist as styled-components using only theme tokens and are reused by 2+ pages.

**Current implementation:**
- All five components exist and are reused across Home, Bootcamps, detail, Nosotros, Profesional and 404.
- Hard-coded `rgba` values were moved to theme tokens on 2026-10-08 (see W-01).

**Evidence:**
- `src/components/ui/Container.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx`
- `src/components/sections/PageHeader.tsx`

**Missing to satisfy DoD:**
- Nothing against the DoD. Visual verification done 2026-10-08 with headless Edge screenshots of `/` at 1440 and 360 px (iframe, since headless Edge cannot go below ~500 px) and `/bootcamps` at 768 px: no overflow, cards/buttons/headers render as designed. Hover and focus states exist in code but were not exercised.
- The primary `Button` gradient end was darkened (`#7380E5` -> `#4C5DDE`, brand-approved under X-07) so white text meets 4.5:1 across the whole button.

**Dependencies / blockers:**
- None.

**Implementation notes:**
- Architectural substitution vs. the template: Eduhall utility classes (Bootstrap + custom CSS) were not reused; components were rewritten.

### W-03 — Layout and navigation

**Original DoD:** Header/Footer/Layout with Inicio, Bootcamps, Nosotros, Profesional; dropdowns for Bootcamps and Profesional; working mobile menu; keyboard accessible; active-route state.

**Current implementation:**
- Sticky header, dropdowns with `aria-expanded`/`aria-controls`, Escape to close, hover on desktop, toggle menu below 992px, `NavLink` active state, footer with section links, scroll-to-top on route change.
- Menu items are generated from `src/data/navigation.ts`.

**Evidence:**
- `src/components/layout/Header.tsx`
- `src/components/layout/Layout.tsx`
- `src/data/navigation.ts`

**Missing to satisfy DoD:**
- Nothing against the DoD. Verified 2026-10-08 with 18 automated checks in Edge (Playwright, 1280 px and 360 px): hover/click/Enter open, Escape closes and returns focus, outside click and Tab-out close, navigation closes menus, active state on the parent button, mobile toggle opens/closes (including Escape), no horizontal scroll.
- Not covered: screen-reader announcements. The checks now live in the repository as `tests/e2e/nav.test.mjs` (`npm run test:e2e`).

**Dependencies / blockers:**
- None.

**Implementation notes:**
- Fixed during W-03: (1) outside-click, Tab-out and mobile Escape closing were missing; (2) on desktop a click after hover closed the menu; (3) `Layout` effect `useEffect(() => window.scrollTo(0, 0))` returned a value, which crashed the whole app in production builds on every route change ("n is not a function"). Effects now use block bodies.
- Eduhall's HeaderOne search box, subject select and login icon were intentionally dropped (scope reduction).

### W-04 — Routing and data layer

**Original DoD:** Declarative routes `/`, `/bootcamps`, `/bootcamps/:slug`, `/nosotros/`, `/profesional`, `/profesional/:slug`, 404; navigation and bootcamp pages generated from one data source; no per-bootcamp duplicated code.

**Current implementation:**
- All routes declared in a single layout route; unknown bootcamp or professional slug renders the 404 page.
- 10 bootcamps defined once in `src/data/bootcamps.ts`; navigation and listing derive from it.

**Evidence:**
- `src/App.tsx`
- `src/data/bootcamps.ts`
- `src/data/professional.ts`

**Missing to satisfy DoD:**
- Nothing against the DoD. Verified 2026-10-08 with 30 automated browser checks (Playwright/Edge): direct load of all 17 routes (home, listing, 10 bootcamp details, nosotros with and without trailing slash, profesional index, PPD, Alianzas) renders the expected `h1`; 4 invalid URLs render the 404 page; listing links and the header menu match `src/data/bootcamps.ts` exactly (10 + "Ver todo"); back/forward, CTA links, detail-to-listing link and scroll reset work; no console or page errors.
- Not covered by this ticket: deep links work in `vite preview` only because it falls back to `index.html`; production hosting must provide the same rewrite (X-06, W-12). React Router matches `/nosotros` and `/nosotros/` equally; a canonical redirect, if wanted, is a hosting rule.

**Dependencies / blockers:**
- X-05 (Full Stack Jr / Full Stack AI Jr is currently a single entry).

**Implementation notes:**
- Closed a data duplication: the Profesional menu in `src/data/navigation.ts` is now derived from `src/data/professional.ts`, so adding a subsection there creates both the page and the menu entry.

### W-05 — Home page

**Original DoD:** Central title, three benefit columns, CTA at foot, following the brand composition; official copy and icons (no placeholder content).

**Current implementation:**
- Hero with central title, side geometric shapes at low opacity, benefits in three columns, CTA block.

**Evidence:**
- `src/components/sections/Hero.tsx`
- `src/components/sections/Benefits.tsx`
- `src/components/sections/CallToAction.tsx`
- `src/components/ui/Reveal.tsx`, `src/components/ui/Float.tsx` (motion applied to Hero shapes, Benefits and CTA)

**Missing to satisfy DoD:**
- Benefits copy is `PROVISIONAL`; icons are provisional generic SVGs (see W-10); hero copy not validated by Kodigo.

**Dependencies / blockers:**
- X-02, X-04 (copy), W-10.

**Implementation notes:**
- None.

### W-06 — Bootcamps listing

**Original DoD:** Cards for all 10 programs from the data source, each linking to its detail; official descriptions.

**Current implementation:**
- Responsive grid of cards (1/2/3 columns) with area tag, name and summary; whole card is clickable via the title link.

**Evidence:**
- `src/components/sections/BootcampGrid.tsx`
- `src/pages/BootcampsPage.tsx`

**Missing to satisfy DoD:**
- Summaries are `PROVISIONAL`; the `area` classification (IA/Datos/Desarrollo/Educación) is an unvalidated assumption.

**Dependencies / blockers:**
- X-03, X-05.

**Implementation notes:**
- None.

### W-07 — Bootcamp detail page

**Original DoD:** Each bootcamp page shows its official syllabus/curriculum, duration, requirements and enrollment action.

**Current implementation:**
- Data schema extended: `Bootcamp` now accepts optional `duration`, `modality`, `level`, `requirements`, `syllabus` (modules with topics) and `enrollmentUrl`; `siteConfig.enrollmentUrl` is the global fallback.
- `BootcampInfo` renders a two-column layout: syllabus and requirements on the left, a sticky side panel (facts + enrollment button) on the right at >= 992 px and first on mobile. Every block renders only when its data exists (no empty headings); with no data it shows a "se publicarán próximamente" notice and no panel.
- Breadcrumbs (Inicio / Bootcamps / name) on the detail page; the current page has `aria-current` and is not a link.
- The enrollment button ("Inscribirme") appears only when an enrollment URL is configured; external URLs open with `rel="noopener noreferrer"`. `ButtonLink` now supports external URLs.
- No bootcamp has official data yet, so every page currently shows the "próximamente" notice and no enrollment button.

**Evidence:**
- `src/pages/BootcampDetailPage.tsx`
- `src/components/sections/BootcampInfo.tsx` (two-column layout: sticky side panel with program facts and enrollment button, first on mobile)
- `src/components/ui/Breadcrumb.tsx` (accessible breadcrumbs, also used on the listing and Profesional subsections)
- `src/data/bootcamps.ts` (schema), `src/data/bootcamps.json` (data), `content/bootcamps.csv` + `scripts/import-bootcamps.mjs` (content intake)
- Verified 2026-10-08 in Edge at 1280 and 360 px in two states: shipped (no data: 10 checks) and with temporary sample data (16 checks: facts, 2-module syllabus, requirements, safe external button, no overflow, no empty headings, no console errors). Sample data was removed afterwards. Screenshot review found and fixed a duplicated module number ("1. 1.").

**Missing to satisfy DoD:**
- Official syllabus, duration, modality, level and requirements for each of the 10 programs (X-03).
- A real enrollment destination (X-06). Until then the DoD item "enrollment action" is not met.

**Dependencies / blockers:**
- X-03, X-06.

**Implementation notes:**
- Scope addition: `modality` and `level` fields beyond the DoD wording; they are optional and can be dropped if not wanted.
- Cosmetic open item: this page and the listing share the provisional `summary` text.

### W-08 — Nosotros page

**Original DoD:** Page at `/nosotros/` with official institutional content, using adapted Eduhall sections as decided.

**Current implementation:**
- Route, page header and two content-driven sections that appear only when their data exists in `src/data/content.ts`: `AboutContent` (heading + paragraphs) and `Stats` (Eduhall CounterOne pattern: figures that count up once when they enter the screen, with optional source/date line).
- Official content is still empty, so production shows only the header with the tagline.
- Accessibility of the counters: the animated number is `aria-hidden`; screen readers receive the final value. With reduced motion the final value shows immediately.
- Verified in demo mode (sample content, clearly labeled): counters start at 0 below the fold, end at the final values, reduced-motion shows final values at once, 0 axe violations, no horizontal overflow at 360 px.

**Evidence:**
- `src/pages/AboutPage.tsx`, `src/components/sections/AboutContent.tsx`, `src/components/sections/Stats.tsx`, `src/hooks/useCountUp.ts`, `src/data/content.ts`
- `tests/e2e/demo.test.mjs` (`npm run test:demo`)

**Missing to satisfy DoD:**
- Official institutional text and figures. Figures must come with source and date (`Stat.source`); none are invented.

**Dependencies / blockers:**
- X-04.

**Implementation notes:**
- Sample content lives only in `src/data/demo/` and is excluded from the production build (checked by `tests/e2e/no-demo.test.mjs`).

### W-09 — Profesional section

**Original DoD:** PPD and Alianzas pages with official content; new subsections addable by data only.

**Current implementation:**
- Index and subsection pages generated from `src/data/professional.ts`; adding an entry creates the page and its menu item (the menu derives from the same data). `showPartners` enables the partners strip on a subsection (currently Alianzas).
- `Partners` + `Marquee` (Eduhall BrandOne/MarqueeOne pattern without slick/react-fast-marquee): continuous strip that pauses on hover/focus, becomes a static wrapped grid with reduced motion, hides the visual duplicate from assistive technology, supports logo (with `alt`) or name, and optional external link (`rel="noopener noreferrer"`). Appears only when `content.partners` exists.
- **Real partner logos (49) delivered and integrated (2026-10-08):** Alianzas shows all of them in a grid (no invented intro text: the placeholder lead was removed); Home shows a marquee that only mounts near the viewport (no logo is downloaded before that), with a proportional speed (about 2.5 s per logo), a static grid of 12 with reduced motion and a link to Alianzas. Names were read from the logos and the file names and are in `content/partners.csv` (editable); URLs are empty. PPD still has placeholder copy.
- Verified in demo mode and with real logos: strip moves, pauses on hover, static grid with reduced motion, no horizontal overflow, 49 images load, unique non-empty `alt`.

**Evidence:**
- `src/pages/ProfessionalPage.tsx`, `src/data/professional.ts`, `src/components/sections/Partners.tsx`, `src/components/ui/Marquee.tsx`
- `tests/e2e/demo.test.mjs`

**Missing to satisfy DoD:**
- Official PPD content and Alianzas intro copy; confirmation of the 49 partner names (flagged rows in `content/partners.csv`: Tigo file is named "Bolivia", Datum/Redsoft are two brands, Ministerio de Salud is a public institution); written permission of each partner to show its logo; partner URLs if links are wanted.

**Dependencies / blockers:**
- X-04, X-02.

**Implementation notes:**
- Resolved 2026-10-08: navigation derives the Profesional menu from `professional.ts` (single source), meeting "addable by data only".

### W-10 — Brand assets

**Original DoD:** Official logo SVG, line-icon set (thin stroke, lilac/white), and imagery integrated with `alt` text.

**Current implementation (2026-10-08, from the delivered `Recursos kodigo/` folder):**
- **Logo:** official white logo (`KODIGO-BL.png`) in header and footer with `alt="Kodigo"`, intrinsic `width/height` (no layout shift). The dark logo (for light backgrounds) was delivered but is not used yet.
- **Favicons:** generated from the violet isotype: `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png`; `theme-color` `#2E3142`.
- **Icons:** the 3 official lilac/white icons (`target`, `bulb`, `path`) replace the provisional SVGs in the Home benefits (assignment icon -> benefit is a proposal; confirm). The 4 white icons (Contenido, Horarios, Modalidad, Ritmo) are processed but not placed yet (they look like bootcamp attributes; needs a decision on the schema).
- **Partner logos:** 49 logos optimized (29 MB of source -> 444 KB), trimmed and normalized; `alt` = partner name; shown as a marquee on Home and as a full grid on Alianzas.
- **Pipeline:** `npm run assets:build` (`scripts/build-assets.mjs`, dev dependency `sharp`) regenerates everything from the source folder (kept outside the repo); partner names/URLs live in `content/partners.csv`.
- **Home banner photo:** `FOTOS/SCC1/O1.png` (classroom session) is used as the background of the Home banner (processed to `src/assets/photos/hero.webp`). It shows identifiable people: **publishing is pending written permission/licence** (see `docs/SOLICITUD_DE_INSUMOS.md`). The dark logo is now used in the light header and the white logo in the navy footer.
- Other photos, ellipses and workshop images were delivered but are not placed: they belong to a design organized in sections `SCC1`..`SCC7` that is not in the project (see X-08).

**Evidence:**
- `scripts/build-assets.mjs`, `content/partners.csv`, `src/assets/{brand,icons,partners}/`, `public/favicon-*.png`, `public/apple-touch-icon.png`
- `src/components/layout/{Header,Footer}.tsx`, `src/components/sections/{Benefits,Partners}.tsx`
- `tests/e2e/brand.test.mjs` (28 checks: logo loaded, favicons respond with images, official icons, no partner download before the strip is near, 49 logos load with unique non-empty alt, grid at 360 px, reduced-motion static grid)

**Missing to satisfy DoD:**
- Vector (SVG) logo and icons: the delivered files are raster; the icons are only 46 px.
- Imagery with `alt`: photos are not placed yet (needs the section design / decisions).

**Dependencies / blockers:**
- X-02 (SVG), X-08 (reference design).

**Implementation notes:**
- Partner logos sit on a light card (brand off-white `#F5F6FE`) because they are third-party logos designed for light backgrounds.
- The provisional `Icon` component was removed.
- Eduhall assets in `../eduall/public/assets` are reference only and must not ship as Kodigo branding.

### W-11 — Responsive and accessibility verification

**Original DoD:** Verified at 360/768/1024/1440 widths; semantic HTML, alt text, focus visibility, color contrast and keyboard navigation checked.

**Current implementation (2026-10-08):**
- **WCAG scan (axe-core; tags wcag2a/2aa/21a/21aa/22aa + best-practice):** 36 scans (all 17 routes incl. 404 at 1280 and 360 px, plus open desktop submenu and open mobile menu): **0 violations**, strict (no allow-list). Also 0 violations on the bootcamp detail page with sample data (panel labels, syllabus numbering, requirements), which is where the latent contrast failures were.
- **Contrast (X-07 resolved):** brand-approved AA tints applied as theme tokens: `textSecondary` `#9EA7ED` (5.63:1 on bg, 4.82:1 on cards), `accentText` `#B69EF9` (5.66:1 / 4.84:1), button gradient end `#4C5DDE` (4.96:1 with white text). Brand violets `#7380E5`/`#AF94F8` are kept for large titles, accents, borders and icons. Rule: small text uses the AA tokens.
- **Responsive:** `tests/e2e/responsive.test.mjs` checks all 17 routes at 360, 768, 1024 and 1440 px: no horizontal overflow, `h1` inside the viewport, correct menu mode (menu button below 992 px, full menu from 992 px), `main` and footer present. Mutation-tested (an injected 520 px footer is detected at 360 px).
- **Keyboard and focus:** header menus, skip link, breadcrumbs (see W-03, W-12); focus ring is a 2 px lilac outline (`:focus-visible`).
- **Headings, landmarks, titles:** one `h1` per page and no skipped levels on all checked routes; unique page titles; skip link.
- **Reduced motion:** content visible, animations off (see FE-GAP-005).

**Evidence:**
- `tests/e2e/a11y-axe.test.mjs`, `tests/e2e/a11y-fixes.test.mjs`, `tests/e2e/responsive.test.mjs`, `tests/e2e/nav.test.mjs`

**Missing to satisfy DoD:**
- Manual screen-reader pass (cannot be automated).
- Alt text for real images: no informative images exist yet (icons are decorative); re-verify when official assets arrive (W-10).
- Re-run the suite after official content replaces the provisional copy (different lengths can change layout).

**Dependencies / blockers:**
- W-05..W-10 final content/assets.

**Implementation notes:**
- Scope addition: skip link and per-route titles (accessibility).
- Brand change approved: button gradient end `#7380E5` -> `#4C5DDE` (originally `#4B4AF1 -> #7380E5`).

### W-12 — Quality and release readiness

**Original DoD:** Lint, typecheck and build pass in CI; page titles and meta tags per route; production deployment configured.

**Current implementation:**
- **Lint:** ESLint 9 (flat config, typescript-eslint, react-hooks), `npm run lint` clean. A custom rule forbids expression-bodied `useEffect` (the W-03 production crash); verified that the rule flags the bad form.
- **Per-route meta:** `usePageMeta` sets title, description and robots; 404 pages are `noindex` (17 checks).
- **Tests in the repo:** `npm test` = importer (30 checks) + build + production server + browser suites (incl. `deploy.test.mjs`, 29 checks of the production server configuration). The runner fails on reported failures and on crashing suites; mutation tests confirmed that lint and the e2e suite catch the W-03 bug and that the responsive suite catches an overflow.
- **CI:** `.github/workflows/ci.yml` (push to `main` and PRs): `npm ci`, lint, typecheck, content check, `npm test` with the runner's Chrome. YAML validated; **not yet run on GitHub**.
- **Deployment (GitHub + Railway):** `nixpacks.toml`, `railway.json`, `package.json` (`start`, `engines`), `public/serve.json`, `docs/DEPLOY.md`. Verified locally with the same server (`serve dist`): SPA rewrite on direct URLs, no directory listing, real 404 for missing files, `/index.html` redirect, immutable cache on hashed assets and `no-cache` on HTML, gzip (238 KB -> 79 KB), security headers. **Not yet deployed to Railway.**
- Local testing found and fixed three server-config defects before they could reach production: an invalid `serve.json` value (the service would crash on start), a rewrite pattern that crashed the server on the first request, and a root URL that showed the server's file listing instead of the site.
- Performance (mobile emulation: 360 px, CPU 4x slower, ~1.6 Mbps / 150 ms RTT; median of 3), re-measured 2026-10-08 after the Eduhall redesign: Home FCP 1.27 s / LCP 1.59 s (the banner photo; a 768 px version is used on mobile), inner pages LCP ~1.2 s, CLS 0.000 on all, blocking time 19-83 ms; JS 302 KB raw / 111 KB gzip (grew with the new sections, partner data and effects); fonts: Inter latin variable 47 KB. Preloading the hero photo or the font was tested and rejected (it delayed FCP).

**Evidence:**
- `eslint.config.js`, `package.json` (scripts), `.github/workflows/ci.yml`
- `railway.json`, `nixpacks.toml`, `public/serve.json`, `docs/DEPLOY.md`
- `tests/`, `scripts/e2e.mjs`, `tests/README.md`
- `src/hooks/usePageMeta.ts`, `index.html`

**Missing to satisfy DoD:**
- First green CI run on GitHub and first Railway deployment (both need access to those platforms).
- Favicon: done from the delivered isotype (see W-10); a vector favicon would still need the SVG.
- Per-route descriptions currently reuse `PROVISIONAL` text (bootcamp summaries, PPD/Alianzas leads); replace with official copy before indexing.
- No Content-Security-Policy (see `docs/DEPLOY.md`).

**Dependencies / blockers:**
- GitHub repository and Railway project (user action); X-02 for the favicon.

**Implementation notes:**
- Scope addition: `serve` runtime dependency (static server for Railway), `playwright-core` and `axe-core` as dev dependencies.

## 4. Adjacent release gate

### W-QA-01 — Internal Kodigo review
- Status: Not started
- Evidence: —
- Open feedback: none

## 5. Dependency and blocker register

| Dependency | Needed by | State | Evidence / issue | Action |
|---|---|---|---|---|
| X-01 Matimo font files | W-01 | Missing | `public/fonts/` is empty | Brand team to provide `.woff2` files |
| X-02 Logo SVG and iconography | W-05, W-10 | Partially received 2026-10-08 | Received as PNG: white logo, dark logo, isotype, 7 line icons (46 px), 49 partner logos, photos. Integrated: header/footer logo, favicons, benefit icons, partner logos. Still missing: vector (SVG) versions; icons are only 46 px (soft on high-DPI) | Ask Design for SVG logo and icons |
| X-03 Official bootcamp content | W-06, W-07 | Missing | `PROVISIONAL` summaries in `src/data/bootcamps.json`; intake template ready at `content/bootcamps.csv` (+ `content/README.md`) | Academics to fill the CSV (descriptions, syllabus, duration, modality, level, requirements, enrollment link); then run `npm run content:import` |
| X-04 Nosotros / PPD / Alianzas content | W-05, W-08, W-09 | Missing (partner logos received) | `PROVISIONAL` in `src/data/professional.ts` for PPD; Alianzas now has real logos but no intro text | Management to provide text and confirm the partner names/permissions |
| X-05 Full Stack program decision | W-04, W-06 | Open | Single entry `full-stack-jr` | Decide one or two programs |
| X-06 Hosting and enrollment destination | W-07, W-12 | Hosting decided: GitHub + Railway (config in repo, `docs/DEPLOY.md`). Enrollment destination still open | Deploy config verified locally with the production server; not yet run on GitHub/Railway | Push repo, confirm CI and Railway deploy; decide enrollment form/platform and set `siteConfig.enrollmentUrl` |
| X-07 Brand decision on text contrast | W-11 | Superseded 2026-10-08 | The AA tints approved for the dark design (`#9EA7ED`, `#B69EF9`, `#4C5DDE`) no longer apply: the Eduhall-based light design uses new tokens verified for AA (body 6.3:1, violet 5.9:1, white on violet 5.9:1, orange/green text only as dark variants). axe: 0 violations | None |
| X-08 Reference design (sections SCC1..SCC7) | W-05, W-08, FE-GAP-008, FE-GAP-009 | Open | The delivered photos/ellipses are named by section (`SCC1`, `SCC4`, `SCC5`, `SCC6`, `SCC7`) of a design that is not in the project | Share the Figma/Canva (or screenshots) so each photo and shape goes where it was designed |
| X-09 Typography decision | W-01 | Open | Brand guide says Matimo; the Eduhall design uses Inter (currently shipped) | Decide Inter (confirm) or Matimo (deliver `.woff2` files and licence) |

## 6. Derived frontend gaps

| ID | Gap | Source/evidence | Related baseline ticket | Release relevance | Status |
|---|---|---|---|---|---|
| FE-GAP-001 | Lead capture / enrollment form behind CTA buttons | CTA in `src/components/sections/CallToAction.tsx` links only to `/bootcamps` | W-05, W-07 | MVP | Not started |
| FE-GAP-002 | Entry point to the Self-Learning platform (login/access link) | Earlier scaffold referenced a `/login` route (`graphify-out/graph.json`); not present in `kodigo-web` | W-03 | Future scope | Not started |
| FE-GAP-003 | Legal pages (privacy, terms) and footer links | No such routes in `src/App.tsx` | W-04 | Release polish | Not started |
| FE-GAP-004 | Contact page or contact details in footer | Footer shows only the domain | W-03 | MVP | Not started |
| FE-GAP-005 | Motion system (Reveal, Float, useInView, useCountUp, Marquee) replacing Eduhall's AOS/WOW/animate.css, with reduced-motion safety | `docs/EDUHALL_ADAPTATION_PLAN.md` section 5 | W-05, W-08, W-09 | Release polish | Done (verified: demo suite checks count-up, marquee pause/motion and reduced-motion fallbacks) |
| FE-GAP-006 | FAQ section (accessible accordion, no Bootstrap JS) | `src/components/sections/Faq.tsx` (native `details/summary`); shown only when `content.faq` exists | W-05, W-07 | Future scope | In progress (component done and verified with sample content; awaiting official questions) |
| FE-GAP-007 | Testimonials section | `src/components/sections/Testimonials.tsx`; shown only when `content.testimonials` exists | W-05, W-08 | Future scope | In progress (component done and verified with sample content; awaiting real testimonials with authorization) |
| FE-GAP-008 | Workshops / events section (poster `26 de noviembre` and a `Coming soon 2027` image were delivered) | `Recursos kodigo/ELEMENTOS/WKSHOPS`; no such section in the baseline or the navigation | W-05 | Future scope | Not started (needs decision: where it lives, dates, registration link) |
| FE-GAP-009 | Team / instructors section (4 portraits delivered, first names only in the file names) | `Recursos kodigo/FOTOS/SCC7`; no such section | W-08 | Future scope | Not started (needs full names, roles and written consent of each person) |

## 7. Milestone readiness

| Milestone | Planned outcome | Frontend readiness | Missing |
|---|---|---|---|
| M0 | Project skeleton: theme, base components, build green | Mostly ready | Matimo fonts (W-01), visual check |
| M1 | Navigable site structure | Ready: W-03 and W-04 Done and browser-verified | Hosting SPA fallback (X-06) |
| M2 | All sections with official content and assets | Not ready | X-02, X-03, X-04; W-07 detail schema |
| M3 | Verified, accessible and deployed | Partially ready: automated accessibility, responsive and deploy-config checks pass | Manual screen-reader pass, first CI/Railway run, official content, W-QA-01 |

## 8. Current delivery focus

### Now
- Provide X-03 content (per bootcamp: duration, modality, level, requirements, syllabus) and X-06 (enrollment destination) so W-07 can finish.
- Obtain X-01 and X-02 and resolve X-05.
- Decide X-07 (brand text contrast) before the W-11 accessibility pass.

### Next
- Add ESLint and per-route titles (W-12).

### Blocked
- W-01 on X-01; W-05/W-06/W-07/W-08/W-09 content on X-02, X-03, X-04.

## 9. Changelog

### 2026-10-09
- **Alianzas = "Kodigo para empresas" (user brief).** `/profesional/alianzas` now renders `AlliancesHero` (h1 KODIGO PARA EMPRESAS, question, subtitle, CTA with arrow), `ImpactStats` (+360 / +2,800 / +80, count-up, uppercase labels), `Workshop` (three icon cards) and `WorkshopForm` (corporate email, validation with aria-invalid/alert, hover/focus/error states), then the partner logo grid. Copy and figures come from the user's brief (`src/data/alliances.ts`). Pending inputs: `siteConfig.advisoryUrl` (until set, the CTA scrolls to Contacto) and `siteConfig.workshopEndpoint` (until set, a valid submit says registration is not enabled yet; nothing is faked). Personal email domains (gmail, hotmail...) are rejected as the field asks for a corporate address. New `alliances.test` (35 checks).
### 2026-10-08
- **Eduhall card styles and animation effects adopted (user request).** Cards: the bootcamp card follows Eduhall's `course-item` (tinted background, 1 px border, 16 px radius, 12 px rounded image with an area pill, up to three data rows with icons only when the data exists, dashed divider, "Ver programa" link, image zoom x1.1 and arrow shift on hover); there are no per-program photos, so the image is an area-colored gradient with the Kodigo isotype as a watermark (`isotype-white.webp`, generated by `npm run assets:build`). `Card` uses Eduhall's `box-shadow-md` (0 6px 30px at 4%), linear 0.2 s transitions and a violet border on hover. The process steps use `item-hover` (the tinted block fills with the main color and the text turns white; numbered dashed badge). Effects copied from the template into `src/styles/effects.ts`: `bounceInDown/bounceIn/bounceInUp` for section titles (shortened travel so the page height does not grow), `flipInY` on the benefit icons on card hover, `upDown`, `scalation` and `roatation` on the page-header decorations, plus AOS-style entrances `fade-up/down/left/right/zoom-in` in `Reveal` (sections clip horizontal overflow). All of it is disabled or shows final state with `prefers-reduced-motion`. Fixes found by the suite: route changes now scroll to the top instantly (the smooth scroll made the new page appear to scroll up), a CSS-comment backtick bug, nav/meta tests. Measured and rejected: preloading the hero photo or the font worsened FCP (they compete with the JavaScript); instead a lighter 768 px hero image is used on mobile (Home LCP 2.05 s -> 1.59 s in mobile emulation, inner pages ~1.2 s). New `effects.test` (30 checks) plus item-hover checks in `demo.test`; production 262, demo 63, importer 30 all pass; axe 0 violations (also the detail page with sample data, desktop and mobile). Detail page and listing cards verified with temporary sample data (restored afterwards).
- **Design pivot (user request):** the dark design was replaced by one that follows Eduhall (Home 3 "University") with Kodigo's violet as the main color, rebuilt in styled-components (no Bootstrap/Eduhall CSS). Measured from the template: Inter, section rhythm of 120 px, 16 px card radius, pill buttons with the up-right arrow, light header with a bottom hairline, dark banner with a navy left-to-right gradient over a photo, white info panel overlapping the banner, alternating tinted sections, centered page headers with breadcrumbs and decorations, navy footer. New: Home bootcamps section (6 cards from the data), cards with colored area tags, section labels with icon, violet CTA band with floating circles, restyled detail page (side card with rows), Alianzas and Profesional cards. Typography is now Inter (X-09). The hero uses the delivered classroom photo (permission pending). Behavior, routes, data, importer and content sections are unchanged. Issues found by the suite and fixed: benefit cards overflowed at 768 px (3 columns only from 992 px), spacing against tinted neighbors (sections now choose their top padding from the previous section color), nav test selector ambiguity. Tests updated to the new design (logo sizes, theme-color, floating circles moved to the CTA, hover border color, logo inlining); suites: importer 30, production 232, demo 60 all pass, axe 0 violations. X-07 superseded, X-09 opened.
- Input request finished with the resources already received: `docs/SOLICITUD_DE_INSUMOS.md` rewritten as a send-ready document (status of what arrived, what is missing per team, 5 open questions, ready-to-paste messages per team) and a review workbook `Solicitud de insumos/Revision-de-recursos-recibidos.xlsx` (8 sheets; 49 partner logos, 4 portraits, 3 photos, 3 workshop images, 7 icons and 5 shapes embedded; yes/no dropdowns; yellow cells to fill). The workbook lives OUTSIDE the repository because it contains photos of people. Verified structurally with openpyxl (images, validations, sheets), not rendered in Excel. No ticket status changed.
- Real resources received (`Recursos kodigo/`, 74 files, 29 MB) and integrated: official white logo (header, footer), favicons from the isotype, official benefit icons, and the 49 partner logos (Alianzas grid + Home marquee). Added `npm run assets:build` (dev dependency `sharp`) and `content/partners.csv`; removed the provisional `Icon` component and the placeholder Alianzas text; demo mode no longer fakes partners. Found by the suite: translucent header over light logo cards dropped the active link to 4.43:1 -> header opacity .92 -> .97 (>= 4.86:1); the strip mounted too early (45 logos downloaded on load) -> mount margin 500 -> 200 px. W-10 Blocked 25% -> 50%; added FE-GAP-008 (workshops) and FE-GAP-009 (team) and X-08 (reference design). Progress index 65% -> 67%. Suite: importer 30, production 231 (new `brand.test`, 28 checks), demo 60. Mobile-emulated LCP ~1.1 s, CLS 0 with real images. Not placed (need decisions): 7 photos, 4 attribute icons, 5 decorative ellipses, 3 workshop images.
- Demo mode (user chose to advance with provisional content): `vite --mode demo` loads clearly labeled EXAMPLE content (banner on every page, `noindex, nofollow`, every text says "de ejemplo") from `src/data/demo/`; it is excluded from the production build (guard test `no-demo.test.mjs`; a leak mutation is detected). Built the sections that were deferred: Steps, Stats with `useCountUp`, Partners with `Marquee`, Faq (native `details`), Testimonials, About content; each appears only when `src/data/content.ts` has data, so production pages are unchanged. New suite `demo.test.mjs` (53 checks) plus axe and responsive in demo mode (0 violations). Found and fixed: demo banner outside any landmark (axe `region`), and a regression of mine (404 robots became `noindex, nofollow`) caught by `meta.test`. W-08 and W-09 In progress 25% -> Blocked 50% (X-04); FE-GAP-005 Done; FE-GAP-006/007 In progress. Progress index 60% -> 65%. Full chain: importer 30, production 208, demo 60 checks pass.
- Added `docs/SOLICITUD_DE_INSUMOS.md`: per-team request for the external dependencies (X-01..X-06) with formats and acceptance details. No ticket status changed. Project state checked: no new inputs received (no remote, no font files, no assets, CSV without official detail).
- X-07 resolved (brand approved the AA tints): `textSecondary`, `accentText` and a darker button gradient end applied as theme tokens; axe strict (0 violations, also with sample data); W-11 Blocked 50% -> Ready for QA 75% (added `responsive.test.mjs` at 360/768/1024/1440; manual screen-reader pass and re-run after official content remain). Hosting decided: GitHub + Railway. W-12 Blocked 50% -> Ready for QA 75%: CI workflow, Railway config, `serve`-based production server and `deploy.test.mjs` added; three server-config defects found and fixed in local testing; first CI run and Railway deploy still pending. Progress index 56% -> 60%.
- Tests moved into the repository (W-12 quality): `tests/e2e` (8 browser suites, 151 checks) and `tests/content` (importer, 30 checks), run with `npm test` / `npm run test:e2e` / `npm run test:content` (runner `scripts/e2e.mjs` builds, serves, tests and stops the server; configurable browser; see `tests/README.md`). New dev dependencies: `playwright-core`, `axe-core` (no browser download). Verified: all pass; the runner fails on reported failures and on crashing suites; mutation test (reintroducing the W-03 `useEffect` bug) is caught by both lint and the e2e suite. The axe suite whitelists only the known X-07 contrast issue. CI itself still pending (X-06).
- Content intake for X-03: bootcamp data moved to `src/data/bootcamps.json`; added `content/bootcamps.csv` template, `content/README.md` (instructions for non-technical staff) and `scripts/import-bootcamps.mjs` (`npm run content:check` / `content:import`; no new dependencies). Verified with 30 importer checks (Excel-style `;`/BOM/CRLF CSV, quotes and line breaks, 16 invalid-input cases that must fail without writing, removal protection for public slugs, `--check`) and one end-to-end run (CSV -> JSON -> build -> detail page, 29 browser checks); sample data removed afterwards and real data restored byte-identical. Regression unchanged (nav 18, routes 30, motion 28, a11y 27, meta 17, detail 21; axe: only color-contrast). No ticket status changed.
- W-10 Not started -> Blocked 25%: provisional line icons (`Icon` component) replace the empty boxes in the Home benefits, drawn to the brand brief; official logo/icons still pending (X-02). Progress index 54% -> 56%. Regression (nav 18, routes 30, motion 28, a11y 27, meta 17, detail 21) and axe scan unchanged (only color-contrast, X-07).
- W-12 In progress 25% -> Blocked 50%: ESLint added and clean (with a custom guard against the W-03 effect bug), per-route meta description and noindex for 404s via `usePageMeta` (replaces `usePageTitle`). Blocked on X-06 (CI/hosting) and X-02 (favicon). Progress index 52% -> 54%. Regression: a11y 27, nav 18, routes 30, motion 28, detail 21 checks pass.
- W-11 Not started -> Blocked 50%: automated accessibility audit (axe-core, 36 scans) and performance measurement done; only color-contrast remains (X-07). Fixed heading order, added skip link and per-route page titles (W-12 partial). Progress index 48% -> 52%. No brand colors were changed without approval.
- W-07 layout (Phase B of the Eduhall plan): side panel + breadcrumbs. Verified in Edge with temporary data in empty (21 checks), partial (21) and full (27) states at 1280 and 360 px; data removed afterwards. Regression: nav 18, routes 30, motion 28 all pass. Status unchanged (Blocked 50%, content X-03/X-06). Breadcrumbs also added to the bootcamp listing and Profesional subsections (W-09). Found and fixed by screenshot review: breadcrumb list showed numbering; global reset is now `ul, ol { list-style: none; padding: 0 }`.
- FE-GAP-005 Not started -> In progress: motion tokens in `src/styles/theme.ts`, `src/hooks/useInView.ts`, `src/components/ui/Reveal.tsx`, `src/components/ui/Float.tsx`; applied to Hero shapes, Benefits, CTA and bootcamp listing (hero text intentionally not animated to protect LCP). Verified with 28 browser checks incl. reduced motion; regression of nav (18), routes (30) and detail (10) checks passes. W-05 status unchanged (content/icons still pending).
- Reviewed Eduhall for reusable patterns and wrote `docs/EDUHALL_ADAPTATION_PLAN.md`. Confirmed that no Eduhall component, style, animation or asset is used in `src/`. Added derived gaps FE-GAP-005 to FE-GAP-007. No ticket status changed.
- W-07 In progress 25% -> Blocked 50%: schema, page and enrollment button implemented and browser-verified with temporary sample data; blocked on official content (X-03) and enrollment destination (X-06). Progress index 46% -> 48%.
- W-04 moved Ready for QA -> Done after 30 browser route checks. Progress index 44% -> 46%. Unified Profesional navigation with `professional.ts` (also removes the data-only gap noted under W-09).
- W-03 moved Ready for QA -> Done after browser tests. Progress index 42% -> 44%. Fixed a production crash on route change (effect returning a value in `Layout`), plus outside-click/Tab-out/Escape handling in the header.
- W-02 moved Ready for QA -> Done after visual verification (1440/768/360 px screenshots). Progress index 40% -> 42%. Found contrast failures (see X-07, W-11); not blocking W-02.
- Created the living PRD. Adapted the tracker skill from the Self-Learning platform baseline (S0-05 ... S5-04) to the corporate website baseline (W-01 ... W-12).
- Status set from repository evidence: build and typecheck pass; no visual verification yet.
- Added derived gaps FE-GAP-001 to FE-GAP-004.
- W-01 work: moved all `rgba` values to theme tokens; `@font-face` now uses theme weights and `local()` fallbacks; added `public/fonts/README.md`. Status stays Blocked 50% because X-01 (Matimo files) is still missing. `npx tsc -b` and `npm run build` pass. Not verified in a browser.
