# Brand assets

This folder is where official Malbek logo files go if you have permission to use them in this private demo.
No official Malbek logo, wordmark, or brand asset files are included in this repository. None were downloaded
from the internet and none are committed to version control beyond this README.

## Why

This project is an independent internship portfolio demo, not an official Malbek product. Malbek's logo and
brand assets are Malbek's property. The application ships with a self-drawn placeholder mark (a simple geometric
monogram built in code, see `src/components/brand/logo.tsx`) so the app looks finished and demo-ready without
needing anyone's trademarked assets. If you have the CEO's permission to use real Malbek brand assets inside this
private demo, drop the files here and follow the steps below to wire them in. Do not commit real logo files to a
public repository and do not deploy this app publicly with real brand assets present.

## What to place here

- `logo-mark.svg` (or `.png`): the icon-only mark, square aspect ratio, transparent background, works at 24 to 48px.
- `logo-full-light.svg`: full horizontal lockup (mark + wordmark) for light backgrounds.
- `logo-full-dark.svg`: full horizontal lockup for dark backgrounds.
- `favicon.ico` or `icon.png`: for the browser tab icon, replaces `src/app/favicon.ico`.

SVG is strongly preferred over PNG: it stays sharp at any size and works cleanly in both light and dark mode.

## How to wire it in

1. Place the files above in this folder.
2. Open `src/components/brand/logo.tsx` and follow the inline comment: swap the placeholder `<PlaceholderMark />`
   component for an `<Image>` (or inline `<svg>`, preferred for icons that need to inherit `currentColor`) pointing
   at `/assets/brand/logo-mark.svg`. Next.js serves anything under `/assets` as a static file automatically once
   the folder is moved under `public/` or referenced via the `public` directory convention. If you keep assets here
   under the repo root instead of `public/assets/brand`, copy them into `public/assets/brand` so Next.js can serve
   them, since only files under `public/` are served as static assets.
3. Replace `src/app/favicon.ico` with the official favicon if provided.
4. If Malbek's real brand colors are available to you, update the `brand` color scale in `tailwind.config.ts`
   (the current values are an informed approximation, not a verified match, see `docs/design/design-direction.md`
   for the reasoning) and the matching `tremor` / `dark-tremor` aliases in the same file, and the `--ring` CSS
   variable in `src/app/globals.css`.

## What never happens automatically

This app never fetches brand assets from the internet at build time or runtime. Nothing here is hotlinked. If this
folder is empty, the app falls back to the placeholder mark and continues to work exactly as before.
