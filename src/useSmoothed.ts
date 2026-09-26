import { useAnimationFrame, useMotionValue } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

// Monotonic exponential smoothing for a scroll-driven MotionValue. Unlike a
// spring, it eases toward the target WITHOUT ever overshooting, so when the
// scroll stops OR reverses the value glides to rest instead of springing past
// and snapping back. That backward correction is exactly the "jerk a few frames
// back" shudder a spring produces the instant a swipe reverses direction — and
// a first-order lag has no velocity term, so it physically cannot overshoot.
// tauMs is the feel dial (smaller = snappier).
export function useSmoothed(source: MotionValue<number>, tauMs = 80) {
  const out = useMotionValue(source.get())
  useAnimationFrame((_, delta) => {
    const target = source.get()
    const cur = out.get()
    // Snap + stop churning once we're effectively at rest (0.00005 progress is
    // sub-pixel here), so we don't thrash subscribers every idle frame.
    if (Math.abs(target - cur) < 0.00005) {
      if (cur !== target) out.set(target)
      return
    }
    const alpha = 1 - Math.exp(-delta / tauMs)
    out.set(cur + (target - cur) * alpha)
  })
  return out
}
