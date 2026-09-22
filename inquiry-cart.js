(function () {
  'use strict';

  var storageKey = 'younex-inquiry-list-v1';
  var whatsappNumber = '963953728253';
  var initialized = false;

  function t(key) {
    return window.YounexI18n ? window.YounexI18n.t('inquiry.' + key, key) : key;
  }

  function products() {
    return window.YOUNEX_CATALOG && Array.isArray(window.YOUNEX_CATALOG.products)
      ? window.YOUNEX_CATALOG.products
      : [];
  }

  function productBySlug(slug) {
    return products().find(function (product) { return product.slug === slug; });
  }

  function readList() {
    try {
      var stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!Array.isArray(stored)) return [];
      return stored
        .filter(function (item) { return item && typeof item.slug === 'string' && productBySlug(item.slug); })
        .slice(0, 40)
        .map(function (item) {
          return { slug: item.slug, quantity: Math.min(99, Math.max(1, Number(item.quantity) || 1)) };
        });
    } catch (error) {
      return [];
    }
  }

  function writeList(list) {
    try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch (error) { /* Storage is optional. */ }
    updateBadge(list);
    renderInquiryPage(list);
    document.dispatchEvent(new CustomEvent('younex:inquirychange', { detail: { list: list } }));
  }

  function totalUnits(list) {
    return list.reduce(function (total, item) { return total + item.quantity; }, 0);
  }

  function addProduct(slug) {
    if (!productBySlug(slug)) return;
    var list = readList();
    var existing = list.find(function (item) { return item.slug === slug; });
    if (existing) existing.quantity = Math.min(99, existing.quantity + 1);
    else list.push({ slug: slug, quantity: 1 });
    writeList(list);
    showToast(t('addedToast'));
  }

  function setQuantity(slug, quantity) {
    var list = readList();
    var item = list.find(function (entry) { return entry.slug === slug; });
    if (!item) return;
    item.quantity = Math.min(99, Math.max(1, Number(quantity) || 1));
    writeList(list);
  }

  function removeProduct(slug) {
    writeList(readList().filter(function (item) { return item.slug !== slug; }));
  }

  function createHeaderLink() {
    var header = document.querySelector('.header-inner');
    if (!header || header.querySelector('.inquiry-nav-link')) return;
    var link = document.createElement('a');
    link.className = 'inquiry-nav-link';
    if (window.location.pathname.indexOf('/inquiry') === 0) link.classList.add('active');
    link.href = '/inquiry/';
    link.setAttribute('data-i18n-aria', 'inquiry.navAria');
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16l-1.4 12H5.4L4 7Z"></path><path d="M8 7a4 4 0 0 1 8 0"></path></svg><span data-i18n="inquiry.navLabel"></span><b class="inquiry-count" hidden>0</b>';
    var languageToggle = header.querySelector('.language-toggle');
    header.insertBefore(link, languageToggle || null);
    if (window.YounexI18n) window.YounexI18n.apply(link);
  }

  function updateBadge(list) {
    var badge = document.querySelector('.inquiry-count');
    var link = document.querySelector('.inquiry-nav-link');
    var count = totalUnits(list || readList());
    if (badge) {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    }
    if (link) link.setAttribute('aria-label', t('navAria') + (count ? ' (' + count + ')' : ''));
  }

  function showToast(message) {
    var toast = document.getElementById('inquiry-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'inquiry-toast';
      toast.className = 'inquiry-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () { toast.classList.remove('visible'); }, 2400);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function localizedName(product) {
    var language = window.YounexI18n ? window.YounexI18n.language : 'ar';
    return product.name && product.name[language] ? product.name[language] : product.model;
  }

  function syncProductWhatsAppLinks() {
    document.querySelectorAll('[data-product-whatsapp]').forEach(function (link) {
      var slug = link.getAttribute('data-product-whatsapp');
      var product = productBySlug(slug);
      if (!product) return;
      var productUrl = 'https://younexpower.com/products/' + product.slug + '/';
      var message = [
        t('directMessageGreeting'),
        product.model + ' — ' + localizedName(product),
        t('messageProductLink') + ': ' + productUrl,
        t('messageClosing')
      ].join('\n');
      var label = t('askOnWhatsApp') + ': ' + product.model;
      link.href = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
      link.setAttribute('aria-label', label);
      link.setAttribute('title', label);
    });
  }

  function itemMarkup(item) {
    var product = productBySlug(item.slug);
    if (!product) return '';
    var name = localizedName(product);
    return '<article class="inquiry-item" data-inquiry-item="' + escapeHtml(item.slug) + '">' +
      '<a class="inquiry-item-media" href="/products/' + escapeHtml(item.slug) + '/"><img src="/' + escapeHtml(product.images[0]) + '" alt="" width="160" height="160" loading="lazy"></a>' +
      '<div class="inquiry-item-copy"><a href="/products/' + escapeHtml(item.slug) + '/"><strong>' + escapeHtml(product.model) + '</strong><span>' + escapeHtml(name) + '</span></a>' +
      '<div class="inquiry-item-actions"><div class="inquiry-quantity"><span>' + escapeHtml(t('quantity')) + '</span>' +
      '<button type="button" data-inquiry-decrease="' + escapeHtml(item.slug) + '" aria-label="' + escapeHtml(t('decreaseQuantity')) + '">−</button>' +
      '<input type="number" min="1" max="99" inputmode="numeric" value="' + item.quantity + '" data-inquiry-quantity="' + escapeHtml(item.slug) + '" aria-label="' + escapeHtml(t('quantity')) + '">' +
      '<button type="button" data-inquiry-increase="' + escapeHtml(item.slug) + '" aria-label="' + escapeHtml(t('increaseQuantity')) + '">+</button></div>' +
      '<button class="inquiry-remove" type="button" data-inquiry-remove="' + escapeHtml(item.slug) + '">' + escapeHtml(t('remove')) + '</button></div></div></article>';
  }

  function updateCustomerType() {
    var business = document.querySelector('input[name="inquiry-customer-type"]:checked');
    var isBusiness = business && business.value === 'business';
    document.querySelectorAll('[data-business-field]').forEach(function (field) { field.hidden = !isBusiness; });
    var submitText = document.querySelector('[data-inquiry-submit-text]');
    if (submitText) submitText.textContent = t(isBusiness ? 'sendBusiness' : 'sendIndividual');
  }

  function renderInquiryPage(list) {
    var page = document.querySelector('[data-inquiry-page]');
    if (!page) return;
    var currentList = (list || readList()).filter(function (item) { return productBySlug(item.slug); });
    var items = document.getElementById('inquiry-items');
    var empty = document.getElementById('inquiry-empty');
    var form = document.getElementById('inquiry-form');
    var clear = document.querySelector('[data-inquiry-clear]');
    var summary = document.querySelector('[data-inquiry-summary]');
    if (items) items.innerHTML = currentList.map(itemMarkup).join('');
    if (empty) empty.hidden = currentList.length > 0;
    if (items) items.hidden = currentList.length === 0;
    if (form) form.classList.toggle('is-disabled', currentList.length === 0);
    if (form) form.querySelectorAll('input, textarea, button[type="submit"]').forEach(function (control) { control.disabled = currentList.length === 0; });
    if (clear) clear.disabled = currentList.length === 0;
    if (summary) summary.textContent = currentList.length + ' ' + t('summaryProducts') + ' · ' + totalUnits(currentList) + ' ' + t('summaryUnits');
    updateCustomerType();
  }

  function fieldValue(id) {
    var field = document.getElementById(id);
    return field ? field.value.trim() : '';
  }

  function buildWhatsAppMessage() {
    var list = readList();
    var type = document.querySelector('input[name="inquiry-customer-type"]:checked');
    var business = type && type.value === 'business';
    var language = window.YounexI18n ? window.YounexI18n.language : 'ar';
    var lines = [t('messageGreeting'), '', t('messageCustomerType') + ': ' + t(business ? 'messageBusiness' : 'messageIndividual')];
    var details = [
      [t('messageName'), fieldValue('inquiry-name')],
      [t('messagePhone'), fieldValue('inquiry-phone')],
      [t('messageCity'), fieldValue('inquiry-city')]
    ];
    if (business) details.push([t('messageCompany'), fieldValue('inquiry-company')]);
    details.forEach(function (detail) { if (detail[1]) lines.push(detail[0] + ': ' + detail[1]); });
    lines.push('', t('messageProducts') + ':');
    list.forEach(function (item, index) {
      var product = productBySlug(item.slug);
      if (!product) return;
      var name = product.name && product.name[language] ? product.name[language] : product.model;
      lines.push((index + 1) + '. ' + product.model + ' — ' + name);
      lines.push(t('messageQuantity') + ': ' + item.quantity);
      lines.push(t('messageProductLink') + ': https://younexpower.com/products/' + product.slug + '/');
    });
    if (business) {
      var services = [];
      var branding = document.getElementById('inquiry-branding');
      var shipping = document.getElementById('inquiry-shipping');
      if (branding && branding.checked) services.push(t('customBrandingMessage'));
      if (shipping && shipping.checked) services.push(t('shippingCustomsMessage'));
      if (services.length) lines.push('', t('messageServices') + ': ' + services.join(language === 'ar' ? '، ' : ', '));
    }
    var notes = fieldValue('inquiry-notes');
    if (notes) lines.push('', t('messageNotes') + ': ' + notes);
    lines.push('', t('messageClosing'));
    return lines.join('\n');
  }

  function sendToWhatsApp() {
    if (!readList().length) return;
    var link = document.createElement('a');
    link.href = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(buildWhatsAppMessage());
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handleClicks(event) {
    var add = event.target.closest('[data-inquiry-add]');
    if (add) {
      event.preventDefault();
      addProduct(add.getAttribute('data-product-slug'));
      var label = add.querySelector('[data-inquiry-add-text]');
      if (label) label.textContent = t('added');
      add.classList.add('is-added');
      window.setTimeout(function () {
        add.classList.remove('is-added');
        if (label) label.textContent = t('addToList');
      }, 1500);
      return;
    }
    var increase = event.target.closest('[data-inquiry-increase]');
    if (increase) {
      var increaseSlug = increase.getAttribute('data-inquiry-increase');
      var increaseItem = readList().find(function (item) { return item.slug === increaseSlug; });
      if (increaseItem) setQuantity(increaseSlug, increaseItem.quantity + 1);
      return;
    }
    var decrease = event.target.closest('[data-inquiry-decrease]');
    if (decrease) {
      var decreaseSlug = decrease.getAttribute('data-inquiry-decrease');
      var decreaseItem = readList().find(function (item) { return item.slug === decreaseSlug; });
      if (decreaseItem) setQuantity(decreaseSlug, decreaseItem.quantity - 1);
      return;
    }
    var remove = event.target.closest('[data-inquiry-remove]');
    if (remove) {
      removeProduct(remove.getAttribute('data-inquiry-remove'));
      return;
    }
    var clear = event.target.closest('[data-inquiry-clear]');
    if (clear && !clear.disabled && window.confirm(t('clearConfirm'))) writeList([]);
  }

  function init() {
    if (initialized) return;
    initialized = true;
    createHeaderLink();
    updateBadge(readList());
    renderInquiryPage(readList());
    syncProductWhatsAppLinks();
    document.addEventListener('click', handleClicks);
    document.addEventListener('change', function (event) {
      if (event.target.matches('[data-inquiry-quantity]')) setQuantity(event.target.getAttribute('data-inquiry-quantity'), event.target.value);
      if (event.target.matches('input[name="inquiry-customer-type"]')) updateCustomerType();
    });
    var form = document.getElementById('inquiry-form');
    if (form) form.addEventListener('submit', function (event) { event.preventDefault(); sendToWhatsApp(); });
    document.addEventListener('younex:languagechange', function () {
      if (window.YounexI18n) window.YounexI18n.ready.then(function () {
        window.YounexI18n.apply(document);
        updateBadge(readList());
        renderInquiryPage(readList());
        syncProductWhatsAppLinks();
      });
    });
  }

  if (window.YounexI18n && window.YounexI18n.ready) window.YounexI18n.ready.then(init).catch(init);
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
}());
