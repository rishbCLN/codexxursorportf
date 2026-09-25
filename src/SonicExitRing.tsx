import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLResilience } from './useWebGLResilience'
import { Environment, Lightformer, Preload } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { motion, useTransform, useMotionTemplate, cubicBezier } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import { WarmupProbe } from './WarmupProbe'

/*
  The Sonic EXIT ring — a wholly separate object from the entry ring, living on
  its own transparent canvas layer at the far end of the warp corridor. It is
  the same gold torus prop as the entry ring (same geometry/material, its own
  lighting rig) so it reads as a fully 3D ring — it simply does NOT spin.

  Behaviour (all a pure function of the hero scroll progress, so it freezes if
  you stop scrolling — matching the warp stars):
    - it is a real, visible ring from a DISTANCE (not a faint speck), tilted so
      you read its 3D depth
    - it begins BLURRED and, as we fly toward it, it magnifies and sharpens into
      focus while the tilt relaxes to face-on
    - its hole is a solid VOID — an opaque black disc — so NO stars show through
      it; you are flying INTO the black mouth of the ring
    - once it engulfs the camera it is gone, leaving pure black (the manifesto)

  The blur lives on THIS layer only, so the stars/entry ring in the other canvas
  are never affected.
*/

const ease = cubicBezier(0.4, 0, 0.2, 1)

// The gate appears only AFTER a long stretch of pure warp travel (stars alone),
// so there's a real sense of distance flown between the entry ring and this one.
const EXIT_BORN = 0.89
// The blur -> clarity resolves FAST and EARLY (about twice as quick as before):
// the gate snaps into focus and squares up not long after it appears.
const SHARP = 0.935
// The ring keeps rushing in (already crisp) until it's big in our face, then
// engulfs the camera into pitch black.
const CLEAR = 0.965 // magnified + in our face
const ENGULF = 0.985 // ring has passed the camera; we're through into black

function ExitRing({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshStandardMaterial>(null)
  const voidMat = useRef<THREE.MeshBasicMaterial>(null)

  // A clearly-visible ring in the distance -> big & in focus by CLEAR -> past
  // the camera by ENGULF.
  const z = useTransform(progress, [EXIT_BORN, CLEAR, ENGULF], [-45, 3.2, 6.4], { clamp: true, ease })
  // Grows the whole way; largest right as it reaches us.
  const s = useTransform(progress, [EXIT_BORN, CLEAR, ENGULF], [0.4, 3.2, 5.2], { clamp: true, ease })
  // Fades up quickly so it's a real ring you can see coming, then gone once it
  // has engulfed us (so nothing lingers on the black).
  const fade = useTransform(progress, [EXIT_BORN, EXIT_BORN + 0.03, CLEAR, ENGULF], [0, 0.8, 1, 0], { clamp: true })
  // 3D tilt while it's far away, squaring up to face-on as it snaps into focus.
  const tilt = useTransform(progress, [EXIT_BORN, SHARP], [0.42, 0.05], { clamp: true, ease })
  // The void snaps fully opaque the instant the ring is born (so it always
  // fully blocks the stars), and is hidden before that so no black dot shows
  // over the hero.
  const voidOpacity = useTransform(
    progress,
    [EXIT_BORN, EXIT_BORN + 0.008, ENGULF - 0.008, ENGULF],
    [0, 1, 1, 0],
    { clamp: true },
  )

  useFrame(() => {
    if (group.current) {
      group.current.position.z = z.get()
      group.current.scale.setScalar(s.get())
      group.current.rotation.x = tilt.get()
    }
    if (mat.current) {
      mat.current.opacity = fade.get()
      mat.current.transparent = true
    }
    if (voidMat.current) voidMat.current.opacity = voidOpacity.get()
  })

  return (
    <group ref={group} position={[0, 0, -45]} scale={0.4} rotation={[0.42, 0, 0]}>
      {/* Solid VOID filling the hole — opaque black so no stars show through and
          it reads as the dark mouth we fly into. Exact --ink for a seamless
          hand-off to the manifesto. */}
      <mesh position={[0, 0, -0.06]}>
        <circleGeometry args={[0.92, 64]} />
        <meshBasicMaterial ref={voidMat} color="#050505" toneMapped={false} transparent opacity={0} />
      </mesh>
      <mesh>
        <torusGeometry args={[1, 0.16, 40, 180]} />
        <meshStandardMaterial
          ref={mat}
          color="#ffca2b"
          emissive="#8a5200"
          emissiveIntensity={0.35}
          metalness={1}
          roughness={0.14}
          envMapIntensity={2}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  )
}

export default function SonicExitRing({ progress }: { progress: MotionValue<number> }) {
  // Focus-pull that belongs to the EXIT RING ALONE (its own layer): soft when it
  // first appears, then resolving to fully sharp FAST + EARLY by SHARP (roughly
  // twice as quick as it used to take). It then keeps rushing in already crisp.
  const blur = useTransform(progress, [EXIT_BORN, SHARP], [15, 0], { clamp: true })
  const filter = useMotionTemplate`blur(${blur}px)`
  const { canvasKey, onCreated } = useWebGLResilience()

  return (
    <motion.div className="hero-exit-canvas" style={{ filter }} aria-hidden="true">
      <Canvas
        key={canvasKey}
        onCreated={onCreated}
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 6], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} color="#fff4d8" />
        <Suspense fallback={null}>
          <ExitRing progress={progress} />
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={4} color="#ffe6a6" position={[-4, 3, 4]} scale={[6, 9, 1]} />
            <Lightformer form="rect" intensity={1.6} color="#9db9d4" position={[5, -2, 3]} scale={[6, 9, 1]} />
            <Lightformer form="ring" intensity={2.8} color="#ffffff" position={[0, 4, -5]} scale={4} />
            <Lightformer form="rect" intensity={0.6} color="#ffffff" position={[0, 0, 8]} scale={[14, 14, 1]} />
          </Environment>
          <Preload all />
          <WarmupProbe />
        </Suspense>
      </Canvas>
    </motion.div>
  )
}
