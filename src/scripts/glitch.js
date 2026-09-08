import { gsap } from 'gsap';

// Background glitch images in the hero — each loops a randomised x/y jitter
// timeline indefinitely. data-speed on the <img> scales the duration.
function glitchEffect(image) {
  const speed = parseFloat(image.getAttribute('data-speed')) || 0.4;

  const x1 = Math.random() * 20 - 10;
  const x2 = Math.random() * 20 - 10;
  const y1 = Math.random() * 12 - 6;
  const y2 = Math.random() * 12 - 6;

  gsap
    .timeline({ repeat: -1, repeatDelay: Math.random() * 0.5 })
    .to(image, { x: x1, duration: speed, ease: 'power2.out' })
    .to(image, { x: x2, duration: speed * 1.5, ease: 'power2.out' })
    .to(image, { x: 0, duration: speed, ease: 'power2.out' })
    .to(image, { y: y1, duration: speed, ease: 'power2.out' })
    .to(image, { y: y2, duration: speed * 1.5, ease: 'power2.out' })
    .to(image, { y: 0, duration: speed, ease: 'power2.out' });
}

export function initGlitches() {
  document.querySelectorAll('.presentation__glitch').forEach(glitchEffect);
}
