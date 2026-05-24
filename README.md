# salespro-quickdraw

A phone-first sales reference PWA. Two modes: Floor (whole lineup at a glance) and Trainer (trim-by-trim Top 5, competitor head-to-head, Say This). Single HTML file. No build step. Edit one data file, drag the folder to Netlify Drop, you're live.

**Demo:** <!-- TODO Lane: replace with permanent demo URL after Netlify deploy -->

## Maintenance posture

This is a side project from a working salesperson. I'll triage bugs that break deploys. I won't add features. Pull requests welcome but no SLA. Forks encouraged. No Discord, no Slack. Issues only.

## Quickstart (5 minutes)

```bash
git clone https://github.com/lanecampbell/salespro-quickdraw.git
cd salespro-quickdraw
python3 -m http.server 8080
```

Open <http://localhost:8080>. You'll see the Acme Motors sample. Both modes work. Toggle between them in the top bar.

To make it yours: edit `data.js`. Read `PROMPT.md` for the AI-assisted walkthrough that gets you from blank brand to deployed PWA in about an hour.

To ship: drag the folder to <https://app.netlify.com/drop>. See `DEPLOY.md` for the full path.

## What this is

A two-mode PWA you SMS to your sales team. They tap the link, add it to home screen, and have a phone-shaped reference card that works offline.

Floor mode is the whole lineup. Model chips across the top. Quick filters (turbo, hybrid, EV, tow rating, hands-free, 3-row, flagships). Tap a trim to drill into specs, packages, paint.

Trainer mode is the deep-dive. One trim at a time. Top 5 reasons to buy with concrete numbers. Three competitor head-to-heads at the trim's price point, each with honest wins AND honest losses. A Say This line at the bottom that sounds like a real salesperson talking, not a marketing brief.

No build step. React 18 plus Babel Standalone plus Tailwind via CDN. Six files total. Deploys to Netlify Drop, Cloudflare Pages, GitHub Pages, or any static host.

## Who built this and why

I'm Lane. After a long stretch in automotive retail, a few years back, I co-founded Zenzio AI, which I think was the first real AI Sales Associate platform for automotive.

On the retail floor, I remember what helps mid-conversation, when the customer is standing in front of you and asking about the third trim down. The brochures and PDFs don't help. What helps is a phone in your pocket with the right answer at the right depth, ready in two taps. Quick draw style.

So I built this for the modern automotive retail salesperson. Six files. No login. No CRM integration. Works offline. The whole lineup plus competitor head-to-heads, in your pocket, on the lot.

I'm open-sourcing it because every salesperson deserves a tool like this and I don't see anyone else shipping it. I'm also building Scalesperson (scalesperson.ai), which is a different product for a different problem. This isn't a funnel for that. This is just the floor tool I felt was needed.

If you fork it, ship it, or improve it, I'd love to know. Open an issue or tag me wherever.

## Customize with AI (recommended path)

Open `PROMPT.md`. Copy the whole file. Paste it into Claude or ChatGPT. Attach your dealer materials (ordering guides, OEM spec sheets, anything with current pricing and feature data). The AI walks you through generating your `data.js`.

Works with Claude (free, Pro, or Claude Code), ChatGPT (GPT-4 or higher), or any frontier model with file upload. About thirty to sixty minutes from prompt to deployed PWA.

## Beyond auto

The framework was built by an automotive salesperson for automotive salespeople. The structure is auto-shaped: models, trims, packages, paint, MSRPs, tow ratings.

The underlying pattern works for any high-ticket sales context where buyers compare variants and competitors. Real estate (units, tiers, comparable listings). Marine and RV. Jewelry. Luxury watches. B2B SaaS (plans, features, competitor head-to-heads). Solar installs. Furniture.

The shape needs minor relabeling for non-auto use. `trim` becomes `tier`. `MSRP` becomes whatever your industry calls list price. `MPG` and `tow` go away. The training pattern (top reasons, competitor head-to-head, Say This) translates cleanly.

If you adapt this for a non-auto industry and want to share what worked, open a PR.

## Tech

No build step. React 18 plus Babel Standalone plus Tailwind via CDN. Single HTML file plus a data file plus PWA infrastructure (manifest, service worker, two SVG icons). The service worker is cache-first on same-origin and refuses to cache cross-origin CDN responses (defense against CDN poisoning). A 14-day TTL purges stale caches if you forget to bump the cache namespace on a redeploy.

## License

MIT. See `LICENSE`.

## Author

Lane Campbell · [scalesperson.ai](https://scalesperson.ai) · [LinkedIn](https://www.linkedin.com/in/lanecampbell)
