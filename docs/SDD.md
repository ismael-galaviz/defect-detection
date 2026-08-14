# VeritX Vision — Website SDD (Software Design Document)

**Purpose of this file:** a self-contained snapshot of the site's current state — structure, content,
design decisions, and constraints — so a future session can make changes without re-reading every
source file or re-deriving decisions that were already made and settled. If this file and the actual
code ever disagree, **the code is the source of truth**; update this file to match it.

Last verified against the live source on: 2026-08-13.

---

## 1. What this is

A bilingual (Spanish/English) marketing website for **VeritX Vision**, a fictional/prototype product
by a company headquartered in Tlaxcala, Mexico, building an AI-powered fabric-defect-inspection system
("Vision A") for textile manufacturers. It is a single-page marketing site plus three small satellite
pages (Demo, Calculator placeholder, About), all client-side routed.

- **Live site:** https://ismael-galaviz.github.io/defect-detection/
- **GitHub repo:** https://github.com/ismael-galaviz/defect-detection (branch `main`)
- **Git root:** this directory (`02_Website_Code/frontend/veritx-web`) — the repo does **not** include
  the rest of the `Defect Detection` project tree (images, project code, diagrams, etc. are siblings,
  outside git).
- **Hosting:** GitHub Pages, deployed via GitHub Actions on every push to `main`/`master`.

---

## 2. Tech stack

- **React 18** + **Vite 5** (`@vitejs/plugin-react`). No TypeScript, no CSS framework, no component
  library, no router library (routing is a ~10-line custom hash hook — see §4).
- Styling: one hand-written global stylesheet, `src/index.css` (~1035 lines), using CSS custom
  properties for the palette and plain class selectors. No CSS Modules, no styled-components.
- Icons: hand-drawn inline SVG paths (no icon library dependency) — see §6.
- State: local `useState`/`useEffect` only. No Redux/Zustand/Context beyond the language provider.
- No test suite, no linter config.
- `package.json` deps: `react`, `react-dom` (runtime); `vite`, `@vitejs/plugin-react` (dev).

### Build & dev

```bash
npm install        # if node_modules is missing/stale
npm run dev         # Vite dev server
npm run build        # production build to dist/
npm run preview      # preview the production build locally
```

**Known local-env quirk:** npm's optional-dependency resolution sometimes omits the native Rollup
binary (`@rollup/rollup-<platform>`), causing `npm run build` to fail with a `MODULE_NOT_FOUND` on a
native `.node` file. Fix: re-run `npm install`.

**Dev server port:** the repo's own Vite config has no fixed port, but in this environment port 5173
was already taken by another app, so the harness's dev-server launcher
(`02_Website_Code/.claude/launch.json`, **one level above this repo, not git-tracked by it**) pins the
dev server to port 5199 via `--port 5199 --strictPort` and runs it with `--prefix frontend/veritx-web`
from the `02_Website_Code` directory. This file is a local tooling convenience, not part of the
deployed app.

### Vite config (`vite.config.js`)

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/defect-detection/',
})
```

`base` **must** match the GitHub Pages repo name. If the repo is ever renamed or moved to a custom
domain, update this and re-deploy.

### Deploy (`.github/workflows/deploy.yml`)

Triggers on push to `main`/`master` or manual dispatch. Steps: checkout → Node 20 → `npm ci` →
`npm run build` → upload `./dist` as a Pages artifact → deploy. Uses `actions/upload-pages-artifact@v3`
and `actions/deploy-pages@v4`. (CI currently warns that Node 20 is deprecated on the runner image and
is being forced onto Node 24 — cosmetic, not currently broken; bump `node-version` to `24` if it starts
to matter.)

### `.gitignore`

```
node_modules
dist
.DS_Store
*.log
*.timestamp-*.mjs
```

---

## 3. File map

```
veritx-web/
├── index.html                 # HTML shell; <html lang="es"> static default, overwritten at runtime
├── package.json / package-lock.json
├── vite.config.js
├── TODO.md                     # running task/annotation scratchpad — see §13
├── .github/workflows/deploy.yml
├── public/
│   └── favicon.svg
├── docs/
│   └── SDD.md                 # this file
└── src/
    ├── main.jsx                # ReactDOM root, imports index.css, mounts <App/>
    ├── App.jsx                 # routing hook, ALL page-1 components (Header..Footer), <Site/>, <App/>
    ├── icons.jsx                # shared <Icon name size/> component + ICON_PATHS map (SVG paths)
    ├── i18n.jsx                 # LanguageProvider/useLanguage — language state, not the copy itself
    ├── translations.js          # ALL user-facing copy, both languages, one big object (see §5, §9)
    ├── DemoPage.jsx              # route #/demo — interactive defect-map demo
    ├── CalculatorPage.jsx         # route #/calculator — interactive ROI/savings calculator (see §10.16)
    ├── AboutPage.jsx              # route #/about — "Who We Are" page
    └── index.css                 # the only stylesheet, global, ~1035 lines
```

There is no `components/` subfolder — every home-page section component (`Header`, `Hero`, `VisionA`,
`HowItWorks`, `UseCases`, `Comparison`, `Specs`, `Contact`, `Footer`, plus small helpers `LangSwitch`,
`NavDropdown`, `MobileAccordion`, `MadeInMexicoBadge`) lives directly in `App.jsx` as sibling function
components, in the order they render. `Site()` is the component that assembles them per route; `App()`
just wraps `Site` in `LanguageProvider`.

---

## 4. Routing

No router library. `useRoute()` (top of `App.jsx`) reads `window.location.hash`, listens for
`hashchange`, and maps it to one of four route names:

| hash prefix | route |
|---|---|
| `#/demo` | `demo` → renders `<DemoPage/>` |
| `#/calculator` | `calculator` → renders `<CalculatorPage/>` |
| `#/about` | `about` → renders `<AboutPage/>` |
| anything else (incl. plain `#section-id` anchors) | `home` → renders the full home-page section stack |

`<Header/>` and `<Footer/>` always render regardless of route.

