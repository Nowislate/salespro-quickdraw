# Customize salespro-quickdraw with AI

Copy this entire file. Paste it into Claude or ChatGPT (or any frontier model with file upload). Attach your dealer materials: brochures, ordering guides, OEM spec sheet PDFs, internal pricing matrices. Anything with current pricing and feature data.

The AI will walk you through generating your `data.js` file. About thirty to sixty minutes from start to deployed.

Works with: Claude (free, Pro, Claude Code) · ChatGPT (GPT-4 or higher) · Anthropic API · OpenAI API · any frontier model that handles file attachments.

---

## Instructions to the AI (copy from here down)

You are helping a salesperson customize **salespro-quickdraw** — an open-source sales-floor PWA — with their brand's data. The user will attach materials (PDFs, brochures, spec sheets, OEM data exports). Read them carefully, then walk the user through generating their `data.js`.

The end state is a single JavaScript file that exports `window.BRAND_DATA = { BRAND_META, LINEUP, PACKAGES, PACKAGE_COVERAGE, PAINT, TRIM_DETAIL, TRIM_DETAIL_SOURCE, TRAINER_DATA }`. The framework reads these keys. Anything you put there shows up in the app. Anything you leave empty renders as a placeholder.

Walk the user through four phases.

### Phase 1: Brand setup

Ask the user for:

- **Brand name** (e.g. "Honda", "Acme Motors", "Wempe")
- **Dealer name** (e.g. "Northstar Honda", "Wempe NYC")
- **Model year** for the current lineup
- A short eyebrow phrase for Floor mode (e.g. "Northstar Honda · Sales Floor")
- A short eyebrow phrase for Trainer mode (e.g. "Northstar Honda · Sales Training")
- The default model that should load when the trainer opens for the first time

Build the `BRAND_META` object:

```js
BRAND_META: {
  appName: 'Northstar Honda 2026',
  shortName: 'NSH 26',
  htmlTitle: 'Northstar Honda 2026',
  htmlDescription: 'Northstar Honda 2026 sales app: floor reference + trim-by-trim trainer.',
  appleTitle: 'NSH 26',
  dealerName: 'Northstar Honda',
  floorEyebrow: 'Northstar Honda · Sales Floor',
  standardsSubtitle: 'every Honda on the lot',
  trainerEyebrow: 'Northstar Honda · Sales Training',
  modelYear: '2026',
  modelYearShort: '2026',
  floorHeadlineHTML: '2026 <span class="italic font-normal">Lineup</span> Reference',
  trainerFooter: 'Pricing from Honda 2026 reference card · Always re-verify pricing in your DMS before quoting · For Retailer Use Only',
  legalDisclaimer: 'Verified against OEM ordering guide as of [date].',
  defaultModel: 'civic',
  storagePrefix: 'quickdraw',
}
```

### Phase 2: Lineup

For each model in the user's brand, get from the user (or read from their materials):

- **`id`** — lowercase, no spaces (`civic`, `accord`, `cr-v`)
- **`name`** — display name (`Civic`, `Accord`, `CR-V`)
- **`segment`** — short positioning string (`Compact Sedan`, `Mid-Size Sedan`, `Compact SUV · 2-Row`)
- **`note`** — one-line "what's new for this year"
- **`trims`** — array of trim objects, each with:
  - `name` — trim name (`Sport`, `Touring Hybrid`)
  - `msrp` — number, no formatting (`28995` not `'$28,995'`)
  - `powertrain` — string, one of: `gas`, `turbo`, `hybrid`, `ev`
  - `badges` — array of strings. Available badges: `turbo`, `hybrid`, `ev`, `wilderness`, `hands-free`, `tow`, `volume`, `flag`, `limited-run`, `3-row`. Used by Floor mode quick filters. Match what the user actually wants filterable.
  - `features` — one-line summary of what this trim adds versus the trim below it

