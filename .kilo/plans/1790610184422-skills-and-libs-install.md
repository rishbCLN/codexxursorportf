# Curated Skills + Libraries Install

## Goal
Add the vetted **agent skills** (emilkowalski animation set, Anthropic `webapp-testing`, Vercel `vercel-optimize`) and the recommended **npm libraries** to the portfolio. Wire the trivial libraries now (Vercel Analytics + Speed Insights in prod; r3f-perf + leva behind a DEV-only gate) and leave `split-type` + `maath` installed with documented integration points — **no forced refactor of the working scenes/headings**.

Requires an implementation-capable agent (source edits + mutating npm/npx commands). Run everything from `D:\codexxursorportf`. Run git/npm commands individually (per `.kilorules`); `git push` is forbidden.

## Current state (verified)
- Vite 7 + React 19.1.1 SPA (`vite.config.ts`, `src/main.tsx`), TS build `tsc -b && vite build`, deploy via `vercel.json` (`framework: vite`).
- Root render: `src/main.tsx:46` → `<StrictMode><SceneBoundary><App/></SceneBoundary></StrictMode>`.
- 6 R3F `<Canvas>` scenes: `SonicRing`, `WarpField`, `SonicExitRing`, `ResearchArchive`, `ToolkitCortex`, `ContactConstellation` — each already uses `useWebGLResilience()` and `frameloop` gating. **Do not disturb this.**
- Existing skills mechanism: `.agents/skills/` + `skills-lock.json` (currently `frontend-design`, `vercel-react-best-practices`, `web-design-guidelines`), installed via the `skills` CLI.
- No test runner configured (no vitest/jest/playwright).

## Peer-dep compatibility (verified via `npm view`)
| Package | Latest | Peers vs our stack | OK? |
|---|---|---|---|
| `@vercel/analytics` | 2.0.1 | react ^18‖^19 | yes (framework peers optional) |
| `@vercel/speed-insights` | 2.0.0 | react ^18‖^19 | yes |
| `r3f-perf` | 7.2.3 | @react-three/fiber ≥8, react ≥18, three ≥0.133 | yes (we have R3F 9.3 / three 0.180) |
| `leva` | 0.10.1 | react ^18‖^19 | yes |
| `split-type` | 0.3.4 | none | yes |
| `maath` | 0.10.8 | three ≥0.134, @types/three ≥0.134 | yes (three 0.180) |

## Decisions (locked)
- **Scope:** both skills + libraries (full curated set).
- **Depth:** install all 6 libs; wire Analytics + Speed Insights (prod) and a DEV-gated r3f-perf HUD + leva panel; document `split-type` + `maath` only.
- **Dep placement:** `@vercel/analytics`, `@vercel/speed-insights` → `dependencies` (pinned exact, matching repo style). `r3f-perf`, `leva`, `split-type`, `maath` → `devDependencies` (pinned exact).
- **Keep dev tools out of the prod bundle:** import `r3f-perf`/`leva` **only through dynamic `import()` inside an `import.meta.env.DEV` branch**, so Vite dead-code-eliminates them from the production build. No static top-level import of these two.

---

## Tasks

### 1. Install agent skills (mutating `npx`)
Run each individually and let the CLI update `.agents/skills/` + `skills-lock.json`:
1. `npx skills@latest add emilkowalski/skills` — full animation/design set (animate, review-animations, improve-animations, find-animation-opportunities, animation-vocabulary, apple-design, mobile-native, pick-ui-library, prototype, emil-design-eng, etc.).
2. `npx skills@latest add anthropics/skills/webapp-testing` — browser/E2E testing skill.
3. `npx skills@latest add vercel-labs/agent-skills/vercel-optimize` — Vercel perf/deploy optimization skill.

If a per-skill path form errors, run `npx skills@latest add --help` to confirm syntax (whole-repo add is the known-good fallback, e.g. `npx skills@latest add anthropics/skills`). After install, confirm new entries exist in `skills-lock.json` and folders exist under `.agents/skills/`.

### 2. Install libraries (mutating `npm`, run individually)
- `npm install @vercel/analytics@2.0.1 @vercel/speed-insights@2.0.0` (prod deps)
- `npm install -D r3f-perf@7.2.3 leva@0.10.1 split-type@0.3.4 maath@0.10.8` (dev deps)

Preserve the existing exact-version style and the `overrides` block in `package.json`. Verify `package-lock.json` updates cleanly.

