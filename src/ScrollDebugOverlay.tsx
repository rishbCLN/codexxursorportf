// TEMP DEBUG (throwaway): on-device instrumentation for the touch-during-inertia
// scroll glitch. Renders a per-frame ring buffer that FREEZES shortly after a
// touchstart so the glitch frame can be read on a phone. Gated behind
// `scrollDebugEnabled()` so it never renders or attaches listeners in a normal
// session. Remove this whole file (and its import + render in App.tsx and the
// __lenisDebug assignment) once the glitch is diagnosed. See
// .kilo/plans/1790393825061-touch-inertia-glitch-diagnosis.md.
import { useEffect, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { scrollDebugEnabled } from './scrollDebug'

// Narrow view of the Lenis instance exposed on window.__lenisDebug (App.tsx).
interface LenisSnapshot {
  isScrolling: boolean | string
  velocity: number
  direction: number
  animatedScroll: number
  targetScroll: number
  isTouching: boolean
}

interface FrameRecord {
  t: number
  scrollY: number
  dScrollY: number
  vvH: number | null
  vvOffTop: number | null
  innerH: number
  clientH: number
  scrollH: number
  rawP: number
  dRawP: number
  smP: number
  lenisScrolling: string
  lenisVel: number
  lenisDir: number
  lenisAnimated: number
  lenisTarget: number
  lenisTouching: boolean
  touchPhase: string
  touchDy: number
  mark: boolean
  glitch: boolean
}

interface FrozenRow {
  text: string
  glitch: boolean
  mark: boolean
}

const BUFFER_SIZE = 90 // ~1.5s at 60fps
const FREEZE_DELAY_MS = 500 // capture the touch frame + glitch frames, THEN freeze
const FREEZE_HOLD_MS = 2500 // how long the frozen table stays before re-arming
const SHOW_ROWS = 22 // newest frames rendered in the frozen table

function fmt(value: number | null, width: number, decimals: number): string {
  if (value === null || Number.isNaN(value)) return 'null'.padStart(width)
  return value.toFixed(decimals).padStart(width)
}

function pad(value: string, width: number): string {
  return value.slice(0, width).padStart(width)
}

const HEADER = [
  pad('t', 6),
  pad('dY', 6),
  pad('scrollY', 8),
  pad('rawP', 7),
  pad('dRawP', 7),
  pad('smP', 7),
  pad('vvH', 5),
  pad('clH', 5),
  pad('scrH', 6),
  pad('Lsc', 4),
  pad('Lvel', 6),
  pad('Ldr', 4),
  pad('tch', 4),
  pad('dy', 5),
].join(' ')

function rowText(r: FrameRecord, t0: number): string {
  return [
    fmt(r.t - t0, 6, 0),
    fmt(r.dScrollY, 6, 0),
    fmt(r.scrollY, 8, 0),
    fmt(r.rawP, 7, 4),
    fmt(r.dRawP, 7, 4),
    fmt(r.smP, 7, 4),
    fmt(r.vvH, 5, 0),
    fmt(r.clientH, 5, 0),
    fmt(r.scrollH, 6, 0),
    pad(String(r.lenisScrolling), 4),
    fmt(r.lenisVel, 6, 1),
    fmt(r.lenisDir, 4, 0),
    pad(r.touchPhase, 4),
    fmt(r.touchDy, 5, 0),
  ].join(' ')
}

export function ScrollDebugOverlay({
  scrollYProgress,
  progress,
}: {
  scrollYProgress: MotionValue<number>
  progress: MotionValue<number>
}) {
  const liveRef = useRef<HTMLDivElement>(null)
  const [frozen, setFrozen] = useState<FrozenRow[] | null>(null)

  useEffect(() => {
    if (!scrollDebugEnabled()) return

    const buffer: FrameRecord[] = []
    let prevScrollY = window.scrollY
    let prevRawP = scrollYProgress.get()
    let prevVvH = window.visualViewport?.height ?? null
    let prevClientH = document.documentElement.clientHeight

    let touchPhase = 'idle'
    let touchStartY = 0
    let touchDy = 0
    let markNextFrame = false

    let frozenState = false
    let freezeTimer = 0
    let rearmTimer = 0
    let rafId = 0

    const freezeNow = () => {
      frozenState = true
      const t0 = buffer.length > 0 ? buffer[0].t : 0
      const slice = buffer.slice(Math.max(0, buffer.length - SHOW_ROWS))
      const rows: FrozenRow[] = slice.map((r) => ({
        text: rowText(r, t0),
        glitch: r.glitch,
        mark: r.mark,
      }))
      setFrozen(rows)
      // Copyable exact numbers over a remote inspector.
      console.table(
        slice.map((r) => ({
          t: Math.round(r.t - t0),
          dScrollY: Math.round(r.dScrollY),
          scrollY: Math.round(r.scrollY),
          rawP: Number(r.rawP.toFixed(4)),
          dRawP: Number(r.dRawP.toFixed(4)),
          smP: Number(r.smP.toFixed(4)),
          vvH: r.vvH,
          clientH: r.clientH,
          scrollH: r.scrollH,
          innerH: r.innerH,
          vvOffTop: r.vvOffTop,
          Lscrolling: r.lenisScrolling,
          Lvel: Number(r.lenisVel.toFixed(2)),
          Ldir: r.lenisDir,
          Lanimated: Math.round(r.lenisAnimated),
          Ltarget: Math.round(r.lenisTarget),
          Ltouching: r.lenisTouching,
          touch: r.touchPhase,
          touchDy: Math.round(r.touchDy),
          glitch: r.glitch,
        })),
      )
      rearmTimer = window.setTimeout(() => {
        frozenState = false
        setFrozen(null)
      }, FREEZE_HOLD_MS)
    }

    const capture = () => {
      const lenisRaw = (window as unknown as { __lenisDebug?: LenisSnapshot }).__lenisDebug
      const scrollY = window.scrollY
      const rawP = scrollYProgress.get()
      const smP = progress.get()
      const vvH = window.visualViewport?.height ?? null
      const vvOffTop = window.visualViewport?.offsetTop ?? null
      const clientH = document.documentElement.clientHeight
      const scrollH = document.documentElement.scrollHeight
      const innerH = window.innerHeight

      const dScrollY = scrollY - prevScrollY
      const dRawP = rawP - prevRawP
      const vvChanged = vvH !== null && prevVvH !== null && vvH !== prevVvH
      const clientChanged = clientH !== prevClientH

      const glitch =
        Math.abs(dRawP) > 0.01 ||
        (Math.abs(dScrollY) > 120 && touchPhase !== 'move') ||
        vvChanged ||
        clientChanged

      buffer.push({
        t: performance.now(),
        scrollY,
        dScrollY,
        vvH,
        vvOffTop,
        innerH,
        clientH,
        scrollH,
        rawP,
        dRawP,
        smP,
        lenisScrolling: lenisRaw ? String(lenisRaw.isScrolling) : '-',
        lenisVel: lenisRaw ? lenisRaw.velocity : 0,
        lenisDir: lenisRaw ? lenisRaw.direction : 0,
        lenisAnimated: lenisRaw ? lenisRaw.animatedScroll : 0,
        lenisTarget: lenisRaw ? lenisRaw.targetScroll : 0,
        lenisTouching: lenisRaw ? lenisRaw.isTouching : false,
        touchPhase,
        touchDy,
        mark: markNextFrame,
        glitch,
      })
      markNextFrame = false
      if (buffer.length > BUFFER_SIZE) buffer.shift()

      prevScrollY = scrollY
      prevRawP = rawP
      prevVvH = vvH
      prevClientH = clientH

      const node = liveRef.current
      if (node) {
        node.textContent = `ARMED  scrollY ${Math.round(scrollY)}  rawP ${rawP.toFixed(4)}  smP ${smP.toFixed(4)}  vvH ${vvH ?? '-'}  clH ${clientH}  (tap & hold-coast to freeze)`
      }
    }

    const loop = () => {
      if (!frozenState) capture()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const onTouchStart = (event: TouchEvent) => {
      touchPhase = 'strt'
      touchStartY = event.touches[0]?.clientY ?? 0
      touchDy = 0
      markNextFrame = true
      // Freeze AFTER a short delay so the buffer captures the touch frame plus
      // the glitch frames that follow it — freezing on the touchstart frame
      // itself would miss the discontinuity we are hunting.
      if (!frozenState && !freezeTimer) {
        freezeTimer = window.setTimeout(() => {
          freezeTimer = 0
          freezeNow()
        }, FREEZE_DELAY_MS)
      }
    }
    const onTouchMove = (event: TouchEvent) => {
      touchPhase = 'move'
      touchDy = (event.touches[0]?.clientY ?? touchStartY) - touchStartY
    }
    const onTouchEnd = () => {
      touchPhase = 'end'
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      if (freezeTimer) window.clearTimeout(freezeTimer)
      if (rearmTimer) window.clearTimeout(rearmTimer)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [scrollYProgress, progress])

  if (!scrollDebugEnabled()) return null

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 99999,
        top: 0,
        left: 0,
        right: 0,
        font: '10px/1.25 monospace',
        background: 'rgba(0,0,0,0.8)',
        color: '#0f0',
        padding: '6px',
        whiteSpace: 'pre',
        pointerEvents: 'none',
        maxHeight: '60vh',
        overflow: 'hidden',
      }}
    >
      {frozen ? (
        <>
          <div style={{ color: '#ff0' }}>FROZEN @touch (glitch=red, touch=cyan) — re-arms in {FREEZE_HOLD_MS / 1000}s</div>
          <div style={{ color: '#888' }}>{HEADER}</div>
          {frozen.map((row, i) => (
            <div
              key={i}
              style={{ color: row.glitch ? '#f44' : row.mark ? '#0ff' : '#0f0' }}
            >
              {row.mark ? '>' : ' '}
              {row.text}
            </div>
          ))}
        </>
      ) : (
        <div ref={liveRef}>ARMED (waiting for frame)</div>
      )}
    </div>
  )
}
