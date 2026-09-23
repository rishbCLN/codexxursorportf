import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox, Float, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing'
import { Suspense, useMemo, useRef, useEffect } from 'react'
import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { CAM_Z, WARP_FOV, TUNNEL, warpScrollTravel } from './warp'
import { WarmupProbe } from './WarmupProbe'

/* ---------------------------------------------------------------------------
   WARP FIELD — the deep-space encounters you drift past inside the warp.

   Instead of abstract slapped-on shapes, these are five real, purpose-built and
   visually DISTINCT craft: a communications SATELLITE (foil bus + solar wings +
   dish), a winged SHUTTLE orbiter, a crew CAPSULE (gumdrop command module + heat
   shield + service module), a deep-space PROBE (Voyager-style dish, bus, RTG boom,
   magnetometer mast) and a modular space STATION (pressurised modules + truss +
   solar arrays). Each is highly detailed (PBR metal/foil, env reflections,
   procedural normal/roughness) — not low-poly.

   Every craft renders CRISP at every depth — there is NO depth-of-field blur.
   The more real dimensionality we build into a body, the more we want it razor
   sharp so that geometry reads. Bodies still appear "into existence" from a
   great distance rather than popping in, but the emergence is carried by the
   corridor haze (fog) + an opacity fade-up — not a focus pull.

   Depth is a PURE, DETERMINISTIC function of the hero scroll (no wall-clock
   drift): every body is anchored at a FIXED MILESTONE COORDINATE down the
   corridor, so it sits at the exact same place every time you reach a given
   scroll position — a landmark rendered ahead of you like level geometry in a
   game, never a random fly-in. As you warp forward you approach each milestone,
   it FADES UP out of the far haze, resolves into crisp focus, and — because it
   holds a real off-axis (x, y) — naturally swings out and glides PAST YOUR SIDE
   rather than being flung down the optical axis at your face. Framer MotionValue
   drives the focus + layer fade.
--------------------------------------------------------------------------- */

// Warp travel window these encounters live in (after the ring dive opens the
// hole ~0.70, before the exit ring takes over ~0.88).
const FIELD_IN = 0.7
const FIELD_OUT = 0.885

// The craft are NOT hand-animated on a per-object timeline. They are real bodies
// parked at fixed milestone coordinates down the SAME corridor the stars stream
// through, and the SAME warpScrollTravel() (shared via ./warp) flies the observer
// past them. So an encounter's apparent size, focus, screen position and parallax
// are pure consequences of its true (x, y, z) relative to the camera at the
// current scroll — exactly like the stars. It shares the space, never pasted on.

// Cull bounds in world z. Beyond FAR_CULL a body is lost in the corridor haze;
// past NEAR_CULL it's behind the camera. Between, it's simply rendered by the
// perspective camera at its true depth — no visibility tricks.
const FAR_CULL = CAM_Z - TUNNEL - 6 // ≈ -70
const NEAR_CULL = CAM_Z + 2 // ≈ 8

// Depth (world units, measured up from FAR_CULL) over which a body FADES UP out
// of the corridor haze as we approach it, so it materialises from distance
// instead of popping into frame.
const REVEAL_DEPTH = 18

// GPU WARM-UP. At rest (scroll 0, still behind the loader) only the nearest
// craft is inside the cull window; the other four never render, so their
// geometry upload + shadow-depth program variants + N8AO/Bloom passes are all
// deferred to the FIRST scroll into the warp — a visible hitch exactly when the
// encounters should be gliding in smoothly. For this many rendered frames each
// craft is instead forced visible in a near, in-frustum depth band so it fully
// rasterises, casts/receives its shadow and runs the composer once. The whole
// canvas is CSS opacity:0 at this scroll, so none of it is ever seen — it only
// primes the GPU. WarmupProbe reports the canvas "ready" only AFTER this sweep.
const WARM_FRAMES = 16

type Craft = 'satellite' | 'probe' | 'shuttle' | 'capsule' | 'station'

type Encounter = {
  kind: Craft
  // Fixed MILESTONE COORDINATE in the corridor: [x, y, zBase]. x/y are the real
  // off-axis offset (world units) the body holds forever — small enough to be
  // framed nicely off-centre when it resolves at the focus plane, big enough that
  // as it closes on the lens it swings out and glides PAST YOUR SIDE (never down
  // the axis into your face). zBase is its birth depth; rendered z = zBase +
  // travel(scroll), so bigger magnitude = you reach it LATER in the warp.
  pos: [number, number, number]
  scale: number
  tilt: [number, number, number]
  spin: number // ambient spin speed (rad/s)
}

