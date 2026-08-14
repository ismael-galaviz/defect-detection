# VeritX Vision — Website

Bilingual (Spanish/English) marketing website for VeritX Vision, an AI-powered fabric defect detection
system for textile manufacturers. Includes a client-only simulated customer portal (login, registration,
password/username recovery, and an account dashboard) — see `docs/SDD.md` §14 for exactly what's real
versus simulated there.

For the full technical/design record — routing, i18n, icon system, established product decisions, known
gaps, and the customer-portal architecture — see **[`docs/SDD.md`](docs/SDD.md)**. This README only
covers the basics of running and deploying the project.

## Stack

- React 18 + Vite
- Plain CSS (no framework dependency)
- No backend — the contact form, appointment booking, and the entire customer portal are client-only
  prototypes (see `docs/SDD.md` §11 and §14.8)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Outputs a production build to `dist/`.

## Structure

- `src/App.jsx` — all marketing-page sections (hero, how it works, use cases, why VeritX, specs, contact
  form) plus the shared `Header`/`Footer` and routing
- `src/auth.js` — the simulated customer-portal auth service (`docs/SDD.md` §14.2)
- `src/LoginPage.jsx`, `RegisterPage.jsx`, `VerifyEmailPage.jsx`, `ForgotPasswordPage.jsx`,
  `RecoverUsernamePage.jsx`, `VisionHomePage.jsx` — the customer-portal pages
- `src/DemoPage.jsx`, `CalculatorPage.jsx`, `AboutPage.jsx` — satellite marketing pages
- `src/MexicoMap.jsx` / `mexicoMapData.js` — generated locator map used on the About page
- `src/translations.js` — all bilingual copy, one object; `src/i18n.jsx` — the language state provider
- `src/icons.jsx` — the hand-drawn SVG icon set
- `src/index.css` — the entire design system (colors, layout, every component's styling)
- `public/favicon.svg` — brand mark

See `docs/SDD.md` §3 for the full annotated file map.

## Deploy

This repo builds to two independent hosting targets from the same `main` branch. `vite.config.js` picks
the right asset base path for each automatically — see `docs/SDD.md` §2 for exactly how and why.

### GitHub Pages

Configured as a **project site** at:

```
https://<your-username>.github.io/defect-detection/
```

Steps:

1. Push this repo to GitHub with the name `defect-detection` (must match — `vite.config.js` uses that
   path as the asset base for this target).
2. In the repo, go to **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or `master`) — the workflow in `.github/workflows/deploy.yml` builds the site and
   deploys it automatically.
4. The live URL will appear in the Actions run summary and under Settings → Pages.

If you rename the repo, update the GitHub Pages branch of the `base` ternary in `vite.config.js` to
match, otherwise assets will 404.

### Vercel

Already connected to this repo via Vercel's own git integration — no extra setup needed:

- **No `vercel.json` required.** Vercel auto-detects this as a Vite project from `package.json`/
  `vite.config.js` and defaults to `npm run build` + `dist` as the output directory, which already match.
- **No "Root Directory" override needed** in the Vercel dashboard — `package.json` sits at the git root
  (this folder), so there's no nested-monorepo path to configure.
- **No rewrites/redirects needed** — every route in the app is a `#/...` hash fragment (client-side
  only), so the browser only ever requests `/` from the server; there's nothing for Vercel to redirect.
- Vercel sets the `VERCEL` env var automatically during its builds; `vite.config.js` uses it to switch
  the asset base to `/` (root-served) instead of GitHub Pages' `/defect-detection/` prefix. This is the
  one thing that had to change in the codebase for Vercel builds to work at all — nothing else to do.
- Push to `main` and Vercel redeploys on its own, independently of the GitHub Pages Action above.

## Git remote

The `.git` repo lives in this folder (`frontend/veritx-web`), **not** at the top of `02_Website_Code` or
`Defect Detection` — running `git` commands from those parent folders will fail with "not a git
repository". `cd` into `frontend/veritx-web` first.

- Remote: `origin` → `https://github.com/ismael-galaviz/defect-detection.git`
- Default branch: `main`, pushed to directly (no PR workflow in use currently)
- Pushing to `main` triggers both deploy targets above

## Notes

Marketing content (specs, comparisons, hero copy) is placeholder pending real product photography, demo
footage, and validated performance specs — see `src/translations.js` and `docs/SDD.md` §11 for what's
still flagged as prototype-only. The customer portal (`docs/SDD.md` §14) has no backend at all; treat it
as a UI/UX demo, not a real auth system, until a real API exists behind it.
