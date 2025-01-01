import './style.scss';
import javascriptLogo from './javascript.svg';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

//loading bar
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  requestAnimationFrame(() => {
    document.querySelector('.loading').style.width = `${progress}%`;
  });
}
window.addEventListener('scroll', updateProgressBar);
window.addEventListener('resize', updateProgressBar);
updateProgressBar();

// Faq toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggleButtons = document.querySelectorAll('.faq__toggle');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq__item');
      const faqItemBody = faqItem.querySelector('.faq__item__body');
      const img = button.querySelector('img');

      // Если тело уже открыто, скрываем его, иначе открываем
      if (faqItemBody.style.maxHeight) {
        faqItemBody.style.maxHeight = null;
        img.style.transform = 'rotate(0deg)';
      } else {
        faqItemBody.style.maxHeight = faqItemBody.scrollHeight + 'px';
        img.style.transform = 'rotate(45deg)';
      }
    });
  });
});

// carousel slider
const carouselContainer = document.querySelector('.carousel-container');
const carousel = document.querySelector('.carousel');
const swiperContainer = document.querySelector('.swiper');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const slides = document.querySelectorAll('.carousel-item');

let currentIndex = 0;
const totalSlides = slides.length;

function updateSlides() {
  const isMobile = window.innerWidth <= 1111;

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

  if (isMobile) {
    gsap.to(carouselContainer, {
      x: 0,
      duration: 0.7,
      ease: 'power2.out',
    });
  } else {
    gsap.to(carouselContainer, {
      x: -currentIndex * 33.33 + '%',
      duration: 0.5,
      ease: 'power2.out',
    });
  }
}

prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlides();
});

nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlides();
});

updateSlides();

let swiperInstance = null;

function initializeSwiper() {
  const isMobile = window.innerWidth <= 1111;

  if (isMobile) {
    carousel.style.display = 'none';
    swiperContainer.classList.add('show'); // Используем класс вместо display
    swiperContainer.style.display = 'block';

    if (!swiperInstance) {
      swiperInstance = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        loop: true,
      });
    }
  } else {
    swiperContainer.classList.remove('show');
    swiperContainer.style.display = 'none';
    carousel.style.display = 'block';

    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  }
}

// Инициализация при загрузке страницы и изменении размера экрана
initializeSwiper();
window.addEventListener('resize', () => {
  updateSlides();
  initializeSwiper();
});

//tag animation
gsap.registerPlugin(ScrollTrigger);

const tags = document.querySelector('.tag-wrap');
const numberOfCopies = 3;
for (let i = 0; i < numberOfCopies; i++) {
  const clonedTags = tags.cloneNode(true);
  tags.parentNode.appendChild(clonedTags);
}
gsap.to('.tag-wrap', {
  x: '-100%',
  duration: 26,
  repeat: -1,
  ease: 'linear',
});

// JS для отслеживания прокрутки
const buttons = document.querySelectorAll('.menu__button');
const links = document.querySelectorAll('.scrolled');
const whiteSections = document.querySelectorAll('.about, .faq');
const scrollTopButton = document.createElement('div');

document.body.appendChild(scrollTopButton);

scrollTopButton.classList.add('menu__link', 'menu__link--scroll-top');

function checkScreenWidth() {
  if (window.innerWidth > 1111) {
    scrollTopButton.style.display = 'block';
  } else {
    scrollTopButton.style.display = 'none';
  }
}

checkScreenWidth();
window.addEventListener('resize', checkScreenWidth);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        buttons.forEach((button) => button.classList.add('scrolled'));
        links.forEach((link) => link.classList.add('scrolled'));
        scrollTopButton.classList.add('scrolled');
      } else {
        buttons.forEach((button) => button.classList.remove('scrolled'));
        links.forEach((link) => link.classList.remove('scrolled'));
        scrollTopButton.classList.remove('scrolled');
      }
    });
  },
  { threshold: 0.3 },
);

