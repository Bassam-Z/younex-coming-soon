const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const localeDirectory = path.join(root, 'locales');

const pairs = [
  { group: 'content', pattern: /\s+data-ar="([^"]*)"\s+data-en="([^"]*)"/g, attribute: 'data-i18n' },
  { group: 'aria', pattern: /\s+data-aria-ar="([^"]*)"\s+data-aria-en="([^"]*)"/g, attribute: 'data-i18n-aria' },
  { group: 'alt', pattern: /\s+data-alt-ar="([^"]*)"\s+data-alt-en="([^"]*)"/g, attribute: 'data-i18n-alt' },
  { group: 'title', pattern: /\s+data-title-ar="([^"]*)"\s+data-title-en="([^"]*)"/g, attribute: 'data-i18n-title' }
];

function decode(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

function slug(value) {
  const clean = decode(value).toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
    .split('_').slice(0, 7).join('_');
  return clean || 'text';
}

function keyFor(group, ar, en) {
  const hash = crypto.createHash('sha1').update(`${decode(ar)}\0${decode(en)}`).digest('hex').slice(0, 7);
  return `${group}.${slug(en)}_${hash}`;
}

function collect(html, arLocale, enLocale) {
  for (const definition of pairs) {
    for (const match of html.matchAll(definition.pattern)) {
      const ar = decode(match[1]);
      const en = decode(match[2]);
      const key = keyFor(definition.group, ar, en).split('.').slice(1).join('.');
      arLocale[definition.group][key] = ar;
      enLocale[definition.group][key] = en;
    }
  }
}

function localeHas(locale, dottedKey) {
  return dottedKey.split('.').reduce((value, segment) => value && value[segment], locale) !== undefined;
}

function compileHtml(html, options = {}) {
  const arLocale = options.arLocale || JSON.parse(fs.readFileSync(path.join(localeDirectory, 'ar.json'), 'utf8'));
  const enLocale = options.enLocale || JSON.parse(fs.readFileSync(path.join(localeDirectory, 'en.json'), 'utf8'));
  let output = html;
  for (const definition of pairs) {
    output = output.replace(definition.pattern, (full, ar, en) => {
      const key = keyFor(definition.group, ar, en);
      if (!localeHas(arLocale, key) || !localeHas(enLocale, key)) {
        throw new Error(`Missing translation key ${key}. Run: node tools/i18n-compiler.cjs --extract`);
      }
      return ` ${definition.attribute}="${key}"`;
    });
  }
  return enhanceDocument(output);
}

function loaderMarkup() {
  return `<div class="i18n-loader" id="i18n-loader" role="status" aria-live="polite" aria-label="جارٍ تحميل موقع يونكس" data-i18n-aria="loader.aria">
  <div class="i18n-loader-visual" aria-hidden="true">
    <span class="i18n-loader-ring"></span>
    <svg viewBox="0 0 64 64"><path d="M35 3 14 36h16l-2 25 22-36H34z"></path></svg>
  </div>
  <strong>YOUNEX</strong>
  <span data-i18n="loader.loading">جارٍ تجهيز الموقع...</span>
  <i aria-hidden="true"><b></b></i>
</div>
<script>window.setTimeout(function(){var b=document.body;if(b&&b.classList.contains('i18n-pending')){b.classList.remove('i18n-pending','i18n-loader-visible');b.classList.add('i18n-ready');}},4000);</script>`;
}

function enhanceDocument(html) {
  let output = html;
  output = output.replace(/(<div class="i18n-loader"[^>]*)(>)/, (match, opening, close) => opening.includes('data-i18n-aria=') ? match : `${opening} data-i18n-aria="loader.aria"${close}`);
  if (!output.includes('/locales/ar.json')) {
    output = output.replace('</head>', '  <link rel="preload" href="/locales/ar.json?v=30" as="fetch" crossorigin>\n</head>');
  }
  if (!output.includes('/locales/en.json')) output = output.replace('</head>', '  <link rel="preload" href="/locales/en.json?v=30" as="fetch" crossorigin>\n</head>');
  if (!output.includes('/i18n.js')) output = output.replace('</head>', '  <script src="/i18n.js?v=3" defer></script>\n</head>');
  output = output.replace(/\/i18n\.js\?v=\d+/g, '/i18n.js?v=3');
  output = output.replace(/<link rel="stylesheet" href="([^"?]+)(?:\?v=\d+)?"\s*\/?\s*>/, '<link rel="stylesheet" href="$1?v=23">');
  if (!output.includes('class="i18n-loader"')) {
    output = output.replace(/<body([^>]*)>/, (match, attributes) => {
      if (/\bclass=/.test(attributes)) {
        return `<body${attributes.replace(/class="([^"]*)"/, 'class="$1 i18n-pending"')}>${loaderMarkup()}`;
      }
      return `<body${attributes} class="i18n-pending">${loaderMarkup()}`;
    });
  }
  return output;
}

function htmlFiles(directory) {
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...htmlFiles(target));
    else if (entry.isFile() && entry.name.endsWith('.html')) result.push(target);
  }
  return result;
}

function extractAndMigrate() {
  const arPath = path.join(localeDirectory, 'ar.json');
  const enPath = path.join(localeDirectory, 'en.json');
  const arLocale = fs.existsSync(arPath) ? JSON.parse(fs.readFileSync(arPath, 'utf8')) : { loader: { loading: 'جارٍ تجهيز الموقع...', aria: 'جارٍ تحميل موقع يونكس' }, content: {}, aria: {}, alt: {}, title: {} };
  const enLocale = fs.existsSync(enPath) ? JSON.parse(fs.readFileSync(enPath, 'utf8')) : { loader: { loading: 'Loading Younex...', aria: 'Loading the Younex website' }, content: {}, aria: {}, alt: {}, title: {} };
  arLocale.loader.aria = arLocale.loader.aria || 'جارٍ تحميل موقع يونكس';
  enLocale.loader.aria = enLocale.loader.aria || 'Loading the Younex website';
  const files = htmlFiles(root);
  for (const file of files) collect(fs.readFileSync(file, 'utf8'), arLocale, enLocale);
  fs.mkdirSync(localeDirectory, { recursive: true });
  fs.writeFileSync(arPath, `${JSON.stringify(arLocale, null, 2)}\n`);
  fs.writeFileSync(enPath, `${JSON.stringify(enLocale, null, 2)}\n`);
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    fs.writeFileSync(file, compileHtml(html, { arLocale, enLocale }));
  }
  console.log(`Migrated ${files.length} HTML files and created two locale files.`);
}

if (require.main === module) {
  if (process.argv.includes('--extract')) extractAndMigrate();
  else console.error('Use --extract to migrate the current HTML files.');
}

module.exports = { collect, compileHtml, enhanceDocument, keyFor };
