import { useCallback, useRef, useState } from 'react'
import type { RootState } from '@react-three/fiber'

// Maximum automatic remounts per mounted lifetime. Prevents a thrash loop when
// a context genuinely cannot be recovered (e.g. truly over the browser's hard
// context cap): after this many tries we stop and let the scene's SceneBoundary
// poster take over instead of flickering forever.
const MAX_RECOVERIES = 3

/**
 * WebGL context-loss / restore recovery for an R3F <Canvas>.
 *
 * A browser can drop a WebGL context at any moment — GPU reset, driver hiccup,
 * memory pressure, or simply too many live contexts across tabs. React Three
 * Fiber does not re-upload GPU resources onto a restored context, so the robust
 * fix is to remount the Canvas with a fresh one. We also call preventDefault on
 * the loss event (required for the browser to even attempt restoration) and, as
 * a belt-and-braces measure, schedule a remount ourselves so recovery still
 * happens on drivers that never emit `webglcontextrestored`.
 *
 * Usage:
 *   const { canvasKey, onCreated } = useWebGLResilience()
 *   <Canvas key={canvasKey} onCreated={onCreated} ... />
 */
export function useWebGLResilience() {
  const [canvasKey, setCanvasKey] = useState(0)
  const attempts = useRef(0)

  const onCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement
    // Scoped to this canvas instance so one loss cycle triggers at most one
    // remount; a fresh onCreated runs (with a fresh guard) after remounting.
    let recovering = false

    const recover = () => {
      if (recovering || attempts.current >= MAX_RECOVERIES) return
      recovering = true
      attempts.current += 1
      setCanvasKey((k) => k + 1)
    }

    const onLost = (event: Event) => {
      // Without preventDefault the context is gone permanently. After signalling
      // intent to restore, remount shortly regardless of whether the browser
      // fires `webglcontextrestored`.
      event.preventDefault()
      window.setTimeout(recover, 250)
    }
    const onRestored = () => recover()

    canvas.addEventListener('webglcontextlost', onLost as EventListener, false)
    canvas.addEventListener('webglcontextrestored', onRestored as EventListener, false)
    // Listeners live on this canvas element; when the Canvas unmounts (gating)
    // or remounts (recovery) the element is discarded and they are GC'd with it.
  }, [])

  return { canvasKey, onCreated }
}
