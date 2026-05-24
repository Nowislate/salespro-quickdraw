# Deploy

Drag-to-deploy via Netlify Drop. No build step. No CLI. Three minutes.

## The fast path (Netlify Drop)

1. Open Netlify Drop in any browser: <https://app.netlify.com/drop>
2. Drag the entire `salespro-quickdraw/` folder onto the page. Not a zip. The folder.
3. Wait about ten seconds for upload. Site is live at a random `*.netlify.app` URL.
4. To get a stable URL, rename the site in Netlify dashboard: Site settings, Change site name. Pick something like `acme-quickdraw` and the URL becomes `acme-quickdraw.netlify.app`.
5. SMS the URL to your sales team. They tap it, then Add to Home Screen.

## Other static hosts

The repo is six files. Any static host works.

- **Cloudflare Pages.** Connect this repo via Pages, set build command to nothing, set output directory to `/`. Auto-deploys on push.
- **GitHub Pages.** Enable Pages in repo settings, source from `main` branch root. The PWA installs from `*.github.io` URLs but iOS Add-to-Home-Screen behaves better on a custom domain or `*.netlify.app`.
- **Your own server.** `scp` the six files to any directory served by nginx or Apache. Done.

## Adding to home screen on iOS

1. Open the URL in Safari. Not Chrome. iOS only installs PWAs via Safari.
2. Tap the share icon (the square with the up-arrow).
3. Scroll down. Tap Add to Home Screen.
4. Confirm.

The app runs full-screen with no Safari chrome. Offline-capable after the first load via the service worker.

## Updating after deploy

Two options.

**Re-drop the folder.** Visit <https://app.netlify.com/drop>, drop the updated folder. Netlify replaces the contents. The URL stays the same.

**Bump the service worker cache namespace BEFORE re-deploying.** Open `sw.js`, change `CACHE_NAME`:

```js
const CACHE_NAME = 'quickdraw-v1';  // bump to 'quickdraw-v2'
```

The service worker's `activate` handler deletes the old cache on first launch. Without the bump, browsers serve stale assets until the 14-day TTL expires.

If you're using GitHub integration: hook the repo to Netlify via "Add new site, Import from Git" for auto-deploys on push.

## What's in the bundle

| File | Purpose |
|---|---|
| `index.html` | Single-file React app. Babel runs in the browser. |
| `data.js` | All brand-specific content. Edit this to customize. |
| `manifest.webmanifest` | PWA identity. Edit `name` and `short_name` to match your brand. |
| `sw.js` | Service worker. Cache namespace `quickdraw-v1`. Cache-first with opportunistic CDN caching. |
| `icon.svg` / `icon-maskable.svg` | App icons. Generic crosshair + QD wordmark. Replace with your own SVG. |

## Verify after deploy

Open the URL on any modern browser. Check:

1. Page title reads your brand name (from `BRAND_META.appName` in data.js)
2. Top bar shows your dealer eyebrow and the TRAINER / FLOOR toggle
3. Default mode is Trainer. First visit shows your `defaultModel` with top reasons and competitor tabs.
4. Toggle to Floor. Shows the full lineup with model chips and quick filters.
5. Toggle persists across reload.
6. Pick a trim in Trainer mode. It persists per-model.

If anything's off, the cache is likely serving stale assets. Force-reload (Cmd+Shift+R on macOS, Ctrl+Shift+R elsewhere), or unregister the service worker via DevTools, Application, Service Workers.

## Reminders before you SMS the URL to your team

- Pricing in `data.js` is reference, not quote. The trainer footer says re-verify in your DMS before quoting.
- Tow ratings carry the "when properly equipped" qualifier per FTC convention.
- Re-verify competitor pricing every 90 days. Competitor MSRPs drift faster than you'd think.
- If your data has compliance language requirements (recalls, allocation limits, regional restrictions), put them in the `trainerFooter` so they show under every trim.
