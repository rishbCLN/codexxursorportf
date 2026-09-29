import { lazy, Suspense } from 'react'
import { perfHudEnabled } from './devFlags'

// DEV-only leva control panel, mounted once at the app root (a DOM overlay, not
// inside a Canvas). This just stands the panel up so future dev-time tuning is a
// single `useControls(...)` call away in any scene — no scene constants are
// wired into it yet (that is a documented follow-up; see the plan and the
// integration-point notes in the R3F scene files).
//
// leva is a devDependency and must never reach the production bundle, so it is
// pulled in through a dynamic import that only exists inside an
// `import.meta.env.DEV` branch. In production `Leva` is `null` and Vite drops
// the import; in dev it renders only when the `?perf` / `perfHud` gate is on.
const Leva = import.meta.env.DEV
  ? lazy(() => import('leva').then((m) => ({ default: m.Leva })))
  : null

export function DevLeva() {
  if (!Leva || !perfHudEnabled()) return null
  return (
    <Suspense fallback={null}>
      <Leva collapsed />
    </Suspense>
  )
}
