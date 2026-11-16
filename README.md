# BeRocker homepage redesign (v2)

Hourline-led layout: off-white page, white cards, one blue accent, one navy for dark panels.

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Motion. One static page.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Environment

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_API_BASE_URL`: backend that receives demo requests (`POST /book-demo`), same value as `NUXT_API_BASE_URL` on the current site.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key for the demo form.
- `NEXT_PUBLIC_SITE_URL` (optional): canonical URL, defaults to `https://berocker.com`.

Without the API URL the form shows a "not connected yet" message instead of sending.

## Colour rules

- Every colour is a token in `app/globals.css` (`@theme`). Tailwind's default palette is switched off,
  so only token classes exist (`bg-accent`, `text-ink-3`, `bg-navy`, ...).
- No gradient text. Gradients appear only in panel backgrounds (`well`, `well-navy`) and the ribbons.
- `components/Ribbons.tsx` reads the ribbon colours from the same tokens.

## Where things are

- `lib/content.ts`: all copy. Items marked `placeholder` must be replaced before launch.
  Set `SHOW_PLACEHOLDER_MARKERS = false` to hide the amber markers.
- `components/sections/*`: one file per homepage section, in page order in `app/page.tsx`.
- `components/InterferenceRibbons.jsx`: hero and closing-section WebGL background (React Bits Pro component;
  one local addition pauses it while off-screen).
- `components/IntegrationFlow.tsx` + `SyncFlow.tsx`: the animated BeRocker <-> Super Dispatch map in the Super Dispatch
  section. Loaded only on wide screens once the section is near (about 5 KB); phones get a plain list. Its light theme
  reads the colour tokens. Rows (`SUPER_DISPATCH.flow`) are the eight areas of the CRM's Super Dispatch connection; pulses pause off-screen.
- `components/DemoForm.tsx` / `DemoProvider.tsx`: demo form and the modal every "Book a demo" button opens.
- `public/`: BeRocker logos, product clips and screenshots, compliance badges.

## Placeholders still to fill

1. Two customer quotes (proof strip, support section)
3. Accounting integrations
4. FAQ: Super Dispatch requirements, contract terms, usage charges
5. Confirmation of "the only auto transport CRM with MCP support"
