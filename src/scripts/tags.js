import { gsap } from 'gsap';

// Endless horizontal marquee of .tag-wrap. The original wrap is cloned 3x
// to fill the viewport width, then translated -100% in a linear loop.
export function initTagAnimation() {
  const tags = document.querySelector('.tag-wrap');
  if (!tags) return;

  const numberOfCopies = 3;
  for (let i = 0; i < numberOfCopies; i++) {
    tags.parentNode.appendChild(tags.cloneNode(true));
  }

  gsap.to('.tag-wrap', {
    x: '-100%',
    duration: 26,
    repeat: -1,
    ease: 'linear',
  });
}
