import { PASSIVE, rafThrottle } from './utils.js';

// Scroll-driven navigation:
//   1. Watches `.about` and `.faq` (light-bg sections); toggles `.scrolled` on
//      menu buttons / social links / scroll-top so they switch to dark variants.
//   2. Adds a scroll-to-top button that fades in past 400px scroll, hidden on
//      narrow viewports.
//   3. Wires `data-scroll-to="<sectionId>"` on .menu__button to smooth-scroll
//      to the matching section.
const DESKTOP_NAV_BREAKPOINT = 1111;

export function initScrollNav() {
  const buttons = document.querySelectorAll('.menu__button');
  // Selected by position, not by the `scrolled` state class they happen to be
  // rendered with: using the state class as the selector meant dropping the
  // seed in src/data/socials.js would silently stop the colour switching.
  const socialLinks = document.querySelectorAll('.menu--right .menu__link');
  const whiteSections = document.querySelectorAll('.about, .faq');

  const scrollTopButton = document.createElement('button');
  scrollTopButton.type = 'button';
  scrollTopButton.setAttribute('aria-label', 'Scroll to top');
  scrollTopButton.classList.add('menu__link', 'menu__link--scroll-top');
  document.body.appendChild(scrollTopButton);

  function checkScreenWidth() {
    scrollTopButton.style.display =
      window.innerWidth > DESKTOP_NAV_BREAKPOINT ? 'block' : 'none';
  }
  checkScreenWidth();
  window.addEventListener('resize', checkScreenWidth, PASSIVE);

  // Which light sections are currently in view. Applying each entry in turn
  // instead let the last one in the batch win, so a callback carrying both
  // ".about leaving" and ".faq entering" could land on the wrong state.
  const inView = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) inView.add(entry.target);
        else inView.delete(entry.target);
      }
      const op = inView.size > 0 ? 'add' : 'remove';
      buttons.forEach((b) => b.classList[op]('scrolled'));
      socialLinks.forEach((l) => l.classList[op]('scrolled'));
      scrollTopButton.classList[op]('scrolled');
    },
    { threshold: 0.3 },
  );
  whiteSections.forEach((section) => observer.observe(section));

  window.addEventListener(
    'scroll',
    rafThrottle(() => {
      scrollTopButton.classList.toggle('visible', window.scrollY > 400);
    }),
    PASSIVE,
  );

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Section navigation. Reading from data-scroll-to keeps the link decoupled
  // from the menu__button--<id> class, so renaming the class is safe.
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const sectionId = button.dataset.scrollTo;
      if (!sectionId) return;
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