// Five DISTINCT craft at five fixed milestones. Their (x, y) are scattered around
// the clock (upper-left, right, lower-left, upper-right, left) — NOT a mechanical
// left/right/left alternation — and none sit on the optical axis, so each one
// sweeps past a different side of you. Staggered in depth so their focus beats
// arrive one after another as you warp deeper, never stacked.
const ENCOUNTERS: Encounter[] = [
  { kind: 'satellite', pos: [-1.5, 1.0, -52], scale: 0.9, tilt: [0.5, -0.6, 0.15], spin: 0.12 },
  { kind: 'shuttle', pos: [1.75, -0.5, -74], scale: 0.92, tilt: [0.12, -0.5, 0.28], spin: 0.05 },
  { kind: 'capsule', pos: [-1.35, -1.15, -96], scale: 0.95, tilt: [0.3, 0.5, -0.1], spin: 0.14 },
  { kind: 'probe', pos: [1.5, 1.15, -118], scale: 0.95, tilt: [-0.3, 0.7, -0.2], spin: 0.16 },
  { kind: 'station', pos: [-1.8, 0.35, -140], scale: 1.05, tilt: [-0.15, 0.6, 0.08], spin: 0.045 },
]

/* ----- procedural textures (built once, no network) ---------------------- */

// Crinkled gold multi-layer-insulation foil (satellite/probe bus wrap).
function makeFoil() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = '#c8952f'
  g.fillRect(0, 0, 256, 256)
  // creased facets
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 256
    const y = Math.random() * 256
    const l = 6 + Math.random() * 26
    const a = Math.random() * Math.PI
    g.strokeStyle = `rgba(${Math.random() > 0.5 ? '255,225,150' : '120,80,20'},${0.12 + Math.random() * 0.35})`
    g.lineWidth = 0.5 + Math.random() * 1.5
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 4
  return tex
}

// Solar-array cells: dark silicon grid with bus bars.
function makePanel() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 512
  const g = c.getContext('2d')!
  g.fillStyle = '#0b1f3a'
  g.fillRect(0, 0, c.width, c.height)
  const cols = 6
  const rows = 12
  const cw = c.width / cols
  const rh = c.height / rows
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const grd = g.createLinearGradient(i * cw, j * rh, (i + 1) * cw, (j + 1) * rh)
      grd.addColorStop(0, '#12325c')
      grd.addColorStop(0.5, '#0e2748')
      grd.addColorStop(1, '#1a3f6e')
      g.fillStyle = grd
      g.fillRect(i * cw + 2, j * rh + 2, cw - 4, rh - 4)
    }
  }
  // bus bars
  g.strokeStyle = 'rgba(180,200,230,.5)'
  g.lineWidth = 1.5
  for (let i = 0; i <= cols; i++) {
    g.beginPath()
    g.moveTo(i * cw, 0)
    g.lineTo(i * cw, c.height)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.anisotropy = 4
  return tex
}

// Faint hull panel-lines + micro-speckle as a grayscale BUMP map. This is what
// stops the white orbiter skin reading as a single moulded toy shell: under the
// key light the recessed panel seams and tile grid catch a thin shadow line, so
// the surface has real, believable detail instead of a dead-flat gradient.
function makeHullDetail() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  g.fillStyle = '#808080' // neutral = flat
  g.fillRect(0, 0, 512, 512)
  // fine tile grid (recessed = darker)
  g.strokeStyle = 'rgba(60,60,60,0.55)'
  g.lineWidth = 1
  for (let i = 0; i <= 512; i += 16) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke()
    g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke()
  }
  // bolder structural panel breaks
  g.strokeStyle = 'rgba(40,40,40,0.8)'
  g.lineWidth = 2.5
  for (let i = 0; i < 9; i++) {
    const y = Math.random() * 512
    g.beginPath(); g.moveTo(0, y); g.lineTo(512, y + (Math.random() - 0.5) * 40); g.stroke()
    const x = Math.random() * 512
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (Math.random() - 0.5) * 40, 512); g.stroke()
  }
  // raised speckle (rivets / instrument bumps)
  for (let i = 0; i < 1400; i++) {
    g.fillStyle = `rgba(${180 + Math.random() * 60 | 0},${180 + Math.random() * 60 | 0},${180 + Math.random() * 60 | 0},0.5)`
    g.fillRect(Math.random() * 512, Math.random() * 512, 1, 1)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 4
  return tex
}

// Build an inset, thin "skin" of an extruded shape — used to lay a white upper
// surface over a black wing so the leading edge + underside stay black (the
// orbiter's RCC / HRSI tiles) while the top is white, from primitives alone.
function insetExtrude(shape: THREE.Shape, s: number, depth: number, z: number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false })
  g.computeBoundingBox()
  const c = new THREE.Vector3()
  g.boundingBox!.getCenter(c)
  g.translate(-c.x, -c.y, 0)
  g.scale(s, s, 1)
  g.translate(c.x, c.y, z)
  return g
}

