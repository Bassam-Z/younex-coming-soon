const fs = require('fs');
const path = require('path');

global.window = {};
require('../products-data.js');

const root = path.resolve(__dirname, '..');
const catalog = window.YOUNEX_CATALOG;
const origin = 'https://younexpower.com';
const updated = '2026-09-16';

function esc(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function json(value) {
  return JSON.stringify(value, null, 2).replaceAll('<', '\\u003c');
}

function localizedTag(tag, value, attrs = '') {
  return `<${tag}${attrs} data-ar="${esc(value.ar)}" data-en="${esc(value.en)}">${esc(value.ar)}</${tag}>`;
}

function head({ title, description, canonical, image, type = 'website', schema }) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="author" content="Younex Power Center">
  <meta name="theme-color" content="#07111f">
  <title>${esc(title)}</title>
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/images/favicon.png">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/assets/images/favicon.png">
  <meta property="og:type" content="${type}">
  <meta property="og:locale" content="ar_SY">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:site_name" content="Younex Power Center">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:alt" content="${esc(title)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${image}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css?v=20">
  <script type="application/ld+json">${json(schema)}</script>
  <script>window.goatcounter = { no_onload: true };</script>
  <script data-goatcounter="https://younexpower.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
  <script src="/analytics.js?v=2" defer></script>
  <script src="/seo-pages.js?v=2" defer></script>
  <script src="/services.js?v=3" defer></script>
</head>`;
}

function header(active) {
  return `<a class="skip-link" href="#main-content" data-ar="انتقل إلى المحتوى" data-en="Skip to content">انتقل إلى المحتوى</a>
<header class="site-header">
  <div class="header-inner container">
    <a class="brand" href="/" aria-label="Younex Power Center - Home"><img src="/assets/images/logo-younex.png" alt="Younex Power Center"></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" data-aria-ar="فتح القائمة" data-aria-en="Open menu"><span></span><span></span><span></span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
      <a href="/" class="nav-link${active === 'home' ? ' active' : ''}" data-ar="الرئيسية" data-en="Home">الرئيسية</a>
      <a href="/products/" class="nav-link${active === 'products' ? ' active' : ''}" data-ar="منتجاتنا" data-en="Products">منتجاتنا</a>
      <a href="/services/" class="nav-link${active === 'services' ? ' active' : ''}" data-ar="خدمات التوريد" data-en="Sourcing services">خدمات التوريد</a>
      <a href="/about/" class="nav-link${active === 'about' ? ' active' : ''}" data-ar="من نحن" data-en="About us">من نحن</a>
    </nav>
    <button class="language-toggle" type="button" aria-label="Switch to English"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3.5 9h17M3.5 15h17M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3C9.8 5.5 8.7 8.5 8.7 12S9.8 18.5 12 21"></path></svg><span>EN</span></button>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand"><img src="/assets/images/logo-younex.png" alt="Younex Power Center"><p data-ar="قوة تثق بها، وخدمة قريبة منك." data-en="Power you can trust, service close to you.">قوة تثق بها، وخدمة قريبة منك.</p></div>
    <div class="footer-links"><strong data-ar="روابط سريعة" data-en="Quick links">روابط سريعة</strong><a href="/" data-ar="الرئيسية" data-en="Home">الرئيسية</a><a href="/products/" data-ar="منتجاتنا" data-en="Products">منتجاتنا</a><a href="/services/" data-ar="خدمات التوريد" data-en="Sourcing services">خدمات التوريد</a><a href="/about/" data-ar="من نحن" data-en="About us">من نحن</a></div>
    <div class="footer-contact"><strong data-ar="تواصل معنا" data-en="Contact us">تواصل معنا</strong><a href="tel:+963953728253" dir="ltr">+963 953 728 253</a><a href="mailto:info@younexpower.com">info@younexpower.com</a><span>www.younexpower.com</span></div>
  </div>
  <div class="footer-bottom container"><span>© <span id="current-year"></span> Younex Power Center.</span><span data-ar="جميع الحقوق محفوظة." data-en="All rights reserved.">جميع الحقوق محفوظة.</span></div>
</footer>
<a class="whatsapp-float" href="https://wa.me/963953728253" target="_blank" rel="noopener" data-aria-ar="تواصل عبر واتساب" data-aria-en="Contact us on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .2 5.3.2 11.9c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7c1.7.9 3.7 1.4 5.7 1.4 6.6 0 11.9-5.3 11.9-11.9 0-3.1-1.3-6.1-3.5-8.3ZM12.1 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.8 1 1-3.7-.2-.4a9.8 9.8 0 1 1 8.4 4.7Zm5.4-7.4c-.3-.1-1.8-.9-2.1-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.7-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2 2.2.9 3.1 1 4.2.8.7-.1 2.1-.9 2.4-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.6-.4Z"></path></svg><span data-ar="واتساب" data-en="WhatsApp">واتساب</span></a>`;
}

function categoryCard(category) {
  const count = catalog.products.filter((product) => product.category === category.id).length;
  const soon = category.status === 'soon';
  const media = category.cover
    ? `<img src="/${category.cover}" alt="${esc(category.name.ar)} — ${esc(category.name.en)}" loading="lazy" width="700" height="700">`
    : '<div class="category-icon"><strong>YOUNEX</strong></div>';
  return `<a class="category-card${soon ? ' is-soon' : ''}" href="/products/${category.id}/">
    <div class="category-media">${media}<span class="category-status ${soon ? 'soon' : 'available'}" data-ar="${soon ? 'قريبًا' : `${count} منتج`}" data-en="${soon ? 'Coming soon' : `${count} products`}">${soon ? 'قريبًا' : `${count} منتج`}</span></div>
    <div class="category-copy">${localizedTag('h2', category.name)}${localizedTag('p', category.description)}<span class="category-link" data-ar="استعرض القسم" data-en="Explore category">استعرض القسم <b aria-hidden="true">←</b></span></div>
  </a>`;
}

function productCard(product) {
  return `<a class="product-card" href="/products/${product.slug}/">
    <div class="product-card-media"><img src="/${product.images[0]}" alt="${esc(product.model)} — ${esc(product.name.ar)}" loading="lazy" width="700" height="700"></div>
    <div class="product-card-copy">${localizedTag('span', product.name)}<h2>${esc(product.model)}</h2><b data-ar="عرض التفاصيل" data-en="View details">عرض التفاصيل <i aria-hidden="true">←</i></b></div>
  </a>`;
}

function page({ titleAr, titleEn, headTitle, description, canonical, image, schema, active = 'products', content, type }) {
  return `${head({ title: headTitle, description, canonical, image, schema, type })}
<body data-title-ar="${esc(titleAr)}" data-title-en="${esc(titleEn)}">
${header(active)}
<main id="main-content" class="static-page-main">${content}</main>
${footer()}
</body>
</html>
`;
}

function currentServicesContent() {
  const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const startMarker = '      <section id="services" class="page-view services-page" data-view="services" aria-labelledby="services-title" hidden>';
  const endMarker = '      <section id="about"';
  const start = homepage.indexOf(startMarker);
  const end = homepage.indexOf(endMarker, start);

  if (start === -1 || end === -1) throw new Error('Unable to extract the services page from index.html');

  return homepage
    .slice(start, end)
    .trim()
    .replace(startMarker.trim(), '<section class="services-page">')
    .replaceAll('src="assets/', 'src="/assets/');
}

function currentAboutContent() {
  const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const startMarker = '      <section id="about" class="page-view" data-view="about" aria-labelledby="about-title" hidden>';
  const endMarker = '\n      </section>';
  const start = homepage.indexOf(startMarker);
  const end = homepage.indexOf(endMarker, start);

  if (start === -1 || end === -1) throw new Error('Unable to extract the about page from index.html');

  return homepage
    .slice(start + startMarker.length, end)
    .trim()
    .replaceAll('src="assets/', 'src="/assets/');
}

function write(relativePath, content) {
  if (relativePath === 'services/index.html') {
    content = content.replace(
      /<main id="main-content" class="static-page-main">[\s\S]*?<\/main>/,
      `<main id="main-content" class="static-page-main">${currentServicesContent()}</main>`
    );
  }
  if (relativePath === 'about/index.html') {
    content = content.replace(
      /<main id="main-content" class="static-page-main">[\s\S]*?<\/main>/,
      `<main id="main-content" class="static-page-main">${currentAboutContent()}</main>`
    );
  }
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: item.url }))
  };
}

const productsCanonical = `${origin}/products/`;
const productsSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'CollectionPage', '@id': productsCanonical, url: productsCanonical, name: 'منتجات يونكس | Younex Products', description: 'معدات كهربائية ومولدات ومضخات مياه من مركز يونكس للمعدات والطاقة.', inLanguage: ['ar', 'en'] },
    breadcrumbSchema([{ name: 'Younex Power Center', url: `${origin}/` }, { name: 'Products', url: productsCanonical }])
  ]
};

write('products/index.html', page({
  titleAr: 'منتجاتنا | مركز يونكس للمعدات والطاقة',
  titleEn: 'Our Products | Younex Power Center',
  headTitle: 'منتجات يونكس: معدات كهربائية ومولدات ومضخات مياه',
  description: 'استعرض معدات يونكس الكهربائية السلكية والمولدات ومضخات المياه، مع الصور والمواصفات الفنية والتواصل المباشر عبر واتساب.',
  canonical: productsCanonical,
  image: `${origin}/assets/products/corded/al-42hh/1.webp`,
  schema: productsSchema,
  content: `<div class="page-hero container"><span class="section-kicker">YOUNEX RANGE</span><h1 data-ar="منتجاتنا" data-en="Our products">منتجاتنا</h1><p data-ar="اختر الفئة التي تهمك، ثم تصفّح المنتجات والمواصفات والصور التفصيلية." data-en="Choose a category, then explore its products, specifications and detailed images.">اختر الفئة التي تهمك، ثم تصفّح المنتجات والمواصفات والصور التفصيلية.</p></div><div class="catalog-content container"><div class="category-grid">${catalog.categories.map(categoryCard).join('')}</div></div>`
}));

for (const category of catalog.categories) {
  const canonical = `${origin}/products/${category.id}/`;
  const products = catalog.products.filter((product) => product.category === category.id);
  const categorySchema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': canonical, url: canonical, name: `${category.name.ar} | ${category.name.en}`, description: category.description.ar, inLanguage: ['ar', 'en'], mainEntity: { '@type': 'ItemList', numberOfItems: products.length, itemListElement: products.map((product, index) => ({ '@type': 'ListItem', position: index + 1, url: `${origin}/products/${product.slug}/`, name: product.model })) } },
      breadcrumbSchema([{ name: 'Younex Power Center', url: `${origin}/` }, { name: 'Products', url: productsCanonical }, { name: category.name.en, url: canonical }])
    ]
  };
  const cards = category.status === 'soon'
    ? `<div class="coming-soon-panel seo-category-empty"><div class="category-icon"><strong>YOUNEX</strong></div><h2 data-ar="معدات البطاريات ستصل قريبًا" data-en="Cordless tools are arriving soon">معدات البطاريات ستصل قريبًا</h2><p data-ar="نعمل على تجهيز تشكيلة أدوات لاسلكية عملية. تواصل معنا عبر واتساب لمعرفة موعد توفرها." data-en="We are preparing a practical cordless tool range. Contact us on WhatsApp for availability.">نعمل على تجهيز تشكيلة أدوات لاسلكية عملية. تواصل معنا عبر واتساب لمعرفة موعد توفرها.</p><a class="button button-whatsapp" href="https://wa.me/963953728253" target="_blank" rel="noopener" data-ar="اسأل عبر واتساب" data-en="Ask on WhatsApp">اسأل عبر واتساب</a></div>`
    : `<div class="product-gallery">${products.map(productCard).join('')}</div>`;
  write(`products/${category.id}/index.html`, page({
    titleAr: `${category.name.ar} | مركز يونكس`,
    titleEn: `${category.name.en} | Younex Power Center`,
    headTitle: `${category.name.ar} في درعا | ${category.name.en} — Younex`,
    description: `${category.description.ar} استعرض موديلات يونكس والصور والمواصفات الفنية وتواصل معنا عبر واتساب.`,
    canonical,
    image: category.cover ? `${origin}/${category.cover}` : `${origin}/assets/images/logo-younex.png`,
    schema: categorySchema,
    content: `<div class="catalog-content container"><nav class="catalog-breadcrumb"><a href="/products/" data-ar="منتجاتنا" data-en="Products">منتجاتنا</a><span>/</span>${localizedTag('strong', category.name)}</nav><header class="catalog-heading"><div><span class="section-kicker">YOUNEX RANGE</span>${localizedTag('h1', category.name)}${localizedTag('p', category.description)}</div><span class="product-count" data-ar="${category.status === 'soon' ? 'قريبًا' : `${products.length} منتج`}" data-en="${category.status === 'soon' ? 'Coming soon' : `${products.length} products`}">${category.status === 'soon' ? 'قريبًا' : `${products.length} منتج`}</span></header>${cards}</div>`
  }));
}

for (const product of catalog.products) {
  const category = catalog.categories.find((item) => item.id === product.category);
  const canonical = `${origin}/products/${product.slug}/`;
  const images = product.images.map((image) => `${origin}/${image}`);
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Product', '@id': `${canonical}#product`, url: canonical, name: `${product.model} ${product.name.en}`, alternateName: `${product.model} ${product.name.ar}`, sku: product.model, model: product.model, image: images, description: `${product.description.ar} ${product.description.en}`, category: category.name.en, brand: { '@type': 'Brand', name: 'Younex' } },
      breadcrumbSchema([{ name: 'Younex Power Center', url: `${origin}/` }, { name: 'Products', url: productsCanonical }, { name: category.name.en, url: `${origin}/products/${category.id}/` }, { name: product.model, url: canonical }])
    ]
  };
  const message = encodeURIComponent(`مرحبًا، أود الاستفسار عن المنتج ${product.model}.\nأريد معرفة السعر والكمية المتوفرة والمزيد عن المميزات.\nرابط المنتج: ${canonical}`);
  const bulkRequest = `/services/?product=${encodeURIComponent(`${product.model} — ${product.name.ar}`)}&productUrl=${encodeURIComponent(canonical)}#service-request`;
  const thumbnails = product.images.map((image, index) => `<button type="button" class="product-thumbnail${index === 0 ? ' active' : ''}" data-gallery-image="/${image}" data-gallery-alt="${esc(product.model)} — صورة ${index + 1}" aria-label="عرض الصورة ${index + 1}"><img src="/${image}" alt="" loading="lazy" width="150" height="150"></button>`).join('');
  const specs = product.specs.map((spec) => `<div>${localizedTag('dt', spec.label)}<dd dir="ltr">${esc(spec.value)}</dd></div>`).join('');
  const content = `<div class="catalog-content container"><nav class="catalog-breadcrumb"><a href="/products/" data-ar="منتجاتنا" data-en="Products">منتجاتنا</a><span>/</span><a href="/products/${category.id}/" data-ar="${esc(category.name.ar)}" data-en="${esc(category.name.en)}">${esc(category.name.ar)}</a><span>/</span><strong>${esc(product.model)}</strong></nav><article class="product-detail"><div class="product-gallery-detail"><div class="product-main-media"><img id="product-main-image" src="/${product.images[0]}" alt="${esc(product.model)} — ${esc(product.name.ar)}" fetchpriority="high" width="900" height="900"><button class="detail-control previous" type="button" data-static-gallery="previous" aria-label="الصورة السابقة"><span>‹</span></button><button class="detail-control next" type="button" data-static-gallery="next" aria-label="الصورة التالية"><span>›</span></button><span id="product-image-counter" class="image-counter">1 / ${product.images.length}</span></div><div class="product-thumbnails">${thumbnails}</div></div><div class="product-detail-copy"><div class="product-title-row"><span class="availability-badge" data-ar="متوفر" data-en="Available">متوفر</span>${localizedTag('small', category.name)}</div><h1>${esc(product.model)}</h1>${localizedTag('h2', product.name)}${localizedTag('p', product.description)}<div class="specifications"><h3 data-ar="المواصفات الفنية" data-en="Technical specifications">المواصفات الفنية</h3><dl>${specs}</dl></div><div class="seo-product-summary"><strong>${esc(product.model)} — ${esc(product.name.en)}</strong><p>${esc(product.description.en)}</p></div><div class="purchase-box"><div><strong data-ar="مهتم بهذا المنتج؟" data-en="Interested in this product?">مهتم بهذا المنتج؟</strong><span data-ar="اسألنا عن السعر والكمية والمميزات." data-en="Ask us about price, quantity and features.">اسألنا عن السعر والكمية والمميزات.</span></div><a class="button button-whatsapp" href="https://wa.me/963953728253?text=${message}" target="_blank" rel="noopener" data-ar="استفسر عبر واتساب" data-en="Ask on WhatsApp">استفسر عبر واتساب</a></div><div class="bulk-order-box"><div><span class="bulk-order-label" data-ar="للتجار وأصحاب المشاريع" data-en="For traders and businesses">للتجار وأصحاب المشاريع</span><strong data-ar="هل تحتاج هذا المنتج بكميات تجارية؟" data-en="Need this product in commercial quantities?">هل تحتاج هذا المنتج بكميات تجارية؟</strong><p data-ar="نوفر الكمية المطلوبة مع خيارات تخصيص اللون وطباعة شعارك أو علامتك التجارية على المنتج والتغليف." data-en="We can source the quantity you need with custom colors, your logo or private label on the product and packaging.">نوفر الكمية المطلوبة مع خيارات تخصيص اللون وطباعة شعارك أو علامتك التجارية على المنتج والتغليف.</p></div><a class="button button-service" href="${bulkRequest}" data-ar="اطلب سعر الكميات" data-en="Request a bulk quote">اطلب سعر الكميات</a></div></div></article></div>`;
  write(`products/${product.slug}/index.html`, page({
    titleAr: `${product.model} ${product.name.ar} | مركز يونكس`,
    titleEn: `${product.model} ${product.name.en} | Younex Power Center`,
    headTitle: `${product.model} ${product.name.ar} | Younex ${product.name.en}`,
    description: `${product.model}: ${product.description.ar} شاهد الصور والمواصفات واستفسر عن السعر والتوفر عبر واتساب.`,
    canonical,
    image: images[0],
    schema: productSchema,
    type: 'product',
    content
  }));
}

