import { gsap } from 'gsap';

// Preloader/scroll timeline merged from three previously-duplicated GSAP
// matchMedia branches. Per-branch differences are encoded as
// { narrow, desktop, wide } overrides at any leaf or sub-tree.
//
// Branch keys map to the media queries registered in initPreloaderTimeline:
//   narrow  → (max-width: 1509.98px)
//   desktop → (min-width: 1510px) and (max-width: 2023.98px)
//   wide    → (min-width: 2024px)
// The ranges must not touch — see the note on the mm.add() calls below.

const BRANCHES = ['narrow', 'desktop', 'wide'];

// Walks a value tree and replaces any sub-tree whose object keys are exactly
// a subset of BRANCHES with the entry for the active branch. Drops null/
// undefined leaves so e.g. { wide: null } removes the key entirely.
function resolve(value, branch) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => resolve(v, branch));

  const keys = Object.keys(value);
  if (keys.length > 0 && keys.every((k) => BRANCHES.includes(k))) {
    return resolve(value[branch], branch);
  }

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    const r = resolve(v, branch);
    if (r !== null && r !== undefined) out[k] = r;
  }
  return out;
}

const steps = [
  // 1. Preloader logo pulse (identical across branches)
  {
    type: 'to',
    target: '.preloading__logo',
    position: '+=0.1',
    vars: {
      scale: 0.9,
      duration: 0.9,
      repeat: 2,
      yoyo: true,
      ease: 'power1.inOut',
    },
  },
  // 1a. Preloader counter. Both parts sit at absolute position 0 so they run
  //    alongside the logo pulse instead of after it. The pulse occupies
  //    0.1 -> 2.8s (0.9s x 3), and the count is given the same 2.8s, so it
  //    reaches 100 on the exact frame the slide-up below is appended at.
  {
    type: 'fromTo',
    target: '.preloading__counter',
    position: 0,
    from: { opacity: 0 },
    // Fading in also covers the font swap: on a cold load Hatsch Sans may
    // still be in flight for the first frames, and a reflow at opacity 0 is
    // invisible.
    to: { opacity: 1, duration: 0.4, ease: 'power1.out' },
  },
  {
    type: 'counter',
    target: '[data-preloader-counter]',
    position: 0,
    vars: { duration: 2.8, ease: 'power1.inOut' },
  },
  // 2. Preloader slide up (identical)
  {
    type: 'to',
    target: '.preloading',
    vars: { yPercent: -100, duration: 2, ease: 'power2.inOut' },
  },
  // 3. Hero title
  {
    type: 'fromTo',
    target: '.presentation__name__title',
    from: { opacity: 0, y: '100%' },
    to: {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: { narrow: 1.0, desktop: 1.0, wide: 0.8 },
    },
  },
  // 4. Hero subtitle
  {
    type: 'fromTo',
    target: '.presentation__name__details--title',
    from: { opacity: 0, y: '-100%' },
    to: {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: { narrow: 0.6, desktop: 0.6, wide: 0.5 },
    },
  },
  // 5. Left menu in
  {
    type: 'fromTo',
    target: '.menu--left',
    from: { opacity: 0, x: -100 },
    to: {
      opacity: 1,
      x: 0,
      ease: 'power2.out',
      duration: { narrow: 0.6, desktop: 0.6, wide: 0.5 },
    },
  },
  // 6. Right menu in (parallel to left via '<' position)
  {
    type: 'fromTo',
    target: '.menu--right',
    position: '<',
    from: { opacity: 0, x: 100 },
    to: {
      opacity: 1,
      x: 0,
      ease: 'power2.out',
      duration: { narrow: 0.6, desktop: 0.6, wide: 0.5 },
    },
  },
  // 7. Projects title — wide drops scrollTrigger
  {
    type: 'fromTo',
    target: '.title--projects',
    from: { opacity: 0, y: '100%' },
    to: {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: { narrow: 1.0, desktop: 1.0, wide: 0.8 },
      scrollTrigger: {
        narrow: {
          trigger: '.projects',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
        desktop: {
          trigger: '.projects',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
        wide: null,
      },
    },
  },
  // 8. Projects body text — wide drops scrollTrigger
  {
    type: 'fromTo',
    target: '.projects__details__text',
    from: { opacity: 0, y: '100%' },
    to: {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: { narrow: 1.0, desktop: 1.0, wide: 0.8 },
      scrollTrigger: {
        narrow: {
          trigger: '.projects',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
        desktop: {
          trigger: '.projects',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
        wide: null,
      },
    },
  },
  // 9. Projects "see more" link — narrow ends at 'top 0%', desktop at 'top 15%'
  {
    type: 'fromTo',
    target: '.common__link--projects',
    from: { opacity: 0, y: '100%' },
    to: {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: { narrow: 1.0, desktop: 1.0, wide: 0.8 },
      scrollTrigger: {
        narrow: {
          trigger: '.projects',
          start: 'top 30%',
          end: 'top 0%',
          scrub: true,
        },
        desktop: {
          trigger: '.projects',
          start: 'top 30%',
          end: 'top 15%',
          scrub: true,
        },
        wide: null,
      },
    },
  },
  // 10. About title
  {
    type: 'fromTo',
    target: '.title--about',
    from: { opacity: 0, y: '100%' },
    to: {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        narrow: {
          trigger: '.about',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
        desktop: {
          trigger: '.about',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
        wide: {
          trigger: '.about',
          start: 'top 90%',
          end: 'top 40%',
          scrub: true,
        },
      },
    },
  },
  // 11. About body text
  {
    type: 'fromTo',
    target: '.about__details__text',
    from: { opacity: 0, y: '100%' },
    to: {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        narrow: {
          trigger: '.about',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
        desktop: {
          trigger: '.about',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
        wide: {
          trigger: '.about',
          start: 'top 70%',
          end: 'top 30%',
          scrub: true,
        },
      },
    },
  },
  // 12. About link
  {
    type: 'fromTo',
    target: '.about__link',
    from: { opacity: 0, y: '100%' },
    to: {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
      scrollTrigger: {
        narrow: {
          trigger: '.about',
          start: 'top 20%',
          end: 'top 0%',
          scrub: true,
        },
        desktop: {
          trigger: '.about',
          start: 'top 20%',
          end: 'top 0%',
          scrub: true,
        },
        wide: {
          trigger: '.about',
          start: 'top 60%',
          end: 'top 30%',
          scrub: true,
        },
      },
    },
  },
  // 13. About person back layer — desktop animates X, narrow/wide animate Y
  {
    type: 'fromTo',
    target: '.about__person--back',
    from: {
      narrow: { opacity: 0, y: 100, scale: 0.8 },
      desktop: { opacity: 0, x: 100, scale: 0.8 },
      wide: { opacity: 0, y: 100, scale: 0.8 },
    },
    to: {
      narrow: {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 65%',
          end: 'top 10%',
          scrub: true,
        },
      },
      desktop: {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 60%',
          end: 'top 10%',
          scrub: true,
        },
      },
      wide: {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 75%',
          end: 'top 30%',
          scrub: true,
        },
      },
    },
  },
  // 14. About person front layer — same axis split as #13
  {
    type: 'fromTo',
    target: '.about__person--front',
    from: {
      narrow: { opacity: 0, y: 100, scale: 0.8 },
      desktop: { opacity: 0, x: 100, scale: 0.8 },
      wide: { opacity: 0, y: 100, scale: 0.8 },
    },
    to: {
      narrow: {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 45%',
          end: 'top 0%',
          scrub: true,
        },
      },
      desktop: {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 50%',
          end: 'top 0%',
          scrub: true,
        },
      },
      wide: {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 65%',
          end: 'top 20%',
          scrub: true,
        },
      },
    },
  },
  // 15. Booking work image slide-in
  {
    type: 'fromTo',
    target: '.booking__work-img',
    from: { x: '-100%' },
    to: {
      x: 0,
      ease: 'power2.out',
      duration: { narrow: 1.5, desktop: 1.6, wide: 1.5 },
      scrollTrigger: {
        narrow: {
          trigger: '.booking',
          start: 'top 90%',
          end: 'top 35%',
          scrub: true,
        },
        desktop: {
          trigger: '.booking',
          start: 'top 65%',
          end: 'top 40%',
          scrub: true,
        },
        wide: {
          trigger: '.booking',
          start: 'top 90%',
          end: 'top 40%',
          scrub: true,
        },
      },
    },
  },
  // 16. Booking list items
  {
    type: 'fromTo',
    target: '.booking__list__item',
    from: { y: '-100%', opacity: 0 },
    to: {
      y: 0,
      opacity: 1,
      ease: 'power2.out',
      duration: { narrow: 0.6, desktop: 0.4, wide: 0.6 },
      stagger: { narrow: 0.1, desktop: 0.07, wide: 0.1 },
      scrollTrigger: {
        narrow: {
          trigger: '.booking',
          start: 'top 35%',
          end: 'top 10%',
          scrub: true,
        },
        desktop: {
          trigger: '.booking',
          start: 'top 40%',
          end: 'top 20%',
          scrub: true,
        },
        wide: {
          trigger: '.booking',
          start: 'top 60%',
          end: 'top 40%',
          scrub: true,
        },
      },
    },
  },
  // 17. Booking background scale-up — only present in desktop branch originally
  {
    skipIn: ['narrow', 'wide'],
    type: 'fromTo',
    target: '.booking',
    from: { backgroundSize: '100%' },
    to: {
      backgroundSize: '150%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.booking',
        start: 'top 80%',
        end: 'bottom',
        scrub: true,
      },
    },
  },
  // 18. Booking design angle (identical across branches)
  {
    type: 'fromTo',
    target: '.booking__design__angle',
    from: { scale: 0.6 },
    to: {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.booking',
        start: 'middle 30%',
        end: 'bottom 40%',
        scrub: true,
      },
    },
  },
  // 19. Booking design steps — desktop has scrollTrigger.once: true
  {
    type: 'fromTo',
    target: '.booking__design__steps__item',
    from: { x: -200, opacity: 0 },
    to: {
      x: 0,
      opacity: 1,
      ease: 'power2.out',
      duration: { narrow: 0.6, desktop: 0.4, wide: 0.4 },
      stagger: { narrow: 0.2, desktop: 0.06, wide: 0.1 },
      scrollTrigger: {
        narrow: {
          trigger: '.booking',
          start: 'middle 20%',
          end: 'bottom 85%',
          scrub: true,
        },
        desktop: {
          trigger: '.booking',
          start: 'middle 10%',
          end: 'bottom 100%',
          scrub: true,
          once: true,
        },
        wide: {
          trigger: '.booking',
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: true,
        },
      },
    },
  },
  // 20. FAQ title — `from` shape differs (narrow has no y axis at all)
  {
    type: 'fromTo',
    target: '.title--faq',
    from: {
      narrow: { opacity: 0 },
      desktop: { opacity: 0, y: '100%' },
      wide: { opacity: 0, y: 30 },
    },
    to: {
      narrow: {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 70%',
          end: 'top 40%',
          scrub: true,
        },
      },
      desktop: {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 70%',
          end: 'top 40%',
          scrub: true,
        },
      },
      wide: {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 70%',
          end: 'top 40%',
          scrub: true,
        },
      },
    },
  },
  // 21. FAQ items
  {
    type: 'fromTo',
    target: '.faq__item',
    from: { scale: 0.8, opacity: 0 },
    to: {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      stagger: 0.2,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        narrow: {
          trigger: '.faq',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
        },
        desktop: {
          trigger: '.faq',
          start: 'top 90%',
          end: 'bottom 70%',
          scrub: true,
        },
        wide: {
          trigger: '.faq',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
        },
      },
    },
  },
  // 22. Footer titles
  {
    type: 'fromTo',
    target: '.footer .title',
    from: { opacity: 0, y: 50 },
    to: {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.2,
      scrollTrigger: {
        narrow: {
          trigger: '.footer',
          start: 'top 70%',
          end: 'top 50%',
          scrub: true,
        },
        desktop: {
          trigger: '.footer',
          start: 'top 70%',
          end: 'top 50%',
          scrub: true,
        },
        wide: {
          trigger: '.footer',
          start: 'top 80%',
          end: 'top 60%',
          scrub: true,
        },
      },
    },
  },
  // 23. Footer link — absent in narrow; desktop uses y:60, wide uses y:50
  {
    skipIn: ['narrow'],
    type: 'fromTo',
    target: '.common__link--footer',
    from: {
      desktop: { opacity: 0, y: 60 },
      wide: { opacity: 0, y: 50 },
    },
    to: {
      desktop: {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 50%',
          end: 'top 30%',
          scrub: true,
        },
      },
      wide: {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 70%',
          end: 'top 50%',
          scrub: true,
        },
      },
    },
  },
];

