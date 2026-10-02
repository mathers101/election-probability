# Election Probabilities

An interactive election prediction app. Set state-level candidate win probabilities and see how they translate into overall victory probabilities.

## Elections

- **2026 Senate** — Open the default page at [`/2026-senate`](https://election-probability.vercel.app/2026-senate). Select a starting map from 270toWin Consensus, Cook Political Report, Inside Elections, or FiftyPlusOne, then select a state with an active Senate race to edit its prediction. States without a race in 2026 are gray. Cards show candidate names and incumbent information. The source maps are dated snapshots. Safe, likely, lean, and tilt ratings use adjustable probability sliders; toss-up remains 50%. FiftyPlusOne's displayed per-race probabilities are used directly.
- **2024 Presidential** — Visit [`/2024-presidential`](https://election-probability.vercel.app/2024-presidential) to set state probabilities for Harris and Trump and view their Electoral College victory probabilities, including the chance of a 269–269 tie.

The home route (`/`) redirects to the 2026 Senate page. Senate probabilities use direct convolution to track Republican wins and Democratic candidate wins separately. A Republican victory means at least 50 seats; a Democratic victory means at least 51 Democratic seats. Independent wins are not counted as Democratic seats.

## Getting started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints a local development URL, usually `http://localhost:5173`.

## Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build in dist/
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```

## Deployment

The app is a Vite single-page application using React Router's declarative routing. The `vercel.json` rewrite sends direct requests for client-side routes to `index.html`, so refreshing `/2026-senate` or `/2024-presidential` works on Vercel. Other static hosts must be configured with an equivalent SPA fallback to `index.html`.

## Tech stack

- React 19 and TypeScript
- Vite
- React Router (declarative mode)
- Tailwind CSS
- Radix UI
