import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useWebGLResilience } from './useWebGLResilience'
import { Environment, Lightformer, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useMemo, useRef } from 'react'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { siGithub, siGmail } from 'simple-icons'

/*
  THE CONSTELLATION — the contact section as three levitating crystal prisms,
  each refracting the environment and cradling a glowing, extruded 3D brand mark
  (GitHub / LinkedIn / Gmail). A single `focus` MotionValue (-1 = idle, else the
  hovered/focused node index) is driven by the DOM cards in App.tsx and read here
  every frame, so the WebGL stays in perfect lockstep with the crisp DOM CTAs
  layered on top. When a node is focused its prism swells, rides forward, and
  flares; its siblings recede and dim. Bloom turns the emissive marks + acid
  sparks into real light.

  The SVG->ExtrudeGeometry logo pipeline mirrors ToolkitCortex.tsx so the two
  scenes share one proven, crash-safe approach to brand geometry.
*/

// The acid signal — unifies all three prisms regardless of brand colour.
const ACID = '#e7b65c'
const LOGO_FIT = 1.05 // world size a logo's largest axis is normalised to
const CAMERA_Z = 9 // must match the <Canvas camera> z — used to aim each prism's mark at the lens

type Brand = { path: string; hex: string }

// LinkedIn was pulled from simple-icons over trademark policy, so its official
// glyph path is embedded directly (same 24x24 shape ExtrudeGeometry consumes).
const siLinkedinPath =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'

// Brand marks lifted to read on the dark stage: GitHub's near-black becomes warm
// paper, LinkedIn/Gmail keep a brightened brand hue. The acid glow ties them together.
const NODES: { key: string; icon: Brand; tint: string }[] = [
  { key: 'github', icon: siGithub, tint: '#f2f1eb' },
  { key: 'linkedin', icon: { path: siLinkedinPath, hex: '0A66C2' }, tint: '#6fb2e8' },
  { key: 'gmail', icon: siGmail, tint: '#ef5b4c' },
]

// --- Extruded-logo geometry (cached; crash-safe) -------------------------

const geometryCache = new Map<string, THREE.BufferGeometry>()

function buildLogoGeometry(pathStr: string): THREE.BufferGeometry {
  const cached = geometryCache.get(pathStr)
  if (cached) return cached

  // A malformed / self-intersecting path can make ExtrudeGeometry throw during
  // triangulation; fall back to a slab for that one mark instead of blanking
  // the whole scene.
  let geometry: THREE.BufferGeometry
  try {
    const loader = new SVGLoader()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${pathStr}"/></svg>`
    const parsed = loader.parse(svg)

    const shapes: THREE.Shape[] = []
    for (const p of parsed.paths) shapes.push(...SVGLoader.createShapes(p))
    if (!shapes.length) throw new Error('no shapes parsed from icon path')

    const extruded = new THREE.ExtrudeGeometry(shapes, {
      depth: 4,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 0.5,
      bevelSegments: 3,
      curveSegments: 16,
    })
    extruded.center()
    extruded.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1)) // SVG is y-down
    extruded.computeVertexNormals()
    extruded.computeBoundingBox()
    const size = new THREE.Vector3()
    extruded.boundingBox!.getSize(size)
    const s = LOGO_FIT / Math.max(size.x || 1, size.y || 1)
    extruded.scale(s, s, s)
    geometry = extruded
  } catch (err) {
    console.error('[ContactConstellation] logo geometry failed, using fallback', err)
    geometry = new THREE.BoxGeometry(LOGO_FIT * 0.8, LOGO_FIT * 0.8, 0.5)
  }

  geometryCache.set(pathStr, geometry)
  return geometry
}

// A soft radial-falloff texture for the levitation pool: encoded as grayscale in
// the RGB channels (three reads the green channel for `alphaMap`), so the disc
// dissolves at its rim instead of ending on a hard circular edge. Built once and
// shared by every prism.
let glowTextureCache: THREE.CanvasTexture | null = null
function getGlowTexture(): THREE.CanvasTexture {
  if (glowTextureCache) return glowTextureCache
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.32, 'rgba(150,150,150,1)')
  grad.addColorStop(0.7, 'rgba(40,40,40,1)')
  grad.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  glowTextureCache = tex
  return tex
}

// Faceted crystal, built once and shared: an icosahedron made non-indexed so each
// of its 20 faces gets a hard flat normal — many sharp refractive facets that
// catch light as it spins — then stretched tall into a gem/prism.
function useCrystalGeometry() {
  return useMemo(() => {
    // A sharp-faceted gem: an icosahedron made non-indexed so each face gets a
    // hard flat normal (every facet catches light on its own). It's elongated
    // into a prism and grown ~1.6x for a bigger, more dimensional read, then the
    // whole solid is tipped off-vertical + phase-rotated so it always presents a
    // corner (never a flat face-on pane) — the fix for the GitHub prism reading
    // flat/"incomplete". The off-vertical tip also makes the continuous spin
    // gently tumble, so more facets sweep the light and it stays solidly 3D.
    const g = new THREE.IcosahedronGeometry(1, 0).toNonIndexed()
    g.scale(1.0, 1.6, 1.0)
    g.rotateZ(0.18)
    g.rotateY(0.5)
    g.computeVertexNormals()
    return g
  }, [])
}