/* ----- craft ------------------------------------------------------------- */

// A solar array built as a real 3D assembly rather than one flat plane: a
// photovoltaic cell substrate set INTO a raised metallic frame with a
// longitudinal spar. The perimeter and spar stand proud of the cells, so under
// the key light they throw thin shadow lines and the N8AO settles into their
// inner corners — the array now reads as a machined, edged panel with genuine
// relief instead of a sheet of cardboard. This is the main "flat -> volumetric"
// upgrade shared by the satellite wings and the station arrays.
function FramedArray({ w, h, panel, thickness = 0.05 }: { w: number; h: number; panel: THREE.Texture; thickness?: number }) {
  const rail = Math.min(w, h) * 0.06 + 0.02 // frame bar cross-section
  const proud = thickness + 0.04 // how far the frame stands off the cells (in Z)
  const frameMat = { color: '#b9bcc4', metalness: 1, roughness: 0.3, envMapIntensity: 1.35 } as const
  return (
    <group>
      {/* photovoltaic cell substrate, recessed inside the frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[w - rail, h - rail, thickness]} />
        <meshStandardMaterial map={panel} metalness={0.45} roughness={0.4} emissive="#0a1a33" emissiveIntensity={0.08} />
      </mesh>
      {/* raised perimeter frame (top/bottom, then sides) */}
      {[h / 2, -h / 2].map((y) => (
        <mesh key={`r${y}`} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[w + rail, rail, proud]} />
          <meshStandardMaterial {...frameMat} />
        </mesh>
      ))}
      {[w / 2, -w / 2].map((x) => (
        <mesh key={`c${x}`} position={[x, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[rail, h + rail, proud]} />
          <meshStandardMaterial {...frameMat} />
        </mesh>
      ))}
      {/* longitudinal spar splitting the cell field */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[rail * 0.7, h - rail, proud * 0.9]} />
        <meshStandardMaterial color="#9a9ca2" metalness={1} roughness={0.34} envMapIntensity={1.2} />
      </mesh>
    </group>
  )
}

