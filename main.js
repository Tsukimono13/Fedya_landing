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
const marqueeText = document.querySelector('.marquee-text');
const marqueeContainer = document.querySelector('.marquee-container');

// Получаем ширину контейнера и текста
const containerWidth = marqueeContainer.offsetWidth;
const textWidth = marqueeText.offsetWidth;

// Анимация с GSAP: перемещение текста слева направо
gsap.fromTo(
  marqueeText, // Элемент для анимации
  { x: containerWidth }, // Начальное положение: за правым краем контейнера
  { 
    x: -textWidth, // Конечное положение: за левым краем контейнера
    duration: 10,  // Длительность анимации
    ease: "linear", // Постоянная скорость
    repeat: -1, // Бесконечное повторение
    delay: 1 // Задержка перед началом анимации
  }
);