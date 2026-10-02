const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const locale = JSON.parse(fs.readFileSync(path.join(root, 'locales/ar.json'), 'utf8'));

function valueAt(source, key) {
  return key.split('.').reduce((value, segment) => value && value[segment], source);
}

function pageId(relativePath) {
  const clean = relativePath.replace(/\\/g, '/').replace(/\/index\.html$/, '').replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
  return (clean || 'index').replace(/[^a-zA-Z0-9_-]+/g, '_').replaceAll('/', '_');
}

function escapeText(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function removeLoader(html) {
  let output = html.replace(/<div class="i18n-loader"[\s\S]*<\/div>\s*<script>window\.setTimeout\(function\(\)\{var b=document\.body;[\s\S]*?<\/script>\s*/m, '');
  output = output.replace(/class="([^"]*)"/g, (match, classes) => {
    const next = classes.split(/\s+/).filter((name) => name && !['i18n-pending', 'i18n-loader-visible', 'i18n-ready'].includes(name));
    return next.length ? `class="${next.join(' ')}"` : '';
  });
  return output.replace(/<body([^>]*)\s{2,}([^>]*)>/, '<body$1 $2>');
}

function injectTextFallbacks(html) {
  const protectedBlocks = [];
  let safe = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, (block) => `@@YOUNEX_BLOCK_${protectedBlocks.push(block) - 1}@@`);
  const stack = [];
  let output = '';

  for (const token of safe.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]+>|[^<]+/g) || []) {
    if (!token.startsWith('<')) {
      if (stack.length && token.trim()) stack[stack.length - 1].hasDirectText = true;
      output += token;
      continue;
    }

    const closing = token.match(/^<\/\s*([\w-]+)/);
    if (closing) {
      const frame = stack.pop();
      if (frame && frame.key && !frame.hasDirectText) {
        const fallback = valueAt(locale, frame.key);
        if (typeof fallback === 'string' && fallback) output += escapeText(fallback);
      }
      output += token;
      continue;
    }

    output += token;
    const opening = token.match(/^<\s*([\w-]+)/);
    if (!opening || /\/\s*>$/.test(token) || /^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(opening[1])) continue;
    const key = token.match(/\sdata-i18n="([^"]+)"/);
    stack.push({ key: key ? key[1] : '', hasDirectText: false });
  }

  return output.replace(/@@YOUNEX_BLOCK_(\d+)@@/g, (match, index) => protectedBlocks[Number(index)]);
}

function injectSeoFallbacks(html, relativePath) {
  const seo = valueAt(locale, `seo.pages.${pageId(relativePath)}`);
  if (!seo) return html;
  let output = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeText(seo.title || '')}</title>`);
  const values = {
    description: seo.description,
    'og:title': seo.ogTitle,
    'og:description': seo.ogDescription,
    'og:image:alt': seo.imageAlt,
    'twitter:title': seo.ogTitle,
    'twitter:description': seo.ogDescription
  };
  output = output.replace(/(<meta\s+(?:name|property)="([^"]+)"\s+content=")[^"]*(")/g, (match, start, name, end) => {
    return typeof values[name] === 'string' ? `${start}${escapeText(values[name])}${end}` : match;
  });
  if (seo.schema) {
    const schema = JSON.stringify(seo.schema).replaceAll('<', '\\u003c');
    output = output.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/, `<script type="application/ld+json" data-i18n-schema="seo.pages.${pageId(relativePath)}.schema">${schema}</script>`);
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

for (const file of htmlFiles(root)) {
  const relativePath = path.relative(root, file);
  let html = fs.readFileSync(file, 'utf8');
  html = removeLoader(html);
  html = injectTextFallbacks(html);
  html = injectSeoFallbacks(html, relativePath);
  html = html.replace(/\s*<link rel="preload" href="\/locales\/(?:ar|en)\.json\?v=\d+" as="fetch" crossorigin>\s*/g, '\n');
  fs.writeFileSync(file, html);
}

console.log('Prerendered Arabic fallbacks and removed the blocking loader from all HTML pages.');
