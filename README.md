# VeritX Vision — Website

Landing page for VeritX Vision, an AI-powered fabric defect detection system for textile manufacturers, built to compete with solutions like Uster Fabriq Vision.

## Stack

- React 18 + Vite
- Plain CSS (no framework dependency)

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

- `src/App.jsx` — all page sections (hero, how it works, use cases, comparison, specs, contact form)
- `src/index.css` — design system (colors, layout, components)
- `public/favicon.svg` — brand mark

## Deploy to GitHub Pages

This repo is configured for GitHub Pages as a **project site** at:

```
https://<your-username>.github.io/defect-detection/
```

Steps:

1. Push this repo to GitHub with the name `defect-detection` (must match, since `vite.config.js` sets `base: '/defect-detection/'`).
2. In the repo, go to **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Push to `main` (or `master`) — the workflow in `.github/workflows/deploy.yml` builds the site and deploys it automatically.
4. The live URL will appear in the Actions run summary and under Settings → Pages.

If you rename the repo, update `base` in `vite.config.js` to match (`/new-repo-name/`), otherwise assets will 404.

## Git remote

The `.git` repo lives in this folder (`frontend/veritx-web`), **not** at the top of `02_Website_Code` or `Defect Detection` — running `git` commands from those parent folders will fail with "not a git repository". `cd` into `frontend/veritx-web` first.

- Remote: `origin` → `https://github.com/ismael-galaviz/defect-detection.git`
- Default branch: `main`, pushed to directly (no PR workflow in use currently)
- Pushing to `main` triggers the GitHub Pages deploy workflow above

## Notes

Content is placeholder pending real product photography, demo footage, and validated performance specs. Update the `SPECS`, `COMPARE_ROWS`, and hero copy in `App.jsx` once real data is available.
