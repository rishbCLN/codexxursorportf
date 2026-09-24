import { useEffect, useRef } from 'react'
import type { MotionValue } from 'framer-motion'

/*
  THE SIGNAL — the atmospheric field behind the contact finale.

  The whole site is about reaching out: hands closing toward a sonic ring, HUD
  read-outs, a champagne signal running through everything. The contact section
  is where the visitor sends that signal back. This canvas draws a drifting
  constellation of nodes, wired to each other by proximity and anchored to a soft
  acid beacon that breathes like the hero's ring.

  Deliberately NOT coupled to the DOM. The previous contact scene positioned 3D
  prisms in world space to line up under DOM columns, an alignment that broke on
  any reflow. Here the field is pure atmosphere — the crisp DOM channel list on
  top stays the real, always-usable control. The only link between them is
  temporal: focusing a channel bumps `signal`, and the beacon answers with a
  pulse. Plain 2D canvas, no WebGL: universal, cheap, one code path everywhere.
*/

const ACID = '231, 182, 92'
const PAPER = '242, 241, 235'

type Node = { x: number; y: number; vx: number; vy: number }

export default function SignalField({
  signal,
  reduced = false,
}: {
  signal: MotionValue<number>
  reduced?: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let link = 150 // proximity threshold for wiring two nodes
    let nodes: Node[] = []
    const rings: number[] = [] // each entry is a live pulse's age in seconds
    let energy = 0 // 0..1 excitement, spikes on focus then decays
    let targetX = 0
    let targetY = 0 // pointer-parallax target (css px)
    let driftX = 0
    let driftY = 0
    let last = performance.now()
    let lastSignal = signal.get()
    let raf = 0

    const beaconX = () => w * 0.3
    const beaconY = () => h * 0.46

    const build = () => {
      const rect = canvas.getBoundingClientRect()
      w = Math.max(1, rect.width)
      h = Math.max(1, rect.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      link = Math.min(190, Math.max(96, Math.min(w, h) * 0.16))
      const count = Math.round(Math.min(84, Math.max(36, (w * h) / 15000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
      }))
    }

    const render = (dt: number, t: number) => {
      const bx = beaconX()
      const by = beaconY()

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      driftX += (targetX - driftX) * Math.min(1, dt * 3)
      driftY += (targetY - driftY) * Math.min(1, dt * 3)
      ctx.translate(driftX, driftY)
      ctx.globalCompositeOperation = 'lighter'

      // Beacon halo
      const pulse = reduced ? 0.6 : 0.6 + Math.sin(t * 1.6) * 0.16
      const halo = ctx.createRadialGradient(bx, by, 0, bx, by, link * 1.8)
      halo.addColorStop(0, `rgba(${ACID}, ${0.15 + energy * 0.18})`)
      halo.addColorStop(0.5, `rgba(${ACID}, ${0.045 + energy * 0.06})`)
      halo.addColorStop(1, `rgba(${ACID}, 0)`)
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(bx, by, link * 1.8, 0, Math.PI * 2)
      ctx.fill()

      // Concentric beacon rings + hot core
      for (let i = 0; i < 3; i++) {
        const r = link * (0.22 + i * 0.17) * (1 + (reduced ? 0 : Math.sin(t * 1.1 + i) * 0.03))
        ctx.strokeStyle = `rgba(${ACID}, ${(0.24 - i * 0.06) * pulse})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(bx, by, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.fillStyle = `rgba(255, 247, 230, ${0.72 * pulse})`
      ctx.beginPath()
      ctx.arc(bx, by, 2.4, 0, Math.PI * 2)
      ctx.fill()

      // Advance drift
      if (!reduced) {
        const speed = 1 + energy * 1.7
        for (const n of nodes) {
          n.x += n.vx * dt * speed
          n.y += n.vy * dt * speed
          if (n.x < -24) n.x = w + 24
          else if (n.x > w + 24) n.x = -24
          if (n.y < -24) n.y = h + 24
          else if (n.y > h + 24) n.y = -24
        }
      }

      // Wiring: node-to-beacon (ties the field to the source) + node-to-node
      const reach = link * 1.5
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        const bd = Math.hypot(a.x - bx, a.y - by)
        if (bd < reach) {
          const al = (1 - bd / reach) * (0.14 + energy * 0.5)
          ctx.strokeStyle = `rgba(${ACID}, ${al})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(bx, by)
          ctx.stroke()
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const c = nodes[j]
          const dx = a.x - c.x
          const dy = a.y - c.y
          if (dx > link || dx < -link || dy > link || dy < -link) continue
          const d = Math.hypot(dx, dy)
          if (d < link) {
            const al = (1 - d / link) * (0.09 + energy * 0.2)
            ctx.strokeStyle = `rgba(${PAPER}, ${al})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(c.x, c.y)
            ctx.stroke()
          }
        }
      }

      // Node points — brighter and warmer the closer they sit to the beacon
      for (const n of nodes) {
        const near = 1 - Math.min(1, Math.hypot(n.x - bx, n.y - by) / reach)
        const r = 0.8 + near * 1.3 + energy * 0.8
        ctx.fillStyle = `rgba(${ACID}, ${0.22 + near * 0.4})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Focus pulses expanding from the beacon
      for (let i = rings.length - 1; i >= 0; i--) {
        rings[i] += dt
        const life = 1.7
        const p = rings[i] / life
        if (p >= 1) {
          rings.splice(i, 1)
          continue
        }
        ctx.strokeStyle = `rgba(${ACID}, ${(1 - p) * 0.5})`
        ctx.lineWidth = 1.5 * (1 - p) + 0.4
        ctx.beginPath()
        ctx.arc(bx, by, p * link * 3.4, 0, Math.PI * 2)
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'source-over'
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    }

    build()

    // Reduced motion: one calm frame, redrawn only when the box resizes.
    if (reduced) {
      render(0, 0)
      const roStatic = new ResizeObserver(() => {
        build()
        render(0, 0)
      })
      roStatic.observe(canvas)
      return () => roStatic.disconnect()
    }

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 18
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 14
    }
    window.addEventListener('pointermove', onPointer)

    const ro = new ResizeObserver(build)
    ro.observe(canvas)

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const sig = signal.get()
      if (sig !== lastSignal) {
        lastSignal = sig
        rings.push(0)
        energy = 1
      }
      energy += (0 - energy) * Math.min(1, dt * 1.6)
      render(dt, now / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [signal, reduced])

  return <canvas ref={ref} className="signal-field" aria-hidden="true" />
}
