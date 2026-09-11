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
const catalogContent = document.getElementById('catalog-content');
const catalogIntro = document.getElementById('catalog-intro');
const catalog = window.YOUNEX_CATALOG || { categories: [], products: [] };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentLanguage = getSavedLanguage() || 'ar';
let currentRoute = 'home';
let activeSlide = 0;
let autoplayTimer;
let touchStartX = 0;
let activeProductImage = 0;
let productTouchStartX = 0;

function getSavedLanguage() {
  try { return localStorage.getItem('younex-language'); } catch { return null; }
}

function localized(value) {
  return value?.[currentLanguage] || value?.ar || value?.en || '';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function categoryById(id) {
  return catalog.categories.find((category) => category.id === id);
}

function productBySlug(slug) {
  return catalog.products.find((product) => product.slug === slug);
}

function categoryIcon(id) {
  const icons = {
    corded: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 11h5l-1 9 8-12h-5V2Z"></path></svg>',
    cordless: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="6" width="14" height="15" rx="2"></rect><path d="M9 3h6v3M10 11h4M12 9v4"></path></svg>',
    generators: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2"></rect><circle cx="9" cy="12.5" r="3"></circle><path d="M15 11h3M15 14h3M7 3h10v3"></path></svg>',
    'water-pumps': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2s6 6.6 6 12a6 6 0 1 1-12 0c0-5.4 6-12 6-12Z"></path><path d="M9 16c.7 1.3 1.7 2 3 2"></path></svg>'
  };
  return icons[id] || '';
}

function updateDocumentTitle() {
  if (currentRoute.startsWith('product/')) {
    const product = productBySlug(currentRoute.split('/')[1]);
    if (product) { document.title = `${product.model} | Younex Power Center`; return; }
  }
  if (currentRoute.startsWith('category/')) {
    const category = categoryById(currentRoute.split('/')[1]);
    if (category) { document.title = `${localized(category.name)} | Younex Power Center`; return; }
  }
  document.title = currentLanguage === 'ar'
    ? 'مركز يونكس للمعدات والطاقة في درعا | Younex Power Center'
    : 'Younex Power Center in Daraa | Power Tools, Generators & Water Pumps';
}

function setLanguage(language) {
  currentLanguage = language;
  const isArabic = language === 'ar';
  root.lang = language;
  root.dir = isArabic ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-ar][data-en]').forEach((element) => {
    element.textContent = element.dataset[language];
  });
  document.querySelectorAll('[data-aria-ar][data-aria-en]').forEach((element) => {
    element.setAttribute('aria-label', isArabic ? element.dataset.ariaAr : element.dataset.ariaEn);
  });
  languageToggle.querySelector('span').textContent = isArabic ? 'EN' : 'عربي';
  languageToggle.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
  try { localStorage.setItem('younex-language', language); } catch { /* Storage may be blocked. */ }
  renderCatalogRoute(currentRoute);
  updateDocumentTitle();
}

