import { useEffect, useRef, useState } from 'react'

/**
 * Robust "is this section near the viewport?" gate built on the native
 * IntersectionObserver.
 *
 * Why not framer-motion's `useInView` here? The reading-room and toolkit
 * sections pin a very tall inner scroll-track; pointing `useInView` at that
 * track proved unreliable (it could fail to flip `true`, leaving the WebGL
 * stage unmounted and the section an empty void). Observing the STABLE OUTER
 * <section> with a generous `rootMargin` instead gives a dependable signal:
 *
 *   - fires `true` well BEFORE the section scrolls in (scene is ready, no pop)
 *   - stays `true` for the whole pinned scroll (the section straddles the root)
 *   - flips `false` only once the section is well past
 *
 * So the canvas mounts reliably yet the number of concurrent WebGL contexts
 * stays bounded (scenes still release when far off-screen). The default margin
 * is deliberately generous (~1.3 screens) so the next section's heavy 3D layer
 * has time to mount, compile shaders and upload textures BEFORE it enters view,
 * instead of popping in abruptly mid-scroll.
 *
 * Usage:
 *   const [ref, near] = useNearViewport<HTMLElement>()
 *   <section ref={ref}>{near && <Canvas … />}</section>
 */
export function useNearViewport<T extends Element = HTMLElement>(
  options?: { rootMargin?: string; threshold?: number },
) {
  const ref = useRef<T | null>(null)
  const [near, setNear] = useState(false)

  const rootMargin = options?.rootMargin ?? '1400px 0px 1400px 0px'
  const threshold = options?.threshold ?? 0

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // No IntersectionObserver (very old browser / SSR): mount eagerly so the
    // scene is never withheld. Better an always-on context than an empty void.
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setNear(entry.isIntersecting)
      },
      { rootMargin, threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [ref, near] as const
}

/**
 * Two-tier viewport gate for heavy WebGL sections.
 *
 * Returns `[ref, near, visible]`:
 *   - `near`    — true well BEFORE the section scrolls in (wide margin). Use to
 *                 MOUNT the scene early so shaders compile / textures upload
 *                 before it appears. Because scenes are latched (see the App),
 *                 this only ever flips false→true once per section.
 *   - `visible` — true only while the section actually overlaps the viewport
 *                 (tight margin). Use to drive `frameloop`: an off-screen scene
 *                 renders `never` (≈ zero GPU) so several transmission/bloom
 *                 stages can coexist without saturating the GPU and stalling the
 *                 main thread (which is what turned scroll-up into teleports).
 *
 * The tight observer uses a small positive margin so a scene starts rendering a
 * beat before its top edge crosses in, avoiding a first-frame pop.
 */
export function useSceneVisibility<T extends Element = HTMLElement>(options?: {
  nearMargin?: string
  visibleMargin?: string
}) {
  const ref = useRef<T | null>(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)

  const nearMargin = options?.nearMargin ?? '1400px 0px 1400px 0px'
  const visibleMargin = options?.visibleMargin ?? '300px 0px 300px 0px'

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setNear(true)
      setVisible(true)
      return
    }

    const nearObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setNear(entry.isIntersecting)
      },
      { rootMargin: nearMargin, threshold: 0 },
    )
    const visObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting)
      },
      { rootMargin: visibleMargin, threshold: 0 },
    )
    nearObs.observe(el)
    visObs.observe(el)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
    }
  }, [nearMargin, visibleMargin])

  return [ref, near, visible] as const
}

/**
 * Latched mount + live visibility for a heavy scene.
 *
 * Returns `[ref, mounted, visible]`:
 *   - `mounted` — flips false→true the first time the section comes near, then
 *     STAYS true. We deliberately never unmount these scenes: re-mounting them
 *     while scrolling back up meant recompiling shaders / rebuilding env maps,
 *     and each of those stalls froze the main thread long enough that queued
 *     wheel/touch momentum applied in one lurch — the "teleport to a far
 *     section" bug. Keeping them mounted but idle (see `visible`) removes the
 *     stall entirely; total live WebGL contexts stay bounded (~6).
 *   - `visible` — drives each Canvas's `frameloop` so an off-screen scene renders
 *     on demand only (≈ zero GPU) instead of at 60fps.
 */
export function useLatchedScene<T extends Element = HTMLElement>(options?: {
  nearMargin?: string
  visibleMargin?: string
}) {
  const [ref, near, visible] = useSceneVisibility<T>(options)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (near) setMounted(true)
  }, [near])
  return [ref, mounted, visible] as const
}

/**
 * True on constrained devices (touch / coarse pointer / narrow viewport) where
 * the heavy transmission + post-processing scenes need trimmed DPR, no MSAA and
 * smaller env maps to hold a smooth frame rate.
 */
export function useLowPower() {
  const [low, setLow] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)')
    const sync = () => setLow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return low
}
