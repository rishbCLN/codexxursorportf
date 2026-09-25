import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useWebGLResilience } from './useWebGLResilience'
import { Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import {
  siBlender,
  siCplusplus,
  siDocker,
  siFigma,
  siFramer,
  siGit,
  siGo,
  siGraphql,
  siGreensock,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPython,
  siReact,
  siRust,
  siSass,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVite,
  siWebassembly,
  siWebgl,
  siWebgpu,
} from 'simple-icons'
import { TOOLKIT_CLUSTERS, TOOLKIT_TOOLS } from './toolkitData'

/*
  THE ORBIT — the toolkit as real 3D brand logos revolving around a central
  slab of refractive glass ("the mind").

  Each tool's official logo (from simple-icons) is parsed and EXTRUDED into a
  thick, bevelled 3D mesh in its own brand colour, then set on one of four
  tilted orbital rings — one ring per lobe (LANGUAGES / INTERFACE / 3D·MOTION /
  SYSTEMS). The rings revolve continuously like an orrery. Scroll advances a
  `focus` across the four lobes: the focused ring swells and brightens and its
  logos glow, while the others recede and dim. Hovering a tool in the DOM
  overlay pulls its logo toward the camera and makes it flare.

  All motion is a pure function of scroll progress + hover state, passed in as
  framer-motion MotionValues so the WebGL stays in lockstep with the crisp DOM
  text layered on top (see TechnologySection in App.tsx).
*/

// Resolve the toolkitData `si` slug -> the real simple-icons record. Kept as an
// explicit map so tree-shaking only bundles the logos we actually orbit.
const ICONS: Record<string, { path: string; hex: string }> = {
  siJavascript,
  siTypescript,
  siCplusplus,
  siPython,
  siRust,
  siGo,
  siReact,
  siNextdotjs,
  siTailwindcss,
  siFigma,
  siHtml5,
  siSass,
  siThreedotjs,
  siWebgl,
  siWebgpu,
  siGreensock,
  siFramer,
  siBlender,
  siNodedotjs,
  siVite,
  siWebassembly,
  siDocker,
  siGraphql,
  siGit,
}

const CLUSTER_COLORS = TOOLKIT_CLUSTERS.map((c) => new THREE.Color(c.accent))
// Logos per lobe — the orbit spaces each ring's logos evenly regardless of count.
const CLUSTER_SIZE = TOOLKIT_CLUSTERS.map((c) => c.items.length)

// --- Orbital geometry (module-level, computed once) ----------------------

const RING_RADIUS = [2.35, 2.85, 3.25, 3.65]
const RING_TILT = [
  new THREE.Euler(0.0, 0.0, 0.0),
  new THREE.Euler(1.15, 0.4, 0.0),
  new THREE.Euler(-0.7, 0.9, 0.3),
  new THREE.Euler(0.5, -1.2, -0.2),
]
const RING_MATRIX = RING_TILT.map((e) => new THREE.Matrix4().makeRotationFromEuler(e))
const RING_SPIN = [0.1, -0.08, 0.092, -0.11] // rad/s revolution, alternating

const CAM = new THREE.Vector3(0, 0.5, 9.4)
const LOGO_FIT = 1.05 // world size a logo is normalised to (largest of w/h)

// Shared temporaries so useFrame does no per-frame allocation.
const _pos = new THREE.Vector3()
const _dir = new THREE.Vector3()
const _quat = new THREE.Quaternion()
const _ZAXIS = new THREE.Vector3(0, 0, 1)
const _screen = new THREE.Vector3()
const _right = new THREE.Vector3()
const _up = new THREE.Vector3()
const _push = new THREE.Vector3()

// Cursor-repulsion tuning: logos get bumped away when the pointer sweeps over
// them, then spring back. Kept SHORT so a knocked logo never wanders far from
// its orbit / the central glass sphere (and never drifts out to clip the
// section edge). The offset cap is further scaled by the aspect-fit factor at
// runtime, so on a narrow phone the wander is tiny.
const CURSOR_R = 0.72 // hover radius in aspect-corrected NDC (bigger = more sensitive)
const CURSOR_FORCE = 20 // shove strength
const SPRING_K = 17 // pull back to the orbit slot (lower = floatier, travels further)
const SPRING_DAMP = 3.6 // lower = more springy wobble before it settles
const MAX_OFFSET = 1.0 // how far a logo can be knocked (reined in — stays near the sphere)

// Aspect-fit: the orbit + mind are authored to fill a ~desktop-width frustum.
// On a narrower/portrait frame the horizontal world extent shrinks, so we scale
// the whole constellation DOWN to keep the outer ring (and every logo) inside
// the frame instead of overflowing/clipping. Never scales ABOVE 1, so desktop
// is pixel-for-pixel unchanged. DESIGN_WIDTH ≈ the world width at the orbit
// plane on desktop (fov 34, z 8.4).
const DESIGN_WIDTH = 8.3
const MIN_FIT = 0.42
function fitFor(viewportWidth: number): number {
  return THREE.MathUtils.clamp(viewportWidth / DESIGN_WIDTH, MIN_FIT, 1)
}

// --- Extruded-logo geometry ---------------------------------------------

const geometryCache = new Map<string, THREE.BufferGeometry>()

// Fallback record so a slug missing from the ICONS map can't throw at render.
const MISSING_ICON = { path: 'M2 2h20v20H2z', hex: 'b8a0ff' }

function buildLogoGeometry(pathStr: string): THREE.BufferGeometry {
  const cached = geometryCache.get(pathStr)
  if (cached) return cached

  // A malformed / self-intersecting SVG path can make ExtrudeGeometry throw
  // during triangulation. Since these logos are built inside render, an
  // uncaught throw here would blank the whole scene — so fall back to a simple
  // rounded slab for that one logo instead of taking everything down.
  let geometry: THREE.BufferGeometry
  try {
    const loader = new SVGLoader()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${pathStr}"/></svg>`
    const parsed = loader.parse(svg)

    const shapes: THREE.Shape[] = []
    for (const p of parsed.paths) shapes.push(...SVGLoader.createShapes(p))
    if (!shapes.length) throw new Error('no shapes parsed from icon path')

    const extruded = new THREE.ExtrudeGeometry(shapes, {
      depth: 3,
      bevelEnabled: true,
      bevelThickness: 0.6,
      bevelSize: 0.35,
      bevelSegments: 2,
      curveSegments: 14,
    })
    // Centre, flip the SVG's Y-down axis, then normalise to a consistent size.
    extruded.center()
    extruded.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1))
    extruded.computeVertexNormals()
    extruded.computeBoundingBox()
    const size = new THREE.Vector3()
    extruded.boundingBox!.getSize(size)
    const s = LOGO_FIT / Math.max(size.x || 1, size.y || 1)
    extruded.scale(s, s, s)
    geometry = extruded
  } catch (err) {
    console.error('[ToolkitCortex] failed to build logo geometry, using fallback', err)
    geometry = new THREE.BoxGeometry(LOGO_FIT * 0.8, LOGO_FIT * 0.8, 0.5)
  }

  geometryCache.set(pathStr, geometry)
  return geometry
}

