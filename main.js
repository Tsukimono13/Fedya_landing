import './style.scss';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';

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

      document.querySelectorAll('.faq__item').forEach((item) => {
        const body = item.querySelector('.faq__item__body');
        const icon = item.querySelector('.faq__toggle img');
        if (body && item !== faqItem) {
          body.style.maxHeight = null;
          icon.style.transform = 'rotate(0deg)';
        }
      });

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

//carousel slider
const carouselContainer = document.querySelector('.carousel-container');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const slides = document.querySelectorAll('.carousel-item');

let currentIndex = 0;
const totalSlides = slides.length;

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

  gsap.to(carouselContainer, {
    x: -currentIndex * 33.33 + '%',
    duration: 0.5,
    ease: 'power2.out',
  });
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

//tag animation
gsap.registerPlugin(ScrollTrigger);

const tags = document.querySelector('.tag-wrap');
const clonedTags = tags.cloneNode(true);
tags.parentNode.appendChild(clonedTags);

gsap.to('.tag-wrap', {
  x: '-100%',
  duration: 14,
  repeat: -1,
  ease: 'linear',
});

// JS для отслеживания прокрутки
const buttons = document.querySelectorAll('.menu__button');
const links = document.querySelectorAll('.scrolled');
const whiteSections = document.querySelectorAll('.about, .faq');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        buttons.forEach((button) => button.classList.add('scrolled'));
        links.forEach((link) => link.classList.add('scrolled'));
      } else {
        buttons.forEach((button) => button.classList.remove('scrolled'));
        links.forEach((link) => link.classList.remove('scrolled'));
      }
    });
  },
  { threshold: 0.3 },
);

whiteSections.forEach((section) => observer.observe(section));

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