const servicesCanonical = `${origin}/services/`;
const servicesDescription = 'تأمين المعدات والأدوات وتجهيز المشاريع في سوريا، مع تخصيص المنتجات والشحن والتخليص الجمركي والتوصيل إلى موقع العميل.';
const servicesSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${servicesCanonical}#service`,
      name: 'خدمات التوريد والتخصيص للشركات',
      alternateName: 'Business Sourcing and Product Customization',
      description: servicesDescription,
      url: servicesCanonical,
      provider: { '@type': 'HardwareStore', '@id': `${origin}/#business`, name: 'Younex Power Center' },
      areaServed: { '@type': 'Country', name: 'Syria' },
      serviceType: ['Bulk sourcing', 'Project equipment sourcing', 'Product customization', 'Private labeling', 'International shipping', 'Customs clearance', 'Commercial delivery']
    },
    breadcrumbSchema([{ name: 'Younex Power Center', url: `${origin}/` }, { name: 'Sourcing services', url: servicesCanonical }])
  ]
};

const serviceRequestForm = `<section id="service-request" class="service-request" aria-labelledby="service-request-title"><div class="service-request-copy"><span class="section-kicker" data-ar="ابدأ طلبك" data-en="START YOUR REQUEST">ابدأ طلبك</span><h2 id="service-request-title" data-ar="اطلب عرض سعر للكميات" data-en="Request a bulk quote">اطلب عرض سعر للكميات</h2><p data-ar="عبّئ المعلومات الأساسية، وسنجهزها لك في رسالة واتساب. يمكنك إرفاق صورة المنتج مباشرة بعد فتح المحادثة." data-en="Fill in the basic details and we will prepare them in a WhatsApp message. You can attach the product photo after the chat opens.">عبّئ المعلومات الأساسية، وسنجهزها لك في رسالة واتساب. يمكنك إرفاق صورة المنتج مباشرة بعد فتح المحادثة.</p><a href="mailto:info@younexpower.com">info@younexpower.com</a></div><form class="sourcing-form" data-sourcing-form><div class="form-field"><label for="request-name" data-ar="الاسم أو اسم الشركة" data-en="Name or company">الاسم أو اسم الشركة</label><input id="request-name" name="name" type="text" autocomplete="organization" required></div><div class="form-field"><label for="request-phone" data-ar="رقم الهاتف" data-en="Phone number">رقم الهاتف</label><input id="request-phone" name="phone" type="tel" autocomplete="tel" dir="ltr" required></div><div class="form-field"><label for="request-product" data-ar="اسم المنتج" data-en="Product name">اسم المنتج</label><input id="request-product" name="product" type="text" required></div><div class="form-field"><label for="request-quantity" data-ar="الكمية المطلوبة" data-en="Required quantity">الكمية المطلوبة</label><input id="request-quantity" name="quantity" type="text" required></div><div class="form-field form-field-full"><label for="request-link" data-ar="رابط المنتج (اختياري)" data-en="Product link (optional)">رابط المنتج (اختياري)</label><input id="request-link" name="productLink" type="url" inputmode="url" dir="ltr" placeholder="https://"></div><div class="form-field"><label for="request-color" data-ar="اللون المطلوب (اختياري)" data-en="Preferred color (optional)">اللون المطلوب (اختياري)</label><input id="request-color" name="color" type="text"></div><div class="form-field"><label for="request-branding" data-ar="التخصيص" data-en="Customization">التخصيص</label><select id="request-branding" name="branding"><option value="" data-ar="بدون تخصيص" data-en="No customization">بدون تخصيص</option><option value="logo" data-ar="طباعة شعار أو علامة تجارية" data-en="Logo or private label">طباعة شعار أو علامة تجارية</option><option value="logo-packaging" data-ar="شعار وتغليف مخصص" data-en="Logo and custom packaging">شعار وتغليف مخصص</option></select></div><div class="form-field form-field-full"><label for="request-delivery" data-ar="مكان التسليم" data-en="Delivery location">مكان التسليم</label><input id="request-delivery" name="delivery" type="text" required></div><div class="form-field form-field-full"><label for="request-details" data-ar="المواصفات أو الملاحظات" data-en="Specifications or notes">المواصفات أو الملاحظات</label><textarea id="request-details" name="details" rows="4"></textarea></div><button class="button button-whatsapp form-submit" type="submit" data-ar="إرسال الطلب عبر واتساب" data-en="Send request on WhatsApp">إرسال الطلب عبر واتساب</button><p class="form-note" data-ar="لن يتم حفظ بياناتك في الموقع؛ ستُستخدم فقط لتجهيز رسالة واتساب." data-en="Your data is not stored on this website; it is only used to prepare your WhatsApp message.">لن يتم حفظ بياناتك في الموقع؛ ستُستخدم فقط لتجهيز رسالة واتساب.</p></form></section>`;

