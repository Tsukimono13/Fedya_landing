import { debounce } from './utils.js';

// FAQ accordion. Open state lives in the `open` class on the body and
// `rotated` on the +/- icon, so the styling stays in _faq.scss; the inline
// max-height is only the animation target, since CSS cannot transition to
// `auto`.
export function initFaq() {
  const toggles = document.querySelectorAll('.faq__toggle');
  if (toggles.length === 0) return;

  const openBodies = () => document.querySelectorAll('.faq__item__body.open');

  toggles.forEach((button) => {
    button.addEventListener('click', () => {
      const body = button
        .closest('.faq__item')
        ?.querySelector('.faq__item__body');
      if (!body) return;

      const isOpen = body.classList.toggle('open');
      button.querySelector('img')?.classList.toggle('rotated', isOpen);
      button.setAttribute('aria-expanded', String(isOpen));
      body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : '';
    });
  });

  // An answer left open across a resize keeps the pixel height it was measured
  // at, so it gets clipped once the text reflows to more lines (or leaves a
  // gap on fewer). Re-measure whatever is open when the width settles.
  window.addEventListener(
    'resize',
    debounce(() => {
      openBodies().forEach((body) => {
        body.style.maxHeight = `${body.scrollHeight}px`;
      });
    }),
    { passive: true },
  );
}
