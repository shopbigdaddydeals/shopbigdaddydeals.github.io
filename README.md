What's new in this release
- Luxury redesign: soft off-white palette, Century Gothic typography, and refined spacing.
- Hero: background video support with graceful fallback and animated CTA.
- Animations: AOS-like reveals and subtle GSAP-style interactions (vanilla IntersectionObserver-driven).
- Products: premium curated product data, quick view modal, wishlist, and animated add-to-cart.
- Cart & Wishlist persisted in `localStorage`.

Note: The cart now persists product options (size/color) using composite keys in localStorage. The product page uses a fly-to-cart animation when GSAP is available.

Notes about included extras
- `assets/videos/hero-loop.mp4` is referenced by the hero; provide a short looped MP4 for best experience. The site gracefully hides the video if not present.
- For production, replace JS-based modals and client-side cart with secure server-backed endpoints and payment providers.
# BigDaddy Deals — Static E‑commerce Template

This repository contains a multi-page, responsive static e‑commerce template for a fictional company "BigDaddy Deals". It's built with HTML5, CSS3, and vanilla JavaScript (optionally Bootstrap 5 is included for utilities). Use this as a starting point for a real storefront.

What's included
- `index.html` — homepage with hero, animated text, featured products, and newsletter CTA
- `pages/` — additional pages: `shop.html`, `product.html`, `cart.html`, `checkout.html`, `login.html`, `signup.html`, `about.html`, `contact.html`, `privacy.html`, `terms.html`
- `css/` — `main.css` and `responsive.css` (layout and responsive styles)
- `js/` — `products.js` (sample product data), `cart.js` (localStorage cart), `validation.js` (form checks), `main.js` (UI interactions)
 - `images/` — SVG/PNG placeholder assets (logo, product placeholders, favicon.png)

Features
- Responsive, modern, minimalist design (black, white, gold color accents)
- Sticky navbar, mobile hamburger menu
- Product grid with hover and CTA
- Product detail page with options
- Cart persisted in `localStorage` (add/remove/update qty)
- Checkout page with shipping/payment form (demo)
- Login/Signup forms with show/hide password and client-side validation
- Newsletter subscription form (demo) and preloader animation

How to view locally (Windows PowerShell)
1. Open the project folder in VS Code or File Explorer.
2. It's best to serve the files over a local HTTP server. If you have Python 3 installed, run in PowerShell:

```powershell
cd 'c:\Users\devva\OneDrive\Documents\GitHub\BigDaddy\shopbigdaddydeals.github.io'
python -m http.server 8000
```

3. Open http://localhost:8000 in your browser. Navigate the pages under `/pages`.

Notes & next steps
- Replace the placeholder SVG images in `/images` with real product photography.
- Integrate a backend or headless commerce API for real product data and secure checkout.
- Add accessibility improvements (ARIA landmarks, keyboard nav) and unit/integration tests.

License: MIT (use and modify freely)
# shopbigdaddydeals.github.io
BigDaddy Deals | Your Deal. Your Happiness. Right Here.