// Crew spacecraft: a gumdrop command module (truncated cone) with a dark ablative
// heat shield, cockpit windows and a docking ring, mounted on a foil-wrapped
// service module with a radiator band and a main engine bell. A silhouette that
// reads instantly as "capsule" and shares nothing with the winged orbiter.
function Capsule({ foil }: { foil: THREE.Texture }) {
  const shieldGeo = useMemo(() => {
    // shallow convex ablative shield (a sphere cap)
    const g = new THREE.SphereGeometry(0.72, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.34)
    g.scale(1, 0.5, 1)
    g.rotateX(Math.PI) // dome facing down/-Y
    return g
  }, [])
  const hull = { color: '#d9dce2', metalness: 0.35, roughness: 0.42, clearcoat: 0.4, clearcoatRoughness: 0.35, envMapIntensity: 0.9 }
  return (
    <group>
      {/* command module (gumdrop) — nose +Y */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.62, 0.66, 40, 1, false]} />
        <meshPhysicalMaterial {...hull} />
      </mesh>
      {/* ablative heat shield underneath */}
      <mesh geometry={shieldGeo} position={[0, -0.17, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#241a12" metalness={0.2} roughness={0.85} envMapIntensity={0.4} />
      </mesh>
      {/* three cockpit windows around the cone */}
      {[-0.6, 0.2, 1.1].map((a, i) => (
        <mesh key={i} position={[Math.sin(a) * 0.42, 0.28, Math.cos(a) * 0.42]} rotation={[0, a, 0]}>
          <boxGeometry args={[0.16, 0.11, 0.04]} />
          <meshPhysicalMaterial color="#0a0f19" metalness={0.5} roughness={0.12} clearcoat={1} envMapIntensity={1.6} emissive="#0b1c30" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* docking ring on top */}
      <mesh position={[0, 0.54, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.12, 24]} />
        <meshStandardMaterial color="#9a9ca2" metalness={1} roughness={0.34} envMapIntensity={1.1} />
      </mesh>
      <mesh position={[0, 0.61, 0]}>
        <torusGeometry args={[0.13, 0.025, 12, 24]} />
        <meshStandardMaterial color="#c9ccd2" metalness={1} roughness={0.3} />
      </mesh>
      {/* foil service module below */}
      <mesh position={[0, -0.62, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.7, 36]} />
        <meshStandardMaterial map={foil} metalness={1} roughness={0.34} color="#d9a83c" envMapIntensity={1.5} />
      </mesh>
      {/* white radiator band */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.505, 0.505, 0.24, 36, 1, true]} />
        <meshStandardMaterial color="#e7e7e2" metalness={0.4} roughness={0.5} side={THREE.DoubleSide} envMapIntensity={0.7} />
      </mesh>
      {/* main engine bell */}
      <mesh position={[0, -1.05, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.2, 0.26, 24, 1, true]} />
        <meshStandardMaterial color="#3a3a42" metalness={1} roughness={0.42} side={THREE.DoubleSide} envMapIntensity={0.9} />
      </mesh>
    </group>
  )
}

// Modular space station: two pressurised modules on a central node, a long
// cross truss carrying four big solar arrays, a white radiator and a comms dish.
// Big, planar and asymmetric — nothing like the other four craft.
function Station({ foil, panel }: { foil: THREE.Texture; panel: THREE.Texture }) {
  const module = { map: foil, metalness: 1, roughness: 0.36, color: '#dcdce0', envMapIntensity: 1.3 } as const
  const trussMat = { color: '#6a6c72', metalness: 1, roughness: 0.4, envMapIntensity: 1.0 } as const
  const Array4 = ({ x }: { x: number }) => (
    <group position={[x, 0, 0]}>
      <FramedArray w={1.5} h={0.9} panel={panel} />
    </group>
  )
  return (
    <group>
      {/* pressurised modules along Z */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 1.7, 32]} />
        <meshStandardMaterial {...module} />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.26, 1.0, 28]} />
        <meshStandardMaterial {...module} />
      </mesh>
      {/* node sphere at the junction */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.36, 28, 20]} />
        <meshStandardMaterial map={foil} metalness={1} roughness={0.34} color="#cfcfd4" envMapIntensity={1.3} />
      </mesh>
      {/* long solar truss across X */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.09, 0.09]} />
        <meshStandardMaterial {...trussMat} />
      </mesh>
      {/* four big arrays on the truss ends */}
      <Array4 x={-1.5} />
      <Array4 x={1.5} />
      {/* white radiator panel */}
      <mesh position={[0, -0.55, -0.2]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.7, 0.03]} />
        <meshStandardMaterial color="#e9e9e4" metalness={0.35} roughness={0.5} envMapIntensity={0.7} />
      </mesh>
      {/* comms dish */}
      <mesh position={[0, 0.42, 0.5]} rotation={[-0.6, 0, 0]}>
        <sphereGeometry args={[0.24, 28, 14, 0, Math.PI * 2, 0, Math.PI / 3]} />
        <meshStandardMaterial color="#e8e6df" metalness={0.5} roughness={0.35} side={THREE.DoubleSide} envMapIntensity={1.0} />
      </mesh>
    </group>
  )
}

function SolarWing({ foil, panel, side }: { foil: THREE.Texture; panel: THREE.Texture; side: 1 | -1 }) {
  return (
    <group position={[side * 1.55, 0, 0]}>
      {/* boom (horizontal) */}
      <mesh position={[-side * 0.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 12]} />
        <meshStandardMaterial map={foil} metalness={1} roughness={0.35} color="#d9a83c" />
      </mesh>
      {/* two framed 3D panel cells (raised metal frame + spar, real relief) */}
      {[-0.62, 0.62].map((oy) => (
        <group key={oy} position={[0, oy, 0]}>
          <FramedArray w={1.9} h={1.15} panel={panel} />
        </group>
      ))}
    </group>
  )
}

