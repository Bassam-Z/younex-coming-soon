(function () {
  'use strict';

  var cache = {};
  var activeLanguage = savedLanguage();
  var initialLoad = true;
  var loaderShownAt = 0;
  var loaderDelay = window.setTimeout(function () {
    if (!initialLoad || !document.body || !document.body.classList.contains('i18n-pending')) return;
    loaderShownAt = performance.now();
    document.body.classList.add('i18n-loader-visible');
  }, 220);

  function savedLanguage() {
    try { return localStorage.getItem('younex-language') === 'en' ? 'en' : 'ar'; }
    catch (error) { return 'ar'; }
  }

  function valueAt(locale, key) {
    return key.split('.').reduce(function (value, segment) {
      return value && Object.prototype.hasOwnProperty.call(value, segment) ? value[segment] : undefined;
    }, locale);
  }

  function load(language) {
    if (cache[language]) return Promise.resolve(cache[language]);
    return fetch('/locales/' + language + '.json?v=32', { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Translation request failed: ' + response.status);
        return response.json();
      })
      .then(function (locale) {
        cache[language] = locale;
        return locale;
      });
  }

  function translate(locale, key, fallback) {
    var value = valueAt(locale, key);
    return typeof value === 'string' ? value : fallback;
  }

  function apply(locale, language, scope) {
    var target = scope || document;
    target.querySelectorAll('[data-i18n]').forEach(function (element) {
      var translated = translate(locale, element.getAttribute('data-i18n'), element.textContent);
      var directText = Array.prototype.find.call(element.childNodes, function (node) {
        return node.nodeType === Node.TEXT_NODE && node.textContent.trim();
      });
      if (directText) directText.textContent = element.children.length ? ' ' + translated + ' ' : translated;
      else element.appendChild(document.createTextNode(translated));
    });
    target.querySelectorAll('[data-i18n-aria]').forEach(function (element) {
      element.setAttribute('aria-label', translate(locale, element.getAttribute('data-i18n-aria'), element.getAttribute('aria-label') || ''));
    });
    target.querySelectorAll('[data-i18n-alt]').forEach(function (element) {
      element.setAttribute('alt', translate(locale, element.getAttribute('data-i18n-alt'), element.getAttribute('alt') || ''));
    });
    target.querySelectorAll('[data-i18n-gallery-alt]').forEach(function (element) {
      element.setAttribute('data-gallery-alt', translate(locale, element.getAttribute('data-i18n-gallery-alt'), ''));
    });
    target.querySelectorAll('[data-i18n-placeholder]').forEach(function (element) {
      element.setAttribute('placeholder', translate(locale, element.getAttribute('data-i18n-placeholder'), ''));
    });
    target.querySelectorAll('[data-i18n-title-attr]').forEach(function (element) {
      element.setAttribute('title', translate(locale, element.getAttribute('data-i18n-title-attr'), ''));
    });
    var titleTarget = document.body && document.body.getAttribute('data-i18n-title');
    if (titleTarget) document.title = translate(locale, titleTarget, document.title);
    var languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
      var toggleText = languageToggle.querySelector('span');
      if (toggleText) toggleText.textContent = valueAt(locale, 'language.toggleLabel') || toggleText.textContent;
      languageToggle.setAttribute('aria-label', valueAt(locale, 'language.toggleAria') || languageToggle.getAttribute('aria-label') || '');
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    applySeo(locale);
  }

  function applySeo(locale) {
    if (!document.body) return;
    var page = document.body.getAttribute('data-i18n-page');
    var seo = page ? valueAt(locale, 'seo.pages.' + page) : null;
    if (!seo) return;
    document.title = seo.title || document.title;
    var fields = {
      'meta[name="description"]': seo.description,
      'meta[property="og:title"]': seo.ogTitle,
      'meta[property="og:description"]': seo.ogDescription,
      'meta[property="og:image:alt"]': seo.imageAlt,
      'meta[name="twitter:title"]': seo.ogTitle,
      'meta[name="twitter:description"]': seo.ogDescription
    };
    Object.keys(fields).forEach(function (selector) {
      var element = document.querySelector(selector);
      if (element && fields[selector]) element.setAttribute('content', fields[selector]);
    });
    var schema = document.querySelector('[data-i18n-schema]');
    if (schema && seo.schema) schema.textContent = JSON.stringify(seo.schema);
  }

  function waitForCriticalMedia() {
    var image = document.querySelector('img[fetchpriority="high"], img[loading="eager"]');
    if (!image || image.complete) return Promise.resolve();
    return new Promise(function (resolve) {
      var settled = false;
      var timeout = window.setTimeout(done, 2500);
      function done() {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        image.removeEventListener('load', done);
        image.removeEventListener('error', done);
        resolve();
      }
      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    });
  }

  function finishLoading() {
    if (!initialLoad || !document.body) return;
    initialLoad = false;
    window.clearTimeout(loaderDelay);
    var remaining = loaderShownAt ? Math.max(0, 240 - (performance.now() - loaderShownAt)) : 0;
    window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        document.body.classList.remove('i18n-pending');
        document.body.classList.remove('i18n-loader-visible');
        document.body.classList.add('i18n-ready');
        window.setTimeout(function () {
          var loader = document.getElementById('i18n-loader');
          if (loader) loader.hidden = true;
        }, 550);
      });
    }, remaining);
  }

  function setLanguage(language) {
    activeLanguage = language === 'en' ? 'en' : 'ar';
    return load(activeLanguage).then(function (locale) {
      apply(locale, activeLanguage);
      try { localStorage.setItem('younex-language', activeLanguage); } catch (error) { /* Optional preference. */ }
      document.dispatchEvent(new CustomEvent('younex:languagechange', { detail: { language: activeLanguage } }));
      return initialLoad ? waitForCriticalMedia().then(function () { return locale; }) : locale;
    }).catch(function (error) {
      console.error(error);
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
      return null;
    }).finally(finishLoading);
  }

  window.YounexI18n = {
    get language() { return activeLanguage; },
    setLanguage: setLanguage,
    toggle: function () { return setLanguage(activeLanguage === 'ar' ? 'en' : 'ar'); },
    apply: function (scope) { if (cache[activeLanguage]) apply(cache[activeLanguage], activeLanguage, scope); },
    t: function (key, fallback) { return cache[activeLanguage] ? translate(cache[activeLanguage], key, fallback) : fallback; }
  };

  window.YounexI18n.ready = setLanguage(activeLanguage);
  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('.language-toggle');
    if (toggle) window.YounexI18n.toggle();
  });
  var currentYear = document.getElementById('current-year');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
}());
