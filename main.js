import './style.scss';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initLoadingBar } from './src/scripts/loading-bar.js';
import { initFaq } from './src/scripts/faq.js';
import { initCarousel } from './src/scripts/carousel.js';
import { initTagAnimation } from './src/scripts/tags.js';
import { initScrollNav } from './src/scripts/scroll-nav.js';
import { initGlitches } from './src/scripts/glitch.js';
import { initMobileMenu } from './src/scripts/mobile-menu.js';
import { initParallax } from './src/scripts/parallax.js';
import { initPreloaderTimeline } from './src/scripts/preloader-timeline.js';

gsap.registerPlugin(ScrollTrigger);

initLoadingBar();
initFaq();
initCarousel();
initTagAnimation();
initScrollNav();
initGlitches();
initMobileMenu();
initParallax();
initPreloaderTimeline();