function showRoute(route, updateHash = true) {
  const catalogRoute = route === 'products' || route.startsWith('category/') || route.startsWith('product/');
  const selectedView = catalogRoute ? 'products' : views.some((view) => view.dataset.view === route) ? route : 'home';
  currentRoute = catalogRoute ? route : selectedView;

  views.forEach((view) => {
    const active = view.dataset.view === selectedView;
    view.hidden = !active;
    view.classList.toggle('active', active);
  });
  navLinks.forEach((link) => {
    const active = link.dataset.route === selectedView;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (selectedView === 'products') renderCatalogRoute(currentRoute);
  if (updateHash && window.location.hash !== `#${currentRoute}`) history.pushState(null, '', `#${currentRoute}`);
  updateDocumentTitle();
  primaryNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

function renderCategories() {
  if (!catalogContent || !catalogIntro) return;
  catalogIntro.hidden = false;
  catalogContent.innerHTML = `<div class="category-grid">${catalog.categories.map((category) => {
    const count = catalog.products.filter((product) => product.category === category.id).length;
    const soon = category.status === 'soon';
    return `<a class="category-card${soon ? ' is-soon' : ''}" href="/products/${category.id}/" data-catalog-route="category/${category.id}">
      <div class="category-media">
        ${category.cover ? `<img src="${category.cover}" alt="${escapeHtml(localized(category.name))}" loading="lazy">` : `<div class="category-icon">${categoryIcon(category.id)}</div>`}
        <span class="category-status ${soon ? 'soon' : 'available'}">${soon ? (currentLanguage === 'ar' ? 'قريبًا' : 'Coming soon') : (currentLanguage === 'ar' ? `${count} منتج` : `${count} products`)}</span>
      </div>
      <div class="category-copy"><h2>${escapeHtml(localized(category.name))}</h2><p>${escapeHtml(localized(category.description))}</p><span class="category-link">${currentLanguage === 'ar' ? 'استعرض القسم' : 'Explore category'} <b aria-hidden="true">←</b></span></div>
    </a>`;
  }).join('')}</div>`;
}

function renderCategory(categoryId) {
  const category = categoryById(categoryId);
  if (!category) { renderCategories(); return; }
  catalogIntro.hidden = true;
  const products = catalog.products.filter((product) => product.category === category.id);
  const soon = category.status === 'soon';
  catalogContent.innerHTML = `
    <nav class="catalog-breadcrumb"><a href="/products/" data-catalog-route="products">${currentLanguage === 'ar' ? 'منتجاتنا' : 'Products'}</a><span>/</span><strong>${escapeHtml(localized(category.name))}</strong></nav>
    <header class="catalog-heading"><div><span class="section-kicker">YOUNEX RANGE</span><h1>${escapeHtml(localized(category.name))}</h1><p>${escapeHtml(localized(category.description))}</p></div>${soon ? `<span class="large-status">${currentLanguage === 'ar' ? 'قريبًا' : 'Coming soon'}</span>` : `<span class="product-count">${currentLanguage === 'ar' ? `${products.length} منتج` : `${products.length} products`}</span>`}</header>
    ${soon ? `<div class="coming-soon-panel"><div class="category-icon">${categoryIcon(category.id)}</div><h2>${currentLanguage === 'ar' ? 'معدات البطاريات ستصل قريبًا' : 'Cordless tools are arriving soon'}</h2><p>${currentLanguage === 'ar' ? 'نعمل على تجهيز تشكيلة أدوات لاسلكية عملية. تواصل معنا عبر واتساب لمعرفة موعد توفرها.' : 'We are preparing a practical cordless tool range. Contact us on WhatsApp for availability.'}</p><a class="button button-whatsapp" href="https://wa.me/963953728253" target="_blank" rel="noopener">${currentLanguage === 'ar' ? 'اسأل عبر واتساب' : 'Ask on WhatsApp'}</a></div>` : `<div class="product-gallery">${products.map((product) => productCard(product)).join('')}</div>`}`;
}

function productCard(product) {
  return `<a class="product-card" href="/products/${product.slug}/" data-catalog-route="product/${product.slug}">
    <div class="product-card-media"><img src="${product.images[0]}" alt="${escapeHtml(product.model)}" loading="lazy"></div>
    <div class="product-card-copy"><span>${escapeHtml(localized(product.name))}</span><h2>${escapeHtml(product.model)}</h2><b>${currentLanguage === 'ar' ? 'عرض التفاصيل' : 'View details'} <i aria-hidden="true">←</i></b></div>
  </a>`;
}

function productShareUrl(product) {
  return `https://younexpower.com/products/${product.slug}/`;
}

function whatsappUrl(product) {
  const message = currentLanguage === 'ar'
    ? `مرحبًا، أود الاستفسار عن المنتج ${product.model} (${localized(product.name)}).\nأريد معرفة السعر والكمية المتوفرة والمزيد عن المميزات.\nرابط المنتج: ${productShareUrl(product)}`
    : `Hello, I would like to ask about ${product.model} (${localized(product.name)}).\nPlease share the price, available quantity and more details.\nProduct link: ${productShareUrl(product)}`;
  return `https://wa.me/963953728253?text=${encodeURIComponent(message)}`;
}

function renderProduct(slug) {
  const product = productBySlug(slug);
  if (!product) { renderCategories(); return; }
  const category = categoryById(product.category);
  activeProductImage = 0;
  catalogIntro.hidden = true;
  catalogContent.innerHTML = `
    <nav class="catalog-breadcrumb"><a href="/products/" data-catalog-route="products">${currentLanguage === 'ar' ? 'منتجاتنا' : 'Products'}</a><span>/</span><a href="/products/${category.id}/" data-catalog-route="category/${category.id}">${escapeHtml(localized(category.name))}</a><span>/</span><strong>${escapeHtml(product.model)}</strong></nav>
    <article class="product-detail" data-product-slug="${product.slug}">
      <div class="product-gallery-detail">
        <div class="product-main-media">
          <img id="product-main-image" src="${product.images[0]}" alt="${escapeHtml(product.model)} — 1">
          ${product.images.length > 1 ? `<button class="detail-control previous" type="button" data-product-image="previous" aria-label="${currentLanguage === 'ar' ? 'الصورة السابقة' : 'Previous image'}"><span>‹</span></button><button class="detail-control next" type="button" data-product-image="next" aria-label="${currentLanguage === 'ar' ? 'الصورة التالية' : 'Next image'}"><span>›</span></button>` : ''}
          <span id="product-image-counter" class="image-counter">1 / ${product.images.length}</span>
        </div>
        <div class="product-thumbnails">${product.images.map((image, index) => `<button type="button" class="product-thumbnail${index === 0 ? ' active' : ''}" data-product-image-index="${index}" aria-label="${currentLanguage === 'ar' ? `عرض الصورة ${index + 1}` : `View image ${index + 1}`}"><img src="${image}" alt="" loading="lazy"></button>`).join('')}</div>
      </div>
      <div class="product-detail-copy">
        <div class="product-title-row"><span class="availability-badge">${currentLanguage === 'ar' ? 'متوفر' : 'Available'}</span><small>${escapeHtml(localized(category.name))}</small></div>
        <h1>${escapeHtml(product.model)}</h1><h2>${escapeHtml(localized(product.name))}</h2><p>${escapeHtml(localized(product.description))}</p>
        <div class="specifications"><h3>${currentLanguage === 'ar' ? 'المواصفات الفنية' : 'Technical specifications'}</h3><dl>${product.specs.map((spec) => `<div><dt>${escapeHtml(localized(spec.label))}</dt><dd dir="ltr">${escapeHtml(spec.value)}</dd></div>`).join('')}</dl></div>
        <div class="purchase-box"><div><strong>${currentLanguage === 'ar' ? 'مهتم بهذا المنتج؟' : 'Interested in this product?'}</strong><span>${currentLanguage === 'ar' ? 'اسألنا عن السعر والكمية والمميزات.' : 'Ask us about price, quantity and features.'}</span></div><a class="button button-whatsapp" href="${whatsappUrl(product)}" target="_blank" rel="noopener">${currentLanguage === 'ar' ? 'استفسر عبر واتساب' : 'Ask on WhatsApp'}</a></div>
      </div>
    </article>`;
  const mainMedia = catalogContent.querySelector('.product-main-media');
  mainMedia?.addEventListener('touchstart', (event) => { productTouchStartX = event.changedTouches[0].clientX; }, { passive: true });
  mainMedia?.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - productTouchStartX;
    if (Math.abs(distance) > 45) setProductImage(activeProductImage + (distance < 0 ? 1 : -1));
  }, { passive: true });
}

function renderCatalogRoute(route) {
  if (!catalogContent || !catalogIntro) return;
  if (route.startsWith('category/')) renderCategory(route.split('/')[1]);
  else if (route.startsWith('product/')) renderProduct(route.split('/')[1]);
  else renderCategories();
}

function setProductImage(index) {
  const product = currentRoute.startsWith('product/') ? productBySlug(currentRoute.split('/')[1]) : null;
  if (!product?.images.length) return;
  activeProductImage = (index + product.images.length) % product.images.length;
  const mainImage = document.getElementById('product-main-image');
  const counter = document.getElementById('product-image-counter');
  if (mainImage) { mainImage.src = product.images[activeProductImage]; mainImage.alt = `${product.model} — ${activeProductImage + 1}`; }
  if (counter) counter.textContent = `${activeProductImage + 1} / ${product.images.length}`;
  catalogContent.querySelectorAll('.product-thumbnail').forEach((thumbnail, thumbnailIndex) => {
    thumbnail.classList.toggle('active', thumbnailIndex === activeProductImage);
    thumbnail.setAttribute('aria-current', thumbnailIndex === activeProductImage ? 'true' : 'false');
  });
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
}

function restartAutoplay() {
  window.clearInterval(autoplayTimer);
  if (slides.length > 1 && !reduceMotion && document.visibilityState === 'visible') autoplayTimer = window.setInterval(() => renderSlide(activeSlide + 1), 4600);
}

slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'carousel-dot';
  dot.setAttribute('aria-label', `${currentLanguage === 'ar' ? 'الصورة' : 'Slide'} ${index + 1}`);
  dot.addEventListener('click', () => { renderSlide(index); restartAutoplay(); });
  dotsContainer?.appendChild(dot);
});

