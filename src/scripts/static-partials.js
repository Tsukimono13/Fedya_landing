import { renderSocials } from '../data/socials.js';
import { renderFaq, renderFaqJsonLd } from '../data/faq.js';

// Custom Vite plugin that inlines static partials into index.html at build
// (and dev-server) time. Replacing on transformIndexHtml means the served
// HTML is fully static — search engine crawlers and link previews see the
// rendered content without executing JS.
//
// Placeholders in index.html:
//   <!-- SOCIALS:mobile-header -->
//   <!-- SOCIALS:right-menu -->
//   <!-- SOCIALS:mobile-menu -->
//   <!-- SOCIALS:footer -->
//   <!-- FAQ_ITEMS -->
//   <!-- FAQ_JSON_LD -->
export function staticPartials() {
  return {
    name: 'static-partials',
    transformIndexHtml(html) {
      return html
        .replace(/<!--\s*SOCIALS:([\w-]+)\s*-->/g, (_, ctx) =>
          renderSocials(ctx),
        )
        .replace(/<!--\s*FAQ_ITEMS\s*-->/g, () => renderFaq())
        .replace(/<!--\s*FAQ_JSON_LD\s*-->/g, () => renderFaqJsonLd());
    },
  };
}
