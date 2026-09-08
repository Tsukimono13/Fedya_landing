// Small scheduling helpers shared by the scroll/resize-driven modules.

// Runs `fn` at most once per animation frame. Scroll and resize fire far more
// often than the compositor paints, so anything that writes styles from those
// events should go through this.
export function rafThrottle(fn) {
  let frame = 0;
  return (...args) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      fn(...args);
    });
  };
}

// Runs `fn` once the events stop for `wait` ms. For resize handlers that do
// real work (tearing down a carousel, re-running a timeline) rather than a
// cheap style write.
export function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

// Scroll listeners must never block the compositor.
export const PASSIVE = { passive: true };
