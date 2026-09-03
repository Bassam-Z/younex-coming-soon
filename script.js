const root = document.documentElement;
const views = [...document.querySelectorAll('[data-view]')];
const routeLinks = [...document.querySelectorAll('[data-route]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
const languageToggle = document.querySelector('.language-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const slides = [...document.querySelectorAll('.slide')];
const dotsContainer = document.querySelector('.carousel-dots');
const carousel = document.querySelector('.carousel');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getSavedLanguage() {
  try {
    return localStorage.getItem('younex-language');
  } catch {
    return null;
  }
}

let currentLanguage = getSavedLanguage() || 'ar';
let activeSlide = 0;
let autoplayTimer;
let touchStartX = 0;

function setLanguage(language) {
  currentLanguage = language;
  const isArabic = language === 'ar';

  root.lang = language;
  root.dir = isArabic ? 'rtl' : 'ltr';
  document.title = isArabic
    ? 'Younex Power Center | قريبًا أونلاين'
    : 'Younex Power Center | Online store coming soon';

  document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll('[data-aria-ar][data-aria-en]').forEach((element) => {
    element.setAttribute('aria-label', isArabic ? element.dataset.ariaAr : element.dataset.ariaEn);
  });

  languageToggle.querySelector('span').textContent = isArabic ? 'EN' : 'عربي';
  languageToggle.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
  try {
    localStorage.setItem('younex-language', language);
  } catch {
    // The language switch still works when private browsing blocks storage.
  }
}

function showView(route, updateHash = true) {
  const selectedRoute = views.some((view) => view.dataset.view === route) ? route : 'home';

  views.forEach((view) => {
    const active = view.dataset.view === selectedRoute;
    view.hidden = !active;
    view.classList.toggle('active', active);
  });

  navLinks.forEach((link) => {
    const active = link.dataset.route === selectedRoute;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  if (updateHash && window.location.hash !== `#${selectedRoute}`) {
    history.pushState(null, '', `#${selectedRoute}`);
  }

  primaryNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function renderSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeSlide;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  [...(dotsContainer?.children || [])].forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === activeSlide);
    dot.setAttribute('aria-current', dotIndex === activeSlide ? 'true' : 'false');
  });
}

function restartAutoplay() {
  window.clearInterval(autoplayTimer);
  if (slides.length > 1 && !reduceMotion && document.visibilityState === 'visible') {
    autoplayTimer = window.setInterval(() => renderSlide(activeSlide + 1), 4600);
  }
}

slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'carousel-dot';
  dot.setAttribute('aria-label', `${currentLanguage === 'ar' ? 'الصورة' : 'Slide'} ${index + 1}`);
  dot.addEventListener('click', () => {
    renderSlide(index);
    restartAutoplay();
  });
  dotsContainer?.appendChild(dot);
});

routeLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showView(link.dataset.route);
  });
});

languageToggle.addEventListener('click', () => setLanguage(currentLanguage === 'ar' ? 'en' : 'ar'));
menuToggle.addEventListener('click', () => {
  const open = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelector('[data-carousel="previous"]')?.addEventListener('click', () => {
  renderSlide(activeSlide - 1);
  restartAutoplay();
});
document.querySelector('[data-carousel="next"]')?.addEventListener('click', () => {
  renderSlide(activeSlide + 1);
  restartAutoplay();
});

carousel?.addEventListener('mouseenter', () => window.clearInterval(autoplayTimer));
carousel?.addEventListener('mouseleave', restartAutoplay);
carousel?.addEventListener('focusin', () => window.clearInterval(autoplayTimer));
carousel?.addEventListener('focusout', restartAutoplay);
carousel?.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
carousel?.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) renderSlide(activeSlide + (distance < 0 ? 1 : -1));
  restartAutoplay();
}, { passive: true });

document.addEventListener('visibilitychange', restartAutoplay);
window.addEventListener('popstate', () => showView(window.location.hash.slice(1) || 'home', false));
window.addEventListener('keydown', (event) => {
  if (views.find((view) => !view.hidden)?.dataset.view !== 'home') return;
  if (event.key === 'ArrowLeft') renderSlide(activeSlide - 1);
  if (event.key === 'ArrowRight') renderSlide(activeSlide + 1);
});

document.getElementById('current-year').textContent = new Date().getFullYear();
setLanguage(currentLanguage);
renderSlide(0);
showView(window.location.hash.slice(1) || 'home', false);
restartAutoplay();