// --- One levitating prism ------------------------------------------------

const LIFT = 0.4 // world units a prism springs up when hovered (trimmed so the spring peak clears the top of the frustum ~±2.58)
const BOB = 0.1 // idle vertical hover amplitude (the "game pickup" float)

function Prism({
  index,
  node,
  focus,
  reduced,
  spread,
  baseY,
}: {
  index: number
  node: { key: string; icon: Brand; tint: string }
  focus: MotionValue<number>
  reduced: boolean
  spread: number
  baseY: number
}) {
  const inner = useRef<THREE.Group>(null) // bobs + springs up
  const crystal = useRef<THREE.Mesh>(null) // the glass shell — spins freely
  const logo = useRef<THREE.Group>(null) // stays camera-facing, subtle sway
  const iconMat = useRef<THREE.MeshStandardMaterial>(null)
  const sparkMat = useRef<THREE.MeshBasicMaterial>(null)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null)
  const glowMesh = useRef<THREE.Mesh>(null) // the pool scales with the prism's rise

  const crystalGeo = useCrystalGeometry()
  const glowTex = useMemo(() => getGlowTexture(), [])
  const logoGeo = useMemo(() => buildLogoGeometry(node.icon.path), [node.icon.path])
  const tint = useMemo(() => new THREE.Color(node.tint), [node.tint])
  const seed = useMemo(() => index * 1.9, [index])

  // Eased state so hover reactions glide rather than snap.
  const mine = useRef(0) // 1 when THIS node is focused
  const field = useRef(0) // 1 when ANY node is focused
  // A real spring (position + velocity) drives the hover rise, so the prism
  // springs up with a touch of overshoot instead of easing linearly.
  const lift = useRef(0)
  const liftVel = useRef(0)

  useFrame((state, delta) => {
    const g = inner.current
    if (!g) return
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 0.05)
    const k = Math.min(1, dt * 7)

    const f = focus.get()
    const isHot = f > -0.5 && Math.round(f) === index
    const anyHot = f > -0.5
    mine.current = THREE.MathUtils.lerp(mine.current, isHot ? 1 : 0, k)
    field.current = THREE.MathUtils.lerp(field.current, anyHot ? 1 : 0, k)
    const m = mine.current
    const other = Math.max(0, field.current - m) // a sibling is the hot one

    // Under-damped spring toward the hover target — the professional "spring up".
    if (reduced) {
      lift.current = isHot ? 1 : 0
      liftVel.current = 0
    } else {
      const target = isHot ? 1 : 0
      const accel = (target - lift.current) * 190 - liftVel.current * 20
      liftVel.current += accel * dt
      lift.current += liftVel.current * dt
    }

    const bob = reduced ? 0 : Math.sin(t * 0.8 + seed) * BOB
    // Focused prism barely swells + rides slightly forward; a passed-over sibling recedes.
    g.position.y = baseY + bob + lift.current * LIFT - other * 0.14
    g.position.z = 0.22 * m - 0.25 * other
    g.scale.setScalar(1 + 0.05 * m - 0.04 * other)

    if (crystal.current) {
      // The glass spins continuously and a hair faster on hover — catches the light.
      crystal.current.rotation.y = reduced ? seed : seed + t * (0.3 + 0.35 * m)
      crystal.current.rotation.x = reduced ? 0 : Math.sin(t * 0.45 + seed) * 0.08
    }
    if (logo.current) {
      // The mark stays facing the camera, only a subtle sway keeps it alive + legible.
      logo.current.rotation.y = reduced ? 0 : Math.sin(t * 0.55 + seed) * 0.2
      logo.current.rotation.x = reduced ? 0 : Math.cos(t * 0.4 + seed) * 0.06
    }
    if (iconMat.current) iconMat.current.emissiveIntensity = 0.25 + 0.5 * m
    if (sparkMat.current) sparkMat.current.opacity = 0.1 + 0.16 * m
    // The pool reads as a real cast light: it brightens + spreads as the prism
    // rises and focuses, and dims when a sibling steals focus.
    if (glowMesh.current) glowMesh.current.scale.setScalar(1 + 0.14 * m + 0.16 * lift.current)
    if (glowMat.current) glowMat.current.opacity = 0.14 + 0.16 * m - 0.05 * other - 0.04 * lift.current
  })

  return (
    // Each prism is yawed so its forward axis points at the camera; the mark that
    // floats OUTSIDE the glass (see the logo group below) then sits exactly on the
    // camera→prism sight line — centred over its gem with no side-prism parallax.
    <group
      position={[spread * (index - 1), 0, 0]}
      rotation={[0, Math.atan2(-(spread * (index - 1)), CAMERA_Z), 0]}
    >
      {/* bobbing / springing assembly */}
      <group ref={inner} position={[0, baseY, 0]}>
        {/* refractive crystal shell — spins freely behind the mark floated in front */}
        <mesh ref={crystal} geometry={crystalGeo}>
          <MeshTransmissionMaterial
            transmissionSampler
            backside
            samples={reduced ? 3 : 6}
            resolution={reduced ? 128 : 256}
            transmission={1}
            thickness={1.5}
            ior={1.45}
            roughness={0.06}
            chromaticAberration={0.14}
            anisotropy={0.22}
            distortion={0.16}
            distortionScale={0.28}
            temporalDistortion={reduced ? 0 : 0.08}
            color="#eae6ff"
            attenuationColor="#ffd9a0"
            attenuationDistance={2.2}
            envMapIntensity={1.3}
          />
        </mesh>

        {/* acid spark cradled at the core — the glow the glass refracts */}
        <mesh position={[0, 0, 0.1]} scale={0.42}>
          <sphereGeometry args={[1, 20, 20]} />
          <meshBasicMaterial
            ref={sparkMat}
            color={ACID}
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* the extruded brand mark, floated OUTSIDE (in front of) the glass so it
            reads crisp + fully lit instead of refracted and dimmed through the gem */}
        <group ref={logo} position={[0, 0, 1.6]} scale={1.0}>
          <mesh geometry={logoGeo}>
            <meshStandardMaterial
              ref={iconMat}
              color={tint}
              emissive={tint}
              emissiveIntensity={0.28}
              metalness={0.4}
              roughness={0.28}
              envMapIntensity={1.4}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      {/* levitation glow pool beneath — a soft radial light-cast (not a hard disc);
          it tightens/spreads and brightens as the prism springs and focuses */}
      <mesh ref={glowMesh} position={[0, baseY - 1.55, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial
          ref={glowMat}
          color={ACID}
          transparent
          opacity={0.14}
          alphaMap={glowTex}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// --- Scene ---------------------------------------------------------------

function Scene({ focus, reduced }: { focus: MotionValue<number>; reduced: boolean }) {
  const viewport = useThree((s) => s.viewport)
  // The canvas is intentionally larger than the visible stage (see the
  // .contact-canvas-layer inset) so a prism can swell / rise on hover without the
  // canvas edge clipping it. We divide that overscan back out here so each prism
  // still lands a third of the STAGE width apart and at the same height as before
  // — the extra canvas is pure headroom, the on-screen placement is unchanged.
  // These MUST mirror the CSS inset: -28% (top/bottom) -24% (left/right).
  const OVERSCAN_X = 0.24
  const OVERSCAN_Y = 0.28
  const PREV_OVERSCAN_Y = 0.12 // the baseY 0.11 factor was tuned at the old -12% inset
  const spread = viewport.width / (3 * (1 + 2 * OVERSCAN_X))
  // Seat the prisms a touch above the canvas centre — rescaled for the new inset.
  // Kept low enough that a focused prism's hover spring-up stays inside the top
  // of the fixed vertical frustum (~+2.58 world units) instead of clipping.
  const baseY = viewport.height * 0.11 * ((1 + 2 * PREV_OVERSCAN_Y) / (1 + 2 * OVERSCAN_Y))

  return (
    <>
      <color attach="background" args={['#070510']} />
      <fog attach="fog" args={['#070510', 9, 27]} />

      <ambientLight intensity={0.5} color="#8a7aa0" />
      <directionalLight position={[4, 5, 6]} intensity={1.4} color="#ffe9c2" />
      <directionalLight position={[-6, -2, 2]} intensity={0.6} color="#8fb2ff" />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#050308']} />
        <Lightformer form="rect" intensity={3} color="#fff0d6" scale={[10, 10, 1]} position={[0, 6, -9]} />
        <Lightformer form="ring" intensity={2.4} color="#9fd0ff" scale={[6, 6, 1]} position={[-9, 1, -3]} />
        <Lightformer form="circle" intensity={2.2} color="#ffb27a" scale={[6, 6, 1]} position={[9, -2, -3]} />
      </Environment>

      {NODES.map((node, i) => (
        <Prism key={node.key} index={i} node={node} focus={focus} reduced={reduced} spread={spread} baseY={baseY} />
      ))}

      <Sparkles count={26} scale={[14, 6, 4]} size={1.6} speed={reduced ? 0 : 0.28} color={ACID} opacity={0.32} />

      <EffectComposer enableNormalPass={false} multisampling={2}>
        <Bloom intensity={0.4} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur radius={0.5} />
      </EffectComposer>
    </>
  )
}

export default function ContactConstellation({
  focus,
  reduced = false,
}: {
  focus: MotionValue<number>
  reduced?: boolean
}) {
  const { canvasKey, onCreated } = useWebGLResilience()
  return (
    <div className="contact-canvas" aria-hidden="true">
      <Canvas
        key={canvasKey}
        onCreated={onCreated}
        dpr={[1, reduced ? 1.3 : 1.8]}
        camera={{ position: [0, 0, CAMERA_Z], fov: 32 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene focus={focus} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  )
}
