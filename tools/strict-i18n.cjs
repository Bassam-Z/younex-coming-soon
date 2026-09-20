const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const arPath = path.join(root, 'locales/ar.json');
const enPath = path.join(root, 'locales/en.json');
const arabic = /[\u0600-\u06ff]/;

function pageId(relativePath) {
  const clean = relativePath.replace(/\\/g, '/').replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
  return (clean || 'home').replace(/[^a-zA-Z0-9_-]+/g, '_').replaceAll('/', '_');
}

function valueAt(locale, key) {
  return key.split('.').reduce((value, part) => value && value[part], locale);
}

function attr(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1] : '';
}

function englishDescription(html, enLocale, title) {
  const values = [...html.matchAll(/data-i18n="([^"]+)"/g)]
    .map((match) => valueAt(enLocale, match[1]))
    .filter((value) => typeof value === 'string' && value.length >= 70 && value.length <= 320)
    .sort((a, b) => b.length - a.length);
  return values[0] || `${title}. Explore Younex products, equipment and sourcing services in Syria.`;
}

function englishSchema(value) {
  if (Array.isArray(value)) return value.map(englishSchema);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, englishSchema(item)]).filter(([, item]) => item !== ''));
  }
  if (typeof value !== 'string' || !arabic.test(value)) return value;
  const known = {
    'مركز يونكس للمعدات والطاقة': 'Younex Power Center',
    'خلف المخفر': 'Behind the police station',
    'الطيبة': 'Al-Taybah',
    'درعا': 'Daraa',
    'درعا، سورية': 'Daraa, Syria'
  };
  if (known[value]) return known[value];
  const latin = value.replace(/[\u0600-\u06ff]+/g, ' ').replace(/[—،]+/g, ' ').replace(/\s+/g, ' ').trim();
  return /[A-Za-z]/.test(latin) ? latin : '';
}

function collectSeo(html, relativePath, arLocale, enLocale) {
  const id = pageId(relativePath);
  const titleKey = attr(html, /<body[^>]*data-i18n-title="([^"]+)"/);
  const currentTitle = attr(html, /<title>([\s\S]*?)<\/title>/);
  const titleAr = valueAt(arLocale, titleKey) || currentTitle;
  const titleEn = valueAt(enLocale, titleKey) || currentTitle.replace(arabic, '').trim() || 'Younex Power Center';
  const descriptionAr = attr(html, /<meta\s+name="description"\s+content="([^"]*)"/);
  const descriptionEn = englishDescription(html, enLocale, titleEn);
  const schemaMatch = html.match(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  let schema = null;
  if (schemaMatch && schemaMatch[1].trim()) {
    try { schema = JSON.parse(schemaMatch[1]); } catch (error) { schema = null; }
  }
  arLocale.seo.pages[id] = {
    title: titleAr,
    description: descriptionAr,
    ogTitle: attr(html, /<meta\s+property="og:title"\s+content="([^"]*)"/) || titleAr,
    ogDescription: attr(html, /<meta\s+property="og:description"\s+content="([^"]*)"/) || descriptionAr,
    imageAlt: attr(html, /<meta\s+property="og:image:alt"\s+content="([^"]*)"/) || titleAr,
    schema
  };
  enLocale.seo.pages[id] = {
    title: titleEn,
    description: descriptionEn,
    ogTitle: titleEn,
    ogDescription: descriptionEn,
    imageAlt: `${titleEn} — Younex Power Center`,
    schema: schema ? englishSchema(schema) : null
  };
}

function autoEnglish(value, attribute) {
  const known = {
    'الصورة السابقة': 'Previous image',
    'الصورة التالية': 'Next image',
    'الرجوع إلى الصفحة السابقة': 'Back to the previous page',
    'جارٍ تحميل موقع يونكس': 'Loading the Younex website'
  };
  if (known[value]) return known[value];
  const image = value.match(/^عرض الصورة (\d+)$/);
  if (image) return `View image ${image[1]}`;
  if (attribute === 'alt') return 'Younex product image';
  return 'Younex interface control';
}

function autoKey(group, ar, en) {
  const hash = crypto.createHash('sha1').update(`${ar}\0${en}`).digest('hex').slice(0, 7);
  return `${group}.runtime_${hash}`;
}

function localizeArabicAttributes(html, arLocale, enLocale, collect) {
  return html.replace(/<[^!][^>]*>/g, (tag) => {
    for (const [attribute, group, marker] of [['aria-label', 'aria', 'data-i18n-aria'], ['alt', 'alt', 'data-i18n-alt'], ['data-gallery-alt', 'alt', 'data-i18n-gallery-alt'], ['placeholder', 'content', 'data-i18n-placeholder'], ['title', 'content', 'data-i18n-title-attr']]) {
      const match = tag.match(new RegExp(`\\s${attribute}="([^"]*)"`));
      if (!match || !arabic.test(match[1])) continue;
      let key = attr(tag, new RegExp(`${marker}="([^"]+)"`));
      if (!key) {
        const en = autoEnglish(match[1], attribute);
        key = autoKey(group, match[1], en);
        if (collect) {
          const shortKey = key.split('.').slice(1).join('.');
          arLocale[group][shortKey] = match[1];
          enLocale[group][shortKey] = en;
        }
        tag = tag.replace(/\s*\/?\s*>$/, (ending) => ` ${marker}="${key}"${ending}`);
      }
      tag = tag.replace(new RegExp(`(\\s${attribute}=)"[^"]*"`), `$1""`);
    }
    return tag;
  });
}

