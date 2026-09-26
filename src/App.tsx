import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import type { MotionValue, Variants } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowUpRight,
  Asterisk,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Database,
  Github,
  Linkedin,
  Mail,
  Plus,
  TerminalSquare,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import SceneBoundary from './SceneBoundary'
import type { ChangeEvent, CSSProperties } from 'react'
import type { RenderedPdf } from './pdfPages'
import { TOOLKIT_CLUSTERS } from './toolkitData'
import Lenis from 'lenis'
import { whenHeroReady } from './heroReady'
import { triggerReveal, useRevealed } from './reveal'
import { useLatchedScene, useLowPower } from './useNearViewport'
import { useSmoothed } from './useSmoothed'
import { ScrollDebugOverlay } from './ScrollDebugOverlay'
import { scrollDebugEnabled } from './scrollDebug'
import heroHandLeftUrl from './assets/hero-hand-left.png'
import heroHandRightUrl from './assets/hero-hand-right.png'
import cloudsUrl from './assets/clouds.png'

const SonicRing = lazy(() => import('./SonicRing'))
const WarpField = lazy(() => import('./WarpField'))
const SonicExitRing = lazy(() => import('./SonicExitRing'))
const ResearchArchive = lazy(() => import('./ResearchArchive'))
const ToolkitCortex = lazy(() => import('./ToolkitCortex'))
const ContactConstellation = lazy(() => import('./ContactConstellation'))

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const projects = [
  {
    index: '01',
    title: 'MESH\nALERT',
    type: 'DISASTER TECH / MOBILE',
    year: '2026',
    description: 'An offline mesh communication app for disaster zones — devices relay messages peer-to-peer with no internet, then sync survivors to a live rescue map the moment any node reconnects.',
    tags: ['FLUTTER', 'DART', 'MESH'],
    theme: 'mesh',
    device: 'phone',
    platform: 'ANDROID / OFFLINE MESH',
    result: 'COMPANION LIVE MAP',
    repo: 'https://github.com/rishbCLN/mesh_net',
  },
  {
    index: '02',
    title: 'CIVIC\nLEDGER',
    type: 'WEB3 / CIVIC TECH',
    year: '2025',
    description: 'A civic-accountability dApp that records public infrastructure issues as append-only, cryptographically verifiable events — evidence on IPFS, history on-chain, nothing silently edited.',
    tags: ['REACT', 'SOLIDITY', 'IPFS'],
    theme: 'civic',
    device: 'laptop',
    platform: 'WEB / ETHEREUM SEPOLIA',
    result: 'LIVE ON SEPOLIA',
    repo: 'https://github.com/rishbCLN/civic-issue-reporting',
  },
  {
    index: '03',
    title: 'ZERO-DEP\nTOOLKIT',
    type: 'OPEN SOURCE / CLI',
    year: '2026',
    description: 'A growing suite of genuinely zero-dependency Node.js developer tools — a Pomodoro timer, snippet vault, JSON viewer, mock API, port killer, and more — each installable and auditable in seconds.',
    tags: ['NODE.JS', 'CLI', 'ZERO-DEPS'],
    theme: 'cli',
    device: 'laptop',
    platform: 'TERMINAL / NPM',
    result: '10+ OPEN-SOURCE TOOLS',
    repo: 'https://github.com/rishbCLN?tab=repositories',
  },
]

// Layered 3D-brain plates (transparent PNGs, all centered on identical canvases).
// Sorted ascending: index 0 = deepest plate (rendered back), last = frontmost shell.
const brainLayerModules = import.meta.glob<string>('./assets/brain-layers/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const brainLayerUrls = Object.entries(brainLayerModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true }))
  .map(([, url]) => url)

const researchPapers = [
  {
    id: 'NOTE-01',
    title: 'MESSAGES WITHOUT A NETWORK',
    subtitle: 'Store-and-forward relay for phones cut off from the internet',
    field: 'OFFLINE-FIRST SYSTEMS',
    year: '2026',
    status: 'BUILD NOTES',
    accent: '#e7b65c',
    figure: 'mesh',
    abstract: 'Notes from building MeshAlert: when the towers are down, phones can still see each other over local radios. Each device carries messages a few hops further and syncs to a rescue map the instant any node touches the internet again.',
    quote: 'Connectivity is not binary. A dead network still has neighbours one hop away.',
    note: 'Working through the hard parts in the open — deduplicating messages that arrive by several paths, ageing out stale packets, and keeping the relay honest when devices join and leave the mesh constantly.',
    keywords: ['MESH', 'OFFLINE-FIRST', 'FLUTTER'],
  },
  {
    id: 'NOTE-02',
    title: 'HISTORY YOU CANNOT QUIETLY EDIT',
    subtitle: 'Recording civic issues as append-only, verifiable events',
    field: 'ON-CHAIN PROVENANCE',
    year: '2025',
    status: 'PROJECT WRITE-UP',
    accent: '#ff64bc',
    figure: 'archive',
    abstract: 'Notes from CivicLedger: a public-infrastructure tracker where every status change is a new immutable event. Evidence lives on IPFS, the trail lives on-chain, and nothing gets silently rewritten after the fact.',
    quote: 'Trust is cheap to claim and expensive to prove. Provenance flips that.',
    note: 'Learning where a blockchain actually earns its keep — cost per event on Sepolia, keeping large evidence off-chain via content addressing, and designing an interface that treats an audit trail as the main feature, not a footnote.',
    keywords: ['SOLIDITY', 'IPFS', 'ACCOUNTABILITY'],
  },
  {
    id: 'NOTE-03',
    title: 'THE CASE FOR ZERO DEPENDENCIES',
    subtitle: 'Building small Node tools you can actually read end to end',
    field: 'DEVELOPER TOOLING',
    year: '2026',
    status: 'ONGOING',
    accent: '#6df7ff',
    figure: 'type',
    abstract: 'Notes behind a growing set of zero-dependency CLI tools — a Pomodoro timer, snippet vault, JSON viewer, mock API, port killer. Each one installs in seconds and has a dependency tree you can audit over a coffee.',
    quote: 'Every dependency is a stranger you invite into your users\u2019 machines.',
    note: 'A practical exercise in restraint: reaching for the standard library first, keeping install size and supply-chain surface near zero, and treating a short, legible codebase as a feature rather than a limitation.',
    keywords: ['NODE.JS', 'CLI', 'ZERO-DEPS'],
  },
  {
    id: 'NOTE-04',
    title: 'SPENDING FRAMES WHERE THEY SHOW',
    subtitle: 'Keeping an expressive site fast on the phone in your hand',
    field: 'WEB PERFORMANCE',
    year: '2026',
    status: 'BUILD LOG',
    accent: '#ffad42',
    figure: 'field',
    abstract: 'Notes from building this portfolio: WebGL, scroll choreography, and motion are only worth it if they hold up on a mid-range phone. The goal is spending the compute budget where people can actually perceive it.',
    quote: 'The frame nobody notices is the cheapest frame you will ever render.',
    note: 'Chasing a smooth result on real hardware — deferring heavy scenes until they enter view, respecting reduced-motion and low-power hints, and cutting work the eye will never resolve.',
    keywords: ['WEBGL', 'R3F', 'PERFORMANCE'],
  },
  {
    id: 'NOTE-05',
    title: 'LEARNING IN PUBLIC',
    subtitle: 'Notes from a CSE student building to understand',
    field: 'FUNDAMENTALS',
    year: '2025',
    status: 'LEARNING LOG',
    accent: '#b8a0ff',
    figure: 'attention',
    abstract: 'A running log of the fundamentals under the projects — data structures, networking, and the parts of distributed systems that only click once you break something and have to fix it yourself.',
    quote: 'You do not really know a concept until a bug forces you to argue with it.',
    note: 'Writing things down as I learn them, keeping the rough edges visible instead of pretending the path was straight. The mistakes are usually the most useful part of the note.',
    keywords: ['DSA', 'NETWORKING', 'SELF-TAUGHT'],
  },
]

const principles = [
  {
    number: '01',
    title: 'MOTION IS\nINFORMATION',
    body: 'Animation is not decoration. It explains hierarchy, establishes causality, and gives interfaces a physical logic people can understand.',
    accent: 'acid',
  },
  {
    number: '02',
    title: 'SPEED IS\nA FEATURE',
    body: 'Visual ambition means nothing if the work cannot move at sixty frames per second on the device already in someone’s hand.',
    accent: 'cyan',
  },
  {
    number: '03',
    title: 'SYSTEMS CREATE\nFREEDOM',
    body: 'Strong constraints make room for surprise. Every expressive moment should emerge from a coherent and maintainable foundation.',
    accent: 'pink',
  },
  {
    number: '04',
    title: 'DETAILS CARRY\nTHE IDEA',
    body: 'The final ten percent is where a digital product gains character: rhythm, sound, easing, copy, focus states, and edge cases.',
    accent: 'orange',
  },
]


function HeroHandsScene({ progress }: { progress: MotionValue<number> }) {
  // Pointer parallax (adds depth, independent of scroll)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const driftX = useSpring(px, { stiffness: 55, damping: 22, mass: 0.6 })
  const driftY = useSpring(py, { stiffness: 55, damping: 22, mass: 0.6 })

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      px.set((event.clientX / window.innerWidth - 0.5) * 22)
      py.set((event.clientY / window.innerHeight - 0.5) * 16)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [px, py])

  // Driven by the pinned hero's scroll progress. They stop with a deliberate gap
  // between the index fingers so the 3D sonic ring fits in the opening.
  //
  // DIALS (all %):
  //   HAND_SHIFT  — slides the WHOLE clasp left. Both hands move together by
  //                 this amount, so the fingertip gap is unchanged.
  //   GAP_X/GAP_Y — half the fingertip gap at the touch point.
  const HAND_SHIFT = 9
  const GAP_X = 5.4
  const GAP_Y = 4.6
  const leftX = useTransform(progress, [0, 0.46], [`${-24 - HAND_SHIFT}%`, `${-GAP_X - HAND_SHIFT}%`])
  const leftY = useTransform(progress, [0, 0.46], ['20%', `${GAP_Y}%`])
  const rightX = useTransform(progress, [0, 0.46], [`${24 - HAND_SHIFT}%`, `${GAP_X - HAND_SHIFT}%`])
  const rightY = useTransform(progress, [0, 0.46], ['-20%', `${-GAP_Y}%`])
  const glowOpacity = useTransform(progress, [0, 0.46], [0.28, 0.9])

  return (
    <div className="hero-canvas" aria-hidden="true">
      <motion.div className="hero-hands-wrap" style={{ x: driftX, y: driftY }}>
        {/* Luminous stage so the dark chrome reads against the black hero */}
        <motion.div className="hero-stage-glow" style={{ opacity: glowOpacity }} />

        {/* Left / lower hand — scroll pulls it in toward the gap */}
        <motion.div className="hero-hand hand-left" style={{ x: leftX, y: leftY }}>
          <img className="hero-hand-img" src={heroHandLeftUrl} alt="" draggable={false} />
        </motion.div>

        {/* Right / upper hand — mirrors it so the fingertips come close but never touch */}
        <motion.div className="hero-hand hand-right" style={{ x: rightX, y: rightY }}>
          <img className="hero-hand-img" src={heroHandRightUrl} alt="" draggable={false} />
        </motion.div>
      </motion.div>
    </div>
  )
}

