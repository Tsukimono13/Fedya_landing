import { PASSIVE, rafThrottle } from './utils.js';

// Top scroll-progress bar (.loading) — width tracks scroll position.
//
// The scrollable height is cached rather than read per scroll event: reading
// document.body.scrollHeight forces a synchronous layout, and doing that on
// every scroll tick is one of the cheapest ways to make scrolling janky. It
// only changes when the document reflows, so resize is enough to refresh it.
export function initLoadingBar() {
  const bar = document.querySelector('.loading');
  if (!bar) return;

  let scrollable = 0;

  function measure() {
    scrollable = document.body.scrollHeight - window.innerHeight;
  }

  const paint = rafThrottle(() => {
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${progress}%`;
  });

  const remeasure = () => {
    measure();
    paint();
  };

  measure();
  paint();
  window.addEventListener('scroll', paint, PASSIVE);
  window.addEventListener('resize', remeasure, PASSIVE);
  // Late-loading images change the document height after the initial measure.
  window.addEventListener('load', remeasure);
}
