# Younex translations

All editable Arabic and English interface text is stored in:

- `locales/ar.json`
- `locales/en.json`

Both files use the same keys. Change only the text value and keep the key unchanged. The update appears throughout every page that uses that key.

The published HTML keeps an Arabic fallback generated from the same content for search engines, accessibility, and safe display if JavaScript or a locale request fails. Runtime language switching always uses the JSON files.

After changing a JSON value, validate both files with:

```bash
node -e "JSON.parse(require('fs').readFileSync('locales/ar.json')); JSON.parse(require('fs').readFileSync('locales/en.json'))"
```

To regenerate product, category, services, and about pages:

```bash
node tools/generate-seo-pages.cjs
```

When adding a completely new translated phrase to a template, add the Arabic and English values, then run:

```bash
node tools/i18n-compiler.cjs --extract
```