function Satellite({ foil, panel }: { foil: THREE.Texture; panel: THREE.Texture }) {
  return (
    <group>
      {/* foil-wrapped bus */}
      <RoundedBox args={[1.1, 1.25, 1.0]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial map={foil} metalness={1} roughness={0.28} color="#e6b64a" envMapIntensity={1.6} />
      </RoundedBox>
      {/* trim rails */}
      {[-0.5, 0.5].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.14, 0.05, 1.04]} />
          <meshStandardMaterial color="#2a2a2e" metalness={0.9} roughness={0.4} />
        </mesh>
      ))}
      {/* high-gain dish on a short mast */}
      <group position={[0, 0.2, 0.72]} rotation={[0.5, 0, 0]}>
        <mesh position={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#9a9a9e" metalness={1} roughness={0.3} />
        </mesh>
        <mesh rotation={[Math.PI, 0, 0]}>
          <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial color="#e8e6df" metalness={0.5} roughness={0.35} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color="#caa23a" metalness={1} roughness={0.2} />
        </mesh>
      </group>
      {/* solar wings */}
      <SolarWing foil={foil} panel={panel} side={1} />
      <SolarWing foil={foil} panel={panel} side={-1} />
      {/* angled thermal-louver radiator slats on the back face */}
      <group position={[0, 0, -0.54]}>
        {[-0.36, -0.18, 0, 0.18, 0.36].map((oy, i) => (
          <mesh key={i} position={[0, oy, 0]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.72, 0.12, 0.02]} />
            <meshStandardMaterial map={foil} color="#caa23a" metalness={1} roughness={0.3} envMapIntensity={1.4} />
          </mesh>
        ))}
      </group>
      {/* omni whip antenna with tip node */}
      <group position={[0.42, 0.6, -0.28]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
          <meshStandardMaterial color="#b8b8bc" metalness={1} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.03, 10, 10]} />
          <meshStandardMaterial color="#d0d0d4" metalness={1} roughness={0.3} />
        </mesh>
      </group>
      {/* thruster nozzle */}
      <mesh position={[0, -0.7, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.22, 20, 1, true]} />
        <meshStandardMaterial color="#3a3a40" metalness={1} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Probe({ foil }: { foil: THREE.Texture }) {
  return (
    <group>
      {/* big parabolic high-gain dish (lathe profile) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.35]}>
        <latheGeometry
          args={[
            Array.from({ length: 16 }, (_, i) => {
              const t = i / 15
              const r = t * 0.95
              return new THREE.Vector2(r, r * r * 0.5)
            }),
            48,
          ]}
        />
        <meshStandardMaterial color="#cdccc4" metalness={0.4} roughness={0.52} side={THREE.DoubleSide} envMapIntensity={0.85} />
      </mesh>
      {/* feed horn at focus */}
      <mesh position={[0, 0, 0.72]}>
        <coneGeometry args={[0.05, 0.16, 16]} />
        <meshStandardMaterial color="#c9c9cf" metalness={1} roughness={0.3} />
      </mesh>
      {/* ten-sided electronics bus behind the dish */}
      <mesh position={[0, 0, -0.02]}>
        <cylinderGeometry args={[0.42, 0.42, 0.26, 10]} />
        <meshStandardMaterial map={foil} metalness={1} roughness={0.32} color="#d9a83c" envMapIntensity={1.5} />
      </mesh>
      {/* RTG power boom */}
      <group position={[-0.75, -0.35, -0.1]} rotation={[0, 0, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
          <meshStandardMaterial color="#8a8a8e" metalness={1} roughness={0.4} />
        </mesh>
        {[-0.28, 0, 0.28].map((oy) => (
          <mesh key={oy} position={[0, -0.55 + oy * 0.34, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.2, 12]} />
            <meshStandardMaterial color="#2c2c30" metalness={0.8} roughness={0.55} emissive="#3a1200" emissiveIntensity={0.25} />
          </mesh>
        ))}
      </group>
      {/* magnetometer mast */}
      <mesh position={[0.9, 0.5, -0.1]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.012, 0.012, 1.6, 6]} />
        <meshStandardMaterial color="#b8b8bc" metalness={1} roughness={0.35} />
      </mesh>
      {/* science instrument boom with a dark sensor head */}
      <group position={[0.52, -0.5, 0.05]} rotation={[0, 0, -0.95]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.7, 6]} />
          <meshStandardMaterial color="#a8a8ac" metalness={1} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.72, 0]}>
          <boxGeometry args={[0.13, 0.13, 0.17]} />
          <meshStandardMaterial color="#2c2c30" metalness={0.7} roughness={0.5} emissive="#0e2036" emissiveIntensity={0.22} />
        </mesh>
      </group>
    </group>
  )
}

// The winged orbiter, rebuilt as a believable solid rather than a pill + flat
// cardboard fins. The fuselage is a lathed OGIVE (drawn-out nose, blunt tail),
// slightly flattened so it's wider than tall. Its whole underside is a black
// tile shell (a half-lathe of the same profile), so the white/black split runs
// down the chine exactly like the real vehicle. The wings are thick, bevelled
// DOUBLE-DELTAS with a white upper skin over a black body (black leading edge +
// black belly = RCC / HRSI tiles). Add a swept tail, wrap-around cockpit glass,
// OMS pods and three lathed engine bells. Everything reads under one key light.
const FUSE_PROFILE: [number, number][] = [
  [0.26, -1.5],
  [0.32, -1.28],
  [0.36, -0.85],
  [0.385, -0.2],
  [0.385, 0.35],
  [0.36, 0.74],
  [0.30, 1.02],
  [0.22, 1.26],
  [0.12, 1.46],
  [0.02, 1.62],
]

