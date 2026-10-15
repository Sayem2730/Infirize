# InfirizeTech Website

A bold, modern agency website built with Next.js, Tailwind CSS, Lenis smooth scroll and 3D elements, for InfirizeTech.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Lenis (smooth scrolling)
- GSAP (animation)
- Three.js, @react-three/fiber, @react-three/drei (3D shapes)

## Getting started

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Project structure

```
app/
  components/     Reusable UI (SmoothScroll, menu, hero, 3D shapes)
  globals.css     Color variables and base styles
  layout.tsx      Fonts, skip link and smooth scroll wrapper
  page.tsx        Home page
public/           Images and static files
```

## Customizing the brand

Colors live in one place, `app/globals.css`:

```css
:root {
  --c-accent: #3d5afe;
  --c-ink: #0b1020;
  --c-white: #ffffff;
}
```

Change these values and the whole site updates.

## Scripts

| Command         | What it does                  |
| --------------- | ----------------------------- |
| `npm run dev`   | Start the dev server          |
| `npm run build` | Create a production build     |
| `npm run start` | Run the production build      |
| `npm run lint`  | Check the code with ESLint    |

## License

All rights reserved.
