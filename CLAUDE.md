# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the built `dist/` locally
- `npm run lint` — ESLint (flat config in `eslint.config.js`, `js.configs.recommended` + browser globals)
- `npm run format` — Prettier over the whole repo (config in `.prettierrc`: 2-space tabs, single quotes, semicolons, trailing commas)

There are no tests and no type checker configured.

## Architecture

A single-page Vite static site (a tattoo-artist landing page). No component framework, no router, one HTML file.

- [index.html](index.html) — the only markup. Sections are identified by `id` (`header`, `project`, `me`, `session`, `faq`, `footer`) and those ids are the targets of the in-page nav. Menu buttons carry `data-scroll-to="<sectionId>"`; [scroll-nav.js](src/scripts/scroll-nav.js) reads that attribute, so the `menu__button--<id>` class is styling-only and safe to rename.
- [main.js](main.js) — the entry point and nothing else: it imports `style.scss`, registers `ScrollTrigger`, and calls one `init*()` per module in [src/scripts/](src/scripts/). All behaviour lives in those modules; each one queries the DOM when its `init` runs, so new interactive markup must exist in `index.html` (or be inlined by a build plugin) beforehand.
- [style.scss](style.scss) — the single SCSS entrypoint. It `@use`s partials from [src/styles/](src/styles/) in a fixed order (fonts → variables → global → reset → styles → per-section). New section stylesheets must be added here; nothing auto-discovers them.
- [src/data/](src/data/) — content as data: [works.js](src/data/works.js) (portfolio order + alt text), [faq.js](src/data/faq.js) (questions, answer HTML, and the FAQPage JSON-LD generator), [socials.js](src/data/socials.js) (the 3 social links plus per-context markup variants). Editing copy means editing these, not `index.html`.

### Build-time asset processing

Four custom Vite plugins run at build time. The first three fill placeholder comments in `index.html` during `transformIndexHtml`, so the shipped HTML is fully static and crawlers never need to execute JS; the last two also rewrite the emitted CSS in `generateBundle`.

- [static-partials.js](src/scripts/static-partials.js) — `<!-- SOCIALS:<context> -->` (4 contexts), `<!-- FAQ_ITEMS -->`, `<!-- FAQ_JSON_LD -->`.
- [works-images.js](src/scripts/works-images.js) — `<!-- WORKS:carousel -->`, `<!-- WORKS:swiper -->`. Encodes the portfolio PNGs in `src/assets/works/` and inlines the `<picture>` markup with intrinsic `width`/`height`. Assets are hashed.
- [site-images.js](src/scripts/site-images.js) — `<!-- PRELOAD:hero -->`. Encodes every PNG under `public/assets/images/`, wraps matching `<img src="assets/images/…">` tags in `<picture>`, and appends an `image-set()` twin to every CSS `background-image` that points at one. Assets keep stable unhashed names, matching how the rest of `public/` is served.

- [fonts-woff2.js](src/scripts/fonts-woff2.js) — converts every `.otf`/`.ttf` in `public/assets/fonts/` to WOFF2 (~70% smaller) and prepends it to the `@font-face` `src` list in the built CSS. The original stays as the second entry for the sub-2% of browsers without WOFF2, which therefore never download the WOFF2.

Both image plugins share [image-encode.js](src/scripts/image-encode.js). Things that are easy to break:

1. Assets are emitted with an explicit `fileName` (and, in `works-images.js`, a self-computed content hash) — **not** a Rollup `name`. Vite runs `transformIndexHtml` before Rollup finalises hashed asset names, so `getFileName()` throws there. Don't "simplify" it back to `name` + `getFileName()`.
2. Both plugins no-op their encoding in dev (`config.command !== 'build'`), because no `.avif`/`.webp` exist on disk — emitting `<source>` tags there would 404. Keep those branches; they also keep dev start fast.
3. Source PNGs are never modified or replaced. They remain the `<img src>` and the first `background-image` declaration, so a browser with neither AVIF nor WebP still renders the page. `encodeVariants()` drops any variant heavier than its source and orders the rest smallest-first, because browsers take the first `<source>`/`image-set()` entry they support and AVIF is not always the smaller one.
4. `picture { display: contents }` in [\_global.scss](src/styles/_global.scss) keeps the build-time wrapper out of the box tree, so layouts written against the bare `<img>` keep working. Don't remove it.
5. `fonts-woff2.js` wraps `compress()`'s return value in `Buffer.from()`. wawoff2 returns a `Uint8Array` that is a view into its 16 MB WASM heap, and Rollup serialises assets from the underlying `ArrayBuffer` — passing the view through emits a file of exactly the right size filled with the wrong bytes. It fails silently; the only symptom is a font that does not render.

Adding a work = drop the PNG in `src/assets/works/` and add a `{ file, alt }` entry to [works.js](src/data/works.js). `alt` should describe what the tattoo depicts (subject, placement, style) — that text is the main ranking signal for Google Images.

Adding a site image = drop the PNG in `public/assets/images/`; it is picked up automatically. Add an entry to [images.js](src/data/images.js) only to downscale it (`maxWidth`, ~2x the largest CSS width it is painted at) or to move the LCP `preload` marker.

### External libraries

