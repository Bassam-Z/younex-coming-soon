function legacyRouteTarget(hash) {
  let route = '';
  try { route = decodeURIComponent(String(hash || '').replace(/^#/, '')); } catch { route = String(hash || '').replace(/^#/, ''); }
  if (route === 'home') return '/';
  if (route === 'products') return '/products/';
  if (route === 'services') return '/services/';
  if (route === 'about') return '/about/';
  if (route.startsWith('category/')) return `/products/${encodeURIComponent(route.split('/')[1] || '')}/`;
  if (route.startsWith('product/')) return `/products/${encodeURIComponent(route.split('/')[1] || '')}/`;
  return '';
}

const legacyTarget = legacyRouteTarget(window.location.hash);
if (legacyTarget) window.location.replace(`${legacyTarget}${window.location.search}`);
if (!legacyTarget && window.location.hash === '#main-content') {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  window.requestAnimationFrame(() => document.getElementById('main-content')?.scrollIntoView({ behavior: 'auto', block: 'start' }));
}

const root = document.documentElement;
const languageToggle = document.querySelector('.language-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const carousel = document.querySelector('.carousel');
const carouselFrame = document.querySelector('.carousel-frame');
const dotsContainer = document.querySelector('.carousel-dots');
const catalog = window.YOUNEX_CATALOG || { products: [] };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentLanguage = getSavedLanguage() || 'ar';
let slides = [];
let activeSlide = 0;
let autoplayTimer;
let touchStartX = 0;
let suppressCarouselClick = false;

function getSavedLanguage() {
  try { return localStorage.getItem('younex-language'); } catch { return null; }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function selectCarouselProducts(products, limit = 8) {
  const groups = [...new Set(products.map((product) => product.category))]
    .map((category) => shuffle(products.filter((product) => product.category === category)));
  const selected = [];
  while (selected.length < limit && groups.some((group) => group.length)) {
    shuffle(groups.filter((group) => group.length)).forEach((group) => {
      if (selected.length < limit && group.length) selected.push(group.pop());
    });
  }
  return shuffle(selected);
}

function homepageSlideMarkup(product, index) {
  const arabicName = product.name?.ar || product.model;
  const englishName = product.name?.en || product.model;
  const loadAttributes = index === 0 ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  return `<article class="slide${index === 0 ? ' is-active' : ''}" aria-hidden="${index === 0 ? 'false' : 'true'}">
    <a class="slide-link" href="/products/${escapeHtml(product.slug)}/" data-aria-ar="عرض تفاصيل ${escapeHtml(arabicName)} ${escapeHtml(product.model)}" data-aria-en="View ${escapeHtml(product.model)} ${escapeHtml(englishName)} details">
      <img src="${escapeHtml(product.images[0])}" alt="${escapeHtml(arabicName)} ${escapeHtml(product.model)}" data-alt-ar="${escapeHtml(arabicName)} ${escapeHtml(product.model)}" data-alt-en="${escapeHtml(product.model)} ${escapeHtml(englishName)}" width="900" height="900" ${loadAttributes} decoding="async">
      <span class="slide-cta" data-ar="عرض المنتج" data-en="View product">عرض المنتج</span>
    </a>
  </article>`;
}

function setLanguage(language) {
  currentLanguage = language;
  const arabic = language === 'ar';
  root.lang = language;
  root.dir = arabic ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
    element.textContent = element.dataset[language];
  });
  document.querySelectorAll('[data-aria-ar][data-aria-en]').forEach((element) => {
    element.setAttribute('aria-label', element.dataset[arabic ? 'ariaAr' : 'ariaEn']);
  });
  document.querySelectorAll('[data-alt-ar][data-alt-en]').forEach((element) => {
    element.alt = element.dataset[arabic ? 'altAr' : 'altEn'];
  });
  if (languageToggle) {
    languageToggle.querySelector('span').textContent = arabic ? 'EN' : 'عربي';
    languageToggle.setAttribute('aria-label', arabic ? 'Switch to English' : 'التبديل إلى العربية');
  }
  const title = document.body.dataset[arabic ? 'titleAr' : 'titleEn'];
  if (title) document.title = title;
  [...(dotsContainer?.children || [])].forEach((dot, index) => {
    dot.setAttribute('aria-label', `${arabic ? 'الصورة' : 'Slide'} ${index + 1}`);
  });
  try { localStorage.setItem('younex-language', language); } catch { /* Optional preference. */ }
}

function renderSlide(index) {
  if (!slides.length) return;
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeSlide;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  [...(dotsContainer?.children || [])].forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === activeSlide);
    dot.setAttribute('aria-current', dotIndex === activeSlide ? 'true' : 'false');
  });
  const nextImage = slides[(activeSlide + 1) % slides.length]?.querySelector('img');
  if (nextImage) nextImage.loading = 'eager';
}

function restartAutoplay() {
  window.clearInterval(autoplayTimer);
  if (slides.length > 1 && !reduceMotion && document.visibilityState === 'visible') {
    autoplayTimer = window.setInterval(() => renderSlide(activeSlide + 1), 5000);
  }
}

if (carouselFrame && catalog.products.length) {
  carouselFrame.innerHTML = selectCarouselProducts(catalog.products).map(homepageSlideMarkup).join('');
  slides = [...carouselFrame.querySelectorAll('.slide')];
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.addEventListener('click', () => { renderSlide(index); restartAutoplay(); });
    dotsContainer?.appendChild(dot);
  });
}

document.addEventListener('click', (event) => {
  const skipLink = event.target.closest('.skip-link');
  if (skipLink) {
    event.preventDefault();
    const target = document.getElementById('main-content');
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  }
});

languageToggle?.addEventListener('click', () => setLanguage(currentLanguage === 'ar' ? 'en' : 'ar'));
menuToggle?.addEventListener('click', () => {
  const open = primaryNav?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
});
primaryNav?.addEventListener('click', () => {
  primaryNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
});
document.querySelector('[data-carousel="previous"]')?.addEventListener('click', () => { renderSlide(activeSlide - 1); restartAutoplay(); });
document.querySelector('[data-carousel="next"]')?.addEventListener('click', () => { renderSlide(activeSlide + 1); restartAutoplay(); });
carousel?.addEventListener('mouseenter', () => window.clearInterval(autoplayTimer));
carousel?.addEventListener('mouseleave', restartAutoplay);
carousel?.addEventListener('focusin', () => window.clearInterval(autoplayTimer));
carousel?.addEventListener('focusout', restartAutoplay);
carousel?.addEventListener('click', (event) => {
  if (suppressCarouselClick && event.target instanceof Element && event.target.closest('.slide-link')) event.preventDefault();
}, true);
carousel?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
  suppressCarouselClick = false;
}, { passive: true });
carousel?.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 45) {
    suppressCarouselClick = true;
    renderSlide(activeSlide + (distance < 0 ? 1 : -1));
    window.setTimeout(() => { suppressCarouselClick = false; }, 400);
  }
  restartAutoplay();
}, { passive: true });

document.addEventListener('visibilitychange', restartAutoplay);
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') renderSlide(activeSlide - 1);
  if (event.key === 'ArrowRight') renderSlide(activeSlide + 1);
});

const currentYear = document.getElementById('current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();
setLanguage(currentLanguage);
renderSlide(0);
restartAutoplay();