function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, { stiffness: 650, damping: 42, mass: 0.18 })
  const smoothY = useSpring(y, { stiffness: 650, damping: 42, mass: 0.18 })
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  // Refs mirror the latest visible/active flags so the pointer handlers can
  // dedupe their updates WITHOUT `visible` sitting in the effect's dependency
  // array. Previously the first pointer move flipped `visible` true, which
  // re-ran this effect and tore down + re-bound every listener — a visible
  // rebind loop that also fired setActive() on every single mousemove. With a
  // ref-based lifecycle the effect mounts its listeners exactly once and only
  // calls setState when a value genuinely changes.
  const visibleRef = useRef(false)
  const activeRef = useRef(false)

  useEffect(() => {
    // Engage the custom cursor on any desktop pointer. We deliberately do NOT
    // gate on `(pointer: fine)`: some desktop browsers report coarse/dual
    // pointers (touchscreen laptops, pen digitisers) yet are driven by a mouse.
    // Genuine touch input is filtered per-event below, so this stays correct.
    const setVisibility = (next: boolean) => {
      if (visibleRef.current === next) return
      visibleRef.current = next
      setVisible(next)
      document.documentElement.classList.toggle('has-custom-cursor', next)
    }

    const onMove = (event: PointerEvent | MouseEvent) => {
      if ('pointerType' in event && event.pointerType === 'touch') return
      x.set(event.clientX)
      y.set(event.clientY)
      setVisibility(true)
      const target = event.target instanceof Element ? event.target : null
      const nextActive = Boolean(target?.closest('a, button, .project-visual, .archive-upload-btn, .toolkit-chip, [role="button"]'))
      if (activeRef.current !== nextActive) {
        activeRef.current = nextActive
        setActive(nextActive)
      }
    }

    const onLeave = () => setVisibility(false)
    const onEnter = () => setVisibility(true)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    window.addEventListener('blur', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('blur', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [x, y])

  return (
    <motion.div
      className="cursor"
      data-active={active}
      style={{
        x: smoothX,
        y: smoothY,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}

// Decode an image off-thread; resolves once the bitmap is actually ready to
// paint (not merely fetched), with a 1.2s timeout so an external asset never blocks the loader.
function decodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, 1200)
    const done = () => {
      clearTimeout(timer)
      resolve()
    }
    const img = new Image()
    img.src = src
    if (img.decode) img.decode().then(done, done)
    else if (img.complete) done()
    else {
      img.onload = done
      img.onerror = done
    }
  })
}

// How many horizontal bands the clouds curtain is sliced into for the parting
// hand-off. Each slat shows its own strip of the SAME clouds image (positioned
// with a negative offset) so together they read as one seamless sky while
// loading, then peel away independently to reveal the hero beneath.
const LOADER_SLATS = 7

// Founder / CEO / entrepreneur quotes shown on the loading screen. One is picked
// at random on every load and rendered in the site's Instrument Serif italic
// (see .loader-quote). Kept short (<=40 chars) so each lays out on one line, or
// two at most on a narrow phone.
const LOADER_QUOTES: { text: string; author: string }[] = [
  { text: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
  { text: 'Make something people want.', author: 'Paul Graham' },
  { text: 'Ideas are easy. Implementation is hard.', author: 'Guy Kawasaki' },
  { text: 'The biggest risk is not taking any risk.', author: 'Mark Zuckerberg' },
  { text: 'Ideas are commodities. Execution is not.', author: 'Michael Dell' },
  { text: 'Whatever you do, be different.', author: 'Anita Roddick' },
  { text: 'Get big fast.', author: 'Jeff Bezos' },
  { text: 'Done is better than perfect.', author: 'Sheryl Sandberg' },
  { text: 'Chase the vision, not the money.', author: 'Tony Hsieh' },
  { text: 'Culture eats strategy for breakfast.', author: 'Peter Drucker' },
  { text: 'Only the paranoid survive.', author: 'Andy Grove' },
  { text: 'Growth and comfort do not coexist.', author: 'Ginni Rometty' },
]

function Loader() {
  const [visible, setVisible] = useState(true)
  // Pick one quote for this page load and keep it stable for the loader's life.
  const [quote] = useState(() => LOADER_QUOTES[Math.floor(Math.random() * LOADER_QUOTES.length)])
  const rootRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const lineRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const seamRef = useRef<HTMLDivElement>(null)
  const slatRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    // Handwritten quote entrance: the block rises in and the text "writes" itself
    // on left-to-right, the attribution signing off a beat later — so the wait
    // opens like a hand-penned note. This is a creative showcase, so it plays for
    // everyone regardless of the OS reduced-motion setting.
    gsap.from('.loader-quote-inner', { opacity: 0, y: 26, duration: 1.0, ease: 'power3.out', delay: 0.3 })
    gsap.fromTo('.loader-quote-text', { clipPath: 'inset(0 100% -18% 0)' }, { clipPath: 'inset(0 0% -18% 0)', duration: 1.6, ease: 'power2.inOut', delay: 0.45 })
    gsap.from('.loader-quote-author', { opacity: 0, y: 12, duration: 0.7, ease: 'power2.out', delay: 1.3 })

    // Snappy, reliable pacing: MIN ensures the quote and counter entrance read
    // with deliberate luxury (~1.4s), but never strands the user.
    // MAX is a strict failsafe (3.5s) so no network hang or background tab delay can trap the site.
    const MIN = 1400
    const PACE_DUR = 1200
    const MAX = 3500
    const start = performance.now()
    let cancelled = false
    let raf = 0

    // Hold the loader until primary hero assets are cached
    const SITE_TARGET = 0.85
    const projectImages: string[] = []
    type LoadTask = { p: Promise<unknown>; w: number; hero: boolean }
    const tasks: LoadTask[] = [
      { p: import('./SonicRing'), w: 6, hero: true },
      // WarpField's chunk statically pulls the shared three/drei graph (~915kB),
      // so this promise represents the bulk of the 3D download.
      { p: import('./WarpField'), w: 1160, hero: true },
      { p: import('./SonicExitRing'), w: 4, hero: true },
      { p: decodeImage(cloudsUrl), w: 1400, hero: true },
      { p: decodeImage(heroHandLeftUrl), w: 795, hero: true },
      { p: decodeImage(heroHandRightUrl), w: 640, hero: true },
      { p: document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]) : Promise.resolve(), w: 120, hero: true },
      { p: whenHeroReady(), w: 200, hero: true },
      { p: import('./ResearchArchive'), w: 12, hero: false },
      { p: import('./ToolkitCortex'), w: 70, hero: false },
      { p: import('./ContactConstellation'), w: 10, hero: false },
      { p: import('./pdfPages'), w: 320, hero: false },
      ...projectImages.map((src) => ({ p: decodeImage(src), w: 200, hero: false })),
    ]
    const totalW = tasks.reduce((sum, t) => sum + t.w, 0)
    let doneW = 0
    let heroPending = tasks.reduce((n, t) => n + (t.hero ? 1 : 0), 0)
    tasks.forEach((t) => {
      const settle = () => { doneW += t.w; if (t.hero) heroPending -= 1 }
      Promise.resolve(t.p).then(settle, settle)
    })

    const reveal = () => {
      if (cancelled) return
      const finish = () => { if (!cancelled) setVisible(false) }
      const slats = slatRefs.current.filter(Boolean) as HTMLDivElement[]

      // Four-phase master timeline. Everything is placed on labels so the phases
      // read top-to-bottom and stay easy to retune.
      const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: finish })

      // Phase 1 — LOCK-IN: the count settles at 100 with a subtle swell, LOADING
      // flips to READY on a widening letter-spacing, and the acid seam ignites
      // across the base as a full-width hairline.
      tl.addLabel('lock', 0)
        .call(() => { if (statusRef.current) statusRef.current.textContent = 'READY' }, undefined, 'lock')
        .fromTo('.loader-counter', { scale: 1 }, { scale: 1.035, duration: 0.5, ease: 'power2.out' }, 'lock')
        .fromTo('.loader-status', { letterSpacing: '0.24em', opacity: 0.55 }, { letterSpacing: '0.52em', opacity: 1, duration: 0.5 }, 'lock')
        .fromTo(seamRef.current, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power2.out' }, 'lock+=0.05')

      // Phase 2 — CHARGE: the HUD, counter and progress line lift out and fade,
      // the acid line completes and the seam thickens/brightens — priming the
      // parting.
      tl.addLabel('charge', 'lock+=0.55')
        .to(['.loader-counter', '.loader-hud'], { yPercent: -18, opacity: 0, duration: 0.55, ease: 'power2.in' }, 'charge')
        .to('.loader-quote-inner', { yPercent: -24, opacity: 0, duration: 0.6, ease: 'power2.in' }, 'charge')
        .to('.loader-line span', { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 'charge')
        .to('.loader-line', { opacity: 0, duration: 0.3, ease: 'power1.in' }, 'charge+=0.35')
        .to(seamRef.current, { scaleY: 2.4, filter: 'brightness(1.9)', duration: 0.45, ease: 'power2.out' }, 'charge')
        .to('.loader-sky-fade', { opacity: 0, duration: 0.7, ease: 'power2.in' }, 'charge+=0.15')

      // Phase 3 — CURTAIN: the clouds sky is wrenched apart like blast doors —
      // bands parting from the CENTRE outward, alternate slabs driving off
      // opposite sides while the whole sky pushes toward the lens and a hot acid
      // burst blooms from the middle. triggerReveal() fires here so the hero text
      // intro (see useRevealed) plays in lock-step. The hero is already mounted +
      // GPU-warm underneath, so this is a pure, hitch-free visual hand-off.
      tl.addLabel('curtain', 'charge+=0.5')
        .call(() => triggerReveal(), undefined, 'curtain')
        // The seam-light scans down the parting line.
        .to(seamRef.current, { top: '100%', duration: 1.0, ease: 'power2.inOut' }, 'curtain')
        // A hot acid burst blooms from the hero's centre the instant the curtain
        // breaks, then decays — the parting is a release of energy, not a fade.
        .fromTo('.loader-flash', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.22, ease: 'power2.out' }, 'curtain')
        .to('.loader-flash', { opacity: 0, duration: 0.85, ease: 'power2.in' }, 'curtain+=0.22')
        // Each slat's trailing edge ignites, so a bright split races OUTWARD from
        // the centre as the bands break apart.
        .to('.loader-slat-edge', { opacity: 1, duration: 0.25, ease: 'power2.out', stagger: { each: 0.07, from: 'center' } }, 'curtain')
        // The whole sky pushes toward the viewer as it splits — depth, not a
        // flat wipe.
        .fromTo('.loader-curtain', { scale: 1 }, { scale: 1.06, duration: 1.1, ease: 'power2.in' }, 'curtain')
        // Blast doors: bands part from the centre outward, alternate slabs off
        // opposite sides. Fully opaque, so it reads as a solid curtain torn
        // apart rather than a dissolve.
        .to(slats, {
          xPercent: (i: number) => (i % 2 === 0 ? 122 : -122),
          scale: 1.08,
          duration: 1.05,
          ease: 'power4.inOut',
          stagger: { each: 0.07, from: 'center' },
        }, 'curtain')
        .to(seamRef.current, { opacity: 0, duration: 0.35, ease: 'power1.in' }, 'curtain+=0.8')

      // Phase 4 — SETTLE: fade whatever shell remains and unmount.
      tl.to(rootRef.current, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, '>-0.15')
    }

    let shown = 0 // eased 0..1 displayed value; never runs backward
    const tick = (now: number) => {
      if (cancelled) return
      const elapsed = now - start
      const siteProgress = totalW > 0 ? doneW / totalW : 1
      // Rescale so the counter reads 100% once SITE_TARGET is reached
      const dataTarget = Math.min(1, siteProgress / SITE_TARGET)
      const paceCeil = Math.min(1, elapsed / PACE_DUR)
      const target = Math.min(dataTarget, paceCeil)
      shown += (target - shown) * 0.1
      // Ready once hero has settled and MIN elapsed, or at 2.4s, or strict failsafe MAX
      const ready = (heroPending <= 0 && siteProgress >= SITE_TARGET && elapsed >= MIN) || elapsed >= 2400 || elapsed >= MAX
      if (ready) shown += (1 - shown) * 0.22 // smoothly complete to 100%
      else shown = Math.min(shown, 0.99)
      if (shown > 0.99) shown = 1
      const pct = Math.round(shown * 100)
      if (numRef.current) numRef.current.textContent = String(pct).padStart(2, '0')
      if (lineRef.current) lineRef.current.style.transform = `scaleX(${shown})`
      if (shown >= 1) { reveal(); return }
      raf = requestAnimationFrame(tick)
    }

    if (numRef.current) numRef.current.textContent = '00'
    if (lineRef.current) lineRef.current.style.transform = 'scaleX(0)'
    raf = requestAnimationFrame(tick)

    return () => { cancelled = true; cancelAnimationFrame(raf) }
  }, [])

  if (!visible) return null

  return (
    <div ref={rootRef} className="loader">
      <div className="loader-curtain" aria-hidden="true">
        {Array.from({ length: LOADER_SLATS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { slatRefs.current[i] = el }}
            className="loader-slat"
            style={{ top: `${(i * 100) / LOADER_SLATS}%`, height: `calc(${100 / LOADER_SLATS}% + 1px)` }}
          >
            <img
              className="loader-slat-img"
              src={cloudsUrl}
              alt=""
              draggable={false}
              style={{ height: '100vh', top: `${-(i * 100) / LOADER_SLATS}vh` }}
            />
            <i className="loader-slat-edge" style={i % 2 === 0 ? { left: 0 } : { right: 0 }} />
          </div>
        ))}
      </div>
      <div className="loader-sky-fade" aria-hidden="true" />
      <div className="loader-seam" ref={seamRef} aria-hidden="true" />
      <div className="loader-flash" aria-hidden="true" />
      <figure className="loader-quote">
        <div className="loader-quote-inner">
          <p className="loader-quote-text">{quote.text}</p>
          <figcaption className="loader-quote-author">&mdash; {quote.author}</figcaption>
        </div>
      </figure>
      <div className="loader-hud">
        <div className="loader-mark"><Asterisk size={16} /> RK / 26</div>
        <div className="loader-status" ref={statusRef}>LOADING</div>
      </div>
      <div className="loader-counter"><span ref={numRef}>00</span><i>%</i></div>
      <div className="loader-line"><span ref={lineRef} /></div>
    </div>
  )
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px 250px 0px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function MagneticLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x, y }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.a>
  )
}