Output the `LINEUP` array. Keep the order roughly volume-first (the model the user sells most goes first).

### Phase 3: Trainer content

This is the heavy lift. For each model the user wants in Trainer mode (start with the user's top 2 by volume), for each trim:

- **`id`** — lowercase, no spaces (`base`, `premium`, `limitedxt`)
- **`name`** — display name
- **`msrp`** — formatted string (`'$28,995'`)
- **`engine`** — short engine description (`'180hp 2.0L turbo I-4'`)
- **`tow`** — short tow string (`'1,500 lb'`) or omit for non-truck/SUV
- **`mpg`** — short MPG string (`'26 / 32'`) or omit for EV (use range instead)
- **`tagline`** — one-sentence positioning of this trim. The hook that sticks in the salesperson's head.
- **`reasons`** — array of 5 objects, each with `h` (headline, short) and `d` (detail, with concrete numbers). The Top 5 reasons to buy. Concrete numbers everywhere. Quote competitor prices in the detail line.
- **`comps`** — array of exactly 3 competitor head-to-head objects, each with:
  - `tab` — short label for the tab UI (`'Civic LX'`, max ~12 chars)
  - `name` — full competitor name (`'Toyota Corolla LE'`)
  - `price` — formatted price string
  - `wins` — array of 4-6 bullets where your trim wins. Concrete numbers.
  - `loses` — array of 4-6 bullets where the competitor wins. **Honest. Don't soften.** This is the salesperson's curveball prep. If the competitor has a 10-year warranty and you have a 5-year, write it.
- **`say`** — one closer line, plain language. Sounds like a real salesperson talking, not a script. No exclamation points.
- **`verified`** — object `{ date: 'YYYY-MM-DD', sources: ['...'] }` so users can audit content freshness later

Style rules for trainer content:

- **Active voice. Short sentences.** Read it aloud. If you'd never say it, rewrite it.
- **Concrete numbers wherever possible.** `$2,505 cheaper`, not `more affordable`. `8.7"` not `more ground clearance`.
- **Honest about competitor wins.** Don't write `loses` like a marketing brief. If the competitor wins on warranty, mileage, prestige, or interior materials, say so.
- **No marketing-speak.** No "exhilarating", no "best-in-class" unless it actually IS best-in-class with a citation.
- **Say This sounds like a person.** Not a script. Not a slogan. Something a salesperson would actually say to a customer mid-conversation.

### Phase 4: Output

Generate the complete `data.js` file. The full structure:

```js
window.BRAND_DATA = {
  BRAND_META: { ... },          // Phase 1 output
  LINEUP: [ ... ],              // Phase 2 output
  PACKAGES: { ... },            // optional, per-trim option packages
  PACKAGE_COVERAGE: { ... },    // 'complete' | 'partial' | 'missing' | 'none' per model
  PAINT: { ... },               // paint colors per model
  TRIM_DETAIL: { ... },         // expanded trim detail drilldowns (Floor mode)
  TRIM_DETAIL_SOURCE: '...',    // attribution string
  TRAINER_DATA: { ... },        // Phase 3 output
};
```

Validate that:

- Every model in `LINEUP` has a key in `TRAINER_DATA` (even if `trims: []` as a placeholder).
- Every trim in `LINEUP` has a matching `name` in `TRAINER_DATA[model].trims` for any model with full trainer coverage.
- Every `comps[].tab` is short enough to render in the trim's tab strip.
- Every numeric MSRP in `LINEUP` is a number (no `$`, no commas). Trainer `msrp` is a formatted string.

Tell the user how to deploy. Point them at `DEPLOY.md`.

---

## Schema reference

The framework reads these keys exactly. Don't rename them.

```js
window.BRAND_DATA = {

  // === BRAND_META ===
  // Everything the framework needs to render the page identity.
  BRAND_META: {
    appName: 'string',           // PWA name, HTML title
    shortName: 'string',         // PWA short_name, home-screen label
    htmlTitle: 'string',
    htmlDescription: 'string',
    appleTitle: 'string',        // iOS Add-to-Home-Screen title
    dealerName: 'string',        // shown bottom-left of mode bar
    floorEyebrow: 'string',      // top eyebrow in Floor mode
    standardsSubtitle: 'string', // shown under "Standard Across [year]" section
    trainerEyebrow: 'string',    // top eyebrow in Trainer mode
    modelYear: 'string',         // '2026'
    modelYearShort: 'string',    // '2026' or '26'
    floorHeadlineHTML: 'string', // HTML allowed for the floor-mode big headline
    trainerFooter: 'string',     // shown under every trim in Trainer mode
    legalDisclaimer: 'string',   // small print at the bottom of Floor mode
    defaultModel: 'string',      // id of the model Trainer opens to on first load
    storagePrefix: 'string',     // localStorage key prefix, leave as 'quickdraw'
  },

  // === LINEUP ===
  // Array of model objects. Order is the order they appear in the Floor mode chip rail.
  LINEUP: [
    {
      id: 'string',              // lowercase, no spaces — keys other maps below
      name: 'string',            // display name
      segment: 'string',         // short positioning ('Compact SUV · 2-Row')
      note: 'string',            // 'what's new this year' single line
      trims: [
        {
          name: 'string',        // 'Premium', 'Limited XT'
          msrp: 0,               // NUMBER, no $ or commas
          powertrain: 'gas|turbo|hybrid|ev',
          badges: [],            // see "Available badges" below
          features: 'string',    // one-line summary of what this trim adds
        },
        // ...more trims
      ],
    },
    // ...more models
  ],

  // Available badges (used by Floor mode quick filters):
  //   'turbo'        — turbo engine
  //   'hybrid'       — hybrid powertrain
  //   'ev'           — battery EV
  //   'wilderness'   — off-road / rugged variant
  //   'hands-free'   — hands-free highway driver-assist
  //   'tow'          — meaningful tow rating
  //   'volume'       — your highest-volume trim (visual highlight)
  //   'flag'         — flagship trim
  //   'limited-run'  — collector / allocation-limited
  //   '3-row'        — 3-row seating

  // === PACKAGES ===
  // Optional. Per-model, per-trim option packages.
  PACKAGES: {
    modelId: {
      'Trim Name': [
        {
          code: 'string',        // dealer pkg code
          add: 0,                // NUMBER, dollars added
          source: 'string',      // attribution
          features: ['...'],     // bullet list of what the pkg adds
        },
      ],
    },
  },

  // === PACKAGE_COVERAGE ===
  // Tells the framework whether to show "package coverage missing" warnings.
  PACKAGE_COVERAGE: {
    modelId: 'complete|partial|missing|none',
  },

  // === PAINT ===
  // Paint colors with surcharge, per model.
  PAINT: {
    modelId: {
      colors: ['...'],           // exterior color names
      add: 0,                    // NUMBER, dollars (0 if no upcharge)
      source: 'string',
      note: 'string',            // optional — e.g. 'all colors standard'
    },
  },

  // === TRIM_DETAIL ===
  // Expanded drilldowns (Floor mode tap-through). Optional per trim.
  TRIM_DETAIL: {
    modelId: {
      'Trim Name': {
        configs: ['...'],        // seating configurations
        configNote: 'string',
        audio: {                 // OR a plain string like 'Same as Limited'
          system: 'string',
          speakers: 0,
          brand: 'string',
          wattage: 0,
          navigation: false,
          sxm: 'string',
        },
        keyStandard: ['...'],    // bullet list of standard features (lowest trim)
        keyAdds: ['...'],        // OR what this trim adds over lower trim
        addsFrom: 'Trim Name',   // which trim this one "inherits" from
        newFor2026: ['...'],     // bullet list of changes vs last MY
        exteriorColors: ['...'],
        interior: ['...'],
        colorNote: 'string',     // optional restriction note
      },
    },
  },

  TRIM_DETAIL_SOURCE: 'string',  // attribution for TRIM_DETAIL block

  // === TRAINER_DATA ===
  // Per-model trainer content. The heavy lift.
  TRAINER_DATA: {
    modelId: {
      name: 'string',
      segment: 'string',
      trims: [
        {
          id: 'string',          // lowercase, no spaces
          name: 'string',        // matches LINEUP trim name
          msrp: 'string',        // FORMATTED string with $
          engine: 'string',
          tow: 'string',         // optional
          mpg: 'string',         // optional
          tagline: 'string',     // one sentence
          reasons: [             // EXACTLY 5
            { h: 'headline', d: 'detail with numbers' },
            // ...4 more
          ],
          comps: [               // EXACTLY 3
            {
              tab: 'string',     // short tab label
              name: 'string',    // full competitor name
              price: 'string',   // formatted with $
              wins: ['...'],     // 4-6 bullets, where you win
              loses: ['...'],    // 4-6 bullets, where they win — HONEST
            },
            // ...2 more
          ],
          say: 'string',         // closer line
          verified: {
            date: 'YYYY-MM-DD',
            sources: ['...'],
          },
        },
        // ...more trims
      ],
    },
  },
};
```

## Style rules (re-emphasized)

- Active voice. Short sentences.
- Concrete numbers wherever possible. `$2,505 cheaper`, not `more affordable`.
- Honest about competitor wins. The `loses` array is curveball prep, not marketing copy.
- No marketing-speak. No "best-in-class" unless cited.
- Say This sounds like a person, not a script.
- Em dashes are fine in data lines but don't sprinkle them everywhere.

## Don't

- Don't make up specs you can't verify from the source materials. If you're unsure, ask the user to confirm.
- Don't use real OEM/competitor data if the user's brand is auto. Always ask the user to confirm current competitor pricing — pricing drifts every 90 days.
- Don't pad with caveats. Brief disclaimers in the footer of the app are enough.
- Don't generate placeholder Lorem Ipsum or `TODO: add real data` lines. Either generate real content from the user's materials or ask the user for it.
- Don't add fields not listed in the schema. The framework only reads the keys above.

## After you generate data.js

Tell the user:

1. Save the output as `data.js` in the project folder.
2. Update `manifest.webmanifest` with your `name` and `short_name` to match `BRAND_META`.
3. Optionally replace `icon.svg` and `icon-maskable.svg` with your own branded icons.
4. Test locally: `python3 -m http.server 8080`, then open `http://localhost:8080`.
5. Deploy by dragging the folder to <https://app.netlify.com/drop>.
6. SMS the URL to the sales team.

Read `DEPLOY.md` for the full deploy walkthrough.

## Beyond auto (non-auto adaptations)

If the user sells something that's not a car (watches, real estate, marine, RV, jewelry, B2B SaaS, solar, furniture), the schema still works. Relabel in your head:

- `model` → product line (watch family, unit type, equipment class)
- `trim` → tier / variant / configuration
- `msrp` → list price (or starting price, or whatever the industry calls it)
- `engine` / `tow` / `mpg` → drop these. Replace with the spec your industry cares about (movement, case material, square footage, beam, payload, watt rating, etc.). The framework renders whichever string keys are present.
- `badges` → still useful. Tag tiers with whatever filters help (steel/gold, vintage/new, ground-floor/penthouse, etc.). You can use the existing badge slugs or just leave `badges: []` and skip Floor-mode filtering.
- `PACKAGES` → optional add-on tiers, complications, finish options.
- `PAINT` → finishes / dial colors / cladding options / fabric options.
- `TRAINER_DATA` is the part that transfers cleanest. Top 5 reasons. Three competitor head-to-heads. Say This. Works in every high-ticket sales context.

The framework doesn't care what industry you're in. It cares that the keys are present and the shape is right.
