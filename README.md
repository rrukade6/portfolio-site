# Rohit Rukade — Portfolio (RRR)

Single-page, dark/cinematic static portfolio for Rohit Rukade — editor.
No build step, no backend. Three files: `index.html`, `styles.css`, `script.js`.

## Edit your content

All content lives in `index.html` — search for these landmarks:

| What you want to change | Where |
|---|---|
| Bio / intro copy | Hero section + `#about` |
| Video projects | Cards inside `#work` — each has `data-video="<YOUTUBE_ID>"` and `data-title`. Vimeo: add class `card--vimeo`, put the numeric ID in `data-video`. Google Drive: add class `card--drive`, put the file ID (or full `drive.google.com/file/d/…` URL) in `data-video`. |
| Writing samples | `#writing` — duplicate a `.writing__card` block, change title/line/link. |
| Email, phone, LinkedIn | `#contact` |
| Video captions / roles | `data-title` attribute + `.card__role` on each card |

### Design tokens
Colors, fonts and spacing are CSS variables at the top of `styles.css` (`:root`).
Palette: electric blue — navy-black base, cyan + violet glows, no yellow.
Fonts (Google): **Space Grotesk** (name & headings), **Bodoni Moda** (serif accents), **Inter** (body), **IBM Plex Mono** (labels).
Brand mark: **RRR.** (monogram in the nav and footer).

## Deploy (GitHub Pages)

1. Push this repo to GitHub (repo name: `portfolio-site`).
2. On GitHub → **Settings → Pages** → *Source:* **Deploy from a branch** → branch **`main`**, folder **`/ (root)`** → **Save**.
3. Live at `https://rrukade6.github.io/portfolio-site/`.

## License
Content © Rohit Rajendra Rukade. All rights reserved.