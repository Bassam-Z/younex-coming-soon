(function () {
  'use strict';

  var root = document.documentElement;
  var languageToggle = document.querySelector('.language-toggle');
  var menuToggle = document.querySelector('.menu-toggle');
  var primaryNav = document.querySelector('.primary-nav');
  var images = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-image]'));
  var activeImage = 0;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function savedLanguage() {
    try { return localStorage.getItem('younex-language') || 'ar'; } catch (error) { return 'ar'; }
  }

  function setLanguage(language) {
    var arabic = language === 'ar';
    root.lang = language;
    root.dir = arabic ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach(function (element) {
      element.textContent = element.getAttribute('data-' + language);
    });
    document.querySelectorAll('[data-aria-ar][data-aria-en]').forEach(function (element) {
      element.setAttribute('aria-label', element.getAttribute(arabic ? 'data-aria-ar' : 'data-aria-en'));
    });
    document.querySelectorAll('[data-alt-ar][data-alt-en]').forEach(function (element) {
      element.setAttribute('alt', element.getAttribute(arabic ? 'data-alt-ar' : 'data-alt-en'));
    });
    if (languageToggle) {
      languageToggle.querySelector('span').textContent = arabic ? 'EN' : 'عربي';
      languageToggle.setAttribute('aria-label', arabic ? 'Switch to English' : 'التبديل إلى العربية');
    }
    var pageTitle = document.body.getAttribute(arabic ? 'data-title-ar' : 'data-title-en');
    if (pageTitle) document.title = pageTitle;
    try { localStorage.setItem('younex-language', language); } catch (error) { /* Optional preference. */ }
  }

  function showImage(index) {
    var mainImage = document.getElementById('product-main-image');
    var counter = document.getElementById('product-image-counter');
    if (!mainImage || !images.length) return;
    activeImage = (index + images.length) % images.length;
    mainImage.src = images[activeImage].getAttribute('data-gallery-image');
    mainImage.alt = images[activeImage].getAttribute('data-gallery-alt') || '';
    if (counter) counter.textContent = (activeImage + 1) + ' / ' + images.length;
    images.forEach(function (button, buttonIndex) {
      button.classList.toggle('active', buttonIndex === activeImage);
      button.setAttribute('aria-current', buttonIndex === activeImage ? 'true' : 'false');
    });
  }

  if (languageToggle) languageToggle.addEventListener('click', function () {
    setLanguage(root.lang === 'ar' ? 'en' : 'ar');
  });
  if (menuToggle) menuToggle.addEventListener('click', function () {
    var open = primaryNav && primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });
  document.addEventListener('click', function (event) {
    var skipLink = event.target.closest('.skip-link');
    if (skipLink) {
      event.preventDefault();
      var mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus({ preventScroll: true });
        mainContent.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
      return;
    }
    var scrollLink = event.target.closest('[data-scroll-target]');
    if (scrollLink) {
      event.preventDefault();
      var scrollTarget = document.getElementById(scrollLink.getAttribute('data-scroll-target'));
      if (scrollTarget) scrollTarget.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    var thumbnail = event.target.closest('[data-gallery-image]');
    if (thumbnail) showImage(images.indexOf(thumbnail));
    var control = event.target.closest('[data-static-gallery]');
    if (control) showImage(activeImage + (control.getAttribute('data-static-gallery') === 'next' ? 1 : -1));
  });
  window.addEventListener('keydown', function (event) {
    if (!images.length) return;
    if (event.key === 'ArrowLeft') showImage(activeImage - 1);
    if (event.key === 'ArrowRight') showImage(activeImage + 1);
  });
  var year = document.getElementById('current-year');
  if (year) year.textContent = new Date().getFullYear();
  setLanguage(savedLanguage());
  showImage(0);
  if (window.location.hash === '#service-request' || window.location.hash === '#main-content') {
    var initialTarget = document.querySelector(window.location.hash);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    if (initialTarget) window.requestAnimationFrame(function () {
      initialTarget.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }
}());