function PointerGlow() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const smoothX = useSpring(x, { stiffness: 80, damping: 24, mass: 0.7 })
  const smoothY = useSpring(y, { stiffness: 80, damping: 24, mass: 0.7 })

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return <motion.div className="pointer-glow" style={{ x: smoothX, y: smoothY }} aria-hidden="true" />
}

function ScrollCoordinates() {
  const { scrollYProgress } = useScroll()
  // Write the percentage straight to the DOM node from the scroll MotionValue
  // instead of through React state. setState on every scroll change forced a full
  // reconciliation pass per frame while scrolling — piled onto the heavy WebGL
  // sections that added up to the main-thread stalls behind the scroll jumps.
  const valueRef = useRef<HTMLSpanElement>(null)
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const node = valueRef.current
    if (node) node.textContent = `Y / ${String(Math.round(value * 100)).padStart(3, '0')}`
  })

  return (
    <div className="scroll-coordinates" aria-hidden="true">
      <span ref={valueRef}>Y / 000</span>
      <i />
      <span>SYS.ONLINE</span>
    </div>
  )
}

function TextScramble({ children }: { children: string }) {
  const [text, setText] = useState(children)
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*'
  const frame = useRef(0)

  const scramble = () => {
    cancelAnimationFrame(frame.current)
    let iteration = 0
    const render = () => {
      setText(
        children
          .split('')
          .map((letter, index) => {
            if (letter === ' ') return ' '
            if (index < iteration) return children[index]
            return glyphs[Math.floor(Math.random() * glyphs.length)]
          })
          .join(''),
      )
      iteration += 0.45
      if (iteration <= children.length) frame.current = requestAnimationFrame(render)
    }
    frame.current = requestAnimationFrame(render)
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return <span onMouseEnter={scramble}>{text}</span>
}

function LiveClock() {
  const [time, setTime] = useState('00:00:00')

  useEffect(() => {
    const update = () => {
      setTime(new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/New_York',
      }).format(new Date()))
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return <span>{time} EST</span>
}

function SoundControl() {
  const [playing, setPlaying] = useState(false)

  return (
    <button className="sound-control" onClick={() => setPlaying((current) => !current)} aria-label={`${playing ? 'Disable' : 'Enable'} ambient sound visualization`}>
      <span className={playing ? 'sound-bars is-playing' : 'sound-bars'} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
      </span>
      <span>SOUND {playing ? 'ON' : 'OFF'}</span>
    </button>
  )
}

function BrainLayer({ url, depth, count, progress, reducedMotion }: {
  url: string
  depth: number
  count: number
  progress: MotionValue<number>
  reducedMotion: boolean
}) {
  // rel: -1 for the deepest plate, +1 for the frontmost shell, 0 at the core
  const mid = (count - 1) / 2
  const rel = mid > 0 ? (depth - mid) / mid : 0
  const isShell = depth === count - 1

  // Dissect ramps up early, holds fully separated across the middle, then rejoins
  const explode = useTransform(progress, [0, 0.32, 0.68, 1], [0, 1, 1, 0])

  const y = useTransform(explode, [0, 1], ['0%', `${rel * -48}%`])
  const x = useTransform(explode, [0, 1], ['0%', `${rel * 10}%`])
  const scale = useTransform(explode, [0, 1], [1, 1 + rel * 0.07])
  const rotate = useTransform(explode, [0, 1], [0, rel * -5])
  const opacity = useTransform(explode, [0, 1], [isShell ? 1 : 0.68, 1])
  const blurPx = useTransform(explode, [0, 1], [isShell ? 0 : 1.6, 0])
  const filter = useTransform(blurPx, (value) => `blur(${value}px)`)

  if (reducedMotion) {
    return <img className="brain-layer" src={url} alt="" aria-hidden="true" style={{ zIndex: depth }} draggable={false} />
  }

  return (
    <motion.img
      className="brain-layer"
      src={url}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ x, y, scale, rotate, opacity, filter, zIndex: depth }}
    />
  )
}

const drawContainer: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
}
const drawStroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
}
const drawFill: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

function ResearchFigure({ figure, reducedMotion }: { figure: string; reducedMotion: boolean }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' })
  const initial = reducedMotion ? 'shown' : 'hidden'
  const animate = reducedMotion || inView ? 'shown' : 'hidden'

  return (
    <motion.svg
      ref={ref}
      className="leaf-figure"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      variants={drawContainer}
      initial={initial}
      animate={animate}
    >
      {figure === 'field' ? (
        <>
          <motion.rect variants={drawStroke} x={14} y={18} width={66} height={66} rx={7} />
          <motion.rect variants={drawStroke} x={30} y={32} width={66} height={66} rx={7} />
          <motion.rect variants={drawStroke} x={44} y={46} width={62} height={62} rx={7} opacity={0.5} />
          <motion.circle variants={drawFill} cx={14} cy={18} r={3.4} fill="currentColor" stroke="none" />
        </>
      ) : figure === 'type' ? (
        <>
          <motion.line variants={drawStroke} x1={16} y1={30} x2={96} y2={30} />
          <motion.line variants={drawStroke} x1={16} y1={48} x2={70} y2={48} />
          <motion.line variants={drawStroke} x1={16} y1={66} x2={104} y2={66} />
          <motion.line variants={drawStroke} x1={16} y1={84} x2={58} y2={84} />
          <motion.path variants={drawStroke} d="M12 60 C 34 26, 52 96, 74 60 S 104 34, 110 58" opacity={0.55} />
        </>
      ) : figure === 'mesh' ? (
        <>
          <motion.path variants={drawStroke} d="M14 92 L104 92 L88 32 L34 32 Z" />
          <motion.line variants={drawStroke} x1={34} y1={32} x2={62} y2={92} />
          <motion.line variants={drawStroke} x1={88} y1={32} x2={62} y2={92} />
          <motion.line variants={drawStroke} x1={61} y1={32} x2={38} y2={92} opacity={0.6} />
          <motion.line variants={drawStroke} x1={75} y1={32} x2={86} y2={92} opacity={0.6} />
          <motion.line variants={drawStroke} x1={48} y1={62} x2={96} y2={62} opacity={0.4} />
        </>
      ) : figure === 'archive' ? (
        <>
          <g transform="rotate(-13 52 58)"><motion.rect variants={drawStroke} x={26} y={28} width={44} height={58} rx={3} /></g>
          <g transform="rotate(9 70 64)"><motion.rect variants={drawStroke} x={48} y={34} width={44} height={58} rx={3} opacity={0.78} /></g>
          <g transform="rotate(-4 58 74)"><motion.rect variants={drawStroke} x={38} y={48} width={44} height={58} rx={3} opacity={0.55} /></g>
        </>
      ) : (
        <>
          <motion.line variants={drawStroke} x1={44} y1={64} x2={16} y2={30} />
          <motion.line variants={drawStroke} x1={44} y1={64} x2={22} y2={92} />
          <motion.line variants={drawStroke} x1={44} y1={64} x2={70} y2={100} />
          <motion.line variants={drawStroke} x1={44} y1={64} x2={98} y2={40} opacity={0.55} />
          <motion.line variants={drawStroke} x1={44} y1={64} x2={104} y2={78} opacity={0.55} />
          <motion.circle variants={drawFill} cx={44} cy={64} r={4} fill="currentColor" stroke="none" />
          <motion.circle variants={drawStroke} cx={98} cy={40} r={6} opacity={0.7} />
          <motion.circle variants={drawFill} cx={70} cy={100} r={2.6} fill="currentColor" stroke="none" opacity={0.7} />
        </>
      )}
    </motion.svg>
  )
}

