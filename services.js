(function () {
  'use strict';

  var forms = document.querySelectorAll('[data-sourcing-form]');
  if (!forms.length) return;

  var params = new URLSearchParams(window.location.search);
  var presetProduct = params.get('product') || '';
  var presetLink = params.get('productUrl') || '';

  function currentLanguage() {
    return document.documentElement.lang === 'en' ? 'en' : 'ar';
  }

  function fieldValue(form, name) {
    var field = form.elements.namedItem(name);
    return field ? String(field.value || '').trim() : '';
  }

  function brandingLabel(value, language) {
    var labels = {
      logo: { ar: 'طباعة شعار أو علامة تجارية', en: 'Logo or private label' },
      'logo-packaging': { ar: 'شعار وتغليف مخصص', en: 'Logo and custom packaging' }
    };
    return labels[value] ? labels[value][language] : language === 'ar' ? 'بدون تخصيص' : 'No customization';
  }

  function createMessage(form) {
    var language = currentLanguage();
    var data = {
      name: fieldValue(form, 'name'),
      phone: fieldValue(form, 'phone'),
      product: fieldValue(form, 'product'),
      quantity: fieldValue(form, 'quantity'),
      productLink: fieldValue(form, 'productLink'),
      color: fieldValue(form, 'color'),
      branding: brandingLabel(fieldValue(form, 'branding'), language),
      delivery: fieldValue(form, 'delivery'),
      details: fieldValue(form, 'details')
    };

    if (language === 'en') {
      return [
        'Hello Younex Power Center, I would like to request a sourcing quote.',
        '',
        'Name / company: ' + data.name,
        'Phone: ' + data.phone,
        'Product or project: ' + data.product,
        'Quantity or project requirements: ' + data.quantity,
        data.productLink ? 'Product link: ' + data.productLink : '',
        data.color ? 'Preferred color: ' + data.color : '',
        'Customization: ' + data.branding,
        'Delivery location: ' + data.delivery,
        data.details ? 'Specifications / notes: ' + data.details : '',
        '',
        'Please send me the price, lead time, customization, shipping, customs clearance and delivery details.'
      ].filter(Boolean).join('\n');
    }

    return [
      'مرحبًا مركز يونكس للمعدات والطاقة، أرغب في طلب عرض للتوريد.',
      '',
      'الاسم / الشركة: ' + data.name,
      'رقم الهاتف: ' + data.phone,
      'المنتج أو المشروع: ' + data.product,
      'الكمية أو الاحتياج المطلوب: ' + data.quantity,
      data.productLink ? 'رابط المنتج: ' + data.productLink : '',
      data.color ? 'اللون المطلوب: ' + data.color : '',
      'التخصيص: ' + data.branding,
      'مكان التسليم: ' + data.delivery,
      data.details ? 'المواصفات / الملاحظات: ' + data.details : '',
      '',
      'أرجو تزويدي بالسعر ومدة التوريد وخيارات التخصيص والشحن والتخليص الجمركي والتوصيل.'
    ].filter(Boolean).join('\n');
  }

  forms.forEach(function (form) {
    if (presetProduct && form.elements.product) form.elements.product.value = presetProduct;
    if (presetLink && form.elements.productLink) form.elements.productLink.value = presetLink;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      var whatsappUrl = 'https://wa.me/963953728253?text=' + encodeURIComponent(createMessage(form));
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  });
})();