function stripTranslatedText(html) {
  const blocks = [];
  let safe = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (block) => `@@YOUNEX_BLOCK_${blocks.push(block) - 1}@@`);
  const stack = [];
  safe = safe.replace(/<!--[\s\S]*?-->|<![^>]*>|<[^>]+>|[^<]+/g, (token) => {
    if (!token.startsWith('<')) return stack.length && stack[stack.length - 1].translated && token.trim() ? '' : token;
    const closing = token.match(/^<\/\s*([\w-]+)/);
    if (closing) { stack.pop(); return token; }
    const opening = token.match(/^<\s*([\w-]+)/);
    if (!opening || /\/\s*>$/.test(token) || /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(opening[1])) return token;
    stack.push({ translated: /\sdata-i18n="/.test(token) });
    return token;
  });
  return safe.replace(/@@YOUNEX_BLOCK_(\d+)@@/g, (match, index) => blocks[Number(index)]);
}

function strictCompileHtml(html, relativePath, options = {}) {
  const arLocale = options.arLocale || JSON.parse(fs.readFileSync(arPath, 'utf8'));
  const enLocale = options.enLocale || JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const id = pageId(relativePath);
  let output = localizeArabicAttributes(html, arLocale, enLocale, Boolean(options.collect));
  output = output.replaceAll('/locales/ar.json?v=29', '/locales/ar.json?v=30').replaceAll('/locales/en.json?v=29', '/locales/en.json?v=30').replaceAll('/i18n.js?v=1', '/i18n.js?v=2');
  output = output.replace(/<script>[\s\S]*?<\/script>/g, (block) => {
    if (block.includes("document.querySelectorAll('[data-ar][data-en]')")) return '';
    if (block.includes('const isProductPath')) {
      return `<script>
(function () {
  if (!window.location.pathname.startsWith('/products/')) return;
  var title = document.getElementById('error-title');
  var description = document.getElementById('error-description');
  if (title) title.setAttribute('data-i18n', 'content.this_product_is_no_longer_available_b07aff0');
  if (description) description.setAttribute('data-i18n', 'content.this_model_may_have_been_discontinued_or_7a831fb');
  if (window.YounexI18n) window.YounexI18n.ready.then(function () { window.YounexI18n.apply(document); });
}());
</script>`;
    }
    return block;
  });
  output = stripTranslatedText(output);
  output = output.replace(/<title>[\s\S]*?<\/title>/, '<title></title>');
  output = output.replace(/(<meta\s+(?:name|property)="(?:description|og:title|og:description|og:image:alt|twitter:title|twitter:description)"\s+content=")([^"]*)(")/g, '$1$3');
  output = output.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/, `<script type="application/ld+json" data-i18n-schema="seo.pages.${id}.schema"></script>`);
  output = output.replace(/<body([^>]*)>/, (match, attributes) => attributes.includes('data-i18n-page=') ? match : `<body${attributes} data-i18n-page="${id}">`);
  if (arabic.test(output)) {
    const position = output.search(arabic);
    throw new Error(`Arabic text remains in ${relativePath}: ${output.slice(Math.max(0, position - 80), position + 180)}`);
  }
  return output;
}

function htmlFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...htmlFiles(target));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(target);
  }
  return files;
}

function migrate() {
  const arLocale = JSON.parse(fs.readFileSync(arPath, 'utf8'));
  const enLocale = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  arLocale.seo = { pages: {} };
  enLocale.seo = { pages: {} };
  const files = htmlFiles(root);
  for (const file of files) collectSeo(fs.readFileSync(file, 'utf8'), path.relative(root, file), arLocale, enLocale);
  const transformed = files.map((file) => [file, strictCompileHtml(fs.readFileSync(file, 'utf8'), path.relative(root, file), { arLocale, enLocale, collect: true })]);
  fs.writeFileSync(arPath, `${JSON.stringify(arLocale, null, 2)}\n`);
  fs.writeFileSync(enPath, `${JSON.stringify(enLocale, null, 2)}\n`);
  for (const [file, content] of transformed) fs.writeFileSync(file, content);
  console.log(`Strict JSON migration completed for ${files.length} HTML files.`);
}

function compileAll() {
  const files = htmlFiles(root);
  for (const file of files) {
    const relativePath = path.relative(root, file);
    fs.writeFileSync(file, strictCompileHtml(fs.readFileSync(file, 'utf8'), relativePath));
  }
  console.log(`Strict JSON compilation completed for ${files.length} HTML files.`);
}

if (require.main === module && process.argv.includes('--migrate')) migrate();
if (require.main === module && process.argv.includes('--compile')) compileAll();

module.exports = { strictCompileHtml };
