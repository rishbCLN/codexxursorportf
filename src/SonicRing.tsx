import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import type { Ref } from 'react'
import { useTransform, useVelocity, useSpring, cubicBezier } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'

/*
  Cinematic timeline, all driven by the pinned hero's scroll (heroProgress 0..1):

    0.00 -> 0.46  hands close in; ring waits small & centred, gentle spin
    0.46 -> 0.60  ring grows to a resting size; spin flashes then eases to a
                  flawless, face-on STOP (hole pointed at us)
    0.60 -> 0.72  holds a beat; the hole fades to matte black
    0.60 -> 0.80  we zoom INTO the hole (ring dives at the camera & engulfs)
    0.74 -> 0.94  warp: speeding stars, trails driven by SCROLL VELOCITY
                  (fast scroll = long streaks, stop = frozen dots)
    0.90 -> 1.00  a second ring approaches from deep down the tunnel
*/

const TOUCH = 0.46 // fingertips meet the ring's diameter (synced with App.tsx)
const STOP = 0.6 // ring has fully stopped, face-on
const BASE = 0.272 // small size while waiting in the finger gap
const REST = 0.92 // resting size once stopped (leaves a comfortable gap)

const SPIN_TURNS = 3 // full turns completed by the time it stops face-on
const IDLE_TURNS = 0.5 // gentle extra idle rotation at the very start, fades out

// World-space spot where the ring WAITS while the fingertips close in. This is
// the clasp point — tune it to sit exactly between the two index fingers. The
// hands are shifted left in App.tsx (HAND_SHIFT), so this is negative (left).
// The ring re-centres to origin by STOP so the dive + warp stay centred.
const RING_WAIT_X = -0.34
const RING_WAIT_Y = 0.02

const flash = cubicBezier(0.7, 0, 0.3, 1)
const ease = cubicBezier(0.4, 0, 0.2, 1)

// Smootherstep: 6a^5 - 15a^4 + 10a^3. Value AND velocity are zero at both
// ends, so a rotation built on it accelerates and decelerates with no snap.
const smoother = (a: number) => a * a * a * (a * (a * 6 - 15) + 10)

// The gold Sonic ring the hands present (the ENTRY ring). The exit ring is a
// wholly separate object in SonicExitRing.tsx.
function RingMesh({ matRef }: { matRef: Ref<THREE.MeshStandardMaterial> }) {
  return (
    <mesh>
      <torusGeometry args={[1, 0.16, 40, 180]} />
      <meshStandardMaterial
        ref={matRef}
        color="#ffca2b"
        emissive="#8a5200"
        emissiveIntensity={0.35}
        metalness={1}
        roughness={0.14}
        envMapIntensity={2}
      />
    </mesh>
  )
}

function Ring({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null)
  const spinner = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)

  // Grow small -> rest, then blow up as we dive into the hole.
  const scale = useTransform(
    progress,
    [TOUCH, STOP, STOP + 0.2],
    [BASE, REST, REST * 11],
    { ease },
  )
  // Waits at the clasp point (shifted left, matching the hands) then drifts to
  // dead centre by the time it stops — so the dive & warp stay centred.
  // DIALS: RING_WAIT_X/RING_WAIT_Y = where the ring sits between the fingertips.
  const posX = useTransform(progress, [TOUCH, STOP], [RING_WAIT_X, 0], { clamp: true, ease })
  const posY = useTransform(progress, [TOUCH, STOP], [RING_WAIT_Y, 0], { clamp: true, ease })
  // Dive toward the camera during the zoom-in.
  const posZ = useTransform(progress, [STOP, STOP + 0.2], [0, 5.2], { clamp: true, ease: flash })
  // Fade the gold band out as the hole engulfs the view.
  const fade = useTransform(progress, [STOP + 0.12, STOP + 0.2], [1, 0], { clamp: true })

  useFrame(() => {
    const p = progress.get()
    // a = normalised progress across the whole pre-stop stretch.
    const a = THREE.MathUtils.clamp(p / STOP, 0, 1)

    if (spinner.current) {
      // Rotation is a PURE function of progress, so it never overshoots and
      // never has to correct backward (no snap). Because smootherstep ends at
      // exactly SPIN_TURNS full turns with zero velocity, the ring glides to a
      // dead, perfectly face-on stop. The idle term adds a gentle turn at the
      // very start and fades to nothing (and zero velocity) by the stop.
      const s = smoother(a)
      const idle = IDLE_TURNS * a * (1 - s)
      spinner.current.rotation.y = (SPIN_TURNS * s + idle) * Math.PI * 2
      // Relax the tilt to near-flat so the hole faces us cleanly on stop.
      const settle = THREE.MathUtils.smoothstep(a, 0.8, 1)
      spinner.current.rotation.x = THREE.MathUtils.lerp(0.34, 0.06, settle)
    }

    if (group.current) {
      group.current.scale.setScalar(scale.get())
      group.current.position.set(posX.get(), posY.get(), posZ.get())
    }
    if (mat.current) {
      mat.current.opacity = fade.get()
      mat.current.transparent = true
    }
  })

  return (
    <group ref={group} position={[RING_WAIT_X, RING_WAIT_Y, 0]} scale={BASE}>
      <group ref={spinner} rotation={[0.34, 0, 0]}>
        <RingMesh matRef={mat} />
      </group>
    </group>
  )
}

