# Hourline

Landing page for a team scheduling product. Plain HTML, CSS and JS, built with Vite.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve dist/
```

## Layout

- `index.html` holds the whole page, including the nine animated SVG illustrations (CSS keyframes, no script).
- `src/style.css` has the page styles and design tokens.
- `src/main.js` handles pausing illustrations off-screen, the header scroll state, the mobile menu, the team and setup tabs, the pricing switch and the copy-link button.
- `public/` holds the favicon, the Geist font and the photos.

## Origin and licences

This branch is a copy of the open-source Hourline template by navedux
(`navedux/illos-hourline-template`, MIT, listed on 21st.dev and pinned there at commit `7386836`).
It was rebuilt from the template's public demo build rather than cloned from the repository,
so file layout and comments may differ from upstream; the rendered page and behaviour match the demo exactly.

- Code: MIT. Copy the upstream `LICENSE.md` into this repo to carry its exact copyright line.
- Animated illustrations: Illos free license. Use them in your site, including commercially;
  do not redistribute them on their own as assets.
