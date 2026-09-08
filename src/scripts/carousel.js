import { gsap } from 'gsap';
import { debounce } from './utils.js';

// Two switchable galleries:
//   > 1111px   — custom GSAP carousel (`.carousel`)
//   ≤ 1111px   — Swiper (`.swiper`)
// Both are inlined into index.html at build time by works-images.js, so the
// slides already exist in the DOM; this module just wires up navigation +
// viewport-based switching.
const MOBILE_BREAKPOINT = 1111;

// Matches $carousel-transition in src/styles/_projects.scss — the row slide and
// the per-card size/opacity/filter transitions have to share a duration and a
// curve, or the movement finishes before the cards have resized. 'power2.out'
// is the GSAP name for that stylesheet's cubic-bezier.
const SLIDE_DURATION = 0.6;
const SLIDE_EASE = 'power2.out';

// Swiper (~50 KB with its CSS) is only ever instantiated at or below the
// breakpoint, so it is loaded on demand instead of riding in the main bundle.
// The promise is memoised: concurrent resize events share one network request.
let swiperPromise = null;
function loadSwiper() {
  swiperPromise ??= Promise.all([
    import('swiper'),
    import('swiper/css'),
    import('swiper/css/navigation'),
    import('swiper/css/pagination'),
  ]).then(([module]) => module.default);
  return swiperPromise;
}

export function initCarousel() {
  const carouselContainer = document.querySelector('.carousel-container');
  const carousel = document.querySelector('.carousel');
  const swiperContainer = document.querySelector('.swiper');
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  const slides = document.querySelectorAll('.carousel-item');

  if (!carouselContainer || !carousel || !swiperContainer) return;

  const totalSlides = slides.length;
  let currentIndex = 0;
  let swiperInstance = null;
  let swiperPending = false;

  const isMobile = () => window.innerWidth <= MOBILE_BREAKPOINT;

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'next-slide', 'prev-slide');
      if (index === currentIndex) {
        slide.classList.add('active');
      } else if (index === (currentIndex + 1) % totalSlides) {
        slide.classList.add('next-slide');
      } else if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
        slide.classList.add('prev-slide');
      }
    });

    // overwrite: 'auto' kills the in-flight tween instead of running two at
    // once, so clicking faster than the animation retargets smoothly rather
    // than fighting itself.
    gsap.to(carouselContainer, {
      x: isMobile() ? 0 : -currentIndex * 33.33 + '%',
      duration: SLIDE_DURATION,
      ease: SLIDE_EASE,
      overwrite: 'auto',
    });
  }

  async function initializeSwiper() {
    if (!isMobile()) {
      if (swiperInstance) {
        swiperInstance.destroy(true, true);
        swiperInstance = null;
      }
      swiperContainer.style.display = 'none';
      carousel.style.display = 'block';
      return;
    }

    // Swap visibility first so the switch is not gated on the import.
    carousel.style.display = 'none';
    swiperContainer.style.display = 'block';
    if (swiperInstance || swiperPending) return;

    swiperPending = true;
    try {
      const Swiper = await loadSwiper();
      // The viewport may have crossed back over the breakpoint while loading.
      if (!isMobile() || swiperInstance) return;
      // No `pagination`: the markup has no .swiper-pagination element and the
      // design uses the arrow buttons instead, so the option was inert.
      swiperInstance = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: { nextEl: '.custom-next', prevEl: '.custom-prev' },
        loop: true,
      });
    } finally {
      swiperPending = false;
    }
  }

  prevButton?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlides();
  });
  nextButton?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlides();
  });

  document
    .querySelector('.custom-next')
    ?.addEventListener('click', () => swiperInstance?.slideNext());
  document
    .querySelector('.custom-prev')
    ?.addEventListener('click', () => swiperInstance?.slidePrev());

  updateSlides();
  initializeSwiper();

  // Debounced: dragging a window fires resize continuously, and this tears
  // down / rebuilds a Swiper instance and runs a GSAP tween.
  window.addEventListener(
    'resize',
    debounce(() => {
      updateSlides();
      initializeSwiper();
    }),
    { passive: true },
  );
}