### 3. Wire Vercel Analytics + Speed Insights (prod) — `src/main.tsx`
Import from the React subpaths and mount once at the root, inside `SceneBoundary` alongside `<App/>`:
```tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
// ...
<SceneBoundary label="root" fallback={RootFallback}>
  <App />
  <Analytics />
  <SpeedInsights />
</SceneBoundary>
```
No config needed for Vercel-hosted deploys; both no-op locally. (Data is sent to Vercel only in production — acceptable, this is the user's own analytics.)

### 4. DEV-only r3f-perf HUD — new `src/DevPerf.tsx`
Create a component that renders **inside a Canvas** and is a no-op unless in dev + explicitly enabled. Use a gate mirroring `src/scrollDebug.ts` (`?perf` query or `perfHud` localStorage):
```tsx
import { lazy, Suspense } from 'react'
// dynamic import keeps r3f-perf out of the prod bundle
const Perf = import.meta.env.DEV
  ? lazy(() => import('r3f-perf').then((m) => ({ default: m.Perf })))
  : null
function perfEnabled() { /* DEV && (?perf | localStorage 'perfHud') — copy scrollDebug.ts pattern */ }
export function DevPerf() {
  if (!Perf || !perfEnabled()) return null
  return <Suspense fallback={null}><Perf position="top-left" /></Suspense>
}
```
Then add `<DevPerf />` as a sibling of the existing `<Suspense>` **inside each `<Canvas>`** (one line per file), e.g. in `ToolkitCortex.tsx:471` region and the equivalent spot in `SonicRing`, `WarpField`, `SonicExitRing`, `ResearchArchive`, `ContactConstellation`. It renders nothing in prod and when the flag is off. (Enough to place in the hero `SonicRing` if minimizing edits; all-canvas gives per-context stats.)

### 5. DEV-only leva panel — `src/main.tsx` (or a small `DevLeva.tsx`)
Mount the panel gated + dynamically so it stays out of prod:
```tsx
const Leva = import.meta.env.DEV
  ? lazy(() => import('leva').then((m) => ({ default: m.Leva })))
  : null
// render (DEV only): <Suspense fallback={null}><Leva collapsed /></Suspense>
```
Do **not** rewire existing scene math into `useControls` in this task — that is the documented follow-up (see below). This task only stands up the panel so future dev tuning is one `useControls` call away.

### 6. Document (comments only, no behavior change)
Add short "integration point" comments — do not refactor working code:
- **`split-type`**: note candidate headings for per-line/word/char splitting to drive existing Framer Motion reveals — hero serif lines (`.hero-line-serif`, `App.tsx` hero block) and `.research-title-row h2`. Pattern: `new SplitType(el, { types: 'lines,words' })` then animate `.line`/`.word`, and call `.revert()` on cleanup / before re-split on resize.
- **`maath`**: note it can replace hand-rolled easing/damping in the R3F `useFrame` loops (e.g. `maath/easing`'s `damp3`/`damp` for camera + group lerps) when those scenes are next touched.
- **`leva`**: note the `useControls` follow-up for live-tuning scene constants (camera fov/position, damping) behind the DEV gate from Task 5.

---

## Validation
From `D:\codexxursorportf`, individually:
1. `npm run build` (`tsc -b && vite build`) — must pass, zero TS errors.
2. `npm run lint` (`eslint .`) — must pass (watch for react-refresh "only export components": keep the `perfEnabled` gate in its own non-component module if lint complains, like `scrollDebug.ts`).
3. Confirm prod bundle is clean of dev tools: after build, grep `dist/assets` for `r3f-perf` / `leva` — expect **no** matches in the entry/main chunks (dynamic-import dead branches should be dropped).
4. `npm run dev`, load `/?perf` → r3f-perf HUD + leva panel visible; load `/` (no flag) → neither present, scenes unchanged.
5. Sanity-check `skills-lock.json` has the 3 new skill groups and `.agents/skills/` contains their folders.

## Risks / notes
- **Bundle bloat / build failure** if `r3f-perf` or `leva` are statically imported — they are devDeps; a static import in a prod code path would pull them into the graph. Mitigation: dynamic import under `import.meta.env.DEV` only (Tasks 4–5).
- **Multiple WebGL contexts**: r3f-perf reports per-Canvas; expect one HUD per mounted scene if wired into all six. Acceptable for dev; wire only into `SonicRing` if a single HUD is preferred.
- **Analytics privacy**: `<Analytics/>`/`<SpeedInsights/>` beacon to Vercel in production only. This is the site owner's own telemetry; no third-party data sharing beyond Vercel.
- **StrictMode double-invoke** (dev) may double-log leva/perf mounts — cosmetic, dev-only.
- Do not touch the `overrides` (`motion-dom`, `motion-utils`) block or the existing `useWebGLResilience`/`frameloop` gating.

## Out of scope
- Refactoring existing headings to `split-type` or swapping scene math to `maath` (documented only).
- Wiring `useControls` into real scene constants.
- Removing the throwaway scroll-debug overlay (tracked separately in `1790393825061-touch-inertia-glitch-diagnosis.md`).
- Any `git push` / deploy.
