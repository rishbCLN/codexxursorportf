import { lazy, Suspense } from 'react'
import { perfHudEnabled } from './devFlags'

// DEV-only r3f-perf HUD. Renders *inside* a <Canvas> (it uses the R3F render
// loop) and shows GPU/CPU/draw-call/memory stats for that WebGL context.
//
// r3f-perf is a devDependency and must never reach the production bundle, so it
// is pulled in through a dynamic import that only exists inside an
// `import.meta.env.DEV` branch. In a production build `Perf` is `null`, this
// component returns `null`, and Vite drops the import entirely. In dev it still
// renders nothing unless the `perfHudEnabled()` gate (?perf / localStorage) is
// on, so normal dev sessions are unaffected.
const Perf = import.meta.env.DEV
  ? lazy(() => import('r3f-perf').then((m) => ({ default: m.Perf })))
  : null

export function DevPerf() {
  if (!Perf || !perfHudEnabled()) return null
  return (
    <Suspense fallback={null}>
      <Perf position="top-left" />
    </Suspense>
  )
}
