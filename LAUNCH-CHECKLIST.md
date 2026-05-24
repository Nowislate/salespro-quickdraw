# Launch checklist — salespro-quickdraw

Things to do AFTER you've eyeballed the repo and BEFORE you tell anyone it exists. None of these are coding tasks. All are 5–15 minutes each.

## 1. Create the public GitHub repo

```
gh repo create salespro-quickdraw \
  --public \
  --source ~/oss/salespro-quickdraw \
  --description "Sales-floor reference + trainer PWA for auto dealerships. Single HTML file. Edit one data file. Deploy in an hour." \
  --remote origin
```

Or via the web UI at `github.com/new`. Owner = your GitHub username. Visibility = Public. Don't initialize with a README — the repo already has one.

## 2. Add repo topics

In the repo's About sidebar → Settings cog → Topics. Add:
- `pwa`
- `sales`
- `automotive`
- `dealer`
- `react`
- `tailwind`
- `quickdraw`
- `salesfloor`

These are how people find you in GitHub search + drive the topic-page traffic.

## 3. Push the initial commit

```
cd ~/oss/salespro-quickdraw
git push -u origin main
```

(The repo has one commit. That's the public starting point.)

## 4. Deploy the Acme demo to a permanent URL

Don't use Netlify Drop alone — those URLs expire if you go a long time without revisits. Pin a custom Netlify subdomain so the README's `Demo:` link is stable.

Option A — Netlify Drop (fastest):
1. Zip `~/oss/salespro-quickdraw/` (exclude `.git`).
2. Drag to `netlify.com/drop`.
3. In the new site's settings, rename the subdomain to something like `quickdraw-demo` so the URL becomes `quickdraw-demo.netlify.app`.

Option B — Netlify CLI (better long-term):
```
cd ~/oss/salespro-quickdraw
netlify init       # create new site, link to GitHub repo
netlify deploy --prod
```

Either way, capture the URL.

## 5. Update README with the demo URL

```
sed -i '' 's|<!-- TODO Lane: replace with permanent demo URL after Netlify deploy -->|https://quickdraw-demo.netlify.app|' README.md
git add README.md
git commit -m "docs: add demo URL"
git push
```

## 6. Add a README screenshot or GIF

A 3-frame GIF is the right format:
1. Floor Ref mode showing the Voyager trim grid
2. Mode toggle in motion
3. Trainer mode showing one trim's Top 5

Tools: QuickTime screen recording → `ffmpeg` to convert to GIF, or use a tool like Kap (free Mac app).

Save as `screenshot.gif` in the repo root. Reference in README right under the title.

## 7. Configure GitHub issue templates

Create `.github/ISSUE_TEMPLATE/` with two templates:

`bug.md` — for bugs:
```
---
name: Bug report
about: Something is broken in the framework
---

What you did:

What happened:

What you expected:

Browser / device / hosting (Netlify / GitHub Pages / self-hosted):
```

`feature.md` — for feature requests, with auto-reply baked into the template:
```
---
name: Feature request
about: An idea for a new feature
---

Heads up: this is a side project. New features are out of scope. The framework is small on purpose. If you want a feature, fork the repo and ship it — that is exactly the workflow this project is designed for. I'm leaving this open in case I'm wrong about something.

What you want:

Why:
```

That auto-template kills 80% of feature-request load before it lands in your inbox.

## 8. Disable Discussions

Repo Settings → General → Features → uncheck "Discussions". This matches the maintenance posture (issues only).

## 9. Pin v0.1.0 as a stable release

```
git tag -a v0.1.0 -m "v0.1.0 — initial public release"
git push --tags
```

Then on GitHub: Releases → Draft a new release → choose `v0.1.0` → title "v0.1.0 — initial release" → publish.

## 10. Promote in this order

**Day 1 — LinkedIn (your audience first):**
- Post the demo URL + the "Who built this and why" story (lift from README)
- Tag automotive industry contacts who'd care
- Pin the post for a week

**Day 2-3 — r/askcarsales (80k+ members):**
- Title something like "I built a free open-source phone tool for sales floor reference"
- Lead with the demo URL + screenshot
- Be present in the comments for the first 24 hours

**Day 4-5 — Show HN:**
- Title: "Show HN: salespro-quickdraw — sales-floor PWA for auto dealerships"
- Single screenshot in the post body, demo URL at the top
- Engage in comments

**Week 2 — Automotive Twitter / X:**
- Tag accounts in auto industry, dealer principal community
- Short video (record one yourself, 30 seconds, walking through a trim) lands better than a static screenshot

## 11. Set a personal review cadence

Add a 90-day reminder to revisit:
- Are issues piling up? Triage one bug-fix batch
- Did Acme spec data drift in the demo? Bump the manifest
- Did any forks ship interesting variants? Link them in README

Then forget about it until day 180.

---

## Anti-checklist (things NOT to do)

- ❌ Don't create a Discord server
- ❌ Don't create a website beyond the README + demo URL
- ❌ Don't promise a roadmap
- ❌ Don't accept "maintainer" invites from strangers
- ❌ Don't merge PRs that add framework features (only bug fixes)
- ❌ Don't engage with feature-request issues beyond the auto-reply

The maintenance posture in the README is load-bearing. Live it.
