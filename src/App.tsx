import { AnimatePresence, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import type { MotionValue, Variants } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowUpRight,
  Asterisk,
  AudioLines,
  Box,
  Braces,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Github,
  Linkedin,
  Mail,
  MoveRight,
  Play,
  Plus,
  Search,
  ShoppingBag,
  TerminalSquare,
  Wind,
  Zap,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'
import type { RenderedPdf } from './pdfPages'
import Lenis from 'lenis'
import ScrollApple from './ScrollApple'
import heroHandLeftUrl from './assets/hero-hand-left.png'
import heroHandRightUrl from './assets/hero-hand-right.png'
import cloudsUrl from './assets/clouds.png'
import tojiUrl from './assets/toji.png'

const SonicRing = lazy(() => import('./SonicRing'))
const SonicExitRing = lazy(() => import('./SonicExitRing'))
const ResearchArchive = lazy(() => import('./ResearchArchive'))

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

const projects = [
  {
    index: '01',
    title: 'NEURAL\nWEATHER',
    type: 'EXPERIMENTAL / AI',
    year: '2026',
    description: 'A living climate interface that transforms atmospheric data into generative spatial systems.',
    tags: ['NEXT.JS', 'THREE.JS', 'GLSL'],
    theme: 'weather',
    device: 'phone',
    platform: 'IOS / SPATIAL INTERFACE',
    result: '2.4M LIVE SESSIONS',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1200&q=88',
    imageAlt: 'Dark storm clouds rolling across a luminous mountain atmosphere',
    imagePosition: '50% 50%',
  },
  {
    index: '02',
    title: 'NOIR\nSYSTEMS',
    type: 'COMMERCE / PLATFORM',
    year: '2025',
    description: 'An uncompromising digital flagship and modular commerce engine for an independent fashion house.',
    tags: ['REACT', 'WEBGL', 'SHOPIFY'],
    theme: 'noir',
    device: 'laptop',
    platform: 'WEB / COMMERCE PLATFORM',
    result: '+38% CONVERSION',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=88&sat=-100',
    imageAlt: 'Monochrome editorial portrait in sculptural fashion',
    imagePosition: '50% 34%',
  },
  {
    index: '03',
    title: 'SYNTHETIC\nMEMORY',
    type: 'ARCHIVE / CULTURE',
    year: '2025',
    description: 'A non-linear cultural archive where sound, image, and language collide in real time.',
    tags: ['TYPESCRIPT', 'R3F', 'WEB AUDIO'],
    theme: 'memory',
    device: 'phone',
    platform: 'IOS / CULTURAL ARCHIVE',
    result: '120K STORIES INDEXED',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=88&sat=-20',
    imageAlt: 'Intimate archival-style portrait of a woman against a textured wall',
    imagePosition: '50% 50%',
  },
]

const processPhases = [
  {
    number: '01',
    phase: 'INTERROGATE',
    title: 'FIND THE\nSIGNAL.',
    detail: 'Question assumptions, map constraints, and locate the emotional center before touching the interface.',
  },
  {
    number: '02',
    phase: 'PROTOTYPE',
    title: 'MAKE IT\nTANGIBLE.',
    detail: 'Move directly into code. Test interaction, type, performance, and motion in the medium itself.',
  },
  {
    number: '03',
    phase: 'ENGINEER',
    title: 'BUILD THE\nSYSTEM.',
    detail: 'Turn the strongest direction into durable architecture with clear primitives and predictable behavior.',
  },
  {
    number: '04',
    phase: 'REFINE',
    title: 'TUNE EVERY\nFRAME.',
    detail: 'Pressurize the details, remove friction, and make performance part of the final aesthetic.',
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

const capabilities = [
  ['01', 'CREATIVE DEVELOPMENT', 'Interfaces with a point of view. Built from first principles with motion, sound, and interaction as core materials.'],
  ['02', 'FRONTEND ARCHITECTURE', 'Scalable systems, thoughtful APIs, and production code engineered to remain fast under pressure.'],
  ['03', '3D & WEBGL', 'Real-time worlds, custom shaders, and spatial experiences optimized for the open web.'],
  ['04', 'TECHNICAL DIRECTION', 'A practical bridge between ambitious creative vision and dependable engineering execution.'],
]

const researchPapers = [
  {
    id: 'ARX-026.1',
    title: 'LATENT INTERFACES',
    subtitle: 'A grammar for interfaces that adapt without disappearing',
    field: 'HUMAN-COMPUTER INTERACTION',
    year: '2026',
    status: 'PREPRINT',
    accent: '#e7b65c',
    figure: 'field',
    abstract: 'This paper proposes a visual grammar for adaptive interfaces that preserve orientation, authorship, and user agency while changing in real time. It treats adaptation as a legible spatial event rather than an invisible optimization.',
    quote: 'An interface that adapts in secret teaches people they can no longer trust what they see.',
    note: 'Prototype-led inquiry across fourteen adaptive layouts against a fixed control. Participants held their orientation only when each change announced itself in space and could be traced back to a cause.',
    keywords: ['ADAPTIVE UI', 'AGENCY', 'SPATIAL SYSTEMS'],
  },
  {
    id: 'ARX-026.2',
    title: 'TEMPORAL TYPE',
    subtitle: 'Reading rhythm under velocity, interruption, and scale',
    field: 'COMPUTATIONAL TYPOGRAPHY',
    year: '2026',
    status: 'UNDER REVIEW',
    accent: '#ff64bc',
    figure: 'type',
    abstract: 'A study of kinetic typography as an information-bearing system. Controlled trials test how acceleration, interruption, and variable width affect comprehension, recall, and the felt duration of digital reading.',
    quote: 'Type in motion should listen to the reader\u2019s tempo before it dares to set its own.',
    note: 'Controlled trials with 212 readers measured recall and perceived duration. Motion aided comprehension only when it followed reading rhythm; imposed pacing consistently lowered both.',
    keywords: ['KINETIC TYPE', 'LEGIBILITY', 'MOTION'],
  },
  {
    id: 'ARX-025.4',
    title: 'PERCEPTUAL BUDGETS',
    subtitle: 'Allocating detail in real-time three-dimensional interfaces',
    field: 'REAL-TIME GRAPHICS',
    year: '2025',
    status: 'PUBLISHED',
    accent: '#6df7ff',
    figure: 'mesh',
    abstract: 'Instead of treating performance as a single frame-rate target, this work models a perceptual budget across motion, geometry, latency, and contrast. The result is a practical method for spending computation where people can actually perceive it.',
    quote: 'The frame nobody notices is the cheapest frame you will ever render.',
    note: 'Eye-tracking during real-time sessions mapped where detail was actually resolved. Reallocating budget away from unseen geometry cut GPU cost by a third with no perceived loss of fidelity.',
    keywords: ['WEBGL', 'PERCEPTION', 'PERFORMANCE'],
  },
  {
    id: 'ARX-025.1',
    title: 'THE UNRULY ARCHIVE',
    subtitle: 'Interfaces for cultural memory beyond search and chronology',
    field: 'CULTURAL COMPUTING',
    year: '2025',
    status: 'PUBLISHED',
    accent: '#ffad42',
    figure: 'archive',
    abstract: 'The searchable grid is not a neutral container. This paper explores interfaces that let oral history, ambiguity, repetition, and contradiction remain visible, offering a non-linear model for encountering cultural collections.',
    quote: 'A search bar quietly asks memory to behave. Most of what matters refuses.',
    note: 'Fieldwork across three community archives. Visitors dwelt longer on contradictory records than on resolved timelines, reading the friction as a sign of honesty rather than error.',
    keywords: ['ARCHIVES', 'MEMORY', 'NON-LINEAR UI'],
  },
  {
    id: 'ARX-024.3',
    title: 'MACHINE ATTENTION',
    subtitle: 'Making inference visible as a spatial material',
    field: 'EXPLAINABLE AI',
    year: '2024',
    status: 'PROCEEDINGS',
    accent: '#b8a0ff',
    figure: 'attention',
    abstract: 'A visual framework for exposing confidence, omission, and competing machine interpretations. The system turns inference into a navigable field so people can inspect uncertainty rather than receive a single polished answer.',
    quote: 'A confidence score hides the argument the model had with itself.',
    note: 'Reviewers inspected model reasoning as a navigable field of competing readings. Surfacing omission and dissent let them catch failures that a single ranked output routinely concealed.',
    keywords: ['INTERPRETABILITY', 'AI', 'VISUALIZATION'],
  },
]

const experience = [
  {
    period: '2023 — NOW',
    role: 'INDEPENDENT CREATIVE DEVELOPER',
    studio: 'ALEX RIVERA STUDIO',
    location: 'NEW YORK / GLOBAL',
    detail: 'Partnering directly with cultural institutions, product teams, and independent founders to create defining digital work.',
    clients: ['NIKE', 'APPLE', 'NEW MUSEUM', 'ARC’TERYX'],
  },
  {
    period: '2020 — 2023',
    role: 'TECHNICAL DIRECTOR',
    studio: 'FORM&FUNCTION',
    location: 'NEW YORK',
    detail: 'Led a multidisciplinary engineering group delivering experimental platforms, commerce systems, and installations.',
    clients: ['GOOGLE', 'SPOTIFY', 'PATAGONIA', 'SONOS'],
  },
  {
    period: '2017 — 2020',
    role: 'SENIOR CREATIVE DEVELOPER',
    studio: 'NORTH / EAST',
    location: 'LONDON',
    detail: 'Built award-winning campaign experiences and codified the studio’s approach to motion, WebGL, and accessibility.',
    clients: ['ADIDAS', 'V&A', 'MONOCLE', 'LEGO'],
  },
  {
    period: '2014 — 2017',
    role: 'INTERACTION ENGINEER',
    studio: 'FIELD OFFICE',
    location: 'BERLIN',
    detail: 'Explored the emerging browser graphics stack through installations, identity systems, and generative tools.',
    clients: ['A24', 'NASA JPL', 'MIT', 'VITRA'],
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

const technologies = [
  'REACT',
  'TYPESCRIPT',
  'THREE.JS',
  'WEBGL',
  'GLSL',
  'FRAMER MOTION',
  'NEXT.JS',
  'NODE.JS',
  'R3F',
  'WEB AUDIO',
  'GSAP',
  'VITE',
  'D3.JS',
  'CANVAS',
  'WASM',
  'FIGMA',
]

const recognition = [
  ['AWWWARDS', 'INDEPENDENT OF THE DAY', '2026'],
  ['CSS DESIGN AWARDS', 'SPECIAL KUDOS × 3', '2026'],
  ['THE FWA', 'SITE OF THE DAY', '2025'],
  ['AWWWARDS', 'DEVELOPER AWARD × 4', '2025'],
  ['CSS DESIGN AWARDS', 'WEBSITE OF THE DAY', '2024'],
  ['TYPE DIRECTORS CLUB', 'CERTIFICATE OF EXCELLENCE', '2024'],
]


function HeroHandsScene({ progress }: { progress: MotionValue<number> }) {
  // Pointer parallax (adds depth, independent of scroll)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const driftX = useSpring(px, { stiffness: 55, damping: 22, mass: 0.6 })
  const driftY = useSpring(py, { stiffness: 55, damping: 22, mass: 0.6 })

  useEffect(() => {
    const move = (event: PointerEvent) => {
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

  useEffect(() => {
    const move = (event: PointerEvent | MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      const target = event.target instanceof Element ? event.target : null
      setActive(Boolean(target?.closest('a, button, .project-visual, [role="button"]')))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('mousemove', move)
    }
  }, [x, y])

  return (
    <motion.div
      className="cursor"
      data-active={active}
      style={{ x: smoothX, y: smoothY }}
    />
  )
}

function Loader() {
  const [visible, setVisible] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const tojiRef = useRef<HTMLImageElement>(null)
  const speedRef = useRef<HTMLDivElement>(null)
  const blackoutRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const shadow = 'drop-shadow(0 14px 30px rgba(0,0,0,0.5))'
    const ctx = gsap.context(() => {
      gsap.set(tojiRef.current, { xPercent: -50, yPercent: -30, rotation: -3, opacity: 1, filter: `blur(0px) ${shadow}` })
      gsap.set(worldRef.current, { scale: 1, transformOrigin: '50% 70%' })
      gsap.set(barRef.current, { scaleX: 0, transformOrigin: 'center' })
      gsap.set(speedRef.current, { opacity: 0 })
      gsap.set(blackoutRef.current, { opacity: 0 })

      const tl = gsap.timeline({ onComplete: () => window.setTimeout(() => setVisible(false), 150) })

      // Progress hairline fills across the whole intro.
      tl.to(barRef.current, { scaleX: 1, ease: 'none', duration: 2.9 }, 0)
      // Fast, straight, continuously accelerating fall (real gravity — power2.in).
      tl.to(tojiRef.current, { yPercent: 450, rotation: 2, ease: 'power2.in', duration: 2.2 }, 0)
      // Motion blur only in the last stretch of the fall (peak velocity).
      tl.to(tojiRef.current, { filter: `blur(12px) ${shadow}`, ease: 'power2.in', duration: 0.95 }, 1.3)
      // Anime speed lines during the fast stretch.
      tl.to(speedRef.current, { opacity: 0.55, duration: 0.35 }, 1.3)
      tl.to(speedRef.current, { opacity: 0, duration: 0.4 }, 2.1)
      // A gentle push-in as he nears the clouds (half the previous zoom).
      tl.to(worldRef.current, { scale: 1.9, ease: 'power3.in', duration: 0.85 }, 1.65)
      // He vanishes into the clouds.
      tl.to(tojiRef.current, { opacity: 0, duration: 0.35 }, 2.1)
      // Brief darkness, then the hero emerges.
      tl.to(blackoutRef.current, { opacity: 1, duration: 0.45 }, 2.45)
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div ref={rootRef} className="loader" exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}>
          <div className="loader-scene">
            <div className="loader-world" ref={worldRef}>
              <div className="loader-sky">
                <img className="loader-clouds" src={cloudsUrl} alt="" draggable={false} />
                <div className="loader-speed" ref={speedRef}><div className="loader-speed-lines" /></div>
                <img className="loader-toji" ref={tojiRef} src={tojiUrl} alt="" draggable={false} />
                <div className="loader-sky-fade" />
              </div>
            </div>
          </div>
          <div className="loader-blackout" ref={blackoutRef} />
          <div className="loader-hud">
            <div className="loader-mark"><Asterisk size={16} /> AR / 26</div>
            <div className="loader-status">LOADING</div>
          </div>
          <div className="loader-progress"><span ref={barRef} /></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
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
  const [percentage, setPercentage] = useState(0)

  useEffect(() => scrollYProgress.on('change', (value) => setPercentage(Math.round(value * 100))), [scrollYProgress])

  return (
    <div className="scroll-coordinates" aria-hidden="true">
      <span>Y / {String(percentage).padStart(3, '0')}</span>
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

function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const activePhaseRef = useRef(0)

  const reducedMotion = useReducedMotion()
  const [activePhase, setActivePhase] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Framer Motion spring physics for tactile, silky-smooth scroll tracking
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0001,
  })

  // The whole plate stack breathes and tilts through the dissection
  const stageScale = useTransform(smoothProgress, [0, 0.5, 1], [0.94, 1.05, 0.94])
  const stageRotateX = useTransform(smoothProgress, [0, 0.5, 1], [0, 15, 0])
  const stageRotateZ = useTransform(smoothProgress, [0, 0.5, 1], [0, -4, 0])
  const copyY = useTransform(smoothProgress, [0, 0.5, 1], [24, 0, -24])
  const copyOpacity = useTransform(smoothProgress, [0, 0.045, 0.94, 1], [0.35, 1, 1, 0.35])

  // Scroll progress drives which process phase is shown
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    if (reducedMotion) return
    const nextPhase = Math.min(
      Math.floor(latest * processPhases.length),
      processPhases.length - 1,
    )
    if (nextPhase !== activePhaseRef.current) {
      activePhaseRef.current = nextPhase
      setActivePhase(nextPhase)
    }
  })

  const displayedPhase = reducedMotion ? 1 : activePhase
  const phase = processPhases[displayedPhase]
  const layerCount = brainLayerUrls.length

  return (
    <section className="process-section" id="process" ref={sectionRef}>
      <div className="process-stage">
        <motion.div
          className="brain-layers"
          style={reducedMotion ? undefined : { scale: stageScale, rotateX: stageRotateX, rotateZ: stageRotateZ }}
          aria-hidden="true"
        >
          {brainLayerUrls.map((url, index) => (
            <BrainLayer
              key={url}
              url={url}
              depth={index}
              count={layerCount}
              progress={smoothProgress}
              reducedMotion={!!reducedMotion}
            />
          ))}
        </motion.div>
        <div className="process-identifier section-tag">
          <span>04</span> / OPERATING SYSTEM
        </div>
        <motion.div className="process-copy" style={reducedMotion ? undefined : { y: copyY, opacity: copyOpacity }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={phase.number}
              initial={reducedMotion ? false : { opacity: 0, y: 22, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -18, filter: 'blur(8px)' }}
              transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{phase.number} / {phase.phase}</span>
              <h2>{phase.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
              <p>{phase.detail}</p>
            </motion.article>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
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
          <span className="leaf-label">Abstract</span>
          <p><span className="leaf-dropcap">{paper.abstract.charAt(0)}</span>{paper.abstract.slice(1)}</p>
        </div>
        <blockquote className="leaf-quote">{paper.quote}</blockquote>
        <div className="leaf-note">
          <span className="leaf-label">Research note</span>
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
            <span>ARX / OPEN SHELF</span>
            <span>{researchPapers.length} VOLUMES</span>
          </div>
        </div>
      </aside>
      <div className="reading-stream">
        {researchPapers.map((paper, index) => (
          <ResearchLeaf key={paper.id} paper={paper} index={index} reducedMotion onActive={setActiveIndex} />
        ))}
        <div className="stream-endnote">
          <span>END OF CURRENT SHELF</span>
          <p>New papers are added as prototypes mature. Preprint requests and correspondence are welcome.</p>
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
  const accent = useMotionValue(researchPapers[0].accent)
  const meterScale = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 })

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
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
    <section className="playground" id="research">
      {/* Tall scroll track; the stage inside pins while papers turn in the light */}
      <div className="archive-scroll" ref={scrollRef}>
        {Array.from({ length: slideCount }).map((_, index) => (
          <span
            key={index}
            id={`research-entry-${index}`}
            className="archive-marker"
            aria-hidden="true"
            style={{ top: `${lastIndex ? (index / lastIndex) * 80 : 0}%` }}
          />
        ))}

        <div className="archive-stage">
          <div className="research-atmosphere" aria-hidden="true">
            <i /><i />
            <motion.span className="research-lamp" style={{ backgroundColor: accent }} />
          </div>

          <Suspense fallback={null}>
            <ResearchArchive progress={scrollYProgress} papers={researchPapers} accent={accent} pdf={pdf} />
          </Suspense>

          <div className="archive-head">
            <div className="section-tag"><span>05</span> / WRITTEN INQUIRY</div>
            <h2>THE READING <i>ROOM.</i></h2>
          </div>

          <div className="archive-upload">
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
          </div>

          <nav className="archive-ledger" aria-label={isPdf ? 'PDF pages' : 'Research papers'}>
            <span className="archive-ledger-tag">{isPdf ? 'UPLOADED PAGES' : 'SELECTED PAPERS'}</span>
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
          </nav>

          <div className="archive-meter" aria-hidden="true"><motion.i style={{ scaleX: meterScale }} /></div>

          <div className="archive-reader" style={{ '--paper-accent': accentAt(activeIndex) } as CSSProperties}>
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
                    <blockquote>{activePaper.quote}</blockquote>
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
          </div>

          <div className="archive-scrollcue" aria-hidden="true"><span>SCROLL TO TURN THE PAGES</span></div>
        </div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section className="experience-section" id="experience">
      <div className="experience-head">
        <div className="section-tag"><span>06</span> / EXPERIENCE</div>
        <Reveal><h2>A DECADE OF<br /><i>MAKING IT REAL.</i></h2></Reveal>
      </div>
      <div className="experience-list">
        {experience.map((item, index) => (
          <motion.article
            className="experience-row"
            key={item.period}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="experience-index">0{index + 1}</span>
            <span className="experience-period">{item.period}</span>
            <div className="experience-role"><h3>{item.role}</h3><span>{item.studio}</span></div>
            <span className="experience-location">{item.location}</span>
            <p>{item.detail}</p>
            <div className="experience-clients">{item.clients.map((client) => <span key={client}>{client}</span>)}</div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section className="principles-section">
      <div className="principles-sticky">
        <div className="section-tag"><span>07</span> / PRINCIPLES</div>
        <h2>THE RULES<br />BEHIND THE<br /><i>WORK.</i></h2>
        <p>Not trends. Not a style guide. Four durable ideas that shape every technical and creative decision.</p>
      </div>
      <div className="principles-cards">
        {principles.map((principle, index) => (
          <motion.article
            className={`principle-card accent-${principle.accent}`}
            key={principle.number}
            initial={{ rotate: index % 2 === 0 ? -2 : 2, y: 80 }}
            whileInView={{ rotate: 0, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8 }}
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
  const [activeTech, setActiveTech] = useState('THREE.JS')
  const activeIndex = technologies.indexOf(activeTech)
  const groups = [
    { name: 'INTERFACE', code: 'UI', items: technologies.slice(0, 4) },
    { name: 'MOTION', code: 'MX', items: technologies.slice(4, 8) },
    { name: 'SYSTEMS', code: 'SY', items: technologies.slice(8, 12) },
    { name: 'EXPERIMENT', code: 'EX', items: technologies.slice(12, 16) },
  ]

  return (
    <section className="technology-section">
      <div className="tech-head">
        <div>
          <div className="section-tag"><span>08</span> / TOOLKIT</div>
          <h2>TOOLS, CHOSEN<br /><i>WITH INTENTION.</i></h2>
        </div>
        <div className="tech-head-meta">
          <span>AN EVOLVING PRACTICE</span>
          <p>The stack is never the story. These are simply the materials I trust to make digital work feel precise, expressive, and effortless.</p>
        </div>
      </div>
      <div className="tech-gallery">
        <div className="tech-canvas" aria-hidden="true">
          <div className="tech-canvas-number">{String(activeIndex + 1).padStart(2, '0')}</div>
          <AnimatePresence mode="wait">
            <motion.div
              className="tech-canvas-word"
              key={activeTech}
              initial={{ opacity: 0, y: 30, rotate: 2, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -25, rotate: -2, filter: 'blur(10px)' }}
              transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeTech}
            </motion.div>
          </AnimatePresence>
          <motion.div className="tech-sculpture" animate={{ rotate: activeIndex * 22 }} transition={{ duration: 1.1, ease: [0.22,1,0.36,1] }}>
            <i /><i /><i /><b />
          </motion.div>
          <div className="tech-canvas-caption"><span>DIGITAL MATERIAL / {String(activeIndex + 1).padStart(2, '0')}</span><span>FORM FOLLOWS PURPOSE</span></div>
          <motion.div className="tech-light" animate={{ x: ['-20%', '25%', '-20%'], y: ['-5%', '10%', '-5%'] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <div className="tech-list">
          <div className="tech-list-head">
            <span>SKILL INDEX / 16</span>
            <span>HOVER TO INSPECT</span>
          </div>
          {groups.map((group, groupIndex) => (
            <motion.div className="tech-group" key={group.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: groupIndex * .08 }}>
              <div className="tech-group-label">
                <span>{String(groupIndex + 1).padStart(2, '0')}</span>
                <strong>{group.name}</strong>
                <i>{group.code}</i>
              </div>
              <div className="tech-skill-grid">
                {group.items.map((technology) => {
                  const technologyIndex = technologies.indexOf(technology)
                  const isActive = activeTech === technology
                  return (
                  <button key={technology} className={isActive ? 'is-active' : ''} onMouseEnter={() => setActiveTech(technology)} onFocus={() => setActiveTech(technology)} onClick={() => setActiveTech(technology)} aria-pressed={isActive}>
                    <motion.span className="tech-skill-fill" initial={false} animate={{ scaleX: isActive ? 1 : 0 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }} />
                    <span className="tech-skill-number">{String(technologyIndex + 1).padStart(2, '0')}</span>
                    <span className="tech-skill-name">{technology}</span>
                    <span className="tech-skill-status"><i /> {isActive ? 'IN FOCUS' : 'LEARNED'}</span>
                    <ArrowUpRight />
                  </button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="tech-footnote">
        <p>Technique in service of <i>clarity.</i></p>
        <span>DESIGN / CODE / MOTION / 2014—2026</span>
        <motion.div animate={{ scaleX: [0, 1, 0], x: ['-100%', '0%', '100%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }} />
      </div>
    </section>
  )
}

function RecognitionSection() {
  return (
    <section className="recognition-section">
      <div className="recognition-title">
        <div className="section-tag"><span>09</span> / RECOGNITION</div>
        <Reveal><h2>SELECTED<br /><i>SIGNALS.</i></h2></Reveal>
      </div>
      <div className="recognition-list">
        {recognition.map(([organization, award, year], index) => (
          <motion.div
            key={`${organization}-${award}`}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
          >
            <span>0{index + 1}</span><strong>{organization}</strong><p>{award}</p><span>{year}</span><ArrowUpRight />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: 'Alex operates in the rare space where an impossible creative concept becomes an even better technical system.',
      person: 'MAYA CHEN',
      role: 'VP DESIGN / NORTHSTAR',
    },
    {
      quote: 'The work feels alive, but never arbitrary. Every surprising interaction is grounded in a remarkably clear engineering decision.',
      person: 'JON BELL',
      role: 'FOUNDER / OBJECT OFFICE',
    },
    {
      quote: 'He elevated the ambition of the entire team and still delivered the fastest experience we had ever shipped.',
      person: 'ELENA MORA',
      role: 'CREATIVE DIRECTOR / FORMA',
    },
  ]
  const [index, setIndex] = useState(0)
  const testimonial = testimonials[index]

  const change = (direction: number) => setIndex((current) => (current + direction + testimonials.length) % testimonials.length)

  return (
    <section className="testimonial-section">
      <div className="testimonial-counter">{String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</div>
      <AnimatePresence mode="wait">
        <motion.blockquote key={testimonial.person} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} transition={{ duration: 0.5 }}>
          “{testimonial.quote}”
          <footer><strong>{testimonial.person}</strong><span>{testimonial.role}</span></footer>
        </motion.blockquote>
      </AnimatePresence>
      <div className="testimonial-controls">
        <button onClick={() => change(-1)} aria-label="Previous testimonial"><ChevronLeft /></button>
        <button onClick={() => change(1)} aria-label="Next testimonial"><ChevronRight /></button>
      </div>
    </section>
  )
}

function WeatherScreen({ active }: { active: boolean }) {
  const forecast = [
    ['NOW', '14°'],
    ['21', '12°'],
    ['00', '09°'],
    ['03', '07°'],
    ['06', '08°'],
  ]
  return (
    <div className="app-scene app-weather">
      <div className="app-noise" aria-hidden="true" />
      <motion.div
        className="wx-orb"
        aria-hidden="true"
        animate={active ? { scale: 1.06, rotate: 8 } : { scale: 1, rotate: 0 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <i /><i /><i />
      </motion.div>
      <motion.span className="wx-scan" aria-hidden="true" animate={{ y: ['0%', '2400%'] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }} />
      <div className="app-status"><span>9:41</span><span className="app-status-dots"><i /><i /><i /></span></div>
      <div className="wx-head">
        <span>NORTH ATLANTIC CELL</span>
        <strong>REYKJAVÍK</strong>
      </div>
      <div className="wx-temp">
        <em>14<sup>°</sup></em>
        <span>FEELS 09° / CLEARING<br />WIND SHEAR NOMINAL</span>
      </div>
      <div className="wx-readouts">
        <span>HUMIDITY<b>72%</b></span>
        <span>PRESSURE<b>1014</b></span>
        <span>UV IDX<b>02</b></span>
      </div>
      <div className="wx-forecast">
        {forecast.map(([h, t], i) => (
          <motion.span
            key={h}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.06 }}
          >
            <small>{h}</small>
            <Wind />
            <b>{t}</b>
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function NoirScreen({ active }: { active: boolean }) {
  const products = [
    ['001', 'STRUCTURED COAT', '€1,290'],
    ['002', 'RAW HEM TROUSER', '€560'],
    ['003', 'CASHMERE MASK', '€340'],
  ]
  return (
    <div className="app-scene app-noir">
      <div className="app-noise" aria-hidden="true" />
      <header className="nr-bar">
        <span className="nr-logo">NOIR<sup>®</sup></span>
        <nav><span>SHOP</span><span>ARCHIVE</span><span>ATELIER</span></nav>
        <span className="nr-cart"><ShoppingBag /> 02</span>
      </header>
      <div className="nr-hero">
        <motion.div className="nr-column" aria-hidden="true" animate={active ? { y: -8 } : { y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
        <div className="nr-hero-type">
          <span>AUTUMN / WINTER 26</span>
          <h4>UN&shy;COMPRO&shy;MISED</h4>
          <p>An independent house building garments as systems — modular, monochrome, permanent.</p>
        </div>
      </div>
      <div className="nr-grid">
        {products.map(([idx, name, price], i) => (
          <motion.article
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            <span className="nr-swatch" aria-hidden="true"><i /></span>
            <span className="nr-index">{idx}</span>
            <strong>{name}</strong>
            <b>{price}</b>
          </motion.article>
        ))}
      </div>
      <div className="nr-foot"><span>FREE ATELIER RETURNS</span><span className="nr-add">ADD TO BAG <Plus /></span></div>
    </div>
  )
}

function MemoryScreen({ active }: { active: boolean }) {
  const tiles = ['1954', '1971', '1988', '1996', '2003', '2011']
  return (
    <div className="app-scene app-memory">
      <div className="app-noise" aria-hidden="true" />
      <div className="app-status"><span>SYNTHETIC MEMORY</span><span className="mm-live"><i /> REC</span></div>
      <div className="mm-search"><Search /><span>trace a sound, a face, a year…</span></div>
      <div className="mm-wave" aria-hidden="true">
        {Array.from({ length: 34 }, (_, i) => (
          <motion.i
            key={i}
            animate={active ? { scaleY: [0.3, 1, 0.5, 0.9, 0.35] } : { scaleY: 0.4 }}
            transition={{ duration: 1.6, repeat: active ? Infinity : 0, delay: i * 0.03, ease: 'easeInOut' }}
          />
        ))}
      </div>
      <div className="mm-grid">
        {tiles.map((year, i) => (
          <motion.span
            key={year}
            className={`mm-tile mm-tile-${i % 4}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <b>{year}</b>
          </motion.span>
        ))}
      </div>
      <div className="mm-foot">
        <span className="mm-play"><Play /> PLAY THREAD</span>
        <span className="mm-count">120,418 FRAGMENTS</span>
      </div>
    </div>
  )
}

function ProjectScreen({ project, active }: { project: typeof projects[number]; active: boolean }) {
  return (
    <div className="app-screen" data-theme={project.theme}>
      {project.theme === 'weather' && <WeatherScreen active={active} />}
      {project.theme === 'noir' && <NoirScreen active={active} />}
      {project.theme === 'memory' && <MemoryScreen active={active} />}
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
        viewport={{ once: true, amount: 0.32 }}
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
        viewport={{ once: true, amount: 0.35 }}
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
          href="https://github.com/alexrivera/example-project"
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
      <a className="wordmark" href="#top" aria-label="Alex Rivera home">A<span>R</span><sup>26</sup></a>
      <div className="availability"><i /> AVAILABLE FOR SELECT PROJECTS <span>SEP '26</span></div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
        <span>{open ? 'CLOSE' : 'MENU'}</span><b className={open ? 'is-open' : ''}><i /><i /></b>
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav className="menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
            {['WORK', 'ABOUT', 'CAPABILITIES', 'RESEARCH', 'CONTACT'].map((item, i) => (
              <motion.a href={`#${item.toLowerCase()}`} key={item} onClick={() => setOpen(false)} initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <small>0{i + 1}</small>{item}<ArrowUpRight />
              </motion.a>
            ))}
            <div className="menu-footer"><span>NEW YORK / GLOBAL</span><LiveClock /><span>HELLO@ALEXRIVERA.DEV</span></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 })

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
  const HERO_VH = 920 // <- keep in sync with .hero (desktop) in styles.css
  const HERO_VH_OLD = 420 // the height the hand timing was tuned against
  const VIEW_VH = 100
  // Scroll distance (in svh) the hands used to travel — the feel we preserve.
  const HAND_SCROLL = 0.46 * (HERO_VH_OLD - VIEW_VH)
  // Raw-scroll fraction at which the hands should finish now.
  const R_TOUCH = HAND_SCROLL / (HERO_VH - VIEW_VH)
  // Piecewise-linear: [0..R_TOUCH] -> [0..0.46] (hands, same scroll distance),
  // then [R_TOUCH..1] -> [0.46..1] (dive + warp, now with room to breathe).
  const heroMapped = useTransform(heroRaw, [0, R_TOUCH, 1], [0, 0.46, 1])
  const heroProgress = useSpring(heroMapped, { stiffness: 120, damping: 30, restDelta: 0.0002 })
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

  // Studio-grade eased/inertial scrolling. Everything scroll-driven (hero scrub,
  // ScrollApple, progress) rides on top of Lenis, so nothing feels linear.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    })

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
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <Loader />
      <Cursor />
      <PointerGlow />
      <ScrollCoordinates />
      <ScrollApple />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Header />
      <main id="top">
        <section className="hero" ref={heroRef}>
          <div className="hero-stage">
            <motion.div className="hero-panel" style={{ scale: panelScale, opacity: panelOpacity }}>
              <HeroHandsScene progress={heroProgress} />

              <div className="hero-top">
                <motion.p
                  className="hero-intro"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  Independent creative developer in New York, designing and
                  engineering expressive, high-performance work for the web.
                </motion.p>
                <div className="hero-corner" aria-hidden="true">
                  <span>40.7128° N</span>
                  <span>74.0060° W</span>
                  <LiveClock />
                </div>
              </div>

              <h1 className="hero-title">
                <span className="hero-line">
                  <motion.span initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ delay: 1.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}>Building digital</motion.span>
                </span>
                <span className="hero-line">
                  <motion.span initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ delay: 1.66, duration: 1, ease: [0.16, 1, 0.3, 1] }}>systems</motion.span>
                </span>
                <span className="hero-line hero-line-serif">
                  <motion.span initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ delay: 1.8, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}>for the unreal.</motion.span>
                </span>
              </h1>

              <div className="hero-foot">
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
              </div>
            </motion.div>

            <Suspense fallback={null}>
              <SonicRing progress={heroProgress} />
            </Suspense>

            <Suspense fallback={null}>
              <SonicExitRing progress={heroProgress} />
            </Suspense>

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
            <p className="statement-copy">I PARTNER WITH <span>AMBITIOUS PEOPLE</span> TO SHAPE IDEAS INTO DIGITAL EXPERIENCES THAT FEEL <i>INEVITABLE</i>, NOT FAMILIAR.</p>
          </Reveal>
          <Reveal className="statement-foot">
            <p>Ten years at the intersection of engineering and design. Building expressive, high-performance work for screens of every size.</p>
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

        <section className="capabilities" id="capabilities">
          <div className="cap-head">
            <div className="section-tag"><span>03</span> / WHAT I DO</div>
            <Reveal><h2>ENGINEERING<br /><i>THE IMPOSSIBLE.</i></h2></Reveal>
          </div>
          <div className="cap-grid">
            {capabilities.map(([number, title, body], index) => (
              <motion.article key={number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <span>{number}</span>
                {index === 0 && <Code2 />}{index === 1 && <Braces />}{index === 2 && <Cpu />}{index === 3 && <Asterisk />}
                <h3>{title}</h3><p>{body}</p>
              </motion.article>
            ))}
          </div>
          <Reveal className="terminal">
            <div className="terminal-top"><span><i /><i /><i /></span><b>alex@rivera: ~/process</b><span>TSX</span></div>
            <pre><code><span className="line">01</span> <b>const</b> intent = <em>await</em> understand(problem);{`\n`}<span className="line">02</span> <b>const</b> system = craft({`{`}{`\n`}<span className="line">03</span>   strategy: <i>intent</i>,{`\n`}<span className="line">04</span>   design: <i>"precise + alive"</i>,{`\n`}<span className="line">05</span>   engineering: <i>"built to last"</i>,{`\n`}<span className="line">06</span> {`}`});{`\n`}<span className="line">07</span>{`\n`}<span className="line">08</span> ship(system).<em>then</em>(makeItUnforgettable);</code></pre>
          </Reveal>
          <div className="capability-modules">
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / A</span><Box /><h3>REAL-TIME GRAPHICS</h3><p>Custom shaders, particles, post-processing, procedural geometry, and disciplined rendering budgets.</p><b>THREE.JS / GLSL / R3F</b>
            </motion.article>
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / B</span><AudioLines /><h3>SPATIAL AUDIO</h3><p>Sound systems that respond to interaction, distance, sequence, and the emotional rhythm of an interface.</p><b>WEB AUDIO / TONE.JS</b>
            </motion.article>
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / C</span><Database /><h3>DESIGN SYSTEMS</h3><p>Flexible primitives and tokens that preserve creative intent across teams, platforms, and product states.</p><b>REACT / TYPESCRIPT</b>
            </motion.article>
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / D</span><Zap /><h3>PERFORMANCE</h3><p>Instrumentation, profiling, loading strategy, asset pipelines, and motion tuned for actual hardware.</p><b>LIGHTHOUSE / RUM</b>
            </motion.article>
          </div>
        </section>

        <ProcessSection />

        <PlaygroundSection />

        <ExperienceSection />

        <PrinciplesSection />

        <TechnologySection />

        <RecognitionSection />

        <TestimonialSection />

        <section className="dispatch-section">
          <div className="dispatch-track">
            <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
              OPEN FOR COLLABORATION <Asterisk /> NEW YORK 2026 <Asterisk /> CREATIVE ENGINEERING <Asterisk /> OPEN FOR COLLABORATION <Asterisk /> NEW YORK 2026 <Asterisk /> CREATIVE ENGINEERING <Asterisk />
            </motion.div>
          </div>
          <div className="dispatch-grid">
            <div className="dispatch-copy">
              <div className="section-tag"><span>10</span> / TRANSMISSION</div>
              <h2>OCCASIONAL<br />NOTES FROM<br /><i>THE LAB.</i></h2>
              <p>Experiments, technical breakdowns, references, and unfinished thoughts. No shortcuts. No weekly obligation.</p>
            </div>
            <form className="dispatch-form" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="email">EMAIL ADDRESS</label>
              <div><input id="email" type="email" placeholder="YOU@DOMAIN.COM" required /><button type="submit" aria-label="Subscribe"><ArrowUpRight /></button></div>
              <span><i /> ENCRYPTED TRANSMISSION / ZERO SPAM</span>
            </form>
            <div className="dispatch-console">
              <span>CHANNEL_10</span><TerminalSquare /><strong>WAITING FOR INPUT</strong><i className="console-cursor" />
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-orbit" aria-hidden="true"><span>LET'S MAKE SOMETHING REAL • LET'S MAKE SOMETHING REAL • </span><Asterisk /></div>
          <Reveal>
            <div className="section-tag"><span>04</span> / START A PROJECT</div>
            <h2>HAVE AN IDEA<br />THAT <i>SHOULDN'T</i><br />BE POSSIBLE?</h2>
          </Reveal>
          <div className="contact-actions">
            <MagneticLink href="mailto:hello@alexrivera.dev" className="contact-link"><TextScramble>LET'S TALK</TextScramble> <MoveRight /></MagneticLink>
            <div className="contact-status"><i /><span>RESPONSE TIME<br /><b>UNDER 48 HOURS</b></span></div>
          </div>
          <footer>
            <a href="#top" className="footer-mark">AR<sup>26</sup></a>
            <p>INDEPENDENT CREATIVE DEVELOPER<br />NEW YORK / WORKING GLOBALLY</p>
            <div className="socials"><a href="https://github.com" aria-label="GitHub"><Github /></a><a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin /></a><a href="mailto:hello@alexrivera.dev" aria-label="Email"><Mail /></a></div>
            <a href="#top" className="back-top">BACK TO TOP <ArrowUpRight /></a>
          </footer>
          <div className="contact-utility"><LiveClock /><span>© 2026 ALEX RIVERA</span><SoundControl /></div>
        </section>
      </main>
    </>
  )
}

export default App
