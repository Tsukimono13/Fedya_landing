# Theo Ivanov — tattoo artist landing page

Single-page promo site for a tattoo artist working out of Seattle: portfolio
gallery, an illustrated booking guide, FAQ and links to the artist's messengers.
Built as a static page with a preloader and scroll-driven GSAP animations
throughout.

Vanilla JS, no framework and no router — Vite, Sass and GSAP, with Swiper for
the mobile gallery.

## Structure

```
index.html          the entire markup — one page, sections keyed by id
main.js             entry point: imports the styles and calls one init() per module
style.scss          SCSS entry point, @use's the partials in a fixed order

src/data/           content as data — portfolio, FAQ, social links
src/scripts/        behaviour, one module per concern, plus the build plugins
src/styles/         one partial per page section
src/assets/works/   portfolio images

public/             images, icons and fonts served as-is
vite.config.js      build config and the custom plugins it registers
```

`src/scripts/` holds two kinds of file: the browser modules (`carousel.js`,
`mobile-menu.js`, `preloader-timeline.js` and so on) and four Vite plugins that
run at build time — they encode the images to AVIF/WebP, convert the fonts to
WOFF2, and render the gallery, FAQ and social links straight into the HTML
instead of leaving it to JavaScript.

## Commands

```bash
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run lint     # ESLint
npm run format   # Prettier
```
