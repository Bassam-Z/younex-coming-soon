(function () {
  'use strict';

  var allowedHosts = ['younexpower.com', 'www.younexpower.com'];
  var queue = [];
  var retryTimer;
  var retryCount = 0;

  if (allowedHosts.indexOf(window.location.hostname) === -1) return;

  function routeFromLocation() {
    var hashRoute = window.location.hash.slice(1);
    if (hashRoute) return hashRoute;
    var pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, '');
    return pathRoute || 'home';
  }

  function flushQueue() {
    if (!window.goatcounter || typeof window.goatcounter.count !== 'function') {
      if (retryCount < 30 && !retryTimer) {
        retryCount += 1;
        retryTimer = window.setTimeout(function () {
          retryTimer = undefined;
          flushQueue();
        }, 500);
      }
      return;
    }

    retryCount = 0;
    while (queue.length) {
      try {
        window.goatcounter.count(queue.shift());
      } catch (error) {
        queue.length = 0;
        return;
      }
    }
  }

  function send(payload) {
    queue.push(payload);
    flushQueue();
  }

  function trackPage() {
    var route = routeFromLocation();
    send({ path: '/' + route, title: document.title });
  }

  function trackEvent(name, title) {
    send({ path: name, title: title, event: true });
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== 'function') return;

    var whatsappLink = target.closest('a[href*="wa.me/"]');
    if (whatsappLink) {
      var whatsappRoute = routeFromLocation();
      trackEvent('whatsapp/' + whatsappRoute, 'WhatsApp — ' + whatsappRoute);
    }

    if (target.closest('[data-route], [data-catalog-route]')) {
      window.setTimeout(trackPage, 0);
    }

    if (target.closest('.language-toggle')) {
      window.setTimeout(function () {
        var language = document.documentElement.lang || 'ar';
        trackEvent('language/' + language, 'Language — ' + language.toUpperCase());
      }, 0);
    }
  });

  window.addEventListener('popstate', function () {
    window.setTimeout(trackPage, 0);
  });

  trackPage();
}());