routeLinks.forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  showRoute(link.dataset.route);
}));

document.addEventListener('click', (event) => {
  const catalogLink = event.target.closest('[data-catalog-route]');
  if (catalogLink) { event.preventDefault(); showRoute(catalogLink.dataset.catalogRoute); return; }
  const thumbnail = event.target.closest('[data-product-image-index]');
  if (thumbnail) { setProductImage(Number(thumbnail.dataset.productImageIndex)); return; }
  const control = event.target.closest('[data-product-image]');
  if (control) setProductImage(activeProductImage + (control.dataset.productImage === 'next' ? 1 : -1));
});

languageToggle.addEventListener('click', () => setLanguage(currentLanguage === 'ar' ? 'en' : 'ar'));
menuToggle.addEventListener('click', () => {
  const open = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
document.querySelector('[data-carousel="previous"]')?.addEventListener('click', () => { renderSlide(activeSlide - 1); restartAutoplay(); });
document.querySelector('[data-carousel="next"]')?.addEventListener('click', () => { renderSlide(activeSlide + 1); restartAutoplay(); });
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
window.addEventListener('popstate', () => showRoute(window.location.hash.slice(1) || 'home', false));
window.addEventListener('keydown', (event) => {
  if (currentRoute.startsWith('product/')) {
    if (event.key === 'ArrowLeft') setProductImage(activeProductImage - 1);
    if (event.key === 'ArrowRight') setProductImage(activeProductImage + 1);
    return;
  }
  if (currentRoute !== 'home') return;
  if (event.key === 'ArrowLeft') renderSlide(activeSlide - 1);
  if (event.key === 'ArrowRight') renderSlide(activeSlide + 1);
});

document.getElementById('current-year').textContent = new Date().getFullYear();
setLanguage(currentLanguage);
renderSlide(0);
showRoute(window.location.hash.slice(1) || 'home', false);
restartAutoplay();