function Shuttle({ detail }: { detail?: THREE.Texture }) {
  const fuse = useMemo(() => {
    const pts = FUSE_PROFILE.map(([r, y]) => new THREE.Vector2(r, y))
    const g = new THREE.LatheGeometry(pts, 72)
    g.scale(1.08, 1, 0.86) // wider than tall
    g.rotateX(Math.PI / 2) // lay the nose along +Z
    g.computeVertexNormals()
    return g
  }, [])
  // Black underside: same profile, half revolution (the bottom hemisphere), a
  // hair proud of the white shell so it wins the depth test along the chine.
  const belly = useMemo(() => {
    const pts = FUSE_PROFILE.map(([r, y]) => new THREE.Vector2(r * 1.006 + 0.004, y))
    const g = new THREE.LatheGeometry(pts, 72, 0, Math.PI)
    g.scale(1.08, 1, 0.86)
    g.rotateX(Math.PI / 2)
    g.computeVertexNormals()
    return g
  }, [])
  const bell = useMemo(() => {
    const pts = [
      [0.035, 0], [0.05, 0.02], [0.075, 0.08], [0.11, 0.17], [0.155, 0.25], [0.17, 0.3],
    ].map(([r, y]) => new THREE.Vector2(r, y))
    return new THREE.LatheGeometry(pts, 28)
  }, [])
  const wingShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.66) // root leading
    s.lineTo(0.52, 0.3) // strake/glove kink
    s.lineTo(1.98, -0.92) // tip leading (highly swept)
    s.lineTo(2.02, -1.16) // tip trailing (small tip chord)
    s.lineTo(0, -1.32) // root trailing
    s.closePath()
    return s
  }, [])
  const wingBody = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(wingShape, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 })
    g.computeVertexNormals()
    return g
  }, [wingShape])
  const wingSkin = useMemo(() => insetExtrude(wingShape, 0.9, 0.03, 0.115), [wingShape])
  const finShape = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0)
    s.lineTo(0.82, 0)
    s.lineTo(0.62, 0.94)
    s.lineTo(0.32, 1.0)
    s.closePath()
    return s
  }, [])
  const finGeo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(finShape, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 })
    g.center()
    g.computeVertexNormals()
    return g
  }, [finShape])

  const hull = { color: '#d3d7df', metalness: 0.0, roughness: 0.6, clearcoat: 0.25, clearcoatRoughness: 0.5, envMapIntensity: 0.45 }
  const tile = { color: '#15161b', metalness: 0.0, roughness: 0.74, clearcoat: 0.15, clearcoatRoughness: 0.5, envMapIntensity: 0.35 }
  const metal = { color: '#43454d', metalness: 1, roughness: 0.42, envMapIntensity: 0.9 }

  const Wing = ({ side }: { side: 1 | -1 }) => (
    <group position={[side * 0.26, -0.12, -0.12]} rotation={[-Math.PI / 2, 0, 0]} scale={[side, 1, 1]}>
      <mesh geometry={wingBody} castShadow receiveShadow>
        <meshPhysicalMaterial {...tile} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={wingSkin} castShadow receiveShadow>
        <meshPhysicalMaterial {...hull} />
      </mesh>
    </group>
  )

  return (
    <group>
      {/* fuselage + black tile underside */}
      <mesh geometry={fuse} castShadow receiveShadow>
        <meshPhysicalMaterial {...hull} bumpMap={detail} bumpScale={0.015} />
      </mesh>
      <mesh geometry={belly} castShadow receiveShadow>
        <meshPhysicalMaterial {...tile} side={THREE.DoubleSide} bumpMap={detail} bumpScale={0.02} />
      </mesh>
      {/* black RCC nose cap tip */}
      <mesh position={[0, -0.03, 1.55]} scale={[1.08, 0.86, 1]}>
        <sphereGeometry args={[0.09, 20, 16]} />
        <meshPhysicalMaterial {...tile} />
      </mesh>

      {/* wrap-around cockpit glass */}
      <mesh position={[0, 0.2, 0.74]} rotation={[0.62, 0, 0]} scale={[1, 1, 0.7]}>
        <sphereGeometry args={[0.26, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#0a0f19" metalness={0.4} roughness={0.12} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.8} emissive="#0b1c30" emissiveIntensity={0.18} side={THREE.DoubleSide} />
      </mesh>

      {/* thick double-delta wings (white top / black underside + edges) */}
      <Wing side={1} />
      <Wing side={-1} />

      {/* swept vertical tail */}
      <mesh geometry={finGeo} position={[0, 0.5, -1.02]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...hull} side={THREE.DoubleSide} />
      </mesh>

      {/* OMS pods flanking the tail base, each with a dark aft nozzle */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.22, 0.14, -1.0]}>
          <mesh rotation={[Math.PI / 2 + 0.12, 0, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.11, 0.26, 8, 16]} />
            <meshPhysicalMaterial {...hull} />
          </mesh>
          <mesh position={[0, -0.02, -0.22]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.06, 0.08, 14, 1, true]} />
            <meshStandardMaterial color="#2a2a30" metalness={0.9} roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* three main engine bells clustered at the tail */}
      {[
        [0, 0.02, -1.5],
        [-0.16, -0.16, -1.46],
        [0.16, -0.16, -1.46],
      ].map((p, i) => (
        <mesh key={i} geometry={bell} position={p as [number, number, number]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial {...metal} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* body flap under the engines */}
      <mesh position={[0, -0.24, -1.36]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.22]} />
        <meshPhysicalMaterial {...tile} />
      </mesh>
    </group>
  )
}