// Matte black disc that fills the hole as we plunge in — the darkness we
// warp through.
function Hole({ progress }: { progress: MotionValue<number> }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const dark = useTransform(progress, [STOP, STOP + 0.12], [0, 1], { clamp: true, ease })

  useFrame(() => {
    if (mat.current) mat.current.opacity = dark.get()
  })

  return (
    <mesh position={[0, 0, -6]}>
      <circleGeometry args={[40, 48]} />
      {/* Pure --ink so the black we punch into matches the manifesto exactly. */}
      <meshBasicMaterial ref={mat} color="#050505" transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

const STAR_COUNT = 900
const TUNNEL = 70 // depth of the warp corridor
// How many tunnel-lengths of stars stream past across the whole warp window.
// Lower = calmer, less "a tiny scroll flings me miles" (was an aggressive 6).
const WARP_WRAPS = 3

// Speeding-stars warp. Star depth is a pure function of scroll PROGRESS, so if
// you stop scrolling the stars freeze. Trail length is driven by scroll
// VELOCITY, so fast scroll stretches them into streaks and rest collapses them
// back to points.
function Warp({ progress }: { progress: MotionValue<number> }) {
  const lines = useRef<THREE.LineSegments>(null)
  const mat = useRef<THREE.LineBasicMaterial>(null)

  // Stars stream in as the warp opens and keep flying through a long corridor
  // (the exit ring only shows up at ~0.86), then fade OUT right at the punch-
  // through so NOTHING is left flying once we hit the black.
  const active = useTransform(progress, [STOP + 0.12, STOP + 0.18, 0.94, 0.975], [0, 1, 1, 0], { clamp: true })
  // Smoothed absolute scroll velocity -> trail length.
  const velocity = useVelocity(progress)
  const smoothVel = useSpring(velocity, { stiffness: 220, damping: 40 })

  // Fixed x/y per star; z is derived every frame from progress.
  const seed = useMemo(() => {
    const s = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 0.25 + Math.random() * 7
      const a = Math.random() * Math.PI * 2
      s[i * 3] = Math.cos(a) * r
      s[i * 3 + 1] = Math.sin(a) * r
      s[i * 3 + 2] = Math.random() * TUNNEL // base depth offset
    }
    return s
  }, [])

  // Two vertices per star (head + tail) for the trail segment.
  const positions = useMemo(() => new Float32Array(STAR_COUNT * 6), [])

  useFrame(() => {
    const a = active.get()
    if (mat.current) mat.current.opacity = a

    if (lines.current && a > 0.001) {
      const p = progress.get()
      // Travel maps progress across the warp window into tunnel distance.
      const travel = ((p - (STOP + 0.14)) / (1 - (STOP + 0.14))) * TUNNEL * WARP_WRAPS
      const trail = THREE.MathUtils.clamp(Math.abs(smoothVel.get()) * 26, 0.05, 7)
      const arr = positions

      for (let i = 0; i < STAR_COUNT; i++) {
        const x = seed[i * 3]
        const y = seed[i * 3 + 1]
        // Wrap through the tunnel so the stream is endless as we scroll.
        let z = ((seed[i * 3 + 2] + travel) % TUNNEL) - TUNNEL + 6
        const h = i * 6
        arr[h] = x
        arr[h + 1] = y
        arr[h + 2] = z // head (nearer camera)
        arr[h + 3] = x
        arr[h + 4] = y
        arr[h + 5] = z - trail // tail (streaks back)
      }
      lines.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <lineSegments ref={lines}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={mat}
        color="#eaf2ff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}

export default function SonicRing({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="hero-ring-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 6], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} color="#fff4d8" />
        <Suspense fallback={null}>
          <Hole progress={progress} />
          <Warp progress={progress} />
          <Ring progress={progress} />
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={4} color="#ffe6a6" position={[-4, 3, 4]} scale={[6, 9, 1]} />
            <Lightformer form="rect" intensity={1.6} color="#9db9d4" position={[5, -2, 3]} scale={[6, 9, 1]} />
            <Lightformer form="ring" intensity={2.8} color="#ffffff" position={[0, 4, -5]} scale={4} />
            <Lightformer form="rect" intensity={0.6} color="#ffffff" position={[0, 0, 8]} scale={[14, 14, 1]} />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}
