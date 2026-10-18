# Siwnin Productions website

Static site, no build step. Upload the contents of this folder to the web root of `siwninproductions.com`.

## Pages

| URL | File |
|---|---|
| `/` (Japanese, main) | `index.html` |
| `/en/` | `en/index.html` |
| `/privacy/` | `privacy/index.html` |
| `/en/privacy/` | `en/privacy/index.html` |
| 404 (Japanese) | `404.html` |
| 404 (English) | `en/404.html` |

## Language

- `/` is Japanese. On the first visit, browsers that are not set to Japanese are sent to `/en/`.
- The EN / 日本語 switch saves the choice in the `siwnin_lang` cookie (1 year) and is always respected.
- Search engine crawlers are never redirected. `hreflang` tags and `sitemap.xml` tell Google about both languages.
- Optional: do the same redirect on the server/edge (Accept-Language header, 302) to avoid a short flash. See `../dev-handoff/language-redirect.js`.

## Hosting setup

- 404: point the host's "not found" page to `/404.html`, and to `/en/404.html` for anything under `/en/`.
  - Netlify: add to `_redirects`: `/en/* /en/404.html 404` then `/* /404.html 404`
  - Vercel / Cloudflare Pages: `404.html` at the root is picked up automatically.
- Use HTTPS and redirect `www.` to the bare domain (or the other way round, but pick one).

## To fill in before launch

1. Privacy policy (both languages): `[所在地]` / `[Address]`, `[代表者名]` / `[Representative]`, effective date, and the analytics paragraph in brackets (delete it if no analytics tool is installed).
2. Disco-ball photo: replace `assets/img/hero-crowd-surf.webp` (top-right hero photo) with the new photo, same name, portrait 3:4, about 1200 px wide, WebP.
3. Add the Siwnin Instagram URL to `sameAs` in the structured data on both home pages, if there is one.

## Brand

- Blue: `#00568F` (from the logo). Accent green: `#7FD3B8`.
- Fonts (Google Fonts): Anton, Archivo, JetBrains Mono, Zen Kaku Gothic New, Dela Gothic One.
- Logo files: `assets/img/` and `../dev-handoff/logo/`.

Designed by lander.co