/* ----- one flying encounter ---------------------------------------------- */

function FlyBy({
  enc,
  index,
  progress,
  foil,
  panel,
  detail,
}: {
  enc: Encounter
  index: number
  progress: MotionValue<number>
  foil: THREE.Texture
  panel: THREE.Texture
  detail: THREE.Texture
}) {
  const group = useRef<THREE.Group>(null)
  const spinner = useRef<THREE.Group>(null)
  const clock = useRef(Math.random() * 100)
  // Counts the GPU warm-up frames this craft has been force-rendered for (see
  // WARM_FRAMES). Once it's had its warm frames, normal scroll-driven culling
  // takes over for the rest of the session.
  const warm = useRef(0)
  // Every material on the craft, so we can fade the whole body UP out of the far
  // corridor haze as it streams in (and hard-restore full opacity for its hero
  // beat, so the in-focus pass is a perfect solid, never a ghost).
  const mats = useRef<THREE.Material[]>([])

  // Every sub-mesh of the craft casts AND receives, so a body self-shadows (wing
  // over fuselage, dish over bus) and neighbouring craft shadow each other —
  // they're lit as solids sharing one space, not flat cutouts pasted on.
  useEffect(() => {
    const g = group.current
    if (!g) return
    const found: THREE.Material[] = []
    g.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh) {
        m.castShadow = true
        m.receiveShadow = true
        const mm = m.material as THREE.Material | THREE.Material[]
        ;(Array.isArray(mm) ? mm : [mm]).forEach((mat) => found.push(mat))
      }
    })
    mats.current = found
  }, [])

  useFrame((_state, delta) => {
    clock.current += delta
    const g = group.current
    if (!g) return

    // ── GPU WARM-UP SWEEP ────────────────────────────────────────────────
    // For the first WARM_FRAMES rendered frames, ignore culling and park the
    // craft in a near, in-frustum depth band (pulled toward centre so the whole
    // body — wings, truss, arrays — rasterises, never edge-clipped). This forces
    // its geometry upload, shadow-depth program compile and composer passes to
    // happen NOW, behind the opacity:0 canvas, instead of hitching on the first
    // real scroll into the warp. Fully opaque so it takes the solid render path.
    if (warm.current < WARM_FRAMES) {
      warm.current += 1
      g.visible = true
      g.position.set(enc.pos[0] * 0.5, enc.pos[1] * 0.5, -9 - index * 1.3)
      for (let i = 0; i < mats.current.length; i++) {
        mats.current[i].transparent = false
        mats.current[i].opacity = 1
      }
      if (spinner.current) {
        spinner.current.rotation.set(enc.tilt[0], enc.tilt[1], enc.tilt[2])
      }
      return
    }

    const p = progress.get()

    // Fixed milestone coordinate, flown toward the lens by the shared scroll field.
    // (x, y) never change — the body is pinned in space; only z advances with the
    // warp. So it sits at the EXACT same place every time you reach progress p:
    // deterministic, and it swings out to pass your side purely from perspective.
    const [mx, my, zBase] = enc.pos
    const z = zBase + warpScrollTravel(p)

    // Cull only when genuinely lost in the far haze or already behind the lens.
    if (z < FAR_CULL || z > NEAR_CULL) {
      g.visible = false
      return
    }
    g.visible = true
    g.position.set(mx, my, z)

    // FADE UP out of the haze across the first REVEAL_DEPTH units past the draw
    // distance, so the body materialises from the void instead of popping in.
    // Below full reveal it's transparent (sorting errors lost in fog); once fully
    // in, we restore opaque solidity for the crisp hero beat.
    const reveal = THREE.MathUtils.smoothstep(z, FAR_CULL, FAR_CULL + REVEAL_DEPTH)
    const revealing = reveal < 0.999
    for (let i = 0; i < mats.current.length; i++) {
      const mat = mats.current[i]
      mat.transparent = revealing
      mat.opacity = reveal
    }

    // Ambient spin (keeps a body alive even when the scroll is still). All actual
    // travel/parallax comes from the fixed coordinate + scroll — no faked motion.
    if (spinner.current) {
      spinner.current.rotation.x = enc.tilt[0] + clock.current * enc.spin * 0.4
      spinner.current.rotation.y = enc.tilt[1] + clock.current * enc.spin
      spinner.current.rotation.z = enc.tilt[2]
    }
  })

  return (
    <group ref={group} scale={enc.scale} visible={false}>
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.14}>
        <group ref={spinner} rotation={enc.tilt}>
          {enc.kind === 'satellite' && <Satellite foil={foil} panel={panel} />}
          {enc.kind === 'probe' && <Probe foil={foil} />}
          {enc.kind === 'shuttle' && <Shuttle detail={detail} />}
          {enc.kind === 'capsule' && <Capsule foil={foil} />}
          {enc.kind === 'station' && <Station foil={foil} panel={panel} />}
        </group>
      </Float>
    </group>
  )
}