write('services/index.html', page({
  titleAr: 'خدمات التوريد والتخصيص | مركز يونكس',
  titleEn: 'Sourcing & Customization Services | Younex Power Center',
  headTitle: 'خدمات توريد وتجهيز المشاريع والمعدات في سوريا | Younex',
  description: servicesDescription,
  canonical: servicesCanonical,
  image: `${origin}/assets/images/services/bulk-sourcing.webp`,
  active: 'services',
  schema: servicesSchema,
  content: `<section class="services-page"><div class="services-hero"><img src="/assets/images/services/bulk-sourcing.webp" alt="خدمات التوريد والتخصيص من مركز يونكس" data-alt-ar="خدمات التوريد والتخصيص من مركز يونكس" data-alt-en="Younex sourcing and customization services" width="1880" height="836"><div class="services-hero-overlay"></div><div class="container services-hero-copy"><span class="section-kicker" data-ar="للتجار والشركات والمشاريع" data-en="FOR TRADERS, COMPANIES & PROJECTS">للتجار والشركات والمشاريع</span><h1 data-ar="خدمات التوريد والتخصيص" data-en="Sourcing & customization services">خدمات التوريد والتخصيص</h1><p data-ar="من اختيار المنتج إلى تسليمه في موقعك: نؤمّن المعدات والآلات بالكميات المطلوبة، مع خيارات تخصيص اللون والشعار والعلامة التجارية والتغليف." data-en="From product selection to delivery at your location: we source equipment and machinery in the quantities you need, with options for custom colors, logos, private labeling and packaging.">من اختيار المنتج إلى تسليمه في موقعك: نؤمّن المعدات والآلات بالكميات المطلوبة، مع خيارات تخصيص اللون والشعار والعلامة التجارية والتغليف.</p><a class="button button-primary" href="#service-request" data-scroll-target="service-request" data-ar="أرسل طلبك الآن" data-en="Send your request">أرسل طلبك الآن</a></div></div><div class="container services-content"><section class="services-intro"><span class="section-kicker" data-ar="حلول مرنة لأعمالك" data-en="FLEXIBLE BUSINESS SOLUTIONS">حلول مرنة لأعمالك</span><h2 data-ar="أخبرنا بما تحتاجه، ونحن نتولى الباقي" data-en="Tell us what you need — we handle the rest">أخبرنا بما تحتاجه، ونحن نتولى الباقي</h2><p data-ar="نوفر للتجار والشركات وأصحاب المشاريع المعدات الكهربائية والصناعية، معدات البناء، المولدات، مضخات المياه، الآلات والمعدات الثقيلة. يكفي أن ترسل صورة المنتج أو رابطه مع الكمية والمواصفات المطلوبة." data-en="We help traders, companies and project owners source power tools, industrial equipment, construction machinery, generators, water pumps and heavy equipment. Simply send a product photo or link with the required quantity and specifications.">نوفر للتجار والشركات وأصحاب المشاريع المعدات الكهربائية والصناعية، معدات البناء، المولدات، مضخات المياه، الآلات والمعدات الثقيلة. يكفي أن ترسل صورة المنتج أو رابطه مع الكمية والمواصفات المطلوبة.</p></section><div class="service-feature-grid"><article class="service-feature-card service-feature-card-wide"><img src="/assets/images/services/custom-branding.webp" alt="تخصيص ألوان وشعارات المنتجات" data-alt-ar="تخصيص ألوان وشعارات المنتجات" data-alt-en="Custom product colors, logos and packaging" loading="lazy" width="1280" height="853"><div><span>01</span><h3 data-ar="تخصيص المنتج والعلامة التجارية" data-en="Product & brand customization">تخصيص المنتج والعلامة التجارية</h3><p data-ar="اختر لون المنتج، وأضف شعار شركتك أو اسم علامتك التجارية على المنتج والملصقات والتغليف حسب رغبتك." data-en="Choose the product color and add your company logo or private label to the product, labels and packaging.">اختر لون المنتج، وأضف شعار شركتك أو اسم علامتك التجارية على المنتج والملصقات والتغليف حسب رغبتك.</p></div></article><article class="service-feature-card service-feature-card-wide"><img src="/assets/images/services/delivery.webp" alt="توصيل طلبيات المعدات داخل سوريا" data-alt-ar="توصيل طلبيات المعدات داخل سوريا" data-alt-en="Commercial equipment delivery across Syria" loading="lazy" width="1280" height="853"><div><span>02</span><h3 data-ar="توريد الكميات والتوصيل" data-en="Bulk sourcing & delivery">توريد الكميات والتوصيل</h3><p data-ar="نوفر المنتجات المعروضة في متجرنا أو المنتجات التي تختارها بكميات تجارية، ونسلّمها إلى الموقع الذي تحدده داخل سوريا." data-en="Order products shown in our store—or products you select—in commercial quantities, delivered to your chosen location in Syria.">نوفر المنتجات المعروضة في متجرنا أو المنتجات التي تختارها بكميات تجارية، ونسلّمها إلى الموقع الذي تحدده داخل سوريا.</p></div></article><article class="service-feature-card service-feature-card-wide"><img src="/assets/images/services/power-tool-accessories.webp" alt="إكسسوارات الباور تولز من ريش وأقراص قص وجلخ ولقم مفكات" data-alt-ar="إكسسوارات الباور تولز من ريش وأقراص قص وجلخ ولقم مفكات" data-alt-en="Power tool accessories including drill bits, cutting and grinding discs, and screwdriver bits" loading="lazy" width="1536" height="1024"><div><span>03</span><h3 data-ar="إكسسوارات ومستلزمات الباور تولز" data-en="Power tool accessories">إكسسوارات ومستلزمات الباور تولز</h3><p data-ar="نوفر ريش الدريل، لقم المفكات، أقراص القص والجلخ، مناشير الفتح، وأقراص الصنفرة بالكميات والمواصفات المطلوبة." data-en="We source drill bits, screwdriver bits, cutting and grinding discs, hole saws, and sanding discs in the quantities and specifications you need.">نوفر ريش الدريل، لقم المفكات، أقراص القص والجلخ، مناشير الفتح، وأقراص الصنفرة بالكميات والمواصفات المطلوبة.</p></div></article></div><section class="service-categories"><h2 data-ar="ماذا يمكننا أن نوفر؟" data-en="What can we source?">ماذا يمكننا أن نوفر؟</h2><div class="service-category-list"><span data-ar="معدات كهربائية" data-en="Power tools">معدات كهربائية</span><span data-ar="إكسسوارات الباور تولز" data-en="Power tool accessories">إكسسوارات الباور تولز</span><span data-ar="معدات صناعية" data-en="Industrial equipment">معدات صناعية</span><span data-ar="معدات بناء" data-en="Construction equipment">معدات بناء</span><span data-ar="مولدات كهربائية" data-en="Generators">مولدات كهربائية</span><span data-ar="مضخات مياه" data-en="Water pumps">مضخات مياه</span><span data-ar="آلات ومعدات ثقيلة" data-en="Machinery & heavy equipment">آلات ومعدات ثقيلة</span></div></section><section class="service-process"><div class="service-section-heading"><span class="section-kicker" data-ar="خطوات واضحة" data-en="A SIMPLE PROCESS">خطوات واضحة</span><h2 data-ar="كيف تطلب خدمة التوريد؟" data-en="How to request sourcing">كيف تطلب خدمة التوريد؟</h2></div><ol><li><b>1</b><div><strong data-ar="أرسل المنتج" data-en="Send the product">أرسل المنتج</strong><span data-ar="أرسل صورة المنتج أو رابطه على الإنترنت." data-en="Send a product photo or online link.">أرسل صورة المنتج أو رابطه على الإنترنت.</span></div></li><li><b>2</b><div><strong data-ar="حدد التفاصيل" data-en="Specify the details">حدد التفاصيل</strong><span data-ar="أخبرنا بالكمية والمواصفات واللون وخيارات الشعار والتغليف." data-en="Tell us the quantity, specifications, color, logo and packaging options.">أخبرنا بالكمية والمواصفات واللون وخيارات الشعار والتغليف.</span></div></li><li><b>3</b><div><strong data-ar="استلم العرض" data-en="Receive the quote">استلم العرض</strong><span data-ar="نراجع الطلب ونرسل السعر ومدة التوريد والتفاصيل." data-en="We review the request and send the price, lead time and details.">نراجع الطلب ونرسل السعر ومدة التوريد والتفاصيل.</span></div></li><li><b>4</b><div><strong data-ar="التوريد والتسليم" data-en="Sourcing & delivery">التوريد والتسليم</strong><span data-ar="بعد الاتفاق نتابع الطلب حتى تسليمه في الموقع المحدد." data-en="Once agreed, we manage the order through delivery to your location.">بعد الاتفاق نتابع الطلب حتى تسليمه في الموقع المحدد.</span></div></li></ol></section>${serviceRequestForm}</div></section>`
}));

