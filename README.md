# Younex Power Center Website

A responsive Arabic/English catalog and sourcing-services website for Younex Power Center, published with GitHub Pages at `younexpower.com`.

## Pages

- Home and product carousel
- Product categories and individual product pages
- Sourcing and customization services with WhatsApp quote form
- About, contact information and store location

## Technology

Plain HTML, CSS and JavaScript. No build step or paid hosting is required.

Run `node tools/generate-seo-pages.cjs` after changing product data or shared static-page markup.


 # Younex error pages

1) Upload 404.html to the repository root:
   /404.html

GitHub Pages will automatically use this page for missing URLs.
If the missing URL starts with /products/, the page automatically changes its message to a product-specific message.

2) Optional: upload product-unavailable.html to:
   /product-unavailable.html

Use this page when you intentionally retire a known product and want to point old links to a friendly product-unavailable page.

Recommended:
- Always install 404.html.
- product-unavailable.html is optional and useful only when you can preserve/redirect known old product links.

