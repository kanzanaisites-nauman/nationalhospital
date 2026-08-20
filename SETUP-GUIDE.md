# National Hospital Bahawalnagar — Website Setup Guide

## 1. What's in this folder

```
nationalhospital/          ← deploy this folder as the live site root
├── index.html            → homepage
├── style.css             → design system
├── script.js             → interactions + content rendering
├── content.js            → ALL editable content (edit via admin.html)
├── admin.html            → visual content editor
├── doctors/              → 4 full doctor profile pages
│   ├── dr-ayub.html
│   ├── dr-amjad-tahir.html
│   ├── dr-sajjad.html
│   └── dr-zareen-amjad.html
├── assets/               → hospital + doctor photos
├── privacy-policy.html
├── 404.html
├── robots.txt
├── sitemap.xml
└── .htaccess
```

Pure HTML/CSS/JS — no build step, no npm.

## 2. Before booking form works

1. Get a free Access Key from https://web3forms.com
2. Open `admin.html` → Booking Delivery → paste the key
3. Generate & download `content.js`, upload to replace the live file

## 3. Placeholders still to fill (via admin.html or content.js)

- Exact street address
- OPD / visiting hours
- Real domain (replace `DOMAIN_PLACEHOLDER` in index.html, sitemap.xml, robots.txt, doctor pages)
- Google Maps embed
- Google rating value / count / review URL
- Logo & favicon image URLs
- Facebook / YouTube URLs
- YouTube video embed URLs
- Sehat Sahulat panel status (only add if confirmed)
- Real patient testimonials (do not publish placeholders)

## 4. Admin password

Default: `national2026` — change `ADMIN_PASSWORD` near the bottom of `admin.html` before sharing.

## 5. Deploy

Drag this whole folder to Netlify Drop, or upload into cPanel `public_html/` so `index.html` is at the root.