function ResearchLeaf({ paper, index, reducedMotion, onActive }: {
  paper: (typeof researchPapers)[number]
  index: number
  reducedMotion: boolean
  onActive: (index: number) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4, restDelta: 0.0004 })

  const opacity = useTransform(smooth, [0, 0.18, 0.36, 0.64, 0.82, 1], [0.12, 0.5, 1, 1, 0.5, 0.12])
  const y = useTransform(smooth, [0, 0.36, 0.64, 1], [96, 0, 0, -96])
  const rotateX = useTransform(smooth, [0, 0.36, 0.64, 1], [11, 0, 0, -11])
  const scale = useTransform(smooth, [0, 0.36, 0.64, 1], [0.92, 1, 1, 0.92])
  const blur = useTransform(smooth, [0, 0.3, 0.7, 1], [5, 0, 0, 5])
  const filter = useTransform(blur, (value) => `blur(${value}px)`)

  const leafStyle = (reducedMotion
    ? { '--leaf-accent': paper.accent }
    : { '--leaf-accent': paper.accent, opacity, y, rotateX, scale, filter }) as unknown as CSSProperties

  return (
    <motion.article ref={ref} id={`research-entry-${index}`} className="research-leaf" style={leafStyle}>
      <div className="leaf-page leaf-page-left">
        <header className="leaf-folio">
          <span>{paper.id}</span>
          <span>{paper.status}</span>
        </header>
        <ResearchFigure figure={paper.figure} reducedMotion={reducedMotion} />
        <h3 className="leaf-title">{paper.title}</h3>
        <p className="leaf-subtitle">{paper.subtitle}</p>
        <footer className="leaf-field">
          <span>{paper.field}</span>
          <span>{paper.year}</span>
        </footer>
      </div>
      <div className="leaf-page leaf-page-right">
        <span className="leaf-pageno">P. {String(index + 1).padStart(2, '0')}</span>
        <div className="leaf-abstract">
          <span className="leaf-label">Summary</span>
          <p><span className="leaf-dropcap">{paper.abstract.charAt(0)}</span>{paper.abstract.slice(1)}</p>
        </div>
        <blockquote className="leaf-quote">{paper.quote}</blockquote>
        <div className="leaf-note">
          <span className="leaf-label">Note</span>
          <p>{paper.note}</p>
        </div>
        <ul className="leaf-keywords">
          {paper.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
        </ul>
      </div>
    </motion.article>
  )
}

function ReducedResearch() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activePaper = researchPapers[activeIndex]
  return (
    <div className="reading-room">
      <aside className="reading-ledger">
        <div className="ledger-card" style={{ '--paper-accent': activePaper.accent } as CSSProperties}>
          <div className="ledger-head">
            <span className="ledger-tag">NOW READING</span>
            <div className="ledger-folio">
              <strong>{String(activeIndex + 1).padStart(2, '0')}</strong>
              <span>/ {String(researchPapers.length).padStart(2, '0')}</span>
            </div>
          </div>
          <nav className="ledger-index" aria-label="Research papers">
            {researchPapers.map((paper, index) => (
              <a
                key={paper.id}
                href={`#research-entry-${index}`}
                className={`ledger-row${activeIndex === index ? ' is-active' : ''}`}
                aria-current={activeIndex === index ? 'true' : undefined}
                style={{ '--row-accent': paper.accent } as CSSProperties}
              >
                <span className="ledger-vol">{String(index + 1).padStart(2, '0')}</span>
                <span className="ledger-titles">
                  <strong>{paper.title}</strong>
                  <small>{paper.field}</small>
                </span>
                <span className="ledger-year">{paper.year}</span>
              </a>
            ))}
          </nav>
          <div className="ledger-foot">
            <span>NOTEBOOK / OPEN</span>
            <span>{researchPapers.length} NOTES</span>
          </div>
        </div>
      </aside>
      <div className="reading-stream">
        {researchPapers.map((paper, index) => (
          <ResearchLeaf key={paper.id} paper={paper} index={index} reducedMotion onActive={setActiveIndex} />
        ))}
        <div className="stream-endnote">
          <span>END OF CURRENT NOTES</span>
          <p>New notes go up as the projects grow. Questions and corrections are always welcome.</p>
        </div>
      </div>
    </div>
  )
}

function PlaygroundSection() {
  // The reading room is scroll-driven (not autoplaying), so it's safe to render
  // the WebGL glass scene for everyone. Reduced-motion users get a calmer idle
  // float inside the scene rather than a separate flat fallback.
  return <ArchiveResearch />
}

const ARCHIVE_ACCENTS = ['#e7b65c', '#ff64bc', '#6df7ff', '#ffad42', '#b8a0ff']

// Fraction of the pinned track spent reading; the rest drives the horizontal exit.
const READING_SPAN = 0.8

