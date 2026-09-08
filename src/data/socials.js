// Single source of truth for the 3 social links used in 4 places (mobile
// header, right menu, mobile menu, footer). The rendered markup is injected
// at build time by vite-plugin-static-partials.js so the HTML is fully static
// for SEO — no runtime DOM mutation.
export const socials = [
  {
    key: 'inst',
    label: 'Instagram',
    href: 'https://www.instagram.com/iftattoo/',
  },
  {
    key: 'watsapp',
    label: 'WhatsApp',
    // Long-form URL with explicit type=phone_number — what web.whatsapp.com
    // generates. Matches the variant used in 3/4 of the original blocks.
    href: 'https://api.whatsapp.com/send/?phone=13477512173&text&type=phone_number&app_absent=0',
  },
  {
    key: 'tg',
    label: 'Telegram',
    href: 'https://t.me/rispit',
  },
];

// Per-context structural overrides. Each context produces a distinct outer
// wrapper / item element / class set, matching the original four blocks
// 1:1 so the CSS keeps working unchanged.
const CONTEXTS = {
  'mobile-header': {
    wrap: 'ul',
    wrapClass: 'mobile-header__socials',
    item: 'li',
    extraLinkClass: '',
    includeTitle: false,
  },
  'right-menu': {
    wrap: 'ul',
    wrapClass: '',
    item: 'li',
    extraLinkClass: ' scrolled',
    includeTitle: true,
  },
  'mobile-menu': {
    wrap: 'ul',
    wrapClass: 'mobile-menu__socials',
    item: 'li',
    extraLinkClass: '',
    includeTitle: true,
  },
  footer: {
    wrap: null, // links sit directly inside the existing .footer__links div
    wrapClass: '',
    item: null,
    extraLinkClass: '',
    includeTitle: true,
  },
};

// The values above are repo constants, so this is guarding the next person who
// edits them rather than any live input: an unescaped " in a label or href
// would otherwise break out of its attribute.
function attr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSocials(context) {
  const cfg = CONTEXTS[context];
  if (!cfg) throw new Error(`Unknown socials context: ${context}`);

  const links = socials
    .map(({ key, label, href }) => {
      const titleAttr = cfg.includeTitle ? ` title="${attr(label)}"` : '';
      // rel: noopener is implied for target=_blank in current browsers, but
      // noreferrer additionally stops the destination seeing our URL.
      const link = `<a href="${attr(href)}" target="_blank" rel="noopener noreferrer"${titleAttr} aria-label="${attr(label)}" class="menu__link menu__link--${attr(key)}${cfg.extraLinkClass}"></a>`;
      return cfg.item ? `<${cfg.item}>${link}</${cfg.item}>` : link;
    })
    .join('');

  if (!cfg.wrap) return links;
  const wrapClassAttr = cfg.wrapClass ? ` class="${cfg.wrapClass}"` : '';
  return `<${cfg.wrap}${wrapClassAttr}>${links}</${cfg.wrap}>`;
}
