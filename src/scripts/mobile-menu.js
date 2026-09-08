// Mobile hamburger menu: opens/closes the .mobile-menu overlay below 1111px,
// hides it entirely above. Click-outside, item click, and viewport-resize all
// close the menu. aria-expanded is kept in sync for screen readers.
const MOBILE_BREAKPOINT = 1111;

export function initMobileMenu() {
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuContainer = document.querySelector('.mobile-menu-container');
  const menuItems = document.querySelectorAll('.mobile-menu li a');
  if (!mobileMenuButton || !mobileMenu || !menuContainer) return;

  let isMenuOpen = false;

  const setLogoSocialsDisplay = (open) => {
    const logo = menuContainer.querySelector('.mobile-header__logo');
    const socials = menuContainer.querySelector('.mobile-header__socials');
    if (logo) logo.style.display = open ? 'none' : 'block';
    if (socials) socials.style.display = open ? 'none' : 'flex';
  };

  const updateMenuVisibility = () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      menuContainer.style.display = 'none';
      closeMenu();
    } else {
      menuContainer.style.display = '';
    }
  };

  const toggleMenu = () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;

    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('hidden', !isMenuOpen);
    mobileMenuButton.classList.toggle('active', isMenuOpen);
    mobileMenuButton.setAttribute('aria-expanded', String(isMenuOpen));
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    menuContainer.classList.toggle('menu-open', isMenuOpen);
    setLogoSocialsDisplay(isMenuOpen);
  };

  const closeMenu = () => {
    isMenuOpen = false;
    mobileMenu.classList.add('hidden');
    mobileMenuButton.classList.remove('active');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuContainer.classList.remove('menu-open');
    setLogoSocialsDisplay(false);
  };

  mobileMenuButton.addEventListener('click', toggleMenu);

  menuItems.forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      const targetSection = document.querySelector(item.getAttribute('href'));
      targetSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    });
  });

  document.addEventListener('click', (event) => {
    if (
      isMenuOpen &&
      !menuContainer.contains(event.target) &&
      !mobileMenuButton.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener('resize', updateMenuVisibility);
  updateMenuVisibility();
}