// Brand colours are used as-is, except near-black logos (Next.js, Three.js,
// Rust) get lifted to a warm off-white so they read on the dark stage.
function displayColor(hex: string): THREE.Color {
  const c = new THREE.Color(`#${hex}`)
  const luma = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b
  if (luma < 0.16) return new THREE.Color('#efe9ff')
  return c
}

// --- One orbiting logo ---------------------------------------------------

function Logo({
  index,
  coarse,
  fit,
}: {
  index: number
  coarse: boolean
  fit: MutableRefObject<number>
}) {
  const tool = TOOLKIT_TOOLS[index]
  const ring = tool.cluster
  const slot = tool.local
  const icon = ICONS[tool.si] ?? MISSING_ICON

  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const geometry = useMemo(() => buildLogoGeometry(icon.path), [icon.path])
  const color = useMemo(() => displayColor(icon.hex), [icon.hex])
  const seed = useMemo(() => Math.random() * 10, [])

  const scaleAmt = useRef(0.9)
  const emissiveAmt = useRef(0.3)
  const offset = useRef(new THREE.Vector3())
  const velocity = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 0.05) // clamp so a tab-switch stutter can't fling logos
    const t = state.clock.elapsedTime
    const k = Math.min(1, dt * 6)

    // Orbit position: a point on the ring's tilted circle around the mind.
    // Slots are spaced evenly around the full ring by the lobe's logo count.
    const angle = slot * ((Math.PI * 2) / CLUSTER_SIZE[ring]) + t * RING_SPIN[ring]
    const r = RING_RADIUS[ring]
    _pos.set(Math.cos(angle) * r, 0, Math.sin(angle) * r).applyMatrix4(RING_MATRIX[ring])

    // Face the camera so the logo stays readable.
    _dir.copy(CAM).sub(_pos).normalize()

    // --- Cursor push: if the pointer sweeps near this logo on screen, shove it
    // away in the camera plane; a spring pulls it back to its orbit slot. On
    // touch/coarse pointers this is skipped entirely — there's no real hover
    // cursor, and scroll-driven pointer values would otherwise knock logos
    // adrift from the sphere. ---
    const off = offset.current
    const vel = velocity.current
    const cam = state.camera
    if (!coarse) {
      _screen.copy(_pos).project(cam)
      if (_screen.z < 1) {
        const aspect = state.size.width / Math.max(1, state.size.height)
        const dx = (_screen.x - state.pointer.x) * aspect
        const dy = _screen.y - state.pointer.y
        const dist = Math.hypot(dx, dy)
        if (dist < CURSOR_R) {
          // eased falloff — a near-direct hit shoves much harder than a graze
          const n = 1 - dist / CURSOR_R
          const strength = n * n
          const inv = dist > 1e-4 ? 1 / dist : 0
          _right.setFromMatrixColumn(cam.matrixWorld, 0)
          _up.setFromMatrixColumn(cam.matrixWorld, 1)
          _push.copy(_right).multiplyScalar(dx * inv).addScaledVector(_up, dy * inv)
          vel.addScaledVector(_push, strength * CURSOR_FORCE * dt)
        }
      }
    }
    // spring back toward the slot + damping
    vel.addScaledVector(off, -SPRING_K * dt)
    vel.multiplyScalar(Math.max(0, 1 - SPRING_DAMP * dt))
    off.addScaledVector(vel, dt)
    // Cap the wander, tightened further on narrow frames (fit<1) so a knocked
    // logo can never drift far from the sphere or out to the section edge.
    const maxOff = MAX_OFFSET * fit.current
    if (off.lengthSq() > maxOff * maxOff) off.setLength(maxOff)
    _pos.add(off)

    g.position.copy(_pos)
    _quat.setFromUnitVectors(_ZAXIS, _dir)
    g.quaternion.copy(_quat)
    // gentle idle sway so bevels catch the light
    g.rotateZ(Math.sin(t * 0.6 + seed) * 0.08)

    const targetScale = 1.0
    const targetEmissive = 0.3
    scaleAmt.current = THREE.MathUtils.lerp(scaleAmt.current, targetScale, k)
    emissiveAmt.current = THREE.MathUtils.lerp(emissiveAmt.current, targetEmissive, k)
    g.scale.setScalar(scaleAmt.current)
    if (mat.current) mat.current.emissiveIntensity = emissiveAmt.current
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.5}
          roughness={0.28}
          envMapIntensity={1.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// --- Faint guide ring showing each orbit path ----------------------------

function RingGuide({ ring }: { ring: number }) {
  const accent = useMemo(() => CLUSTER_COLORS[ring], [ring])

  return (
    <group rotation={RING_TILT[ring]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_RADIUS[ring], 0.012, 8, 160]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// --- The mind (central refractive glass + lattice) -----------------------

function Mind({ accent }: { accent: MotionValue<string> }) {
  const core = useRef<THREE.Group>(null)
  const coreMat = useRef<THREE.MeshBasicMaterial>(null)
  const coreColor = useMemo(() => new THREE.Color('#e7b65c'), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (core.current) {
      core.current.rotation.y = t * 0.08
      core.current.rotation.x = Math.sin(t * 0.12) * 0.15
    }
    if (coreMat.current) {
      coreColor.set(accent.get())
      coreMat.current.color.copy(coreColor)
      // slow breathing glow so the mind feels alive inside the glass
      coreMat.current.opacity = 0.5 + Math.sin(t * 1.1) * 0.14
    }
  })

  return (
    <group ref={core}>
      {/* outer refractive glass shell — smooth sphere, no facets */}
      <mesh>
        <sphereGeometry args={[1.15, 96, 96]} />
        <MeshTransmissionMaterial
          transmissionSampler
          backside={false}
          transmission={1}
          thickness={1.6}
          ior={1.4}
          roughness={0.06}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.12}
          distortionScale={0.25}
          temporalDistortion={0.06}
          color="#f4ecff"
          attenuationColor="#ffd9a0"
          attenuationDistance={2.4}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* inner accent-lit spark the glass refracts — reads as "the mind" */}
      <mesh scale={0.34}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          ref={coreMat}
          color="#e7b65c"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function AccentLight({ accent }: { accent: MotionValue<string> }) {
  const light = useRef<THREE.PointLight>(null)
  useFrame(() => {
    if (light.current) light.current.color.set(accent.get())
  })
  return <pointLight ref={light} position={[0, 1.5, 4.5]} intensity={40} distance={22} decay={2} />
}

// --- Scene ---------------------------------------------------------------

function Scene({
  accent,
  coarse,
}: {
  accent: MotionValue<string>
  coarse: boolean
}) {
  // Aspect-fit scale for the whole constellation. Recomputed from the live
  // viewport width and applied to the root group each frame, so the outer ring
  // + every logo stay inside a narrow/portrait frame instead of clipping. The
  // ref is shared with each Logo so the wander cap scales down with it too.
  const viewportWidth = useThree((s) => s.viewport.width)
  const fit = useRef(fitFor(viewportWidth))
  const root = useRef<THREE.Group>(null)
  useFrame(() => {
    fit.current = fitFor(viewportWidth)
    if (root.current) root.current.scale.setScalar(fit.current)
  })

  return (
    <>
      <color attach="background" args={['#0a0810']} />
      <fog attach="fog" args={['#0a0810', 10, 26]} />

      <ambientLight intensity={0.55} color="#8a7aa0" />
      <directionalLight position={[4, 5, 6]} intensity={1.6} color="#ffe9c2" />
      <directionalLight position={[-6, -2, 2]} intensity={0.7} color="#8fb2ff" />
      <AccentLight accent={accent} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#070510']} />
        <Lightformer form="rect" intensity={3} color="#fff0d6" scale={[10, 10, 1]} position={[0, 6, -9]} />
        <Lightformer form="ring" intensity={2.4} color="#9fd0ff" scale={[6, 6, 1]} position={[-9, 1, -3]} />
        <Lightformer form="circle" intensity={2.2} color="#ffb27a" scale={[6, 6, 1]} position={[9, -2, -3]} />
      </Environment>

      <group ref={root}>
        <Mind accent={accent} />
        {[0, 1, 2, 3].map((ring) => (
          <RingGuide key={ring} ring={ring} />
        ))}
        {TOOLKIT_TOOLS.map((_, index) => (
          <Logo key={index} index={index} coarse={coarse} fit={fit} />
        ))}
      </group>
    </>
  )
}

export default function ToolkitCortex({
  accent,
  coarse = false,
}: {
  accent: MotionValue<string>
  coarse?: boolean
}) {
  const { canvasKey, onCreated } = useWebGLResilience()
  return (
    <div className="toolkit-canvas" aria-hidden="true">
      <Canvas
        key={canvasKey}
        onCreated={onCreated}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0.5, 8.4], fov: 34 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene accent={accent} coarse={coarse} />
        </Suspense>
      </Canvas>
    </div>
  )
}
