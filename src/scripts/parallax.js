import { gsap } from 'gsap';
import { PASSIVE, rafThrottle } from './utils.js';

// Subtle scroll-driven parallax on the hero portrait — small sin/cos jitter
// in x/y/z synced to scrollY.
//
// quickTo() builds one reusable tween per property instead of allocating a
// fresh gsap.to() on every scroll event, which is what the naive version did
// dozens of times a second.
export function initParallax() {
  const personImage = document.querySelector('.presentation__person');
  if (!personImage) return;

  const options = { duration: 0.1, ease: 'power1.out' };
  const moveX = gsap.quickTo(personImage, 'x', options);
  const moveY = gsap.quickTo(personImage, 'y', options);
  const moveZ = gsap.quickTo(personImage, 'z', options);

  const update = rafThrottle(() => {
    const s = window.scrollY;
    moveX(Math.sin(s * 0.01) * 5);
    moveY(Math.cos(s * 0.01) * 1);
    moveZ(Math.cos(s * 0.01) * 5);
  });

  window.addEventListener('scroll', update, PASSIVE);
}