/* ----- scene + post ------------------------------------------------------- */

function FieldScene({ progress }: { progress: MotionValue<number> }) {
  const foil = useMemo(() => {
    const t = makeFoil()
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  const panel = useMemo(() => {
    const t = makePanel()
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  const detail = useMemo(() => makeHullDetail(), [])

  return (
    <>
      {/* Corridor haze: distant bodies dissolve into the void and RESOLVE out of
          it as they approach — they emerge from real distance, never pop in. */}
      <fogExp2 attach="fog" args={['#05060c', 0.017]} />

      {/* One coherent rig, mirrored from the star canvas so every body is lit &
          reflects the SAME surroundings. Warm key (throws the shadows) + cool
          fill + a cold rim from DOWN THE CORRIDOR (the direction we fly toward),
          so leading edges catch a consistent warp-core glow as they approach. */}
      <ambientLight intensity={0.09} />
      <directionalLight
        position={[5, 4.5, 3]}
        intensity={1.9}
        color="#fff1cf"
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={0.1}
        shadow-camera-far={90}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0003}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-4, -2, -3]} intensity={0.35} color="#7ea2c4" />
      <directionalLight position={[0, 0.5, -9]} intensity={0.7} color="#bcd4ff" />

      {ENCOUNTERS.map((enc, i) => (
        <FlyBy key={i} enc={enc} index={i} progress={progress} foil={foil} panel={panel} detail={detail} />
      ))}

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} color="#ffe6a6" position={[-4, 3, 4]} scale={[6, 9, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#9db9d4" position={[5, -2, 3]} scale={[6, 9, 1]} />
        <Lightformer form="ring" intensity={2.8} color="#ffffff" position={[0, 4, -5]} scale={4} />
        <Lightformer form="rect" intensity={0.6} color="#ffffff" position={[0, 0, 8]} scale={[14, 14, 1]} />
      </Environment>

      <EffectComposer enableNormalPass={false} multisampling={2}>
        {/* Contact/crevice ambient occlusion — the single biggest "solid, not a
            toy" cue: it darkens where wing meets fuselage, under the OMS pods,
            inside the dish, so parts read as one machined body instead of loose
            floating primitives. With the depth-of-field blur removed, this crisp
            contact shading now carries the whole 3D-solidity read. */}
        <N8AO aoRadius={0.55} intensity={4.2} distanceFalloff={1.0} quality="high" color="#05060c" halfRes />
        <Bloom intensity={0.4} luminanceThreshold={0.85} luminanceSmoothing={0.3} mipmapBlur radius={0.6} />
        <Vignette eskil={false} offset={0.25} darkness={0.42} />
      </EffectComposer>
    </>
  )
}

export default function WarpField({ progress }: { progress: MotionValue<number> }) {
  // The whole layer only exists during the warp window (fades in as we enter
  // the corridor, out before the exit ring). Cheap CSS-level gate on the whole
  // canvas so we're not compositing a full post-pipeline over the hero.
  const opacity = useTransform(progress, [FIELD_IN - 0.02, FIELD_IN + 0.03, FIELD_OUT - 0.02, FIELD_OUT], [0, 1, 1, 0], {
    clamp: true,
  })

  return (
    <motion.div className="hero-warp-canvas" aria-hidden="true" style={{ opacity }}>
      <Canvas
        shadows
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, CAM_Z], fov: WARP_FOV }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <FieldScene progress={progress} />
          <Preload all />
          {/* Report ready only AFTER the warm-up sweep (WARM_FRAMES) has run all
              five craft through the shadow + composer paths, so the loader never
              lifts onto a warp that still has to compile on the first scroll. */}
          <WarmupProbe frames={WARM_FRAMES + 6} />
        </Suspense>
      </Canvas>
    </motion.div>
  )
}
