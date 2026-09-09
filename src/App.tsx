import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  AudioLines,
  Binary,
  Box,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Gauge,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  MoveRight,
  Play,
  ScanLine,
  TerminalSquare,
  Workflow,
  Zap,
} from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Group, Mesh } from 'three'

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
  },
]

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
    accent: '#c6ff00',
    figure: 'field',
    abstract: 'This paper proposes a visual grammar for adaptive interfaces that preserve orientation, authorship, and user agency while changing in real time. It treats adaptation as a legible spatial event rather than an invisible optimization.',
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


function Scene() {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const contour = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (!group.current || !core.current || !contour.current) return
    const time = state.clock.elapsedTime
    group.current.rotation.y += (state.pointer.x * 0.12 + Math.sin(time * 0.2) * 0.08 - group.current.rotation.y) * 0.025
    group.current.rotation.x += (state.pointer.y * 0.08 + Math.sin(time * 0.28) * 0.025 - group.current.rotation.x) * 0.025
    group.current.rotation.z = Math.cos(time * 0.2) * 0.012
    group.current.position.y = Math.sin(time * 0.42) * 0.07
    const breath = 2.02 + Math.sin(time * 0.55) * 0.018
    core.current.scale.setScalar(breath)
    contour.current.scale.setScalar(breath + 0.018)
    contour.current.rotation.z -= delta * 0.01
  })

  return (
    <group ref={group}>
      <mesh ref={core} scale={2.02}>
        <sphereGeometry args={[1, 96, 64]} />
        <MeshDistortMaterial
          color="#11150d"
          emissive="#101a08"
          emissiveIntensity={0.28}
          roughness={0.3}
          metalness={0.74}
          distort={0.14}
          speed={0.7}
        />
      </mesh>
      <mesh ref={contour} scale={2.038}>
        <sphereGeometry args={[1, 36, 24]} />
        <MeshDistortMaterial color="#b8df35" emissive="#557a09" emissiveIntensity={0.65} distort={0.14} speed={0.7} wireframe transparent opacity={0.24} depthWrite={false} />
      </mesh>
    </group>
  )
}

function WebGLHero() {
  return (
    <div className="webgl-wrap" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[4, 5, 4]} color="#f4f7ec" intensity={3.2} />
        <pointLight position={[-4, -2, 3]} color="#8dbb27" intensity={8} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
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
    const move = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setActive(Boolean((event.target as HTMLElement).closest('a, button, .project-visual')))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="cursor"
      data-active={active}
      style={{ x: smoothX, y: smoothY }}
      transition={{ type: 'spring' }}
    />
  )
}

