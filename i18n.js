(function () {
  'use strict';

  var cache = {};
  var activeLanguage = savedLanguage();
  var initialLoad = true;
  var loadingStartedAt = performance.now();

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
    return fetch('/locales/' + language + '.json?v=29', { credentials: 'same-origin' })
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
    var titleTarget = document.body && document.body.getAttribute('data-i18n-title');
    if (titleTarget) document.title = translate(locale, titleTarget, document.title);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }

  function finishLoading() {
    if (!initialLoad || !document.body) return;
    initialLoad = false;
    var remaining = Math.max(0, 320 - (performance.now() - loadingStartedAt));
    window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        document.body.classList.remove('i18n-pending');
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
      return locale;
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
}());
