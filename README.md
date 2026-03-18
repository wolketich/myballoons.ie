# MyBalloons Dublin — Static Website + PWA

A complete, production-ready static website for MyBalloons Dublin. Built with plain HTML, CSS and vanilla JavaScript — no frameworks, no build tools, no dependencies.

---

## 🗂 Project Structure

```
myballoons/
├── index.html                        Homepage
├── collections.html                  Collections overview
├── gallery.html                      Gallery with filters + lightbox
├── custom-order.html                 Custom order enquiry form
├── about.html                        About page
├── reviews.html                      Reviews / testimonials
├── faq.html                          FAQ accordion
├── delivery.html                     Delivery info
├── contact.html                      Contact page
├── thank-you.html                    Post-form success page
├── offline.html                      PWA offline fallback page
├── 404.html                          Not found page
├── manifest.json                     PWA web app manifest
├── sw.js                             Service worker (offline support)
├── sitemap.xml                       XML sitemap
├── robots.txt                        Search engine directives
│
├── collections/                      12 individual collection pages
│   ├── birthday-balloons.html
│   ├── baby-balloons.html
│   ├── valentines-balloons.html
│   ├── mothers-day-balloons.html
│   ├── anniversary-balloons.html
│   ├── kids-character-balloons.html
│   ├── photo-balloons.html
│   ├── rose-balloon-boxes.html
│   ├── teddy-balloon-gifts.html
│   ├── luxury-surprise-balloons.html
│   ├── personalised-gift-balloons.html
│   └── seasonal-event-balloons.html
│
├── seasonal/                         7 seasonal landing pages (SEO)
│   ├── mothers-day-dublin.html
│   ├── valentines-dublin.html
│   ├── birthday-balloons-dublin.html
│   ├── baby-shower-dublin.html
│   ├── personalised-gift-balloons-dublin.html
│   ├── anniversary-dublin.html
│   └── christmas-dublin.html
│
├── case-studies/                     Case studies
│   ├── index.html
│   ├── personalised-birthday-balloon-dublin.html
│   ├── mothers-day-rose-balloon-box-dublin.html
│   ├── minecraft-birthday-balloon-kids-dublin.html
│   ├── valentines-teddy-balloon-gift-photo.html
│   └── luxury-anniversary-balloon-box-roses.html
│
├── css/style.css                     Full design system — all styles
├── js/main.js                        Nav, accordion, gallery, lightbox, SW
└── images/
    ├── icons/                        PWA icons (8 sizes: 72–512px)
    ├── gallery/                      Gallery photos (you add these)
    └── collections/                  Collection images (you add these)
```

---

## 🎨 Design System

### Colour Palette (Pistachio)

| Variable | Hex | Use |
|---|---|---|
| `--rose` | `#7A9E77` | Primary brand — pistachio green |
| `--rose-light` | `#B5CEB3` | Soft sage for italic/accent text |
| `--rose-pale` | `#E5EFE4` | Light pistachio backgrounds |
| `--gold` | `#BFA882` | Warm sand accent |
| `--gold-light` | `#E4D5B8` | Light sand for backgrounds |
| `--ivory` | `#F7F5F0` | Main background |
| `--ivory-dark` | `#EAE5DA` | Slightly darker sections |
| `--charcoal` | `#2C2320` | Primary text + dark sections |
| `--charcoal-mid` | `#4A5E48` | Secondary text (green-grey) |
| `--warm-grey` | `#8A9E88` | Subtle labels and metadata |

### Typography
- **Display / Headings:** Cormorant Garamond (Google Fonts)
- **Body / UI:** Jost (Google Fonts)

---

## ✏️ How to Edit

### Text Content
Open any `.html` file in a text editor and edit directly. The markup is plain and readable.

### Contact Details
All contact info is already set to:
- **Phone 1:** 085 114 0753
- **Phone 2:** 089 471 4339
- **WhatsApp 1:** https://wa.me/353851140753
- **WhatsApp 2:** https://wa.me/353894714339
- **Email 1:** hello@myballoons.ie
- **Email 2:** order@myballoons.ie
- **Instagram:** https://instagram.com/myballoons

To change any of these, use **Find & Replace All** (Ctrl+H / Cmd+H) across the whole folder in your text editor.

---

## 🖼 Replacing Placeholder Images

Photos are currently emoji placeholders in coloured divs. To replace:

1. Add your photos to `images/gallery/`, `images/collections/` etc.
2. Swap the placeholder div for an `<img>` tag:

```html
<!-- Before -->
<div style="height:200px;background:...;font-size:3rem;">🎈</div>

<!-- After -->
<img src="../images/collections/birthday-hero.jpg"
     alt="Birthday balloon arrangement Dublin"
     width="800" height="400" loading="lazy">
```

**Compress all images** before uploading — use [squoosh.app](https://squoosh.app). Aim for under 200KB per image.

---

## 📬 Connecting the Forms

Forms currently redirect to `thank-you.html` on submit (client-side only).

### Formspree (recommended)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a form, copy your ID
3. In `custom-order.html` and `contact.html`, update the `<form>` tag:
```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
```

### Netlify Forms
If hosting on Netlify, simply add `netlify` attribute:
```html
<form name="custom-order" netlify>
```

---

## 📱 PWA (Progressive Web App)

The site is fully PWA-ready:

- **`manifest.json`** — app name, icons, theme colour, shortcuts
- **`sw.js`** — service worker with smart caching (assets cached first, pages network-first)
- **`offline.html`** — branded offline fallback page
- **Icons** — 8 PNG sizes (72px → 512px) in `images/icons/`

### What this means for users:
- On **Android**: "Add to Home Screen" prompt appears automatically (Chrome)
- On **iOS**: Users can "Add to Home Screen" from Safari share menu
- **Offline**: Cached pages load without internet; offline page shown for uncached ones
- **App shortcuts**: Long-press the home screen icon → quick links to Order, WhatsApp, Collections

### To update the app icon:
Replace the PNG files in `images/icons/` with your own branded images at the same sizes. The SVG master is at `images/icons/icon.svg`.

---

## 📱 Mobile Bottom Bar

A fixed bottom navigation bar appears on screens under 768px:
- **Home** · **Collections** · **Order Now** (highlighted) · **WhatsApp** · **Gallery**

The bar respects iPhone safe areas (notch/home indicator). Body padding is added automatically so content doesn't get hidden behind it.

---

## 🌐 Hosting

This is a plain static site — host anywhere:

| Host | How |
|---|---|
| **Netlify** | Drag-and-drop the folder at app.netlify.com (free, forms included) |
| **Vercel** | `vercel` CLI or GitHub import |
| **GitHub Pages** | Push to repo → enable Pages |
| **Any web host** | FTP the folder contents to `public_html` |

### After deploying, update:
- All `canonical` URLs (search for `https://myballoons.ie`)
- `sitemap.xml` `<loc>` values
- Schema markup URLs in `<script type="application/ld+json">` blocks
- Submit sitemap to [Google Search Console](https://search.google.com/search-console)

---

## 🔄 Updating the Service Worker Cache

When you make significant changes to the site, bump the cache version in `sw.js`:

```js
const CACHE_NAME = 'myballoons-v2';  // increment version
const ASSETS_CACHE = 'myballoons-assets-v2';
```

This forces all users to get the fresh version on their next visit.

---

*37 pages · Plain HTML/CSS/JS · PWA-ready · No build step · No dependencies*