whiteSections.forEach((section) => observer.observe(section));

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopButton.classList.add('visible');
    } else {
      scrollTopButton.classList.remove('visible');
    }
  });

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});

//scroll to section
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const sectionId = button.className.match(/menu__button--(\w+)/)[1];
    const section = document.querySelector(`#${sectionId}`);

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

const glitchImages = document.querySelectorAll('.presentation__glitch');

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

glitchImages.forEach((image) => {
  glitchEffect(image);
});

// mobile menu
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuContainer = document.querySelector('.mobile-menu-container');
  const loadingElement = document.querySelector('.loading');
  const menuItems = document.querySelectorAll('.mobile-menu li a');

  let isScrolled = false;
  let isMenuOpen = true;

  if (window.innerWidth <= 1111) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      mobileMenuButton.classList.toggle('active');

      // Блокировка прокрутки
      if (isMenuOpen) {
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку
        menuContainer.classList.add('transparent');
        const logo = menuContainer.querySelector('.mobile-header__logo');
        const socials = menuContainer.querySelector('.mobile-header__socials');
        if (logo) logo.style.display = 'none';
        if (socials) socials.style.display = 'none';

        if (loadingElement) loadingElement.style.display = 'none';
      } else {
        document.body.style.overflow = ''; // Разблокируем прокрутку
        menuContainer.classList.remove('transparent');
        const logo = menuContainer.querySelector('.mobile-header__logo');
        const socials = menuContainer.querySelector('.mobile-header__socials');
        if (logo) logo.style.display = 'block';
        if (socials) socials.style.display = 'flex';

        if (loadingElement) loadingElement.style.display = 'block';
      }

      isMenuOpen = !isMenuOpen;
    });

    window.addEventListener('scroll', () => {
      if (!mobileMenu.classList.contains('hidden') && isMenuOpen) return;

      if (window.scrollY > 100) {
        if (!isScrolled) {
          menuContainer.classList.add('fixed');
          mobileMenuButton.classList.add('scrolled');

          // Добавляем логотип, если он не существует
          if (!menuContainer.querySelector('.mobile-header__logo')) {
            const logo = document.createElement('img');
            logo.src = 'assets/icons/Logo.svg';
            logo.alt = 'Logo';
            logo.className = 'mobile-header__logo';
            menuContainer.appendChild(logo);
          }

          // Добавляем соц. ссылки, если их нет
          if (!menuContainer.querySelector('.mobile-header__socials')) {
            const socials = document.createElement('ul');
            socials.className = 'mobile-header__socials';
            socials.innerHTML = `
              <li><a href="https://www.instagram.com/iftattoo/" target="_blank" class="menu__link menu__link--inst"></a></li>
              <li><a href="https://api.whatsapp.com/send/?phone=13477512173" target="_blank" class="menu__link menu__link--watsapp"></a></li>
              <li><a href="https://t.me/rispit" target="_blank" class="menu__link menu__link--tg"></a></li>
            `;
            menuContainer.appendChild(socials);
          }

          isScrolled = true;
        }
      } else {
        if (isScrolled) {
          menuContainer.classList.remove('fixed');
          mobileMenuButton.classList.remove('scrolled');

          // Убираем логотип и социальные ссылки
          const logo = menuContainer.querySelector('.mobile-header__logo');
          const socials = menuContainer.querySelector(
            '.mobile-header__socials',
          );
          if (logo) logo.remove();
          if (socials) socials.remove();

          isScrolled = false;
        }
      }
    });

    menuItems.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();

        const targetSection = document.querySelector(item.getAttribute('href'));

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        mobileMenu.classList.add('hidden');
        mobileMenuButton.classList.remove('active');

        document.body.style.overflow = '';

        const logo = menuContainer.querySelector('.mobile-header__logo');
        const socials = menuContainer.querySelector('.mobile-header__socials');
        if (logo) logo.style.display = 'block';
        if (socials) socials.style.display = 'flex';
        if (loadingElement) loadingElement.style.display = 'block';

        isMenuOpen = true;
        menuContainer.classList.remove('transparent');
      });
    });
  }
});