// Counts 0 -> 100 into an element's text. The tween runs on a plain object so
// the value gets the same easing as everything else on the timeline; onUpdate
// only formats. Returns a tween even when the element is missing, so the
// timeline keeps its shape.
function counterTween(selector, vars) {
  const el = document.querySelector(selector);
  const state = { value: 0 };
  return gsap.to(state, {
    ...vars,
    value: 100,
    onUpdate: () => {
      if (el) el.textContent = String(Math.round(state.value));
    },
  });
}

export function buildPreloaderTimeline(tl, branch) {
  for (const raw of steps) {
    if (raw.skipIn && raw.skipIn.includes(branch)) continue;
    const step = resolve(raw, branch);
    if (step.type === 'to') {
      tl.to(step.target, step.vars, step.position);
    } else if (step.type === 'fromTo') {
      tl.fromTo(step.target, step.from, step.to, step.position);
    } else if (step.type === 'counter') {
      tl.add(counterTween(step.target, step.vars), step.position);
    }
  }
}

// Creates the shared timeline and registers all three matchMedia branches.
// The active branch's steps get added to `tlLoader`; switching viewport
// re-evaluates which branch is active.
export function initPreloaderTimeline() {
  const tlLoader = gsap.timeline();
  const mm = gsap.matchMedia();

  // The upper bounds stop just short of the next branch's lower bound. With
  // `max-width: 1510px` and `min-width: 1510px` both queries matched at exactly
  // 1510px (and likewise at 2024px), so two branches built into the same
  // timeline: 48 tweens instead of 23, the preloader sliding away twice, and
  // every ScrollTrigger registered in duplicate.
  mm.add('(max-width: 1509.98px)', () =>
    buildPreloaderTimeline(tlLoader, 'narrow'),
  );
  mm.add('(min-width: 1510px) and (max-width: 2023.98px)', () =>
    buildPreloaderTimeline(tlLoader, 'desktop'),
  );
  mm.add('(min-width: 2024px)', () => buildPreloaderTimeline(tlLoader, 'wide'));
}