On route change, `Site()`'s `useEffect`:
- scrolls to top (`window.scrollTo(0,0)`) for `demo`/`calculator`/`about`,
- otherwise (route `home`), if the current hash is a plain anchor (doesn't start with `#/`), scrolls
  that element into view via `document.getElementById(hash.slice(1))?.scrollIntoView()`.

This means an in-page anchor like `#contact` works both when already on `home` (native browser anchor
scroll, assisted by `html { scroll-behavior: smooth }` in CSS) **and** when clicked from a satellite
page (e.g. Calculator's CTA linking to `#contact` — the hash change flips the route back to `home`,
which mounts the Contact section, and the effect above scrolls to it).

**To add a new page/route:** add a `hash.startsWith('#/whatever')` branch in `useRoute()`, add
`{route === 'whatever' && <WhateverPage/>}` in `Site()`, import the new page component, and add it to
`route === 'home' || route === 'demo' || ...` in the top-scroll `useEffect` condition if it should
scroll-to-top on entry (satellite pages do; anchor-style routes don't).

---

## 5. i18n system

`src/i18n.jsx` exports `LanguageProvider` and `useLanguage()`.

- `detectLanguage()`: reads `localStorage['veritx-lang']`; if it's `'en'` or `'es'`, use it; **otherwise
  defaults to `'es'`** (Spanish-first is intentional — the target audience is Mexico/LatAm-first, per
  explicit product decision, not a browser-language auto-detect).
- On every language change: persists to `localStorage['veritx-lang']` and sets
  `document.documentElement.lang` to match (so `index.html`'s static `lang="es"` is just the pre-JS
  default; the real value is runtime-managed).
- `useLanguage()` returns `{ lang, setLang, t }` where `t` is `translations[lang]` — the whole
  per-language object from `translations.js`. Components read copy as `t.section.field`.

**Language switcher UI** (`LangSwitch` in `App.jsx`): a native `<select>` styled to look custom
(class `lang-switch`), not a pair of buttons — two `<option>`s, each prefixed with a flag emoji:
`🇲🇽 ES` and `🇺🇸 EN`. This is the one place emoji are intentionally used (see §6 — everywhere else
emoji were replaced with SVG icons; flags here represent language/country identity, not decoration,
and were explicitly kept). Lives in the header, opens as a real native dropdown (per explicit
instruction: "que sea un dropbox", after an earlier iteration used two flag buttons).

**To add a language:** add a new top-level key to `translations.js` (e.g. `pt: {...}` mirroring the
full shape of `en`/`es`), add an `<option>` in `LangSwitch`, and extend `detectLanguage`'s validity
check.

---

## 6. Icon system (`src/icons.jsx`)

A single exported component:

```jsx
export function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  )
}
```

All icons are **hand-drawn stroke-only SVG paths** (no icon library/font), colored via CSS
`color` on the parent element (they use `stroke="currentColor"`). This was a deliberate replacement of
an earlier emoji-based icon set ("cambia los emojis por iconos más serios y que el color sea el mismo
del tema de la página") — icons are consistently tinted with the brand cyan (`var(--cyan)` on dark
backgrounds, `var(--cyan-dark)` on light backgrounds), never left at default/emoji color, **except** the
language-switcher flags (see §5).

**Current icon names** (`ICON_PATHS` keys) and what they're used for:

| name | used in | meaning |
|---|---|---|
| `bolt` | Vision A feature 1 | Plug & play |
| `link` | Vision A feature 2 | Easy integration |
| `sliders` | Vision A feature 3 | Flexible to your process |
| `weave` | Use Cases card 1 | Fabric Production |
| `droplet` | Use Cases card 2 | Finishing |
| `eyeCheck` | Use Cases card 3 | Final Inspection (compound eye + checkmark-badge icon, explicitly requested) |
| `pause` | How It Works integration example 1 | "stop the line" |
| `tag` | How It Works integration example 2 | "trigger the labeling unit" |
| `mail` | Contact info row | Email us |
| `pin` | Contact info row, About facts | Location/HQ |
| `gear` | How It Works integration card | Machine-integration/automation |
| `target` | Why VeritX Vision card 1 | Industrial-grade accuracy |
| `activity` | Why VeritX Vision card 2 | Real-time inline inspection |
| `percent` | Why VeritX Vision card 3 | Accessible pricing |
| `cloud` | Why VeritX Vision card 4 | Cloud or on-premises |
| `globe` | About facts | "Where we serve" |
| `chevronDown` | Nav dropdown / mobile accordion triggers | Expand/collapse indicator (rotates 180° via `.chev.open`) |
| `clock` | Calculator, section 2 (labor hours) | Time/hours |
| `gauge` | Calculator, section 3 (line speed) | Speed |

**To add an icon:** add a `name: <path .../>` (or `<>...</>` fragment for multi-element icons) entry to
`ICON_PATHS` in `icons.jsx`, keeping the `viewBox="0 0 24 24"` coordinate space consistent with the
existing set so sizing behaves predictably.

---

## 7. Design tokens & layout conventions

CSS custom properties, defined on `:root` in `index.css`:

```css
--navy: #0B1F3A;
--navy-light: #12315c;
--cyan: #00D4FF;
--cyan-dark: #00a8cc;
--ink: #0d1b2a;
--gray-50: #f7f9fc;
--gray-100: #eef1f6;
--gray-300: #cbd5e1;
--gray-500: #64748b;
--gray-700: #334155;
--white: #ffffff;
--radius: 14px;
--max-width: 1180px;
```

Font: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
(no font is actually loaded/imported — this falls back to system fonts since Inter isn't linked
anywhere; cosmetic gap, not a bug per se).

**Section vertical padding** — base rule `section { padding: 77px 0; }`. This value (and the hero's
`80px 0 96px`, the demo/calculator/about hero's `58px 0`, and their content section's `51px 0 77px`)
are **already a 20%-reduced** version of the original design (96px / 100+120px / 72px / 64+96px) per
an explicit "reduce spacing 20%" request. If asked to adjust spacing again, these current numbers are
the baseline to scale from, not the original ones.

**Responsive breakpoints:** two, both `max-width` media queries — `900px` (the main one: collapses
grids to 1–2 columns, hides desktop nav, shows the hamburger) and `600px` (a couple of demo-page-only
tweaks). No `min-width` breakpoints are used.

**Container:** `.container { max-width: 1180px; margin: 0 auto; padding: 0 24px; }` — used inside every
section.

**Buttons:** `.btn` base + `.btn-primary` (cyan, dark navy text), `.btn-ghost` (transparent, white
border, for dark backgrounds), `.btn-dark` (navy bg, white text, used for the contact form submit).

**Card/section pattern reused across the site:** an icon in a small rounded square with a tinted cyan
background (`rgba(0,212,255, .1–.15)`), a heading, a paragraph. This exact visual pattern is shared by
Vision A features (`.vf-icon`), Use Cases cards (`.usecase-icon`), and the "Why VeritX Vision" cards
(`.usecase-icon` reused via the `why-grid` class — see §9.7) — reuse this pattern rather than inventing
a new card style when adding similar content.

**Pages that aren't the home page** (`DemoPage`, `CalculatorPage`, `AboutPage`) all share the same
two-part layout: a `<section className="demo-hero">` navy gradient banner with just an eyebrow + `<h1>`
(and optionally a lead paragraph / toolbar, as Demo does), followed by a `<section className="demo-section">`
light-gray content area. Reuse this `demo-hero` + `demo-section` pair for any new satellite page instead
of inventing new classes.

---

## 8. Component inventory (`App.jsx`)

In file order:

- **`useRoute()`** — hash-based router hook, see §4.
- **`LangSwitch()`** — native `<select>` language switcher, see §5.
- **`NavDropdown({ label, items, isOpen, onToggle, onNavigate })`** — a header nav item that's a button
  + absolutely-positioned panel of links. Controlled from outside (open/close state lives in `Header`).
- **`MobileAccordion({ label, items, onNavigate })`** — the mobile-hamburger-menu equivalent of
  `NavDropdown`; manages its own `open` state locally (each mobile menu section is independent, unlike
  desktop where only one dropdown can be open at a time).
- **`Header()`** — sticky header. Desktop nav is **Home** (plain link) + three `NavDropdown`s:
  **Product** (`t.nav.productItems`), **Tools** (`t.nav.toolsItems`), **About Us** (`t.nav.aboutItems`).
  Only one dropdown can be open at a time (`openDropdown` state: `null | 'product' | 'tools' | 'about'`).
  Dropdowns open **on click, not hover** (explicit choice — more accessible, consistent with mobile).
  Closed by: clicking its own trigger again, clicking any item inside it, clicking anywhere outside the
  nav (`mousedown` listener on `document`, checked against a `navRef`), or pressing `Escape`. The
  mobile hamburger (`mobile-toggle` button, ☰/✕) toggles a separate `<nav className="mobile-menu">`
  that mirrors the same three groups as `MobileAccordion`s plus the Home link. **There is no CTA button
  in the header** — it was deliberately removed once the header got crowded with the language switcher
  and three dropdowns; the primary CTA only lives in the hero, the contact section, and page-specific
  CTAs (Calculator's placeholder card).
- **`Hero()`** — headline, lead paragraph, two CTAs (`#contact`, `#how-it-works`), three stat chips
  (`t.hero.stats`), and a decorative "scan frame" visual with two floating defect-tag labels
  (`t.hero.defectTags`) and an animated scan line (`@keyframes scan`, pure CSS).
- **`VisionA()`** (`id="vision-a"`) — product intro section, right after Hero. Left: eyebrow/title/sub +
  3 feature rows (icon + title + body, from `t.visionA.features`). Right: a decorative CSS-only "device"
  illustration (`.device-frame`, no real image asset) plus a row of small pill tags
  (`t.visionA.tags`). Below the two-column grid, full width: a responsive 16:9 YouTube embed
  (`.video-embed`, privacy-enhanced `youtube-nocookie.com` domain, video id `djK5l04jRoM`, accessible
  `title` from `t.visionA.videoTitle`). **The product video lives here (product description section),
  not on the About page** — it was initially added to About and explicitly moved to Vision A; if a
  second video is ever needed for About, that'd be a new addition, not "restoring" anything.
- **`HowItWorks()`** (`id="how-it-works"`) — 4-step numbered pipeline grid (`t.howItWorks.steps`,
  `.step-card`), plus one extra full-width dark **"integration card"** below the grid
  (`t.howItWorks.integration`) explaining that Vision A can trigger **client-defined actions** on
  severe defects (e.g. stop the line, trigger a labeling unit) — this card was explicitly requested as
  an "extra box", not a numbered step, and is visually distinct (navy gradient vs. the light step
  cards) for that reason.
- **`UseCases()`** (`id="use-cases"`) — 3-card grid, `t.useCases.cards` (Fabric Production, Finishing,
  Final Inspection).
- **`Comparison()`** (`id="comparison"`) — despite the id/name (kept for URL/nav-anchor stability), this
  is **not** a competitor-comparison table. It renders `t.comparison.cards` as a 4-card grid (class
  `usecases-grid why-grid` — reuses the use-cases card styling, `why-grid` just changes the grid to 4
  columns). **This was deliberately reworked from an earlier "VeritX vs. Legacy Systems" two-column
  table into standalone value-prop cards, per an explicit "don't compare to the competition" request.**
  Do not reintroduce a competitor/legacy-systems comparison here.
- **`Specs()`** (`id="specs"`) — dark navy section, 4 stat cards (`t.specs.cards`).
- **`Contact()`** (`id="contact"`) — two-column: left is contact info (`.contact-info`, with `mail`/`pin`
  icon rows); right is the lead-gen form. See §9.6 and §10 for the form's exact fields, ordering, and
  behavior — it's the most complex component in the file.
- **`MadeInMexicoBadge()`** — small decorative footer badge, pure CSS Mexican-flag color bar, no
  translated text (the "HECHO EN MÉXICO" label is hardcoded, not through `t`, since it's a fixed
  Spanish-language brand mark regardless of site language — this was an explicit request, not an
  oversight).
- **`Footer()`** — brand block (logo, tagline, the Mexico badge) + 3 link columns (`Product`, `Company`,
  `Legal`) + bottom bar (copyright, "prototype" disclaimer). The `Company` column is `About` (→
  `#/about`) and `Contact` (→ `#contact`) — both real links; there is no `Careers` entry. **The `Legal`
  column is still not real links** — see §11.
- **`Site()`** — route-to-component mapping, see §4.
- **`App()`** — default export, wraps `<Site/>` in `<LanguageProvider>`.

---

## 9. Content — full copy (both languages)

This is the **entire, current, verbatim contents of `src/translations.js`**, reproduced in full per the
request that this SDD be self-contained (you should not need to open `translations.js` to know the
exact copy — but if this ever drifts from the real file, trust the real file and refresh this section).

```js
export const translations = {
  en: {
    nav: {
      home: 'Home',
      product: 'Product',
      productItems: [
        { href: '#vision-a', label: 'Vision A' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#use-cases', label: 'Use Cases' },
        { href: '#comparison', label: 'Why VeritX' },
        { href: '#specs', label: 'Specifications' },
      ],
      toolsLabel: 'Tools',
      toolsItems: [
        { href: '#/demo', label: 'Demo' },
        { href: '#/calculator', label: 'Calculator' },
      ],
      aboutLabel: 'About Us',
      aboutItems: [
        { href: '#/about', label: 'Who We Are' },
        { href: '#contact', label: 'Contact' },
      ],
    },
    calculatorPage: {
      eyebrow: 'Coming Soon',
      title: 'Savings calculator',
      body: "We're building a calculator to estimate your potential savings and ROI with VeritX Vision based on your line speed, current inspection costs, and defect rate. In the meantime, request contact and we'll walk you through the numbers for your line.",
      cta: 'Request Contact',
    },
    demo: {
      eyebrow: 'Live Demo',
      title: 'Roll defect map',
      sub: 'Every detected defect is logged with its position along the roll and across the fabric width. This simulation shows the map an operator sees once a roll has been inspected.',
      simulate: 'Simulate new roll',
      defectsDetected: 'defects detected',
      rollInfo: '120 m roll · 160 cm fabric width',
      xAxis: 'Meters produced (m)',
      yAxis: 'Fabric width (cm)',
      sizeNote: 'Square size indicates severity',
      types: { hole: 'Hole', stain: 'Stain', weave: 'Weaving error', other: 'Other' },
      severities: { low: 'Low', medium: 'Medium', high: 'High' },
      tooltip: { position: 'Position', width: 'Width', severity: 'Severity', confidence: 'Confidence' },
      table: {
        title: 'Defect log',
        cols: ['#', 'Position (m)', 'Width (cm)', 'Type', 'Severity', 'Confidence'],
      },
    },
    hero: {
      eyebrow: 'AI-Powered Fabric Inspection',
      titleStart: 'Catch every textile defect. ',
      titleAccent: 'Cut inspection costs by half.',
      lead: 'VeritX Vision uses real-time computer vision and machine learning to detect fabric defects on the production line — delivering enterprise-grade quality control at a fraction of the cost of legacy inspection systems.',
      ctaPrimary: 'Request Contact',
      ctaSecondary: 'See How It Works',
      stats: [
        { num: '99.2%', label: 'Detection accuracy' },
        { num: 'Flexible', label: 'Install adapts to your machine' },
        { num: '~50%', label: 'Lower cost vs. legacy systems' },
      ],
      defectTags: [
        { label: 'Hole 98%', style: { top: '22%', left: '30%', width: '60px', height: '40px' } },
        { label: 'Stain 94%', style: { top: '58%', left: '62%', width: '70px', height: '46px' } },
      ],
      liveFeed: 'Live detection feed',
      feedDetail: '2 defects flagged · 12 ft roll',
    },
    visionA: {
      eyebrow: 'Meet the Product',
      title: 'Vision A: inspection that plugs into your line',
      sub: 'Vision A is our first inspection unit — engineered to be plug and play, so any mill can go from unboxing to automated quality control without re-engineering its production line.',
      features: [
        {
          icon: 'bolt',
          title: 'Plug & play by design',
          body: 'Vision A ships pre-calibrated with mounting hardware included. Mount it over your line, connect power and network, and start detecting — no specialized technicians, no production stops.',
        },
        {
          icon: 'link',
          title: 'Easy integration',
          body: 'Designed to retrofit onto your existing looms, finishing lines, or inspection frames without modifying them. Open APIs and standard industrial protocols connect it to your MES, ERP, or dashboards.',
        },
        {
          icon: 'sliders',
          title: 'Flexible to your process',
          body: 'Works across fabric types, widths, and line speeds. Start with a single unit at final inspection or scale to full-line coverage — in the cloud or on-premises.',
        },
      ],
      tags: ['Pre-calibrated', 'Flexible installation', 'Open API', 'No line modifications'],
      videoTitle: 'VeritX Vision video',
    },
    howItWorks: {
      eyebrow: 'How It Works',
      title: 'From raw fabric to actionable quality data',
      sub: 'A simple, four-step pipeline that plugs into your existing production line.',
      steps: [
        {
          n: '01',
          title: 'Camera & Sensor Capture',
          body: 'High-resolution line-scan cameras mount directly onto existing looms, finishing lines, or final inspection frames — no need to replace your current equipment.',
        },
        {
          n: '02',
          title: 'Real-Time AI Analysis',
          body: 'Our machine learning model analyzes fabric imagery frame by frame, classifying defects such as holes, stains, weaving errors, and shade variation in real time.',
        },
        {
          n: '03',
          title: 'Instant Defect Mapping',
          body: 'Detected defects are logged with position, type, and severity, and mapped onto the roll so operators know exactly where to inspect or cut.',
        },
        {
          n: '04',
          title: 'Reporting & Yield Optimization',
          body: 'Quality data feeds into a dashboard for trend analysis and integrates with your existing MES and production ecosystem, helping you optimize cut positions, reduce waste, and make data-driven decisions.',
        },
      ],
      integration: {
        title: 'Client-defined actions on severe defects',
        body: "Vision A can talk directly to your line's control system to react automatically when a defect crosses a severity threshold you set. You define the rules and the actions — VeritX Vision executes them in real time.",
        examples: [
          { icon: 'pause', rule: 'Severe defect detected 5+ times within 100 m', action: 'stop the line' },
          { icon: 'tag', rule: 'Severe defect detected', action: 'trigger the labeling unit to mark the defect' },
        ],
      },
    },
    useCases: {
      eyebrow: 'Where VeritX Fits',
      title: 'Coverage across your entire fabric line',
      sub: 'Deploy at one stage or across the full production flow — the system adapts to your setup.',
      cards: [
        {
          icon: 'weave',
          title: 'Fabric Production',
          body: 'Inline inspection during weaving and knitting catches defects at the source — before hours of production compound a single flaw.',
        },
        {
          icon: 'droplet',
          title: 'Finishing',
          body: 'Monitor dyeing, coating, and finishing stages for shade variation, streaks, and contamination before fabric moves downstream.',
        },
        {
          icon: 'eyeCheck',
          title: 'Final Inspection',
          body: 'Full-roll automated inspection before packaging and shipment, with a complete defect map for cutting and grading decisions.',
        },
      ],
    },
    comparison: {
      eyebrow: 'Why VeritX Vision',
      title: 'Precision, flexibility, and value — built into every unit',
      sub: 'VeritX Vision combines industrial-grade AI detection with a pricing and deployment model designed to fit mills of any size.',
      cards: [
        {
          icon: 'target',
          title: 'Industrial-grade accuracy',
          body: 'AI-based classification identifies holes, stains, weaving errors, and shade variation with industrial-grade precision, in real time.',
        },
        {
          icon: 'activity',
          title: 'Real-time inline inspection',
          body: 'Defects are flagged the moment they happen on the line, not discovered downstream after hours of production.',
        },
        {
          icon: 'percent',
          title: 'Accessible pricing',
          body: 'Designed from the ground up to be cost-efficient, so AI-powered quality control fits mills of any size — not just large enterprise budgets.',
        },
        {
          icon: 'cloud',
          title: 'Cloud or on-premises',
          body: 'Deploy VeritX Vision in the cloud, on-premises, or a hybrid setup — your infrastructure, your rules.',
        },
      ],
    },
    specs: {
      eyebrow: 'Technical Specifications',
      title: 'Precision built for production floors',
      sub: 'Prototype performance based on internal testing. Full technical datasheet available on request.',
      cards: [
        { val: '99.2%', label: 'Defect detection accuracy' },
        { val: '≤5mm', label: 'Minimum detectable defect size' },
        { val: 'Up to 120m/min', label: 'Inspection line speed' },
        { val: 'Custom-trained', label: 'Defect classes learned per material, not fixed' },
      ],
    },
    about: {
      eyebrow: 'About Us',
      title: 'Mexican engineering, built for textile manufacturers everywhere',
      body: 'VeritX Vision started in Tlaxcala, Mexico, built by a team with years of hands-on experience in the textile industry, with a simple goal: bring AI-powered quality control within reach of textile mills of any size — not just the largest manufacturers. We combine computer vision, machine learning, and hardware designed to fit into real production lines, so quality control stops being a luxury only a few can afford.',
      facts: [
        { icon: 'pin', label: 'Headquarters', value: 'Tlaxcala, Mexico' },
        { icon: 'globe', label: 'Where we serve', value: 'Mexico, Latin America, and beyond' },
      ],
    },
    contact: {
      eyebrow: 'Get In Touch',
      title: 'Ready to see VeritX Vision on your line?',
      body: "Tell us about your production setup and we'll schedule a personalized demo — in person or over video — to show how VeritX Vision fits into your process.",
      emailLabel: 'Email us',
      email: 'hello@veritxvision.com',
      locationLabel: 'Based in',
      location: 'Tlaxcala, Mexico — serving textile manufacturers across Mexico, Latin America, and the world',
      success: "Thanks for reaching out! We'll get back to you within one business day to schedule your demo.",
      privacy: {
        title: 'How we use your information',
        summary: 'VeritX Vision collects the information you submit here only to respond to your request and schedule a demo.',
        points: [
          'We use your data solely to contact you about VeritX Vision and follow up on your request.',
          'We never sell or share your information with third parties for marketing purposes.',
          'Your data is stored securely and kept only as long as needed to support your inquiry.',
          'You can request access, correction, or deletion of your data at any time by emailing hello@veritxvision.com.',
        ],
        consentLabel: 'I have read and agree to the processing of my personal data as described in this Privacy Policy.',
        consentRequired: 'Please accept the Privacy Policy to continue.',
      },
      form: {
        name: 'Full name',
        namePlaceholder: 'Jane Smith',
        company: 'Company',
        companyPlaceholder: 'Your mill or company',
        email: 'Work email',
        emailPlaceholder: 'jane@company.com',
        stage: 'Where would you use VeritX Vision?',
        stagePlaceholder: 'Select a stage',
        stageOptions: [
          {
            label: 'Fabric production',
            hint: 'Catches defects at the source — during weaving or knitting, before hours of production compound a single flaw.',
          },
          {
            label: 'Finishing',
            hint: 'Flags shade variation, streaks, and contamination during dyeing and coating, before fabric moves downstream.',
          },
          {
            label: 'Final inspection',
            hint: 'Gives you a complete defect map on the full roll before packaging, so cutting and grading decisions are based on real data.',
          },
          {
            label: 'Multiple stages',
            hint: 'Correlates defects across stages to trace recurring issues back to their source on the line.',
          },
        ],
        country: 'Country',
        countryPlaceholder: 'Select a country',
        countries: [
          { group: null, options: ['Mexico'] },
          {
            group: 'Latin America',
            options: [
              'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
              'Dominican Republic', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras',
              'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'Puerto Rico', 'Uruguay', 'Venezuela',
            ],
          },
          {
            group: 'Other countries',
            options: [
              'Australia', 'Bangladesh', 'Belgium', 'Canada', 'China', 'Denmark', 'Egypt',
              'France', 'Germany', 'India', 'Indonesia', 'Israel', 'Italy', 'Japan', 'Kenya',
              'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan',
              'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'South Africa',
              'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
              'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam', 'Other',
            ],
          },
        ],
        message: 'Tell us about your line',
        messagePlaceholder: 'Fabric type, line speed, current inspection process...',
        submit: 'Request Contact',
      },
    },
    footer: {
      tagline: 'AI-powered fabric inspection for modern textile manufacturers. Enterprise-grade quality control, without the enterprise price.',
      product: 'Product',
      productLinks: [
        { href: '#vision-a', label: 'Vision A' },
        { href: '#how-it-works', label: 'How It Works' },
        { href: '#use-cases', label: 'Use Cases' },
        { href: '#specs', label: 'Specifications' },
      ],
      company: 'Company',
      about: 'About',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      rights: 'All rights reserved.',
      prototype: 'Prototype product — specifications subject to change.',
    },
  },

  es: {
    nav: {
      home: 'Inicio',
      product: 'Producto',
      productItems: [
        { href: '#vision-a', label: 'Vision A' },
        { href: '#how-it-works', label: 'Cómo funciona' },
        { href: '#use-cases', label: 'Casos de uso' },
        { href: '#comparison', label: 'Por qué VeritX' },
        { href: '#specs', label: 'Especificaciones' },
      ],
      toolsLabel: 'Herramientas',
      toolsItems: [
        { href: '#/demo', label: 'Demo' },
        { href: '#/calculator', label: 'Calculadora' },
      ],
      aboutLabel: 'Nosotros',
      aboutItems: [
        { href: '#/about', label: 'Quiénes somos' },
        { href: '#contact', label: 'Contacto' },
      ],
    },
    calculatorPage: {
      eyebrow: 'Próximamente',
      title: 'Calculadora de ahorro',
      body: 'Estamos construyendo una calculadora para estimar tu ahorro potencial y retorno de inversión con VeritX Vision, según la velocidad de tu línea, tus costos de inspección actuales y tu tasa de defectos. Mientras tanto, solicita contacto y te ayudamos a revisar los números para tu línea.',
      cta: 'Solicitar contacto',
    },
    demo: {
      eyebrow: 'Demo en vivo',
      title: 'Mapa de defectos del rollo',
      sub: 'Cada defecto detectado se registra con su posición a lo largo del rollo y a lo ancho de la tela. Esta simulación muestra el mapa que ve un operador al terminar la inspección de un rollo.',
      simulate: 'Simular nuevo rollo',
      defectsDetected: 'defectos detectados',
      rollInfo: 'Rollo de 120 m · 160 cm de ancho de tela',
      xAxis: 'Metros producidos (m)',
      yAxis: 'Ancho de tela (cm)',
      sizeNote: 'El tamaño del cuadro indica la severidad',
      types: { hole: 'Agujero', stain: 'Mancha', weave: 'Error de tejido', other: 'Otro' },
      severities: { low: 'Baja', medium: 'Media', high: 'Alta' },
      tooltip: { position: 'Posición', width: 'Ancho', severity: 'Severidad', confidence: 'Confianza' },
      table: {
        title: 'Registro de defectos',
        cols: ['#', 'Posición (m)', 'Ancho (cm)', 'Tipo', 'Severidad', 'Confianza'],
      },
    },
    hero: {
      eyebrow: 'Inspección de telas con IA',
      titleStart: 'Detecta cada defecto textil. ',
      titleAccent: 'Reduce los costos de inspección a la mitad.',
      lead: 'VeritX Vision utiliza visión por computadora y aprendizaje automático en tiempo real para detectar defectos en la tela sobre la línea de producción — control de calidad de nivel empresarial a una fracción del costo de los sistemas de inspección tradicionales.',
      ctaPrimary: 'Solicitar contacto',
      ctaSecondary: 'Ver cómo funciona',
      stats: [
        { num: '99.2%', label: 'Precisión de detección' },
        { num: 'Flexible', label: 'La instalación se adapta a tu máquina' },
        { num: '~50%', label: 'Menor costo vs. sistemas tradicionales' },
      ],
      defectTags: [
        { label: 'Agujero 98%', style: { top: '22%', left: '30%', width: '60px', height: '40px' } },
        { label: 'Mancha 94%', style: { top: '58%', left: '62%', width: '70px', height: '46px' } },
      ],
      liveFeed: 'Detección en vivo',
      feedDetail: '2 defectos marcados · rollo de 12 ft',
    },
    visionA: {
      eyebrow: 'Conoce el producto',
      title: 'Vision A: inspección que se conecta a tu línea',
      sub: 'Vision A es nuestra primera unidad de inspección — diseñada para ser plug and play, para que cualquier fábrica pase de abrir la caja al control de calidad automatizado sin reingeniería de su línea de producción.',
      features: [
        {
          icon: 'bolt',
          title: 'Plug & play desde el diseño',
          body: 'Vision A llega precalibrada y con el hardware de montaje incluido. Móntala sobre tu línea, conecta corriente y red, y empieza a detectar — sin técnicos especializados ni paros de producción.',
        },
        {
          icon: 'link',
          title: 'Fácil integración',
          body: 'Diseñada para adaptarse a tus telares, líneas de acabado o marcos de inspección existentes sin modificarlos. APIs abiertas y protocolos industriales estándar la conectan a tu MES, ERP o tableros.',
        },
        {
          icon: 'sliders',
          title: 'Flexible a tu proceso',
          body: 'Funciona con distintos tipos de tela, anchos y velocidades de línea. Empieza con una unidad en inspección final o escala a cobertura total — en la nube o en sitio.',
        },
      ],
      tags: ['Precalibrada', 'Instalación flexible', 'API abierta', 'Sin modificar tu línea'],
      videoTitle: 'Video de VeritX Vision',
    },
    howItWorks: {
      eyebrow: 'Cómo funciona',
      title: 'De la tela cruda a datos de calidad accionables',
      sub: 'Un flujo simple de cuatro pasos que se integra a tu línea de producción existente.',
      steps: [
        {
          n: '01',
          title: 'Captura con cámaras y sensores',
          body: 'Cámaras de barrido lineal de alta resolución se montan directamente sobre telares, líneas de acabado o marcos de inspección final existentes — sin necesidad de reemplazar tu equipo actual.',
        },
        {
          n: '02',
          title: 'Análisis con IA en tiempo real',
          body: 'Nuestro modelo de aprendizaje automático analiza las imágenes de la tela cuadro por cuadro, clasificando defectos como agujeros, manchas, errores de tejido y variación de tono en tiempo real.',
        },
        {
          n: '03',
          title: 'Mapeo instantáneo de defectos',
          body: 'Los defectos detectados se registran con posición, tipo y severidad, y se mapean sobre el rollo para que los operadores sepan exactamente dónde inspeccionar o cortar.',
        },
        {
          n: '04',
          title: 'Reportes y optimización de rendimiento',
          body: 'Los datos de calidad alimentan un panel de análisis de tendencias y se integran con tu MES y ecosistema de producción existente, ayudándote a optimizar posiciones de corte, reducir desperdicio y tomar decisiones basadas en datos.',
        },
      ],
      integration: {
        title: 'Acciones definidas por el cliente ante defectos severos',
        body: 'Vision A puede comunicarse directamente con el sistema de control de tu línea para reaccionar automáticamente cuando un defecto supera un umbral de severidad que tú definas. Tú defines las reglas y las acciones — VeritX Vision las ejecuta en tiempo real.',
        examples: [
          { icon: 'pause', rule: 'Defecto severo detectado 5+ veces en 100 m', action: 'detener la línea' },
          { icon: 'tag', rule: 'Defecto severo detectado', action: 'activar la etiquetadora para marcar el defecto' },
        ],
      },
    },
    useCases: {
      eyebrow: 'Dónde encaja VeritX',
      title: 'Cobertura en toda tu línea de tela',
      sub: 'Instálalo en una etapa o a lo largo de todo el flujo de producción — el sistema se adapta a tu configuración.',
      cards: [
        {
          icon: 'weave',
          title: 'Producción de tela',
          body: 'La inspección en línea durante el tejido detecta defectos en el origen — antes de que horas de producción multipliquen una sola falla.',
        },
        {
          icon: 'droplet',
          title: 'Acabado',
          body: 'Monitorea las etapas de teñido, recubrimiento y acabado para detectar variación de tono, rayas y contaminación antes de que la tela avance en el proceso.',
        },
        {
          icon: 'eyeCheck',
          title: 'Inspección final',
          body: 'Inspección automatizada del rollo completo antes de empaque y envío, con un mapa completo de defectos para decisiones de corte y clasificación.',
        },
      ],
    },
    comparison: {
      eyebrow: 'Por qué VeritX Vision',
      title: 'Precisión, flexibilidad y valor — en cada unidad',
      sub: 'VeritX Vision combina detección con IA de nivel industrial con un modelo de precio y despliegue diseñado para fábricas de cualquier tamaño.',
      cards: [
        {
          icon: 'target',
          title: 'Precisión de nivel industrial',
          body: 'La clasificación con IA identifica agujeros, manchas, errores de tejido y variación de tono con precisión de nivel industrial, en tiempo real.',
        },
        {
          icon: 'activity',
          title: 'Inspección en línea en tiempo real',
          body: 'Los defectos se marcan en el momento en que ocurren en la línea, no se descubren después de horas de producción.',
        },
        {
          icon: 'percent',
          title: 'Precio accesible',
          body: 'Diseñado desde cero para ser eficiente en costo, para que el control de calidad con IA quepa en fábricas de cualquier tamaño — no solo en grandes presupuestos empresariales.',
        },
        {
          icon: 'cloud',
          title: 'En la nube o en sitio',
          body: 'Despliega VeritX Vision en la nube, en sitio, o en un esquema híbrido — tu infraestructura, tus reglas.',
        },
      ],
    },
    specs: {
      eyebrow: 'Especificaciones técnicas',
      title: 'Precisión diseñada para pisos de producción',
      sub: 'Rendimiento del prototipo basado en pruebas internas. Ficha técnica completa disponible a solicitud.',
      cards: [
        { val: '99.2%', label: 'Precisión de detección de defectos' },
        { val: '≤5mm', label: 'Tamaño mínimo de defecto detectable' },
        { val: 'Hasta 120m/min', label: 'Velocidad de línea de inspección' },
        { val: 'Entrenamiento a medida', label: 'Clases de defectos aprendidas por material, no fijas' },
      ],
    },
    about: {
      eyebrow: 'Quiénes somos',
      title: 'Ingeniería mexicana, hecha para fabricantes textiles de todo el mundo',
      body: 'VeritX Vision nació en Tlaxcala, México, de la mano de un equipo con años de experiencia en el sector textil, con un objetivo simple: poner el control de calidad con IA al alcance de fábricas textiles de cualquier tamaño — no solo de los fabricantes más grandes. Combinamos visión por computadora, aprendizaje automático y hardware diseñado para integrarse a líneas de producción reales, para que el control de calidad deje de ser un lujo al alcance de unos pocos.',
      facts: [
        { icon: 'pin', label: 'Sede', value: 'Tlaxcala, México' },
        { icon: 'globe', label: 'A quién atendemos', value: 'México, Latinoamérica y el mundo' },
      ],
    },
    contact: {
      eyebrow: 'Contáctanos',
      title: '¿Listo para ver VeritX Vision en tu línea?',
      body: 'Cuéntanos sobre tu configuración de producción y agendaremos una demo personalizada — presencial o por video — para mostrarte cómo VeritX Vision encaja en tu proceso.',
      emailLabel: 'Escríbenos',
      email: 'hello@veritxvision.com',
      locationLabel: 'Ubicados en',
      location: 'Tlaxcala, México — atendiendo a fabricantes textiles de México, Latinoamérica y el mundo',
      success: '¡Gracias por contactarnos! Te responderemos en un día hábil para agendar tu demo.',
      privacy: {
        title: 'Cómo usamos tu información',
        summary: 'VeritX Vision recopila la información que nos envíes en este formulario únicamente para responder tu solicitud y agendar una demo.',
        points: [
          'Usamos tus datos únicamente para contactarte sobre VeritX Vision y dar seguimiento a tu solicitud.',
          'Nunca vendemos ni compartimos tu información con terceros con fines de marketing.',
          'Tus datos se almacenan de forma segura y se conservan solo el tiempo necesario para atender tu solicitud.',
          'Puedes solicitar acceso, corrección o eliminación de tus datos en cualquier momento escribiendo a hello@veritxvision.com.',
        ],
        consentLabel: 'He leído y acepto el tratamiento de mis datos personales conforme a este aviso de privacidad.',
        consentRequired: 'Debes aceptar el aviso de privacidad para continuar.',
      },
      form: {
        name: 'Nombre completo',
        namePlaceholder: 'María López',
        company: 'Empresa',
        companyPlaceholder: 'Tu fábrica o empresa',
        email: 'Correo de trabajo',
        emailPlaceholder: 'maria@empresa.com',
        stage: '¿Dónde usarías VeritX Vision?',
        stagePlaceholder: 'Selecciona una etapa',
        stageOptions: [
          {
            label: 'Producción de tela',
            hint: 'Detecta defectos en el origen — durante el tejido, antes de que horas de producción multipliquen una sola falla.',
          },
          {
            label: 'Acabado',
            hint: 'Marca variación de tono, rayas y contaminación durante el teñido y recubrimiento, antes de que la tela avance en el proceso.',
          },
          {
            label: 'Inspección final',
            hint: 'Te da un mapa completo de defectos del rollo antes de empacar, para decidir corte y clasificación con datos reales.',
          },
          {
            label: 'Varias etapas',
            hint: 'Cruza los defectos entre etapas para rastrear problemas recurrentes hasta su origen en la línea.',
          },
        ],
        country: 'País',
        countryPlaceholder: 'Selecciona un país',
        countries: [
          { group: null, options: ['México'] },
          {
            group: 'Latinoamérica',
            options: [
              'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba',
              'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Panamá',
              'Paraguay', 'Perú', 'Puerto Rico', 'República Dominicana', 'Uruguay', 'Venezuela',
            ],
          },
          {
            group: 'Otros países',
            options: [
              'Alemania', 'Arabia Saudita', 'Australia', 'Bangladés', 'Bélgica', 'Canadá',
              'China', 'Corea del Sur', 'Dinamarca', 'Egipto', 'Emiratos Árabes Unidos',
              'España', 'Estados Unidos', 'Filipinas', 'Francia', 'India', 'Indonesia',
              'Israel', 'Italia', 'Japón', 'Kenia', 'Marruecos', 'Nigeria', 'Noruega',
              'Nueva Zelanda', 'Países Bajos', 'Pakistán', 'Polonia', 'Portugal',
              'Reino Unido', 'Rusia', 'Sudáfrica', 'Suecia', 'Suiza', 'Tailandia',
              'Turquía', 'Vietnam', 'Otro país',
            ],
          },
        ],
        message: 'Cuéntanos sobre tu línea',
        messagePlaceholder: 'Tipo de tela, velocidad de línea, proceso de inspección actual...',
        submit: 'Solicitar contacto',
      },
    },
    footer: {
      tagline: 'Inspección de telas con IA para fabricantes textiles modernos. Control de calidad de nivel empresarial, sin el precio empresarial.',
      product: 'Producto',
      productLinks: [
        { href: '#vision-a', label: 'Vision A' },
        { href: '#how-it-works', label: 'Cómo funciona' },
        { href: '#use-cases', label: 'Casos de uso' },
        { href: '#specs', label: 'Especificaciones' },
      ],
      company: 'Empresa',
      about: 'Nosotros',
      contact: 'Contacto',
      legal: 'Legal',
      privacy: 'Aviso de privacidad',
      terms: 'Términos de servicio',
      rights: 'Todos los derechos reservados.',
      prototype: 'Producto prototipo — especificaciones sujetas a cambio.',
    },
  },
}
```

---

## 10. Established decisions & constraints (read before changing content)

These are product/brand decisions that were **explicitly requested** during development. Don't
casually reverse them without the user re-confirming — re-litigating them wastes a round-trip.

1. **Default language is Spanish**, not browser-detected. English is opt-in via the header switcher.
2. **No competitor comparisons anywhere on the site.** The "Why VeritX Vision" section was rewritten
   from a "VeritX vs. Legacy Systems" table into standalone value-prop cards for exactly this reason.
   Don't reintroduce head-to-head competitor framing (explicit or implied) in that section or elsewhere.
3. **No specific installation-time promises** (e.g. "installs in < 48h"). Physical installation time
   varies by machine, so every mention of install time was changed to communicate **flexibility**
   instead of a fixed duration — see the hero stat, Vision A tags, and the "Why VeritX Vision" cards.
4. **CTA copy is "Request Contact" / "Solicitar contacto"** everywhere (hero, contact form submit,
   calculator placeholder) — not "Request a Demo"/"Solicitar demo" (an earlier version used that
   wording; it was explicitly renamed).
5. **No CTA button in the header** — removed once the header got crowded with the language switcher
   and 3 nav dropdowns. The primary CTA lives in content (hero, contact section, calculator page).
6. **Company facts, baked into copy:** HQ in **Tlaxcala, Mexico**; serves **Mexico, Latin America, and
   the world**; contact email **hello@veritxvision.com**. A "Hecho en México" footer badge with a small
   Mexican-flag-colored bar is present regardless of site language (hardcoded Spanish text — this is a
   fixed brand mark, not meant to translate to "Made in Mexico" in the English version).
7. **Demo and Calculator are grouped together** under one "Tools"/"Herramientas" nav dropdown, separate
   from "Product" (informational marketing sections) and "About Us"/"Nosotros" (Who We Are + Contact).
   This grouping was explicit — don't split them back into loose top-level nav links.
8. **Contact form field order:** Name + Company (2-col row) → Work email + Country (2-col row) → Stage
   select (full width, with a dynamic hint) → Message (textarea) → Privacy policy `<details>` →
   required consent checkbox → Submit button.
9. **Country select ordering is fixed:** Mexico first (standalone, no group label), then a "Latin
   America"/"Latinoamérica" `<optgroup>`, then an "Other countries"/"Otros países" `<optgroup>` — in
   that order, always. This was an explicit ordering requirement, not alphabetical-everything.
10. **The "stage" select shows a contextual hint** below it in light gray (`.field-hint`, `var(--gray-500)`)
    explaining, per selected stage, why deploying there matters — updates live as the visitor picks a
    different option. This was an explicit request ("agrega ... una descripción corta del por qué...").
11. **Contact form requires explicit consent** — a required checkbox (blocks native form submission via
    HTML5 validation + a `setCustomValidity` localized message) paired with a collapsible `<details>`
    block summarizing what data is collected and why. This exists because of an explicit "add a data
    policy and request consent" instruction.
12. **Icons are hand-drawn SVG, not emoji**, tinted with the brand cyan — an explicit reversal of an
    earlier emoji-based version ("cambia los emojis por iconos más serios..."). The one deliberate
    exception is the language-switcher's flag emoji (🇲🇽/🇺🇸), which represent language/country identity
    rather than being decorative.
13. **Section vertical spacing was reduced 20%** from the original design values — see §7. If asked to
    adjust spacing again, treat the current CSS values as the baseline.
14. **The demo-page defect-map color palette is validated**, not arbitrary — see the comment at the top
    of `DemoPage.jsx`: colors were checked for CVD-safety and contrast against the navy map surface
    (`#10294a`) using the project's internal data-viz accessibility method (all-pairs CVD ΔE ≥ 9.4,
    normal-vision ΔE ≥ 20.9, contrast ≥ 3:1). If defect-type colors are ever changed, re-validate rather
    than picking colors by eye.
15. **The product video belongs on the Vision A / product-description section**, not the About page —
    explicitly corrected after an initial placement in About. See §8's `VisionA()` entry.
16. **The `#/calculator` page is a real, interactive ROI calculator**, sourced from a client-provided
    document (`Guia_Ingeniero_Calidad_ROI.docx`, a "Quality Engineer's ROI Guide") — not a placeholder.
    Three savings sections (defect reduction, manual-inspection labor hours, line-speed increase), each
    with editable inputs (defaults = the guide's own worked examples), a live-computed annual-savings
    result, a collapsible formula box, and a client-facing hint; a total card sums the three, subtracts
    an optional recurring cost, and computes payback in months from an optional initial investment. All
    labels/formulas/hints are bilingual (`translations.js` → `calculatorPage`); the numeric defaults and
    the calculation functions themselves live in `CalculatorPage.jsx` (`DEFAULTS`, `CALC`), not in
    translations, since they aren't language-dependent. **Known issue inherited from the source
    document:** the line-speed section's worked example in the guide states an annual savings of
    $2,400,000 MXN, but applying the guide's own stated formula to that same example's numbers
    ((100−70) × 4,000 hrs × 0.5 units/m × $20/unit) yields $1,200,000 MXN — exactly half. The calculator
    implements the formula literally, so it will show $1,200,000 MXN for the default inputs, not the
    guide's $2,400,000 MXN. This was not silently "corrected" one way or the other; it's flagged in
    `TODO.md` for the user to confirm which is right (and fix the formula, the guide's example, or add a
    documented ×2 factor) rather than guessed at.

---

## 11. Known gaps / intentionally unfinished

> This is a point-in-time snapshot. **`TODO.md` (repo root) is the live, user-editable version of this
> list** — check it for the current state and any notes the user has added since this was last synced,
> and update both when you close an item out (see §13).

- **The contact form does not submit anywhere.** `Contact()`'s `handleSubmit` just calls
  `e.preventDefault()` and flips local `submitted` state to show a static success message
  (`t.contact.success`). There is no backend, no email service (e.g. Formspree), no API call. If the
  user asks "why didn't I get an email", this is why — it's cosmetic/prototype-only, flagged
  previously, not yet wired up.
- **Footer "Company" column** now has exactly two real links: "About"/"Nosotros" (`href="#/about"`,
  wired to the real About page) and "Contact"/"Contacto" (`href="#contact"`). "Careers"/"Vacantes" was
  removed entirely (was a non-functional placeholder with no page behind it) — do not re-add a Careers
  link without a real destination for it.
- **Footer "Legal" column:** "Privacy Policy"/"Aviso de privacidad" and "Terms of Service"/"Términos de
  servicio" are also plain `<span>`s — no privacy-policy or terms-of-service page exists anywhere on
  the site (the contact form's own inline privacy blurb, §10.11, is the only privacy-related content
  that actually exists).
- **The line-speed example in the source ROI guide has an arithmetic inconsistency** — see §10.16.
  Flagged in `TODO.md` for the user to confirm which side (formula vs. example) is right.
- **No web font is actually loaded** — `index.css` requests `'Inter'` first in the font stack, but
  nothing imports/links Inter, so every browser silently falls back to its next system font.
- **No automated tests, no linter/formatter config.**

---

## 12. Recipes for common changes

- **Change copy in an existing section:** edit the matching keys in `translations.js`, in **both**
  `en` and `es` blocks. There's no fallback language — a missing key renders `undefined`.
- **Add a new home-page section:** write a new function component in `App.jsx` (steal the shape of an
  existing one, e.g. `UseCases()`), add a matching content object to `translations.js` (both
  languages), add its `<Whatever/>` to the `route === 'home'` block in `Site()`, and — if it should be
  reachable from the nav — add an entry to the right `nav.*Items` array (`productItems` for marketing
  content, `toolsItems` for interactive tools, `aboutItems` for company-facing pages) in both languages.
- **Add a brand-new page (own hash route):** create `src/WhateverPage.jsx` following the
  `AboutPage.jsx`/`CalculatorPage.jsx` pattern (`demo-hero` + `demo-section`), add a route branch in
  `useRoute()` and `Site()` (see §4), and add its translations under a new top-level key in both
  language blocks.
- **Add/replace an icon:** add an entry to `ICON_PATHS` in `icons.jsx` (see §6), reference it by name
  from wherever needs it.
- **Add a language:** see the end of §5.
- **Deploy:** just `git push` to `main` — the Actions workflow builds and publishes automatically.
  No manual deploy step exists or is needed.

---

## 13. `TODO.md` — the live task list

`TODO.md` (repo root, next to `README.md`) is a plain checklist file, explicitly requested as an
open, low-friction place for the user to jot down pending items and annotations over time — it is
**not** meant to be as structured or as exhaustively-reasoned as this SDD. Treat it as the
**current source of truth for "what's left to do"**; §11 above is a snapshot frozen at the time it was
written and will drift.

- When you finish something listed there, check it off (`- [x]`) rather than deleting it, so there's a
  visible record of what shipped.
- When you notice a new gap or the user asks for something to be tracked "for later" rather than done
  now, add it there instead of just mentioning it in chat.
- If closing out or adding an item there makes §11 of this SDD stale or inaccurate, update §11 to match
  in the same change — don't let the two documents disagree about what's outstanding.
