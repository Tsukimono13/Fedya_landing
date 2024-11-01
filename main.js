import './style.scss';
import javascriptLogo from './javascript.svg';
import viteLogo from '/vite.svg';

document.querySelector('#app').innerHTML = `
  // <div>
  //   <a href="https://vitejs.dev" target="_blank">
  //     <img src="${viteLogo}" class="logo" alt="Vite logo" />
  //   </a>
  //   <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
  //     <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
  //   </a>
  //   <h1>Hello Vite!</h1>
  //   <div class="card">
  //     <button id="counter" type="button"></button>
  //   </div>
  //   <p class="read-the-docs">
  //     Click on the Vite logo to learn more
  //   </p>
  // </div>
`;

// window.addEventListener('scroll', () => {
//   // Высчитываем процент прокрутки
//   const scrollTop = window.scrollY;
//   const documentHeight =
//     document.documentElement.scrollHeight - window.innerHeight;
//   const scrollPercent = (scrollTop / documentHeight) * 100;

//   // Устанавливаем ширину индикатора загрузки
//   document.querySelector('.loading').style.width = scrollPercent + '%';
// });