function Loader() {
  const [visible, setVisible] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(100, Math.floor(((now - started) / 1350) * 100))
      setCount(progress)
      if (progress < 100) frame = requestAnimationFrame(tick)
      else window.setTimeout(() => setVisible(false), 240)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="loader" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <div className="loader-mark"><Asterisk size={20} /> AR / 26</div>
          <div className="loader-count">{String(count).padStart(3, '0')}</div>
          <div className="loader-track"><motion.span style={{ scaleX: count / 100 }} /></div>
          <p>COMPILING VISUAL SYSTEM</p>
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

function MetricsStrip() {
  const metrics = [
    ['10+', 'YEARS IN THE BROWSER'],
    ['47', 'PROJECTS SHIPPED'],
    ['19', 'GLOBAL AWARDS'],
    ['60', 'FRAMES / SECOND'],
  ]

  return (
    <section className="metrics-strip" aria-label="Selected metrics">
      {metrics.map(([value, label], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
        >
          <strong>{value}</strong>
          <span>{label}</span>
        </motion.div>
      ))}
    </section>
  )
}

function ProcessSection() {
  const steps = [
    {
      number: '01',
      phase: 'INTERROGATE',
      verb: 'UNDERSTAND',
      detail: 'Question assumptions, map constraints, and locate the emotional center of the problem before touching the interface.',
      output: 'STRATEGY / SYSTEM MAP',
      icon: ScanLine,
    },
    {
      number: '02',
      phase: 'PROTOTYPE',
      verb: 'MAKE',
      detail: 'Move directly into code. Test interaction, type, performance, and motion in the medium where the work will actually live.',
      output: 'WORKING PROTOTYPE',
      icon: Workflow,
    },
    {
      number: '03',
      phase: 'ENGINEER',
      verb: 'SYSTEMIZE',
      detail: 'Turn the strongest direction into a durable architecture with clear primitives, predictable behavior, and real data.',
      output: 'PRODUCTION BUILD',
      icon: Layers3,
    },
    {
      number: '04',
      phase: 'REFINE',
      verb: 'PRESSURIZE',
      detail: 'Test every device and edge case, remove friction, tune every frame, and make performance part of the aesthetic.',
      output: 'RELEASE / EVOLVE',
      icon: Gauge,
    },
  ]

  return (
    <section className="process-section" id="process">
      <div className="process-intro">
        <div className="section-tag"><span>04</span> / OPERATING SYSTEM</div>
        <Reveal>
          <p>NO BLACK BOX.<br /><i>JUST A CLEAR PROCESS</i><br />BUILT AROUND MAKING.</p>
        </Reveal>
      </div>
      <div className="process-list">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.article
              className="process-row"
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75, delay: index * 0.06 }}
            >
              <div className="process-number">{step.number}</div>
              <div className="process-icon"><Icon /></div>
              <div className="process-title"><small>{step.phase}</small><h3>{step.verb}</h3></div>
              <p>{step.detail}</p>
              <span className="process-output"><Check /> {step.output}</span>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

function PlaygroundSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reading, setReading] = useState(false)
  const readerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activePaper = researchPapers[activeIndex]

  useEffect(() => {
    if (!reading) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setReading(false)
        return
      }

      if (event.key !== 'Tab' || !readerRef.current) return
      const focusable = Array.from(readerRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'))
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      openerRef.current?.focus()
    }
  }, [reading])

  const openPaper = (opener: HTMLButtonElement) => {
    openerRef.current = opener
    setReading(true)
  }

  const moveTabFocus = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    const backwards = event.key === 'ArrowUp' || event.key === 'ArrowLeft'
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? researchPapers.length - 1
        : (index + (backwards ? -1 : 1) + researchPapers.length) % researchPapers.length
    setActiveIndex(nextIndex)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <section className="playground" id="research">
      <div className="research-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <div className="research-title-row">
        <div>
          <div className="section-tag"><span>05</span> / WRITTEN INQUIRY</div>
          <h2>THE READING<br /><i>ROOM.</i></h2>
        </div>
        <p>An evolving shelf of arguments on computation, perception, and culture. Each paper begins as a marginal note, becomes a prototype, and returns here as a text.</p>
      </div>
      <div className="research-library">
        <div className="research-shelf" role="tablist" aria-label="Research paper index">
          <span className="shelf-caption">SELECTED PAPERS / VOL. I—V</span>
          {researchPapers.map((paper, index) => (
            <button
              key={paper.id}
              ref={(element) => { tabRefs.current[index] = element }}
              id={`paper-tab-${index}`}
              type="button"
              role="tab"
              className={activeIndex === index ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => moveTabFocus(event, index)}
              aria-selected={activeIndex === index}
              aria-controls="research-paper-panel"
              tabIndex={activeIndex === index ? 0 : -1}
              style={{ '--spine-accent': paper.accent } as CSSProperties}
            >
              <span>VOL. {String(index + 1).padStart(2, '0')}</span>
              <strong>{paper.title}</strong>
              <small>{paper.year}</small>
            </button>
          ))}
          <div className="shelf-edge" aria-hidden="true" />
        </div>
        <div className="reading-desk" style={{ '--paper-accent': activePaper.accent } as CSSProperties}>
          <div className="desk-notes" aria-hidden="true">
            <span>archive copy</span>
            <p>“To read is to enter<br />another system.”</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.button
              key={activePaper.id}
              id="research-paper-panel"
              className="open-manuscript"
              type="button"
              role="tabpanel"
              aria-labelledby={`paper-tab-${activeIndex}`}
              onClick={(event) => openPaper(event.currentTarget)}
              initial={{ opacity: 0, rotateY: -12, y: 24 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              exit={{ opacity: 0, rotateY: 12, y: -16 }}
              transition={{ duration: .75, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="manuscript-leaf manuscript-left">
                <span className="manuscript-folio">{activePaper.id} / {activePaper.status}</span>
                <span className="manuscript-ornament" aria-hidden="true"><i /><b /><i /></span>
                <strong>{activePaper.title}</strong>
                <em>{activePaper.subtitle}</em>
                <span className="manuscript-field">{activePaper.field} / {activePaper.year}</span>
              </span>
              <span className="manuscript-leaf manuscript-right">
                <span className="manuscript-page">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="manuscript-dropcap">{activePaper.abstract.charAt(0)}</span>
                <span className="manuscript-abstract">{activePaper.abstract.slice(1)}</span>
                <span className="manuscript-rule" />
                <span className="manuscript-action">Open paper <ArrowUpRight /></span>
                <span className="manuscript-marginalia">working paper<br />private circulation</span>
              </span>
            </motion.button>
          </AnimatePresence>
          <div className="desk-pencil" aria-hidden="true" />
        </div>
      </div>
      <AnimatePresence>
        {reading ? (
          <motion.div ref={readerRef} className="paper-reader" role="dialog" aria-modal="true" aria-labelledby="paper-reader-title" aria-describedby="paper-reader-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setReading(false) }}>
            <motion.div className="paper-reader-sheet" initial={{ y: '100%', rotateX: -8 }} animate={{ y: 0, rotateX: 0 }} exit={{ y: '100%', rotateX: 8 }} transition={{ duration: .9, ease: [0.76, 0, 0.24, 1] }}>
              <button type="button" ref={closeButtonRef} className="paper-reader-close" onClick={() => setReading(false)}>Close paper <span aria-hidden="true">×</span></button>
              <div className="paper-reader-meta"><span>{activePaper.id}</span><span>{activePaper.field}</span><span>{activePaper.year}</span></div>
              <div className="paper-reader-heading">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                <h2 id="paper-reader-title">{activePaper.title}</h2>
                <p id="paper-reader-subtitle">{activePaper.subtitle}</p>
              </div>
              <div className="paper-reader-body">
                <div><span>Abstract</span><p>{activePaper.abstract}</p></div>
                <blockquote>“The interface is not a container for the argument. It is part of the argument.”</blockquote>
                <div><span>Research position</span><p>This work combines prototype-led inquiry, comparative observation, and visual systems analysis. The paper remains open: each implementation is treated as evidence, not illustration.</p></div>
              </div>
              <div className="paper-reader-keywords">{activePaper.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
              <div className="paper-reader-nav">
                <button type="button" onClick={() => setActiveIndex((activeIndex + researchPapers.length - 1) % researchPapers.length)}>Previous paper</button>
                <span>{String(activeIndex + 1).padStart(2, '0')} / {String(researchPapers.length).padStart(2, '0')}</span>
                <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % researchPapers.length)}>Next paper</button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
    { name: 'INTERFACE', items: technologies.slice(0, 4) },
    { name: 'MOTION', items: technologies.slice(4, 8) },
    { name: 'SYSTEMS', items: technologies.slice(8, 12) },
    { name: 'EXPERIMENT', items: technologies.slice(12, 16) },
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
          {groups.map((group, groupIndex) => (
            <motion.div className="tech-group" key={group.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: groupIndex * .08 }}>
              <span>{String(groupIndex + 1).padStart(2, '0')} / {group.name}</span>
              <div>
                {group.items.map((technology) => (
                  <button key={technology} className={activeTech === technology ? 'is-active' : ''} onMouseEnter={() => setActiveTech(technology)} onFocus={() => setActiveTech(technology)} onClick={() => setActiveTech(technology)}>
                    <span>{technology}</span><ArrowUpRight />
                  </button>
                ))}
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

function PhoneScreen({ theme, active }: { theme: string; active: boolean }) {
  if (theme === 'weather') {
    return (
      <div className="device-ui weather-ui">
        <div className="mobile-status"><span>9:41</span><span><i /><i /><b /></span></div>
        <div className="weather-mobile-head"><span>NEW YORK CITY</span><button aria-label="Weather menu"><i /><i /></button></div>
        <div className="weather-mobile-copy"><small>THURSDAY / SEP 08</small><strong>18°</strong><span>FEELS LIKE 16°</span></div>
        <motion.div className="mobile-weather-planet" animate={{ rotate: active ? 180 : 0 }} transition={{ duration: 8, ease: 'linear' }}>
          <i /><i /><i />
        </motion.div>
        <div className="weather-mobile-stats">
          <div><span>WIND</span><strong>12 <small>KM/H</small></strong></div>
          <div><span>HUMIDITY</span><strong>67<small>%</small></strong></div>
          <div><span>VISIBILITY</span><strong>9.2 <small>KM</small></strong></div>
        </div>
        <div className="mobile-forecast">
          {['NOW', '11', '12', '13', '14'].map((hour, index) => <div className={index === 0 ? 'is-current' : ''} key={hour}><span>{hour}</span><i /><strong>{18 + index}°</strong></div>)}
        </div>
      </div>
    )
  }

  return (
    <div className="device-ui memory-ui">
      <div className="mobile-status"><span>9:41</span><span><i /><i /><b /></span></div>
      <div className="memory-mobile-head"><span>SM / 0432</span><Asterisk /></div>
      <div className="memory-mobile-title"><small>AN ORAL HISTORY ARCHIVE</small><strong>MEMORY<br />IS A <i>PLACE.</i></strong></div>
      <motion.div className="memory-mobile-disc" animate={{ rotate: active ? 360 : 0 }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}><i /><b /></motion.div>
      <div className="memory-wave" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i style={{ height: `${15 + ((index * 17) % 48)}%` }} key={index} />)}</div>
      <div className="memory-player"><button aria-label="Play story"><Play /></button><div><strong>THE BLUE HOUSE</strong><span>ALMA REYES / 04:32</span></div><span>02:17</span></div>
      <div className="memory-mobile-footer"><span>DISCOVER</span><span>ARCHIVE</span><span>ABOUT</span></div>
    </div>
  )
}

function LaptopScreen({ active }: { active: boolean }) {
  return (
    <div className="device-ui noir-ui">
      <div className="noir-browser-bar"><span><i /><i /><i /></span><b>NOIR.SYSTEMS / COLLECTION_06</b><span>EN / USD</span></div>
      <div className="noir-site-nav"><strong>NØIR</strong><div><span>COLLECTIONS</span><span>OBJECTS</span><span>STUDIO</span></div><span>BAG / 02</span></div>
      <div className="noir-screen-hero">
        <div className="noir-screen-copy"><small>EDITION / 006</small><strong>FORM<br />FOLLOWS<br /><i>FEELING.</i></strong><button>EXPLORE COLLECTION <ArrowUpRight /></button></div>
        <div className="noir-product-stage">
          <motion.div className="noir-product" animate={{ y: active ? [-5, 5, -5] : 0, rotate: active ? [-1, 1, -1] : 0 }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><i /><i /><b /></motion.div>
          <span>OBJECT 014<br />ENGINEERED WOOL</span>
          <div className="noir-index">01 <i /> 06</div>
        </div>
      </div>
      <motion.div className="noir-screen-ticker" animate={{ x: active ? ['0%', '-50%'] : '0%' }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}><span>NEW FORMS / RESPONSIBLE MATERIALS / MADE IN NEW YORK / NEW FORMS / RESPONSIBLE MATERIALS / MADE IN NEW YORK /</span></motion.div>
    </div>
  )
}

function PhoneDevice({ theme, active }: { theme: string; active: boolean }) {
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
          <div className="phone-screen"><PhoneScreen theme={theme} active={active} /><div className="screen-reflection" /></div>
          <div className="phone-island"><div className="phone-speaker" /><div className="phone-camera"><i /></div></div>
          <div className="phone-home-indicator" />
        </div>
      </div>
      <div className="phone-port" aria-hidden="true"><i /><i /><i /><i /><b /></div>
      <div className="phone-floor-shadow" />
    </div>
  )
}

function LaptopDevice({ active }: { active: boolean }) {
  return (
    <div className="laptop-pro">
      <div className="laptop-pro-display">
        <div className="laptop-pro-shell" />
        <div className="laptop-pro-bezel">
          <div className="laptop-pro-camera"><i /></div>
          <div className="laptop-pro-screen"><LaptopScreen active={active} /><div className="screen-reflection" /></div>
        </div>
        <div className="laptop-pro-lid-edge lid-edge-left" />
        <div className="laptop-pro-lid-edge lid-edge-right" />
        <div className="laptop-pro-lid-edge lid-edge-top" />
        <div className="laptop-pro-lid-edge lid-edge-bottom" />
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
      <div className="showcase-type" aria-hidden="true">
        <motion.span
          className="showcase-type-main"
          initial={{ opacity: 0, x: '-12%', filter: 'blur(14px)' }}
          whileInView={{ opacity: 1, x: '0%', filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {project.title.replace('\n', ' ')}
        </motion.span>
        <span className="showcase-type-echo">{project.title.replace('\n', ' ')}</span>
        <span className="showcase-type-discipline">{project.type.replace(' / ', '  +  ')}</span>
      </div>
      <motion.div
        className="device-motion-stage"
        initial={{ opacity: 0, y: isPhone ? 180 : 140, rotateX: isPhone ? -24 : 14, rotateY: isPhone ? -42 : 24, scale: 0.68 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.34 }}
        transition={{ type: 'spring', stiffness: 72, damping: 17, mass: 1.05 }}
      >
        <motion.div
          className="device-tilt-stage"
          style={{ rotateX: tiltX, rotateY: tiltY, y: lift }}
        >
          {isPhone ? <PhoneDevice theme={project.theme} active={hovered} /> : <LaptopDevice active={hovered} />}
        </motion.div>
      </motion.div>
      <motion.div className="view-project" animate={{ scale: hovered ? 1 : 0, rotate: hovered ? 0 : -45 }}>
        VIEW<br />CASE <ArrowUpRight size={15} />
      </motion.div>
      <span className="visual-title">{project.title.replace('\n', ' / ')}</span>
    </motion.div>
  )
}

function Project({ project, position }: { project: typeof projects[number], position: number }) {
  return (
    <article className={`project project-${position + 1}`}>
      <Reveal className="project-meta">
        <span>{project.index} / 03</span>
        <span>{project.type}</span>
        <span>{project.year}</span>
      </Reveal>
      <Reveal><ProjectArt project={project} /></Reveal>
      <Reveal className="project-info">
        <h3>{project.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
        <div className="project-details">
          <p>{project.description}</p>
          <div className="project-outcome"><span>PLATFORM <b>{project.platform}</b></span><span>OUTCOME <b>{project.result}</b></span></div>
          <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </Reveal>
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
  const heroY = useTransform(scrollYProgress, [0, 0.2], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <>
      <Loader />
      <Cursor />
      <PointerGlow />
      <ScrollCoordinates />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Header />
      <main id="top">
        <section className="hero">
          <WebGLHero />
          <div className="hero-coordinate">40.7128° N<br />74.0060° W</div>
          <motion.div className="hero-copy" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="eyebrow"><span>CREATIVE DEVELOPER</span><span>BASED IN NEW YORK</span></div>
            <h1>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>BUILDING</motion.span>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}><em>DIGITAL</em> SYSTEMS</motion.span>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>FOR THE UNREAL.</motion.span>
            </h1>
          </motion.div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /><p>DESIGN / CODE / MOTION<br />IN ONE CONTINUOUS SYSTEM</p></div>
          <div className="hero-systems" aria-hidden="true">
            <span><Activity /> GPU READY</span>
            <span><Globe2 /> LAT 40.7128</span>
            <span><Binary /> BUILD 26.09.08</span>
          </div>
        </section>

        <MetricsStrip />

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
              <p>Experiments, technical breakdowns, references, and unfinished thoughts. No growth hacks. No weekly obligation.</p>
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
