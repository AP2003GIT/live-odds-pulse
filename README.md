# Live Odds Pulse

A small but production-minded frontend project designed to showcase practical skills for high-traffic, real-time products.

## What it demonstrates

- Vue 3 + Pinia architecture with reusable components
- Near real-time UI updates through a mocked odds stream
- Filtering by sport, league, and team search
- Favorites persisted in localStorage
- Responsive, accessible UI with keyboard-friendly controls
- Unit and integration tests using Vitest + Vue Test Utils
- GitHub Actions CI (test + build)

## Tech stack

- JavaScript (ES modules)
- Vue 3
- Pinia
- Vite
- Vitest + Vue Test Utils

## Quick start

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## Scripts

```bash
npm run dev         # start local dev server
npm run build       # production build
npm run preview     # preview built app
npm run test        # run unit + integration tests once
npm run test:watch  # watch mode tests
```

## Suggested GitHub pitch text

"Real-time sports odds dashboard built with Vue 3 and Pinia. Focused on scalable component architecture, user-centric UX, accessibility, and production-like quality gates (tests + CI)."

## Project structure

```text
src/
  components/
  data/
  services/
  stores/
tests/
.github/workflows/ci.yml
```
