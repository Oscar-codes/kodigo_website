# Translating Bootstrap, Tailwind, HTML and CSS to styled-components

Project tokens live in `src/styles/theme.ts`. Breakpoints: sm 576, md 768, lg 992, xl 1200 (they match Bootstrap's). `theme.space(n)` = `n * 0.25rem`.

## Breakpoints

| Source | Equivalent in Kodigo |
|---|---|
| Bootstrap `sm/md/lg/xl` (576/768/992/1200) | `media.up("sm" \| "md" \| "lg" \| "xl")` |
| Bootstrap `d-lg-none` | `${media.up("lg")} { display: none; }` |
| Bootstrap `d-none d-lg-block` | `display: none; ${media.up("lg")} { display: block; }` |
| Tailwind `md:` (768) | `media.up("md")` |
| Tailwind `lg:` (1024) | closest token is `lg` (992). Check the visual need; do not add a token silently |
| Tailwind `sm:` (640) | closest token is `sm` (576). Same caution |

Mobile-first: write the base style for small screens, then `media.up(...)`.

## Spacing (careful: the scales differ)

| Source | Value | Kodigo |
|---|---|---|
| Tailwind `p-4`, `gap-4`, `m-4` | 1rem | `theme.space(4)` |
| Tailwind `p-1` ... `p-12` | n * 0.25rem | `theme.space(n)` |
| Bootstrap `p-1`, `p-2`, `p-3`, `p-4`, `p-5` | 0.25, 0.5, 1, 1.5, 3 rem | `space(1)`, `space(2)`, `space(4)`, `space(6)`, `space(12)` |
| Eduhall `w-36`, `h-52`, `pe-48` | N / 16 rem (`w-36` = 2.25rem) | `theme.space(N/4)` or a literal if no token fits |

## Layout

| Source | styled-components |
|---|---|
| Bootstrap `.container` | `Container` from `components/ui/Container` |
| Eduhall `.container--xl` (1760px) | Do not replicate; Kodigo max width is `theme.layout.maxWidth` (1200px). Ask before widening |
| Bootstrap `.row` + `.col-md-4` | CSS Grid: `display: grid; ${media.up("md")} { grid-template-columns: repeat(3, 1fr); }` |
| Bootstrap `.d-flex .justify-content-between .align-items-center` / Eduhall `.flex-between` | `display: flex; justify-content: space-between; align-items: center;` |
| Eduhall `.flex-align` | `display: flex; align-items: center;` |
| Eduhall `.flex-center` | `display: flex; justify-content: center; align-items: center;` |
| Tailwind `grid grid-cols-3 gap-6` | `display: grid; grid-template-columns: repeat(3, 1fr); gap: ${theme.space(6)};` |

## Components

| Source | Kodigo |
|---|---|
| `.btn .btn-primary` | `ButtonLink` (`variant="primary"`) |
| `.btn-outline-*` | `ButtonLink` (`variant="ghost"`) |
| `.card` | `Card` from `components/ui/Card` |
| `.navbar`, Eduhall HeaderOne | `components/layout/Header` |
| `.modal`, `.dropdown`, `.collapse` (Bootstrap JS) | Build with React state + ARIA; never import Bootstrap JS |
| Slick/AOS/lightgallery/jQuery plugins | Not used. If a carousel is truly required, ask and justify a dependency |
| Phosphor / Remix icon fonts | Replace with inline SVG (thin stroke, lilac/white); icon fonts are not allowed |

## Colors and typography

- Never copy a source hex. Map to a token by role: page `bg`, alternating sections `surface`, cards `white` with `border`, headings `heading`, body `text`, secondary text `textMuted`, actions `main` (`mainHover`), tags `main50`/`greenSoft`/`orangeSoft`/`yellowSoft` with their dark text variants, banner and footer `navy`.
- Eduhall colors map to Kodigo tokens: `main-600` -> `main` (violet `#4B4AF1`), `main-25` -> `surface`, `neutral-700` -> `heading`, `neutral-30` -> `border`, `neutral-900` -> `navy`, `main-two-*` (orange) and `main-three-*` (green) -> `orange*`/`green*` (soft backgrounds only), `yellow-600` -> `yellow`. Choose by role, not by value.
- Font weights: titles `theme.weights.bold`, buttons/labels `theme.weights.semibold`, body `theme.weights.regular`.

## Conversion procedure

1. Identify the section's role and replace markup with semantic elements (`header`, `nav`, `section`, `ul/li`, `article`, `button`, `a`).
2. Extract text and lists to `src/data/` when they repeat or are content.
3. Create one styled component per meaningful element; avoid styling by descendant selectors beyond one level.
4. Replace every class and inline style with theme tokens.
5. Replace behavior (jQuery/Bootstrap JS) with React state; add ARIA.
6. Remove `!important`, utility class chains and unused markup.

## Example

Bootstrap/Eduhall input:

```html
<div class="row">
  <div class="col-md-4"><div class="card p-3"><h5>Título</h5><p>Texto</p></div></div>
</div>
```

Kodigo output:

```tsx
const Grid = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(5)};
  ${media.up("md")} { grid-template-columns: repeat(3, 1fr); }
`;
// <Grid>{items.map((i) => <Card as="li" key={i.id}><h3>{i.title}</h3><p>{i.text}</p></Card>)}</Grid>
```