const aboutCanonical = `${origin}/about/`;
write('about/index.html', page({
  titleAr: 'من نحن | مركز يونكس للمعدات والطاقة',
  titleEn: 'About Younex Power Center',
  headTitle: 'من نحن | مركز يونكس للمعدات والطاقة في درعا',
  description: 'مركز يونكس للمعدات والطاقة في الطيبة، درعا: معدات كهربائية ومولدات ومضخات مياه، وخدمات توريد وتخصيص وشحن وتخليص جمركي للتجار والمشاريع.',
  canonical: aboutCanonical,
  image: `${origin}/assets/images/logo-younex.png`,
  active: 'about',
  schema: { '@context': 'https://schema.org', '@type': 'AboutPage', '@id': aboutCanonical, url: aboutCanonical, name: 'عن مركز يونكس للمعدات والطاقة', inLanguage: ['ar', 'en'], about: { '@type': 'HardwareStore', name: 'Younex Power Center', telephone: '+963953728253', email: 'info@younexpower.com', hasMap: 'https://maps.app.goo.gl/1JqNdXCCJAQ686aG9', geo: { '@type': 'GeoCoordinates', latitude: 32.565238, longitude: 36.239266 }, address: { '@type': 'PostalAddress', streetAddress: 'خلف المخفر', addressLocality: 'الطيبة', addressRegion: 'درعا', addressCountry: 'SY' } } },
  content: `<div class="about-layout container"><div class="about-copy"><span class="section-kicker" data-ar="من نحن" data-en="ABOUT US">من نحن</span><h1 data-ar="مركز يونكس للمعدات والطاقة" data-en="Younex Power Center">مركز يونكس للمعدات والطاقة</h1><p data-ar="مركز يونكس للمعدات والطاقة في الطيبة، درعا، يوفر المعدات الكهربائية والمولدات ومضخات المياه ومعدات البناء، إضافة إلى قطع الغيار والصيانة والكفالة." data-en="Younex Power Center in Al-Taybah, Daraa, supplies power tools, generators, water pumps and construction equipment, along with spare parts, maintenance and warranty services.">مركز يونكس للمعدات والطاقة في الطيبة، درعا، يوفر المعدات الكهربائية والمولدات ومضخات المياه ومعدات البناء، إضافة إلى قطع الغيار والصيانة والكفالة.</p><div class="service-tags" data-nosnippet>
    <span data-ar="معدات كهربائية" data-en="Power tools">معدات كهربائية</span>
    <span data-ar="مولدات" data-en="Generators">مولدات</span>
    <span data-ar="مضخات مياه" data-en="Water pumps">مضخات مياه</span>
    <span data-ar="معدات بناء" data-en="Construction equipment">معدات بناء</span>
    <span data-ar="قطع غيار" data-en="Spare parts">قطع غيار</span>
    <span data-ar="صيانة وكفالة" data-en="Service & warranty">صيانة وكفالة</span>
  </div></div><aside class="contact-panel"><img src="/assets/images/logo-younex.png" alt="Younex Power Center"><div class="contact-list"><a href="https://maps.google.com/?q=Al-Taybah,Daraa,Syria" target="_blank" rel="noopener"><span><small data-ar="العنوان" data-en="Address">العنوان</small><strong data-ar="سورية - درعا - الطيبة - خلف المخفر" data-en="Behind the police station, Al-Taybah, Daraa, Syria">سورية - درعا - الطيبة - خلف المخفر</strong></span></a><a href="tel:+963953728253"><span><small data-ar="الهاتف وواتساب" data-en="Phone & WhatsApp">الهاتف وواتساب</small><strong dir="ltr">+963 953 728 253</strong></span></a><a href="mailto:info@younexpower.com"><span><small data-ar="البريد الإلكتروني" data-en="Email">البريد الإلكتروني</small><strong>info@younexpower.com</strong></span></a><div><span><small data-ar="ساعات العمل" data-en="Opening hours">ساعات العمل</small><strong data-ar="السبت–الخميس: 9 صباحًا–1 مساءً، ثم 2 مساءً–5 مساءً" data-en="Saturday–Thursday: 9 AM–1 PM, then 2–5 PM">السبت–الخميس: 9 صباحًا–1 مساءً، ثم 2 مساءً–5 مساءً</strong><em data-ar="استراحة: 1–2 مساءً · الجمعة مغلق" data-en="Break: 1–2 PM · Friday: Closed">استراحة: 1–2 مساءً · الجمعة مغلق</em></span></div></div></aside></div>`
}));

const sitemapUrls = [
  `${origin}/`,
  productsCanonical,
  servicesCanonical,
  aboutCanonical,
  ...catalog.categories.map((category) => `${origin}/products/${category.id}/`),
  ...catalog.products.map((product) => `${origin}/products/${product.slug}/`)
];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${updated}</lastmod>\n  </url>`).join('\n')}\n</urlset>\n`);

console.log(`Generated ${catalog.categories.length} category pages, ${catalog.products.length} product pages, products/about pages, and sitemap.xml.`);
