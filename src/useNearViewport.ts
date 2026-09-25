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