- **GSAP + ScrollTrigger** — npm dependencies, imported as ES modules. `gsap.registerPlugin(ScrollTrigger)` happens once in `main.js`. There are no CDN `<script>` tags in `index.html`.
- **Swiper** — npm dependency, **dynamically** imported in [carousel.js](src/scripts/carousel.js) (with its three CSS files) the first time the viewport is at or below 1111px. That keeps ~68 KB of JS and ~13 KB of CSS out of the main bundle on desktop; the memoised `loadSwiper()` promise is what stops concurrent resize events from racing. Don't turn it back into a static import.
- **Sass** — dev dependency, consumed by Vite from the `.scss` import in `main.js`.
- **sharp** / **wawoff2** — dev dependencies, used only by the build plugins.
- **@fontsource-variable/roboto** — self-hosted Roboto. [\_fonts.scss](src/styles/_fonts.scss) declares one `@font-face` pointing at the package's latin _variable_ file via a bare specifier that Vite resolves and hashes. One 42 KB file covers every weight the site uses; five static instances would be ~110 KB, and the old `fonts.googleapis.com` `<link>` cost a render-blocking request to a third-party origin. Don't split it back into per-weight faces.

### Responsive behaviour is JS-driven, not just CSS

Two viewport-driven behaviours must stay in sync with the SCSS breakpoints:

1. `1111px` — the carousel/Swiper switch ([carousel.js](src/scripts/carousel.js)), the hamburger menu ([mobile-menu.js](src/scripts/mobile-menu.js)), and the scroll-to-top button ([scroll-nav.js](src/scripts/scroll-nav.js)). Each declares its own `const`; change all three together. Above 1111px a custom GSAP carousel is used; at/below it Swiper is initialised and the carousel hidden. Both markup variants exist in `index.html` at once and are toggled via `display`.
2. [preloader-timeline.js](src/scripts/preloader-timeline.js) drives three GSAP `matchMedia` branches — `narrow` (`max-width: 1509.98px`), `desktop` (`1510px–2023.98px`), `wide` (`min-width: 2024px`). The upper bounds deliberately stop short of the next lower bound: when the ranges shared an endpoint, two branches matched at exactly 1510px and 2024px and both built into the same timeline (48 tweens instead of 23, the preloader sliding away twice, duplicate ScrollTriggers). They were once three duplicated copies; now there is one declarative timeline where per-branch differences are `{ narrow, desktop, wide }` overrides at any leaf or sub-tree, resolved by `resolve()`. Add a branch override rather than forking the timeline.

### Assets

- `src/assets/works/` — portfolio PNGs, processed and hashed by `works-images.js`.
- `public/assets/images/` — page images, encoded to AVIF/WebP by `site-images.js` (the PNGs still ship as fallbacks).
- `public/` — everything else, served as-is with no hashing. HTML references these with document-relative paths (`assets/icons/Logo.svg`), SCSS with root-absolute ones (`url("/assets/images/background_main.png")`). SCSS `url()`s **must** be root-absolute: a relative one resolves against the built CSS at `/assets/index-*.css` and 404s. SVG icons are referenced from both HTML `<img>` and SCSS `background-image` — when renaming an icon, grep both.

### SEO

The `<head>` of `index.html` carries canonical, Open Graph and Twitter tags, plus a Person JSON-LD block; the FAQPage JSON-LD is generated from `src/data/faq.js`. Constraints worth knowing before editing:

- The site is served at `https://usa.tattoo/seattlebooking/`; the domain root 301s there. That URL is hardcoded in `<link rel="canonical">`, `og:url`, the absolute `og:image`/`twitter:image` URLs, the Person JSON-LD `image` (inside a `<script>`, so `base` never rewrites it), and `base` in [vite.config.js](vite.config.js). Change them together.
- `og:image` and `twitter:image` **must** stay absolute (scheme + host). Scrapers do not resolve relative paths, and a relative value silently yields no preview.
- The hero portrait (`.presentation__person`) is the LCP element: eager, `fetchpriority="high"`, and preloaded from `<head>` via the `<!-- PRELOAD:hero -->` placeholder. Never give it `loading="lazy"`.
- Decorative images (glitches, corner angles, logos, the FAQ toggle icon) intentionally carry `alt=""`.
- `robots.txt` and `sitemap.xml` are **not** in this repo. Both live at the domain root, outside the deploy target, and are edited by hand in cPanel: `https://usa.tattoo/robots.txt` points at `https://usa.tattoo/sitemap.xml`, which lists the landing page. A copy under `/seattlebooking/` would be a duplicate that crawlers ignore — robots.txt is only ever read from the host root. Bump the sitemap's `<lastmod>` after a content deploy.
- `base` in [vite.config.js](vite.config.js) is `'/seattlebooking/'` because the build is uploaded into that directory, not the host root. Vite prefixes the emitted `<script>`/`<link>` tags, the root-absolute `url()`s in SCSS, and the asset URLs the image/font plugins generate (they all read `config.base`). Document-relative paths in `index.html` (`src="assets/icons/Logo.svg"`) resolve correctly on their own and are left alone.

### Scroll and resize handlers

Every scroll listener is `{ passive: true }` and goes through `rafThrottle` from [utils.js](src/scripts/utils.js); resize handlers that do real work use `debounce`. Two specific traps that were fixed and should not come back:

- [loading-bar.js](src/scripts/loading-bar.js) caches the scrollable height. Reading `document.body.scrollHeight` inside a scroll handler forces a synchronous layout on every tick.
- [parallax.js](src/scripts/parallax.js) uses `gsap.quickTo()`. Calling `gsap.to()` from a scroll handler allocates a fresh tween dozens of times a second.

### Theming

CSS custom properties for the palette live in [src/styles/\_variables.scss](src/styles/_variables.scss) on `:root` (`--main-text-color`, `--assent-color`, `--assent-bright-color`, `--background`, `--link-btn-color`, `--added-color`, `--bg-color-light`, `--faq-color-bg`). Use these instead of hardcoding hex values.