// preloader
const tlLoader = gsap.timeline();
const mm = gsap.matchMedia();

mm.add('(min-width: 1510px) and (max-width: 2024px)', () => {
  tlLoader
    .to(
      '.preloading__logo',
      {
        scale: 0.9,
        duration: 0.9,
        repeat: 2,
        yoyo: true,
        ease: 'power1.inOut',
      },
      '+=0.1',
    )

    .to('.preloading', {
      yPercent: -100,
      duration: 2,
      ease: 'power2.inOut',
    })
    .fromTo(
      '.presentation__name__title',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
      },
    )
    .fromTo(
      '.presentation__name__details--title',
      {
        opacity: 0,
        y: '-100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
    )
    .add(
      gsap.fromTo(
        '.menu--left',
        {
          opacity: 0,
          x: -100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
      ),
    )
    .add(
      gsap.fromTo(
        '.menu--right',
        {
          opacity: 0,
          x: 100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
      ),
      '<',
    )
    .fromTo(
      '.title--projects',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.projects__details__text',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.common__link--projects',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 30%',
          end: 'top 15%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.title--about',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__details__text',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__link',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 20%',
          end: 'top 0%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__person--back',
      {
        opacity: 0,
        x: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 60%',
          end: 'top 10%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__person--front',
      {
        opacity: 0,
        x: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1.0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 50%',
          end: 'top 0%',
          scrub: true,
        },
      },
    )

    .fromTo(
      '.booking__work-img',
      {
        x: '-100%',
      },
      {
        x: 0,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 65%',
          end: 'top 40%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking__list__item',
      {
        y: '-100%',
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 40%',
          end: 'top 20%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking',
      {
        backgroundSize: '100%',
      },
      {
        backgroundSize: '150%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 80%',
          end: 'bottom',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking__design__angle',
      {
        scale: 0.6,
      },
      {
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
    )
    .fromTo(
      '.booking__design__steps__item',
      {
        x: -200,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: '.booking',
          start: 'middle 10%',
          end: 'bottom 100%',
          scrub: true,
          once: true,
        },
      },
    )
    .fromTo(
      '.title--faq',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        duration: 0.6,
        y: 0,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 70%',
          end: 'top 40%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.faq__item',
      {
        scale: 0,
      },
      {
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
          once: true,
        },
      },
    )
    .fromTo(
      '.footer .title',
      {
        opacity: 0,
        y: 50,
      },
      {
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
    )
    .fromTo(
      '.common__link--footer',
      {
        opacity: 0,
        y: 60,
      },
      {
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
    );
});

mm.add('(max-width: 1510px)', () => {
  tlLoader
    .to(
      '.preloading__logo',
      {
        scale: 0.9,
        duration: 0.9,
        repeat: 2,
        yoyo: true,
        ease: 'power1.inOut',
      },
      '+=0.1',
    )
    .to('.preloading', {
      yPercent: -100,
      duration: 2,
      ease: 'power2.inOut',
    })
    .fromTo(
      '.presentation__name__title',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
      },
    )
    .fromTo(
      '.presentation__name__details--title',
      {
        opacity: 0,
        y: '-100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
    )
    .add(
      gsap.fromTo(
        '.menu--left',
        {
          opacity: 0,
          x: -100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
      ),
    )
    .add(
      gsap.fromTo(
        '.menu--right',
        {
          opacity: 0,
          x: 100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
      ),
      '<',
    )
    .fromTo(
      '.title--projects',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.projects__details__text',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.common__link--projects',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects',
          start: 'top 30%',
          end: 'top 0%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.title--about',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 70%',
          end: 'top 20%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__details__text',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__link',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 20%',
          end: 'top 0%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__person--back',
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 65%',
          end: 'top 10%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__person--front',
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 45%',
          end: 'top 0%',
          scrub: true,
        },
      },
    )

    .fromTo(
      '.booking__work-img',
      {
        x: '-100%',
      },
      {
        x: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 90%',
          end: 'top 40%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking__list__item',
      {
        y: '-100%',
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 35%',
          end: 'top 10%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking__design__angle',
      {
        scale: 0.6,
      },
      {
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
    )
    .fromTo(
      '.booking__design__steps__item',
      {
        x: -200,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.booking',
          start: 'middle 20%',
          end: 'bottom 85%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.title--faq',
      {
        opacity: 0,
      },
      {
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
    )
    .fromTo(
      '.faq__item',
      {
        scale: 0,
      },
      {
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
          once: true,
        },
      },
    )
    .fromTo(
      '.footer .title',
      {
        opacity: 0,
        y: 50,
      },
      {
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
    );
});

mm.add('(min-width: 2024px)', () => {
  tlLoader
    .to(
      '.preloading__logo',
      {
        scale: 0.9,
        duration: 0.9,
        repeat: 2,
        yoyo: true,
        ease: 'power1.inOut',
      },
      '+=0.1',
    )

    .to('.preloading', {
      yPercent: -100,
      duration: 2,
      ease: 'power2.inOut',
    })
    .fromTo(
      '.presentation__name__title',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
    )
    .fromTo(
      '.presentation__name__details--title',
      {
        opacity: 0,
        y: '-100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
    )
    .add(
      gsap.fromTo(
        '.menu--left',
        {
          opacity: 0,
          x: -100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
      ),
    )
    .add(
      gsap.fromTo(
        '.menu--right',
        {
          opacity: 0,
          x: 100,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
      ),
      '<',
    )
    .fromTo(
      '.title--projects',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
    )
    .fromTo(
      '.projects__details__text',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
    )
    .fromTo(
      '.common__link--projects',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      },
    )
    .fromTo(
      '.title--about',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 90%',
          end: 'top 40%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__details__text',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 70%',
          end: 'top 30%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__link',
      {
        opacity: 0,
        y: '100%',
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 60%',
          end: 'top 30%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__person--back',
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 75%',
          end: 'top 30%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.about__person--front',
      {
        opacity: 0,
        y: 100,
        scale: 0.8,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about',
          start: 'top 65%',
          end: 'top 20%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking__work-img',
      {
        x: '-100%',
      },
      {
        x: 0,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 90%',
          end: 'top 40%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking__list__item',
      {
        y: '-100%',
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 60%',
          end: 'top 40%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.booking__design__angle',
      {
        scale: 0.6,
      },
      {
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
    );
  gsap
    .fromTo(
      '.booking__design__steps__item',
      {
        x: -200,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.booking',
          start: 'top 75%',
          end: 'bottom 70%',
          scrub: true,
          once: true,
        },
      },
    )
    .fromTo(
      '.title--faq',
      {
        opacity: 0,
        y: 30,
      },
      {
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
    )
    .fromTo(
      '.faq__item',
      {
        scale: 0,
      },
      {
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.faq',
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: true,
          once: true,
        },
      },
    )
    .fromTo(
      '.footer .title',
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 80%',
          end: 'top 60%',
          scrub: true,
        },
      },
    )
    .fromTo(
      '.common__link--footer',
      {
        opacity: 0,
        y: 50,
      },
      {
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
    );
});

// mm.revert();

const personImage = document.querySelector('.presentation__person');

function handleScroll() {
  const scrollPosition = window.scrollY;
  gsap.to(personImage, {
    x: Math.sin(scrollPosition * 0.01) * 5,
    y: Math.cos(scrollPosition * 0.01) * 1,
    z: Math.cos(scrollPosition * 0.01) * 5,
    duration: 0.1,
    ease: 'power1.out',
  });
}

window.addEventListener('scroll', handleScroll);