function ArchiveResearch() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)
  const [pdf, setPdf] = useState<RenderedPdf | null>(null)
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  // In PDF mode the corridor is the uploaded pages; otherwise it's the samples.
  const isPdf = !!pdf && pdf.pages.length > 0
  const slideCount = isPdf ? pdf!.pages.length : researchPapers.length
  const lastIndex = Math.max(0, slideCount - 1)
  const activePaper = researchPapers[Math.min(activeIndex, researchPapers.length - 1)]
  const accentAt = (index: number) =>
    isPdf ? ARCHIVE_ACCENTS[index % ARCHIVE_ACCENTS.length] : researchPapers[index].accent

  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start start', 'end end'] })
  // Creative showcase: the reading-room stage scale / blur / plunge play for
  // everyone regardless of the OS reduced-motion setting.
  const prefersReduced = false
  const accent = useMotionValue(researchPapers[0].accent)

  // Viewport gate: mount the WebGL reading room once it comes near (and keep it
  // mounted so scrolling back up never re-compiles it — that stall was the
  // scroll-jump culprit), while `sceneVisible` drives the render loop so it idles
  // when off-screen. `lowPower` trims DPR/MSAA/env size on constrained devices.
  const [sceneRef, sceneMounted, sceneVisible] = useLatchedScene<HTMLElement>()
  const lowPower = useLowPower()

  // The pinned track runs in two phases:
  // Phase 1 (0.00 -> 0.72): Reading room exploration. Focus advances across the glass monoliths.
  // Phase 2 (0.72 -> 1.00): The Optical Plunge. The 3D camera dives into the final refractive slab,
  // chromatic aberration & distortion surge, text UI fades & blurs away, and a razor-thin golden
  // laser horizon ignites across the bottom, seamlessly meeting Section 04 as the stage unpins.
  const READING_SPAN = 0.72
  const reading = useTransform(scrollYProgress, [0, READING_SPAN], [0, 1], { clamp: true })
  const exitRaw = useTransform(scrollYProgress, [READING_SPAN, 1], [0, 1], { clamp: true })
  // Monotonic exponential smoothing (NOT a spring). A spring on a scroll-linked
  // value overshoots and corrects backward whenever the finger/wheel stops
  // mid-plunge, so the camera dive + horizon beam visibly bounced past their
  // target and settled back — the transition into 04 read as a jolt. `useSmoothed`
  // eases toward the scroll target and never crosses it, so stopping anywhere in
  // the plunge holds a clean frame and the hand-off to Principles is seamless.
  const exitSmoothed = useSmoothed(exitRaw, 90)
  const exit = prefersReduced ? exitRaw : exitSmoothed
  // Monotonic smoothing (NOT a spring) for the archive meter, for the same
  // reason as the exit value above: a spring on this scroll-linked value
  // overshoots and snaps back when the swipe reverses direction.
  const meterScale = useSmoothed(reading, 90)

  // DOM elements gracefully dissolve and part ways during exit (0.0 -> 0.35)
  const domOpacity = useTransform(exit, [0, 0.32], [1, 0], { clamp: true })
  const headY = useTransform(exit, [0, 0.36], [0, -32], { clamp: true })
  const ledgerX = useTransform(exit, [0, 0.36], [0, 48], { clamp: true })
  const readerY = useTransform(exit, [0, 0.36], [0, 32], { clamp: true })
  const stageScale = useTransform(exit, [0.3, 1], [1, 0.94], { clamp: true })
  const stageBlur = useTransform(exit, [0.35, 1], [0, 8], { clamp: true })
  const stageFilter = useTransform(stageBlur, (v) => prefersReduced ? 'none' : `blur(${v}px)`)

  // Luminous laser horizon beam across the bottom edge of the stage
  const horizonOpacity = useTransform(exit, [0.35, 0.85], [0, 1], { clamp: true })
  const horizonScaleX = useTransform(exit, [0.3, 0.9], [0.15, 1], { clamp: true })
  const horizonGlow = useTransform(exit, [0.35, 0.9], [0, 1], { clamp: true })

  useMotionValueEvent(reading, 'change', (value) => {
    const next = Math.round(clamp01(value) * lastIndex)
    if (next !== activeRef.current) {
      activeRef.current = next
      accent.set(accentAt(next))
      setActiveIndex(next)
    }
  })

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = '' // allow re-selecting the same file
    if (!file) return
    setPdfStatus('loading')
    try {
      const { renderPdfToCanvases } = await import('./pdfPages')
      const rendered = await renderPdfToCanvases(file)
      if (!rendered.pages.length) throw new Error('No pages rendered')
      setPdf(rendered)
      setPdfStatus('idle')
      setActiveIndex(0)
      activeRef.current = 0
      accent.set(ARCHIVE_ACCENTS[0])
    } catch (err) {
      console.error('Failed to render PDF', err)
      setPdfStatus('error')
    }
  }

  function resetToSamples() {
    setPdf(null)
    setPdfStatus('idle')
    setActiveIndex(0)
    activeRef.current = 0
    accent.set(researchPapers[0].accent)
  }

  return (
    <section className="playground" id="research" ref={sceneRef}>
      {/* Tall scroll track; the stage inside pins while papers turn in the light */}
      <div className="archive-scroll" ref={scrollRef}>
        {Array.from({ length: slideCount }).map((_, index) => (
          <span
            key={index}
            id={`research-entry-${index}`}
            className="archive-marker"
            aria-hidden="true"
            style={{ top: `${lastIndex ? (index / lastIndex) * 80 * READING_SPAN : 0}%` }}
          />
        ))}

        <div className="archive-stage">
          <motion.div
            className="archive-room"
            style={{
              scale: prefersReduced ? 1 : stageScale,
              filter: stageFilter,
            }}
          >
            <div className="research-atmosphere" aria-hidden="true">
              <i /><i />
              <motion.span className="research-lamp" style={{ backgroundColor: accent }} />
            </div>

            {sceneMounted && (
              <SceneBoundary
                label="ResearchArchive"
                fallback={<div className="archive-canvas scene-poster scene-poster--research" aria-hidden="true" />}
              >
                <Suspense fallback={null}>
                  <ResearchArchive progress={reading} exit={exit} papers={researchPapers} accent={accent} pdf={pdf} active={sceneVisible} lowPower={lowPower} />
                </Suspense>
              </SceneBoundary>
            )}

            <motion.div
              className="archive-head"
              style={{ opacity: domOpacity, y: headY }}
            >
              <div className="section-tag"><span>03</span> / WRITTEN INQUIRY</div>
              <h2>THE READING <i>ROOM.</i></h2>
            </motion.div>

            <motion.div
              className="archive-upload"
              style={{ opacity: domOpacity, y: headY }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleUpload}
                hidden
              />
              <button
                type="button"
                className="archive-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={pdfStatus === 'loading'}
              >
                <Plus size={14} />
                {pdfStatus === 'loading' ? 'RENDERING…' : isPdf ? 'REPLACE PDF' : 'UPLOAD A PDF'}
              </button>
              {isPdf && (
                <button type="button" className="archive-upload-reset" onClick={resetToSamples}>
                  RESET
                </button>
              )}
              {isPdf && <span className="archive-upload-name" title={pdf!.name}>{pdf!.name}.pdf</span>}
              {pdfStatus === 'error' && <span className="archive-upload-error">Couldn't read that PDF.</span>}
            </motion.div>

            <motion.nav
              className="archive-ledger"
              aria-label={isPdf ? 'PDF pages' : 'Research papers'}
              style={{ opacity: domOpacity, x: ledgerX }}
            >
              <span className="archive-ledger-tag">{isPdf ? 'UPLOADED PAGES' : 'SELECTED NOTES'}</span>
              {Array.from({ length: slideCount }).map((_, index) => (
                <a
                  key={index}
                  href={`#research-entry-${index}`}
                  className={`archive-ledger-row${activeIndex === index ? ' is-active' : ''}`}
                  aria-current={activeIndex === index ? 'true' : undefined}
                  style={{ '--row-accent': accentAt(index) } as CSSProperties}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{isPdf ? `Page ${index + 1}` : researchPapers[index].title}</strong>
                </a>
              ))}
            </motion.nav>

            <div className="archive-meter" aria-hidden="true"><motion.i style={{ scaleX: meterScale }} /></div>

            <motion.div
              className="archive-reader"
              style={{ ['--paper-accent' as any]: accentAt(activeIndex), opacity: domOpacity, y: readerY }}
            >
              <AnimatePresence mode="wait">
                {isPdf ? (
                  <motion.div
                    key={`pdf-${activeIndex}`}
                    className="archive-reader-inner"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="archive-reader-meta">
                      <span>UPLOAD</span>
                      <span>PDF</span>
                      <span>PAGE {activeIndex + 1} / {slideCount}</span>
                    </div>
                    <h3 className="archive-reader-title">{pdf!.name}</h3>
                    <p className="archive-reader-sub">Your document, cast onto glass. Scroll to move through the pages.</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activePaper.id}
                    className="archive-reader-inner"
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="archive-reader-meta">
                      <span>{activePaper.id}</span>
                      <span>{activePaper.field}</span>
                      <span>{activePaper.status} / {activePaper.year}</span>
                    </div>
                    <h3 className="archive-reader-title">{activePaper.title}</h3>
                    <p className="archive-reader-sub">{activePaper.subtitle}</p>
                    <div className="archive-reader-body">
                      <p><span className="archive-dropcap">{activePaper.abstract.charAt(0)}</span>{activePaper.abstract.slice(1)}</p>
                    </div>
                    <ul className="archive-reader-keywords">
                      {activePaper.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="archive-reader-nav">
                <a href={`#research-entry-${Math.max(0, activeIndex - 1)}`} aria-label="Previous" className={activeIndex === 0 ? 'is-disabled' : ''}><ChevronLeft size={16} /></a>
                <span>{String(activeIndex + 1).padStart(2, '0')} / {String(slideCount).padStart(2, '0')}</span>
                <a href={`#research-entry-${Math.min(lastIndex, activeIndex + 1)}`} aria-label="Next" className={activeIndex === lastIndex ? 'is-disabled' : ''}><ChevronRight size={16} /></a>
              </div>
            </motion.div>

            <motion.div className="archive-scrollcue" aria-hidden="true" style={{ opacity: domOpacity }}>
              <span>SCROLL TO TURN THE PAGES</span>
            </motion.div>
          </motion.div>

          {/* Golden laser horizon line bridging Section 03 and Section 04 */}
          <motion.div
            className="archive-horizon-beam"
            style={{
              opacity: horizonOpacity,
              scaleX: horizonScaleX,
            }}
            aria-hidden="true"
          >
            <span className="horizon-line" />
            <motion.span className="horizon-flare" style={{ opacity: horizonGlow }} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section className="principles-section" id="principles">
      <div className="principles-horizon-rim" aria-hidden="true">
        <span className="horizon-line" />
        <span className="horizon-flare" />
      </div>
      <div className="principles-sticky">
        <div className="section-tag"><span>04</span> / PRINCIPLES</div>
        <h2>THE RULES<br />BEHIND THE<br /><i>WORK.</i></h2>
        <p>Not trends. Not a style guide. Four durable ideas that shape every technical and creative decision.</p>
      </div>
      <div className="principles-cards">
        {principles.map((principle, index) => (
          <motion.article
            className={`principle-card accent-${principle.accent}`}
            key={principle.number}
            initial={{ rotate: index % 2 === 0 ? -2 : 2, y: 70 }}
            whileInView={{ rotate: 0, y: 0 }}
            viewport={{ once: true, margin: '0px 0px 250px 0px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="principle-top"><span>{principle.number} / 04</span><Asterisk /></div>
            <h3>{principle.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
            <p>{principle.body}</p>
            <div className="principle-diagram">
              <i /><i /><i />
              <motion.b animate={{ rotate: 360 }} transition={{ duration: 12 + index * 3, repeat: Infinity, ease: 'linear' }} />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function TechnologySection() {
  // A single ambient orbit of every tool logo around the glass "mind". Nothing
  // is scroll-driven and there are no lobe "phases" and no tool tags — just one
  // continuous constellation that flows into the contact section.
  const accent = useMotionValue(TOOLKIT_CLUSTERS[0].accent) // static amber core

  // Viewport gate: mount the orbiting-logos cortex once it comes near and keep
  // it mounted (idle when off-screen via `sceneVisible` → frameloop) so scrolling
  // back up doesn't re-compile it and stall the main thread.
  const [sceneRef, sceneMounted, sceneVisible] = useLatchedScene<HTMLElement>()

  // On touch/coarse pointers there's no real hover cursor, and scroll-driven
  // pointer values would otherwise knock the orbiting logos away from the glass
  // sphere. We pass this down so the cortex disables its cursor-repulsion there.
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const sync = () => setCoarse(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <section className="technology-section" id="toolkit" ref={sceneRef}>
      <div className="toolkit-stage">
        {sceneMounted && (
          <SceneBoundary
            label="ToolkitCortex"
            fallback={<div className="toolkit-canvas scene-poster scene-poster--toolkit" aria-hidden="true" />}
          >
            <Suspense fallback={null}>
              <ToolkitCortex accent={accent} coarse={coarse} active={sceneVisible} />
            </Suspense>
          </SceneBoundary>
        )}

        <div className="toolkit-head">
          <div className="section-tag"><span>05</span> / TOOLKIT</div>
          <h2>TOOLS, CHOSEN<br /><i>WITH INTENTION.</i></h2>
        </div>
      </div>
    </section>
  )
}

function MeshScreen({ active }: { active: boolean }) {
  // A small mesh of peer nodes; edges pulse as messages hop between devices.
  const nodes = [
    { x: 50, y: 20 },
    { x: 22, y: 44 },
    { x: 78, y: 44 },
    { x: 34, y: 74 },
    { x: 66, y: 74 },
  ]
  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2],
  ]
  return (
    <div className="app-scene app-mesh">
      <div className="app-noise" aria-hidden="true" />
      <div className="app-status"><span>MESHALERT</span><span className="ms-offline"><i /> OFFLINE MESH</span></div>

      <div className="ms-head">
        <span>NO INTERNET · PEER RELAY</span>
        <strong>5 DEVICES LINKED</strong>
      </div>

      <div className="ms-graph" aria-hidden="true">
        <svg viewBox="0 0 100 94" preserveAspectRatio="xMidYMid meet">
          {edges.map(([a, b], i) => (
            <motion.line
              key={`${a}-${b}`}
              x1={nodes[a].x} y1={nodes[a].y}
              x2={nodes[b].x} y2={nodes[b].y}
              className="ms-edge"
              animate={active ? { opacity: [0.15, 0.8, 0.15] } : { opacity: 0.25 }}
              transition={{ duration: 2.2, repeat: active ? Infinity : 0, delay: i * 0.28, ease: 'easeInOut' }}
            />
          ))}
          {nodes.map((n, i) => (
            <motion.circle
              key={i}
              cx={n.x} cy={n.y} r={i === 0 ? 4.6 : 3.4}
              className={i === 0 ? 'ms-node ms-node-self' : 'ms-node'}
              animate={active ? { scale: [1, 1.18, 1] } : { scale: 1 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              transition={{ duration: 2, repeat: active ? Infinity : 0, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </svg>
      </div>

      <div className="ms-readouts">
        <span>HOPS<b>3</b></span>
        <span>PEERS<b>04</b></span>
        <span>QUEUED<b>12</b></span>
      </div>

      <div className="ms-sos">
        <motion.span
          className="ms-sos-ring"
          aria-hidden="true"
          animate={active ? { scale: [1, 1.6], opacity: [0.5, 0] } : { scale: 1, opacity: 0 }}
          transition={{ duration: 1.8, repeat: active ? Infinity : 0, ease: 'easeOut' }}
        />
        <Zap size={15} /> BROADCAST SOS
      </div>
    </div>
  )
}

function CivicScreen({ active }: { active: boolean }) {
  const timeline = [
    ['REPORTED', 'Pothole flagged with photo evidence', '0xa1f… → IPFS'],
    ['VERIFIED', 'Community confirmed on-chain', 'block 6,421,908'],
    ['FUNDED', 'Transparent repair donation', '0.42 ETH'],
  ]
  return (
    <div className="app-scene app-civic">
      <div className="app-noise" aria-hidden="true" />
      <header className="cv-bar">
        <span className="cv-logo">CIVIC<b>LEDGER</b></span>
        <nav><span>ISSUES</span><span>MAP</span><span>AUDIT</span></nav>
        <span className="cv-wallet"><i /> 0x7a3…e12</span>
      </header>

      <div className="cv-body">
        <div className="cv-issue">
          <span className="cv-tag">ISSUE #0247 · APPEND-ONLY</span>
          <h4>BROKEN STREETLIGHT</h4>
          <p>Every status update is written as a new immutable event — evidence on IPFS, history verifiable on Ethereum Sepolia.</p>
          <span className="cv-cid">CID bafybeih…q4k2</span>
        </div>

        <div className="cv-timeline">
          {timeline.map(([state, label, meta], i) => (
            <motion.div
              key={state}
              className="cv-event"
              initial={{ opacity: 0, x: 12 }}
              animate={active ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 0 }}
              transition={{ delay: 0.15 + i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="cv-dot" aria-hidden="true"><Check size={11} /></span>
              <div className="cv-event-body">
                <strong>{state}</strong>
                <span>{label}</span>
                <b>{meta}</b>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="cv-foot"><span>PROOF OVER TRUST</span><span className="cv-verify"><Database size={12} /> VERIFIED ON-CHAIN</span></div>
    </div>
  )
}

function CliScreen({ active }: { active: boolean }) {
  const lines: { prompt?: boolean; text: string; muted?: boolean }[] = [
    { prompt: true, text: 'npx pomo start --deep-work' },
    { text: '◷ 25:00 focus · streak 6 days · 0 deps', muted: true },
    { prompt: true, text: 'jsonpeek package.json .scripts.build' },
    { text: '"tsc -b && vite build"', muted: true },
    { prompt: true, text: 'portkill 3000' },
    { text: '✓ freed :3000 (node 41822)', muted: true },
    { prompt: true, text: 'snipvault add "flex-center"' },
    { text: '✓ saved · fuzzy-searchable · offline', muted: true },
  ]
  return (
    <div className="app-scene app-cli">
      <div className="app-noise" aria-hidden="true" />
      <header className="cli-bar">
        <span className="cli-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="cli-title"><TerminalSquare size={12} /> zero-dep toolkit</span>
        <span className="cli-badge">0 DEPENDENCIES</span>
      </header>

      <div className="cli-body">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            className={`cli-line${l.muted ? ' cli-out' : ''}`}
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0.5 }}
            transition={{ delay: 0.1 + i * 0.16, duration: 0.35 }}
          >
            {l.prompt && <span className="cli-prompt">rk@vit ~ $</span>}
            <span>{l.text}</span>
          </motion.div>
        ))}
        <motion.span
          className="cli-caret"
          aria-hidden="true"
          animate={active ? { opacity: [1, 1, 0, 0, 1] } : { opacity: 1 }}
          transition={{ duration: 1, repeat: active ? Infinity : 0, ease: 'linear' }}
        />
      </div>

      <div className="cli-foot"><span>INSTALL &amp; AUDIT IN SECONDS</span><span className="cli-count">10+ TOOLS ON NPM</span></div>
    </div>
  )
}

function ProjectScreen({ project, active }: { project: typeof projects[number]; active: boolean }) {
  return (
    <div className="app-screen" data-theme={project.theme}>
      {project.theme === 'mesh' && <MeshScreen active={active} />}
      {project.theme === 'civic' && <CivicScreen active={active} />}
      {project.theme === 'cli' && <CliScreen active={active} />}
    </div>
  )
}

function PhoneDevice({ project, active }: { project: typeof projects[number]; active: boolean }) {
  return (
    <div className="phone-device">
      <div className="phone-body-depth" aria-hidden="true">
        <i className="phone-depth-left" />
        <i className="phone-depth-right" />
        <i className="phone-depth-top" />
        <i className="phone-depth-bottom" />
      </div>
      <div className="phone-button phone-action" />
      <div className="phone-button phone-volume-up" />
      <div className="phone-button phone-volume-down" />
      <div className="phone-button phone-power" />
      <div className="phone-chassis">
        <div className="phone-antenna antenna-top" />
        <div className="phone-antenna antenna-bottom" />
        <div className="phone-glass">
          <div className="phone-screen"><ProjectScreen project={project} active={active} /></div>
          <div className="phone-island"><div className="phone-speaker" /><div className="phone-camera"><i /></div></div>
          <div className="phone-home-indicator" />
        </div>
      </div>
      <div className="phone-port" aria-hidden="true"><i /><i /><i /><i /><b /></div>
      <div className="phone-floor-shadow" />
    </div>
  )
}

function LaptopDevice({ project, active }: { project: typeof projects[number]; active: boolean }) {
  return (
    <div className="laptop-pro">
      <div className="laptop-pro-display">
        <div className="laptop-pro-shell" />
        <div className="laptop-pro-bezel">
          <div className="laptop-pro-camera"><i /></div>
          <div className="laptop-pro-screen"><ProjectScreen project={project} active={active} /></div>
        </div>
        <div className="laptop-pro-lid-edge lid-edge-left" />
        <div className="laptop-pro-lid-edge lid-edge-right" />
        <div className="laptop-pro-lid-edge lid-edge-top" />
        <div className="laptop-pro-lid-edge lid-edge-bottom" />
      </div>
      <div className="laptop-pro-base" aria-hidden="true">
        <span className="laptop-pro-hinge" />
        <span className="laptop-pro-deck" />
        <span className="laptop-pro-notch" />
      </div>
      <div className="laptop-pro-shadow" />
    </div>
  )
}

function ProjectArt({ project }: { project: typeof projects[number] }) {
  const [hovered, setHovered] = useState(false)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const tiltX = useSpring(pointerY, { stiffness: 80, damping: 24, mass: 0.65 })
  const tiltY = useSpring(pointerX, { stiffness: 80, damping: 24, mass: 0.65 })
  const lift = useSpring(0, { stiffness: 95, damping: 24, mass: 0.7 })
  const isPhone = project.device === 'phone'

  const resetDeviceMotion = () => {
    setHovered(false)
    pointerX.set(0)
    pointerY.set(0)
    lift.set(0)
  }

  return (
    <motion.div
      className={`project-visual device-showcase ${project.theme} device-${project.device}`}
      onHoverStart={() => { setHovered(true); lift.set(-8) }}
      onHoverEnd={resetDeviceMotion}
      onPointerMove={(event) => {
        if (event.pointerType === 'touch') return
        const rect = event.currentTarget.getBoundingClientRect()
        pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * -5)
        pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 6)
      }}
      transition={{ duration: 0.45 }}
    >
      <motion.div
        className="device-motion-stage"
        initial={{ opacity: 0, y: 190, rotateX: isPhone ? 32 : 22, rotateY: isPhone ? -94 : -78, scale: 0.82 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
        viewport={{ once: true, margin: '0px 0px 250px 0px' }}
        transition={{
          opacity: { duration: 0.55, ease: 'easeOut' },
          rotateY: { type: 'spring', stiffness: 58, damping: 15, mass: 1.1 },
          rotateX: { type: 'spring', stiffness: 62, damping: 16, mass: 1 },
          y: { type: 'spring', stiffness: 66, damping: 18, mass: 1.05 },
          scale: { type: 'spring', stiffness: 60, damping: 14, mass: 1 },
        }}
      >
        <motion.div
          className="device-tilt-stage"
          style={{ rotateX: tiltX, rotateY: tiltY, y: lift }}
        >
          {isPhone ? <PhoneDevice project={project} active={hovered} /> : <LaptopDevice project={project} active={hovered} />}
        </motion.div>
      </motion.div>
      <motion.div className="view-project" animate={{ scale: hovered ? 1 : 0, rotate: hovered ? 0 : -45 }}>
        VIEW<br />CASE <ArrowUpRight size={15} />
      </motion.div>
    </motion.div>
  )
}

const lineReveal = {
  hidden: { y: '115%', filter: 'blur(10px)', opacity: 0 },
  visible: { y: '0%', filter: 'blur(0px)', opacity: 1 },
}
const softReveal = {
  hidden: { opacity: 0, y: 22, filter: 'blur(9px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

function Project({ project, position }: { project: typeof projects[number], position: number }) {
  const lines = project.title.split('\n')
  return (
    <article className={`project project-${position + 1}`}>
      <div className="project-art-wrap"><ProjectArt project={project} /></div>
      <motion.div
        className="project-info"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '0px 0px 250px 0px' }}
      >
        <h3>
          {lines.map((line, i) => (
            <span className="line-mask" key={line}>
              <motion.span
                className="line-inner"
                variants={lineReveal}
                transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1], delay: 0.06 + i * 0.1 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h3>
        <motion.p
          className="project-lede"
          variants={softReveal}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
        >
          {project.description}
        </motion.p>
        <motion.a
          className="project-repo"
          href={project.repo}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${project.title.replace('\n', ' ')} on GitHub`}
          variants={softReveal}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
        >
          <Github size={17} strokeWidth={1.6} />
          <span>View source</span>
          <ArrowUpRight size={14} strokeWidth={1.6} />
        </motion.a>
      </motion.div>
    </article>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header>
      <a className="wordmark" href="#top" aria-label="Rishabh Kumar home">R<span>K</span><sup>26</sup></a>
      <div className="availability"><i /> OPEN TO INTERNSHIPS &amp; FREELANCE <span>SEP '26</span></div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
        <span>{open ? 'CLOSE' : 'MENU'}</span><b className={open ? 'is-open' : ''}><i /><i /></b>
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav className="menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
            {['WORK', 'ABOUT', 'RESEARCH', 'CONTACT'].map((item, i) => (
              <motion.a href={`#${item.toLowerCase()}`} key={item} onClick={() => setOpen(false)} initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <small>0{i + 1}</small>{item}<ArrowUpRight />
              </motion.a>
            ))}
            <div className="menu-footer"><span>INDIA</span><LiveClock /><span>RISHABH.KUMAR2024@VITSTUDENT.AC.IN</span></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

// Hero intro entrance. These play in lock-step with the loader curtain parting
// (gated on useRevealed / triggerReveal) rather than on mount — with a longer
// loader, mount-time delays would finish behind the curtain and the hero would
// appear frozen on hand-off. `custom` is the per-element stagger index.
const HERO_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const heroFade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.09, duration: 0.9, ease: HERO_EASE },
  }),
}

const heroMask: Variants = {
  hidden: { y: '115%' },
  show: (i = 0) => ({
    y: 0,
    transition: { delay: 0.22 + i * 0.11, duration: 1, ease: HERO_EASE },
  }),
}

// Same rising mask as the sans lines, plus an acid brightness bloom that settles
// as it lands — the one deliberate glow accent of the reveal. `filter` is safe
// under the line's `overflow:hidden` mask (it adds no geometry to clip).
const heroMaskGlow: Variants = {
  hidden: { y: '115%', filter: 'brightness(2.6)' },
  show: (i = 0) => ({
    y: 0,
    filter: 'brightness(1)',
    transition: {
      delay: 0.22 + i * 0.11,
      duration: 1.05,
      ease: HERO_EASE,
      filter: { delay: 0.22 + i * 0.11 + 0.28, duration: 0.9, ease: 'easeOut' },
    },
  }),
}

// --- Contact ---------------------------------------------------------------

const CONTACT_NODES: { key: string; label: string; handle: string; href: string; cta: string; Icon: LucideIcon }[] = [
  { key: 'github', label: 'GitHub', handle: 'github.com/rishbCLN', href: 'https://github.com/rishbCLN', cta: 'View GitHub', Icon: Github },
  { key: 'linkedin', label: 'LinkedIn', handle: 'LinkedIn', href: 'https://linkedin.com', cta: 'View LinkedIn', Icon: Linkedin },
  { key: 'email', label: 'Email', handle: 'rishabh.kumar2024@vitstudent.ac.in', href: 'mailto:rishabh.kumar2024@vitstudent.ac.in', cta: 'Send an email', Icon: Mail },
]

// The prism stage resolves as one piece: the whole canvas WRAPPER (never the 3D
// scene inside — that stays untouched) fades up out of a soft blur and settles to
// full clarity, like the constellation coming into focus.
const canvasReveal: Variants = {
  rest: { opacity: 0, scale: 0.94, filter: 'blur(12px)' },
  show: { opacity: 1, scale: 1, filter: 'blur(0px)' },
}

const ctaVariants: Variants = {
  // Each CTA resolves a beat after the prisms — a quiet rise out of a light blur
  // into a crisp, tappable control. Driven by the grid's stagger container below,
  // so the three arrive one-after-another as the section settles, then stay.
  rest: { y: 24, opacity: 0, filter: 'blur(10px)' },
  show: { y: 0, opacity: 1, filter: 'blur(0px)' },
}

// Parent container: holds the buttons hidden until the section is in view, then
// releases them in a delayed, staggered cascade (after the prisms have settled).
const gridStagger: Variants = {
  rest: {},
  show: { transition: { delayChildren: 0.7, staggerChildren: 0.16 } },
}

// The headline resolves line-by-line out of an overflow mask — the same rising
// wipe the hero opens with, so the closing title rhymes with the first one. The
// middle line carries the lone acid bloom as it lands (the serif accent word),
// keeping amber a deliberate one-time accent rather than ambient decoration.
const CONTACT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const contactMask: Variants = {
  hidden: { y: '115%' },
  show: (i = 0) => ({ y: 0, transition: { delay: 0.1 + i * 0.12, duration: 1, ease: CONTACT_EASE } }),
}
const contactMaskGlow: Variants = {
  hidden: { y: '115%', filter: 'brightness(2.4)' },
  show: (i = 0) => ({
    y: 0,
    filter: 'brightness(1)',
    transition: {
      delay: 0.1 + i * 0.12,
      duration: 1.05,
      ease: CONTACT_EASE,
      filter: { delay: 0.1 + i * 0.12 + 0.26, duration: 0.85, ease: 'easeOut' },
    },
  }),
}

// The closing rows (copy/availability, footer, utility) share one entrance,
// fired by their own in-view trigger so the cascade is actually seen when the
// foot scrolls up — a quiet, staggered fade-rise that lands the section.
const footReveal: Variants = {
  rest: {},
  show: { transition: { delayChildren: 0.08, staggerChildren: 0.12 } },
}
const footItem: Variants = {
  rest: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: CONTACT_EASE } },
}

function ContactNode({
  node,
  index,
  active,
  reduced,
  onEnter,
  onLeave,
}: {
  node: (typeof CONTACT_NODES)[number]
  index: number
  active: number | null
  reduced: boolean
  onEnter: (i: number) => void
  onLeave: () => void
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  // Pointer position over the card drives a real 3D tilt on the CTA control —
  // damped for a subtle, premium lean rather than a toy wobble.
  const rotX = useTransform(my, [-30, 30], [8, -8])
  const rotY = useTransform(mx, [-30, 30], [-10, 10])
  const external = node.href.startsWith('http')
  const isActive = active === index

  return (
    <motion.a
      ref={ref}
      href={node.href}
      className={`contact-node${isActive ? ' is-active' : ''}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={`${node.label} — ${node.handle}`}
      onMouseEnter={() => onEnter(index)}
      onFocus={() => onEnter(index)}
      onBlur={onLeave}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect || reduced) return
        mx.set((event.clientX - rect.left - rect.width / 2) * 0.11)
        my.set((event.clientY - rect.top - rect.height / 2) * 0.11)
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); onLeave() }}
    >
      <span className="contact-node-glyph" aria-hidden="true"><node.Icon /></span>
      <span className="contact-node-name">{node.label}</span>

      <motion.span
        className="contact-cta"
        variants={ctaVariants}
        transition={
          reduced
            ? { duration: 0.001 }
            : { type: 'spring', stiffness: 240, damping: 26, mass: 0.9, opacity: { duration: 0.55 }, filter: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }
        }
      >
        <motion.span
          className="contact-cta-face"
          style={{ transformPerspective: 620, rotateX: rotX, rotateY: rotY, x: mx, y: my }}
        >
          <node.Icon />
          <b>{node.cta}</b>
        </motion.span>
      </motion.span>

      <span className="contact-node-handle">{node.handle}</span>
    </motion.a>
  )
}

function ContactSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '200px 0px' })
  // Latched mount + live-visibility gate for the WebGL prisms, attached to the
  // stage below. Mount ~1.3 screens early and KEEP mounted (scrolling back up no
  // longer re-compiles the transmission+bloom scene — that stall was the
  // scroll-jump culprit); `sceneVisible` drives frameloop so it idles off-screen.
  const [stageRef, sceneMounted, sceneVisible] = useLatchedScene<HTMLDivElement>()
  const lowPower = useLowPower()
  const footRef = useRef<HTMLDivElement>(null)
  const footInView = useInView(footRef, { once: true, margin: '-12%' })
  // Creative showcase: the contact prisms spin, sparkle and the text masks play
  // for everyone. We intentionally ignore the OS reduced-motion preference here
  // (native scrolling is still respected via Lenis being gated separately).
  const reduced = false
  const [active, setActive] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [compact, setCompact] = useState(false)
  const focus = useMotionValue(-1)

  // Availability badge stays current on its own — derived from the clock, never
  // a hard-coded month that silently goes stale.
  const now = new Date()
  const availMonth = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const availYear = String(now.getFullYear()).slice(-2)

  // The prisms run on EVERY device. There are no flat contact "cards" anymore —
  // no box, border, glyph tile, name or handle text around them. On every screen
  // the presentation is the same: floating CTA pills over the glass prisms. We
  // still track a narrow (<=600px) `compact` flag purely so the scene can stack
  // the prisms vertically and tighten their scale for a phone frame.
  useEffect(() => {
    const widthMq = window.matchMedia('(max-width: 600px)')
    const sync = () => setCompact(widthMq.matches)
    sync()
    widthMq.addEventListener('change', sync)
    return () => widthMq.removeEventListener('change', sync)
  }, [])

  const enter = (i: number) => { setActive(i); focus.set(i) }
  const leave = () => { setActive(null); focus.set(-1) }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('rishabh.kumar2024@vitstudent.ac.in')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable — the mailto node still works */
    }
  }

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact-inner">
        <Reveal>
          <div className="section-tag"><span>06</span> / START A PROJECT</div>
        </Reveal>
        <h2 className="contact-title" aria-label="Have an idea that shouldn't be possible?">
          <span className="contact-line" aria-hidden="true">
            <motion.span variants={contactMask} custom={0} initial={reduced ? false : 'hidden'} animate={reduced ? 'show' : inView ? 'show' : 'hidden'}>HAVE AN IDEA</motion.span>
          </span>
          <span className="contact-line" aria-hidden="true">
            <motion.span variants={contactMaskGlow} custom={1} initial={reduced ? false : 'hidden'} animate={reduced ? 'show' : inView ? 'show' : 'hidden'}>THAT <i>SHOULDN&rsquo;T</i></motion.span>
          </span>
          <span className="contact-line" aria-hidden="true">
            <motion.span variants={contactMask} custom={2} initial={reduced ? false : 'hidden'} animate={reduced ? 'show' : inView ? 'show' : 'hidden'}>BE POSSIBLE?</motion.span>
          </span>
        </h2>

        <motion.p
          className="contact-lede"
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          Pick a channel. Three ways to reach me directly.
        </motion.p>

        <div className="contact-stage" ref={stageRef}>
          <motion.div
            className="contact-canvas-layer"
            aria-hidden="true"
            initial="rest"
            animate={sceneVisible ? 'show' : 'rest'}
            variants={canvasReveal}
            transition={reduced ? { duration: 0.001 } : { duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {sceneMounted && (
              <SceneBoundary
                label="ContactConstellation"
                fallback={<div className="contact-canvas scene-poster scene-poster--contact" aria-hidden="true" />}
              >
                <Suspense fallback={null}>
                  <ContactConstellation focus={focus} reduced={reduced} compact={compact} active={sceneVisible} lowPower={lowPower} />
                </Suspense>
              </SceneBoundary>
            )}
          </motion.div>

          <motion.div
            className={`contact-grid${active != null ? ' is-engaged' : ''}`}
            initial="rest"
            animate={inView ? 'show' : 'rest'}
            variants={gridStagger}
          >
            {CONTACT_NODES.map((node, i) => (
              <ContactNode key={node.key} node={node} index={i} active={active} reduced={reduced} onEnter={enter} onLeave={leave} />
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="contact-foot"
        ref={footRef}
        initial={reduced ? false : 'rest'}
        animate={reduced ? 'show' : footInView ? 'show' : 'rest'}
        variants={footReveal}
      >
        <motion.div className="contact-foot-lead" variants={footItem}>
          <button
            type="button"
            className={`contact-copy${copied ? ' is-copied' : ''}`}
            onClick={copyEmail}
            aria-label={copied ? 'Email address copied to clipboard' : 'Copy email address rishabh.kumar2024@vitstudent.ac.in'}
          >
            <span className="contact-copy-swap" aria-hidden="true">
              <span>rishabh.kumar2024@vitstudent.ac.in</span>
              <span>COPIED TO CLIPBOARD</span>
            </span>
            {copied ? <Check /> : <Copy />}
            <span className="sr-only" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</span>
          </button>
          <span className="contact-avail"><i />AVAILABLE FOR NEW WORK &mdash; {availMonth} &rsquo;{availYear}</span>
        </motion.div>

        <motion.footer variants={footItem}>
          <a href="#top" className="footer-mark">RK<sup>26</sup></a>
          <p>CREATIVE DEVELOPER &middot; CSE @ VIT<br />INDIA / WORKING REMOTELY</p>
          <div className="socials">
            <a href="https://github.com/rishbCLN" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><Github /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><Linkedin /></a>
            <a href="mailto:rishabh.kumar2024@vitstudent.ac.in" aria-label="Email"><Mail /></a>
          </div>
          <a href="#top" className="back-top">BACK TO TOP <ArrowUpRight /></a>
        </motion.footer>

        <motion.div className="contact-utility" variants={footItem}><LiveClock /><span>&copy; 2026 RISHABH KUMAR</span><SoundControl /></motion.div>
      </motion.div>
    </section>
  )
}

function App() {
  const { scrollYProgress } = useScroll()
  // Monotonic smoothing (NOT a spring) for the global top progress bar. A spring
  // overshoots and corrects backward the instant a swipe reverses direction,
  // which read as a small shudder/bounce on mobile; a first-order lag only ever
  // approaches the scroll target, so reversal glides to rest without a snap-back.
  const progress = useSmoothed(scrollYProgress, 110)

  // The hero is pinned; scroll scrubs the hands together, then we zoom through the ring to black.
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroRaw } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })
  // The hands close over 0 -> 0.46 of progress and that timing is dialled in
  // perfectly, so we must NOT change the scroll distance the hands travel. But
  // the dive + warp felt hyper-sensitive because the WHOLE back half was crammed
  // into the leftover ~173svh of scroll. Fix: make the hero much taller (more
  // scroll everywhere) and REMAP raw scroll piecewise so the hands still finish
  // after the exact same scroll distance, handing the huge remainder to the
  // dive + warp. Hand feel is byte-for-byte identical; the warp just breathes.
  //   HERO_VH / HERO_VH_OLD must match .hero height in styles.css.
  const HERO_VH = 1200 // <- keep in sync with .hero (desktop) in styles.css
  const HERO_VH_OLD = 420 // the height the hand timing was tuned against
  const VIEW_VH = 100
  // Scroll distance (in svh) the hands used to travel — the feel we preserve.
  const HAND_SCROLL = 0.46 * (HERO_VH_OLD - VIEW_VH)
  // Raw-scroll fraction at which the hands should finish now.
  const R_TOUCH = HAND_SCROLL / (HERO_VH - VIEW_VH)
  // Piecewise-linear: [0..R_TOUCH] -> [0..0.46] (hands, same scroll distance),
  // then [R_TOUCH..1] -> [0.46..1] (dive + warp, now with room to breathe).
  const heroMapped = useTransform(heroRaw, [0, R_TOUCH, 1], [0, 0.46, 1])
  // Monotonic smoothing (NOT a spring) so the sequence never springs past a
  // scroll-stop and corrects backward. Lenis already adds inertia on top.
  const heroProgress = useSmoothed(heroMapped, 80)

  // Viewport gate for the three hero WebGL canvases (SonicRing / WarpField /
  // SonicExitRing). Like every other heavy section, the hero now LATCHES: the
  // scenes mount once (while the tall pinned hero is near the viewport — which
  // is immediately, since the hero starts at the top) and are never unmounted.
  // Unmounting them on scroll-up used to recompile shaders / rebuild env maps,
  // stalling the main thread so queued wheel/touch momentum applied in one lurch
  // (the mobile "teleport" jump) and flashing the hero black on re-entry
  // (desktop flicker). Instead they stay mounted but idle: `heroVisible` drives
  // each Canvas's `frameloop`, so an off-screen hero renders on demand only
  // (≈ zero GPU) and total live WebGL contexts stay bounded.
  const [heroSceneRef, heroMounted, heroVisible] = useLatchedScene<HTMLElement>()
  // `useScroll` needs `heroRef`; the latch observer needs its own ref. Feed both
  // from one callback ref so the pinned <section> drives scroll scrub AND the
  // near/visible observers off the same node.
  const setHeroRefs = useCallback(
    (node: HTMLElement | null) => {
      heroRef.current = node
      ;(heroSceneRef as React.MutableRefObject<HTMLElement | null>).current = node
    },
    [heroSceneRef],
  )
  // Trim DPR on constrained devices for the three hero WebGL canvases too.
  const heroLowPower = useLowPower()

  // Latches true the instant the loader curtain starts parting; drives the hero
  // text entrance so it choreographs with the hand-off.
  const revealed = useRevealed()
  // Decouple the hero typography from the loader's GSAP timeline. `revealed` is
  // flipped by triggerReveal() inside that timeline, which is driven by
  // requestAnimationFrame — and rAF is paused/throttled in background tabs, so a
  // stalled loader could otherwise strand the headline + CTAs invisible forever.
  // This independent wall-clock timer (setTimeout, NOT rAF) guarantees the hero
  // text reveals on its own even if the timeline never fires. In the normal fast
  // path `revealed` still wins first, so the curtain-synced choreography is
  // preserved; this only takes over when the timeline is throttled or stalled.
  const [heroFailsafe, setHeroFailsafe] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setHeroFailsafe(true), 3200)
    return () => window.clearTimeout(timer)
  }, [])
  const heroShown = revealed || heroFailsafe
  // Ring stops ~0.60, we dive into the hole 0.60->0.80, then warp. The panel
  // (hero text + hands) scales up into the dive and fades out before the warp
  // so only the ring/stars remain for the journey.
  const panelScale = useTransform(heroProgress, [0.5, 0.8], [1, 4.6])
  const panelOpacity = useTransform(heroProgress, [0.6, 0.74], [1, 0])

  // Punch-through to black: as the exit ring engulfs the camera (~0.86 -> 0.92)
  // a solid --ink sheet fades in and holds, so we land on a pure black canvas
  // with nothing flying on it. Because it's the exact manifesto colour, it reads
  // as one continuous surface straight into the 01 / MANIFESTO section.
  const emergeOpacity = useTransform(heroProgress, [0.965, 0.985, 1], [0, 1, 1])

  // Own scroll restoration. Left at the browser default ('auto'), a reload or
  // back-navigation restores the previous offset WHILE the loader plays and Lenis
  // re-initialises and the 1200svh hero re-mounts — the restored position then
  // fights the settling layout and reads as a jump to a random spot. Take manual
  // control and always start at the top so the intro plays cleanly from frame 0.
  useEffect(() => {
    if (typeof window === 'undefined' || !('scrollRestoration' in window.history)) return
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  // Studio-grade eased/inertial scrolling. Everything scroll-driven (hero scrub,
  // progress) rides on top of Lenis, so nothing feels linear.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    })

    // TEMP DEBUG (throwaway): expose the Lenis instance so ScrollDebugOverlay can
    // read isScrolling/velocity/direction/animatedScroll/targetScroll/isTouching.
    // Gated by the same flag as the overlay; removed on cleanup. Remove with the
    // overlay once the touch-inertia glitch is diagnosed.
    if (scrollDebugEnabled()) {
      ;(window as unknown as { __lenisDebug?: unknown }).__lenisDebug = lenis
    }

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a[href^="#"]')
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const target = hash === '#top' ? 0 : document.querySelector(hash)
      if (target === null) return
      event.preventDefault()
      lenis.scrollTo(target as HTMLElement | number, { offset: 0, duration: 1.3 })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onAnchorClick)
      if (scrollDebugEnabled()) {
        delete (window as unknown as { __lenisDebug?: unknown }).__lenisDebug
      }
      lenis.destroy()
    }
  }, [])

  // Failsafe to guarantee all hero and website features reveal even if loader is interrupted
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerReveal()
    }, 3800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Loader />
      <Cursor />
      <PointerGlow />
      <ScrollCoordinates />
      <ScrollDebugOverlay scrollYProgress={scrollYProgress} progress={progress} />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Header />
      <main id="top">
        <section className="hero" ref={setHeroRefs}>
          <div className="hero-stage">
            <motion.div className="hero-panel" style={{ scale: panelScale, opacity: panelOpacity }}>
              <HeroHandsScene progress={heroProgress} />

              <div className="hero-top">
                <motion.p
                  className="hero-intro"
                  variants={heroFade}
                  custom={0}
                  initial="hidden"
                  animate={heroShown ? 'show' : 'hidden'}
                >
                  Creative developer and CSE student in India, designing and
                  engineering expressive, high-performance work for the web.
                </motion.p>
                <motion.div
                  className="hero-corner"
                  aria-hidden="true"
                  variants={heroFade}
                  custom={1}
                  initial="hidden"
                  animate={heroShown ? 'show' : 'hidden'}
                >
                  <span>12.9692° N</span>
                  <span>79.1559° E</span>
                  <LiveClock />
                </motion.div>
              </div>

              <h1 className="hero-title">
                <span className="hero-line">
                  <motion.span variants={heroMask} custom={0} initial="hidden" animate={heroShown ? 'show' : 'hidden'}>Building digital</motion.span>
                </span>
                <span className="hero-line">
                  <motion.span variants={heroMask} custom={1} initial="hidden" animate={heroShown ? 'show' : 'hidden'}>systems</motion.span>
                </span>
                <span className="hero-line hero-line-serif">
                  <motion.span variants={heroMaskGlow} custom={2} initial="hidden" animate={heroShown ? 'show' : 'hidden'}>for the unreal.</motion.span>
                </span>
              </h1>

              <motion.div
                className="hero-foot"
                variants={heroFade}
                custom={3}
                initial="hidden"
                animate={heroShown ? 'show' : 'hidden'}
              >
                <div className="hero-actions">
                  <MagneticLink href="#work" className="hero-cta">
                    <span>See the work</span>
                    <ArrowUpRight />
                  </MagneticLink>
                  <span className="hero-avail"><i /> Available for new work — Sept ’26</span>
                </div>
                <a className="hero-scroll" href="#work" aria-label="Scroll to explore the work">
                  <span>Scroll</span>
                  <motion.i animate={{ scaleY: [0.15, 1, 0.15] }} transition={{ duration: 2.1, repeat: Infinity, ease: 'easeInOut' }} />
                </a>
              </motion.div>
            </motion.div>

            {heroMounted && (
              <>
                <SceneBoundary label="SonicRing">
                  <Suspense fallback={null}>
                    <SonicRing progress={heroProgress} active={heroVisible} lowPower={heroLowPower} />
                  </Suspense>
                </SceneBoundary>

                <SceneBoundary label="WarpField">
                  <Suspense fallback={null}>
                    <WarpField progress={heroProgress} active={heroVisible} lowPower={heroLowPower} />
                  </Suspense>
                </SceneBoundary>

                <SceneBoundary label="SonicExitRing">
                  <Suspense fallback={null}>
                    <SonicExitRing progress={heroProgress} active={heroVisible} lowPower={heroLowPower} />
                  </Suspense>
                </SceneBoundary>
              </>
            )}

            <motion.div
              className="hero-emerge"
              aria-hidden="true"
              style={{ background: '#050505', opacity: emergeOpacity }}
            />
          </div>
        </section>

        <section className="statement" id="about">
          <div className="section-tag"><span>01</span> / MANIFESTO</div>
          <Reveal>
            <p className="statement-copy">I BUILD <span>FROM FIRST PRINCIPLES</span> TO LEARN HOW SYSTEMS REALLY WORK, THEN SHAPE THEM INTO THINGS THAT FEEL <i>INEVITABLE</i>, NOT FAMILIAR.</p>
          </Reveal>
          <Reveal className="statement-foot">
            <p>Working at the intersection of engineering and design. Building expressive, high-performance work for screens of every size.</p>
            <Braces size={40} strokeWidth={1} />
          </Reveal>
        </section>

        <div className="marquee" aria-hidden="true">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
            SELECTED WORK <Asterisk /> SELECTED WORK <Asterisk /> SELECTED WORK <Asterisk /> SELECTED WORK <Asterisk />
          </motion.div>
        </div>

        <section className="work" id="work">
          <div className="work-heading">
            <div className="section-tag"><span>02</span> / FEATURED PROJECTS</div>
            <p>THREE SYSTEMS.<br />ONE CONTINUOUS FIELD.</p>
          </div>
          <div className="project-field">
            {projects.map((project, position) => <Project project={project} position={position} key={project.index} />)}
          </div>
        </section>

        <PlaygroundSection />

        <PrinciplesSection />

        <TechnologySection />

        <ContactSection />
      </main>
    </>
  )
}

export default App
