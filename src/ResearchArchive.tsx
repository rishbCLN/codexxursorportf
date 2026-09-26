import { Canvas, useFrame } from '@react-three/fiber'
import { useWebGLResilience } from './useWebGLResilience'
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox, Sparkles } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import * as THREE from 'three'
import type { RenderedPdf } from './pdfPages'

/*
  A real WebGL reading room, built as floating glass monoliths. Each item — a
  sample research paper, or a page of an uploaded PDF — is a readable sheet
  mounted on the face of a thick slab of refractive glass, suspended in a dark
  void. Scroll drives a continuous "focus" index: the slab at focus turns
  face-on and lights up so its page is readable, while upcoming slabs recede
  down the corridor and the ones already read lift up and swing out of frame.

  Motion is driven by the section's scroll progress (0..1) so the glass stays in
  lockstep with the crisp DOM reader layered on top (see PlaygroundSection).
*/

export type ArchivePaper = {
  id: string
  title: string
  subtitle: string
  field: string
  year: string
  status: string
  accent: string
  abstract: string
  keywords: string[]
}

// One shared accent palette so the DOM reader (App) and the glass slabs agree
// on colours, whether we're showing sample papers or an uploaded PDF's pages.
export const ARCHIVE_ACCENTS = ['#e7b65c', '#ff64bc', '#6df7ff', '#ffad42', '#b8a0ff']

export function accentForIndex(index: number): string {
  return ARCHIVE_ACCENTS[index % ARCHIVE_ACCENTS.length]
}

const TEX_W = 1024
const TEX_H = 1424
const PAGE_W = 2.15 // world width of the printed sheet; height follows aspect
const FRAME = 0.42 // glass border around the sheet
const SLAB_D = 0.42
const GAP = 4.4 // z-distance between neighbouring slabs down the corridor
const WHITE = new THREE.Color('#ffffff')

type Slide = {
  id: string
  accent: string
  texture: THREE.Texture
  aspect: number // height / width
}

// --- Sample-paper artwork -----------------------------------------------

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawPaper(canvas: HTMLCanvasElement, paper: ArchivePaper) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const W = canvas.width
  const H = canvas.height
  const M = 96
  const inner = W - M * 2

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#ece1cb'
  ctx.fillRect(0, 0, W, H)

  const sheen = ctx.createLinearGradient(0, 0, W, H)
  sheen.addColorStop(0, 'rgba(255,251,240,0.65)')
  sheen.addColorStop(0.45, 'rgba(150,110,66,0)')
  sheen.addColorStop(1, 'rgba(84,55,30,0.14)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, W, H)

  ctx.save()
  ctx.globalAlpha = 0.05
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? '#3a2714' : '#ffffff'
    ctx.fillRect(Math.random() * W, Math.random() * H, 1.5, 1.5)
  }
  ctx.restore()

  const ink = '#241a0f'
  const faint = '#7c674f'

  ctx.fillStyle = faint
  ctx.font = '500 24px "DM Mono", monospace'
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.fillText(paper.id, M, 150)
  ctx.textAlign = 'right'
  ctx.fillText(paper.status, W - M, 150)
  ctx.textAlign = 'left'

  ctx.strokeStyle = 'rgba(71,48,31,0.32)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(M, 178)
  ctx.lineTo(W - M, 178)
  ctx.stroke()

  ctx.fillStyle = ink
  ctx.font = '400 104px "Instrument Serif", Georgia, serif'
  let y = 296
  for (const l of wrapLines(ctx, paper.title, inner)) {
    ctx.fillText(l, M, y)
    y += 98
  }

  ctx.fillStyle = faint
  ctx.font = 'italic 400 40px "Instrument Serif", Georgia, serif'
  y += 8
  for (const l of wrapLines(ctx, paper.subtitle, inner)) {
    ctx.fillText(l, M, y)
    y += 50
  }

  y += 30
  ctx.fillStyle = paper.accent
  ctx.fillRect(M, y, 132, 6)
  y += 66

  ctx.fillStyle = faint
  ctx.font = '500 21px "DM Mono", monospace'
  ctx.fillText('ABSTRACT', M, y)
  y += 50
  ctx.fillStyle = '#3a2a1a'
  ctx.font = '400 37px "Instrument Serif", Georgia, serif'
  for (const l of wrapLines(ctx, paper.abstract, inner)) {
    ctx.fillText(l, M, y)
    y += 52
  }

  ctx.fillStyle = faint
  ctx.font = '500 22px "DM Mono", monospace'
  ctx.textAlign = 'left'
  ctx.fillText(paper.field, M, H - 96)
  ctx.textAlign = 'right'
  ctx.fillText(paper.year, W - M, H - 96)
  ctx.textAlign = 'left'

  ctx.strokeStyle = 'rgba(71,48,31,0.32)'
  ctx.beginPath()
  ctx.moveTo(M, H - 72)
  ctx.lineTo(W - M, H - 72)
  ctx.stroke()

  ctx.font = '500 18px "DM Mono", monospace'
  let kx = M
  for (const kw of paper.keywords) {
    const w = ctx.measureText(kw).width + 30
    ctx.strokeStyle = 'rgba(96,77,60,0.55)'
    ctx.lineWidth = 1.4
    ctx.strokeRect(kx, H - 54, w, 36)
    ctx.fillStyle = '#6b573e'
    ctx.fillText(kw, kx + 15, H - 30)
    kx += w + 13
  }
}

// A single soft radial sprite, shared by every slab's glow halo.
let haloTexture: THREE.Texture | null = null
function getHaloTexture(): THREE.Texture {
  if (haloTexture) return haloTexture
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.4)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 128, 128)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  haloTexture = texture
  return texture
}

// A large soft-lit gradient plane sitting far behind the corridor — reads like
// a studio wall / gallery backdrop rather than a flat black void. The glow is
// biased slightly above centre so it feels like overhead light falling down.
let backdropTexture: THREE.Texture | null = null
function getBackdropTexture(): THREE.Texture {
  if (backdropTexture) return backdropTexture
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#080706'
    ctx.fillRect(0, 0, 512, 512)
    const grad = ctx.createRadialGradient(256, 205, 40, 256, 256, 400)
    grad.addColorStop(0, '#37281a')
    grad.addColorStop(0.4, '#241a11')
    grad.addColorStop(0.75, '#12100c')
    grad.addColorStop(1, '#070605')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  backdropTexture = texture
  return texture
}

function Backdrop() {
  const tex = useMemo(() => getBackdropTexture(), [])
  return (
    <mesh position={[0, 0, -20]} scale={[80, 50, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={tex} toneMapped={false} depthWrite={false} fog={false} />
    </mesh>
  )
}

// --- Slab ----------------------------------------------------------------

function CameraRig({ exit }: { exit?: MotionValue<number> }) {
  useFrame(({ camera }) => {
    const e = exit ? exit.get() : 0
    // Camera dives smoothly forward toward and into the slab. `exit` is now a
    // monotonic-smoothed scroll value (App.tsx) instead of a spring, so it never
    // overshoots its scroll target and springs back on a mid-plunge stop; the
    // lerp below is the only easing and it only ever approaches, never crosses.
    const targetZ = 9 - e * 5.6
    const targetY = 0.3 - e * 0.2
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08)
  })
  return null
}

function GlassSlab({
  slide,
  index,
  focus,
  exit,
  isLast,
}: {
  slide: Slide
  index: number
  focus: MotionValue<number>
  exit?: MotionValue<number>
  isLast: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const paperMat = useRef<THREE.MeshStandardMaterial>(null)
  const spine = useRef<THREE.MeshStandardMaterial>(null)
  const halo = useRef<THREE.Sprite>(null)
  // Ref for MeshTransmissionMaterial to animate physical optical uniforms
  const transmissionMat = useRef<any>(null)
  const seed = useMemo(() => Math.random() * 10, [])
  const bodyColor = useMemo(() => new THREE.Color(slide.accent).lerp(WHITE, 0.7), [slide.accent])
  const haloTex = useMemo(() => getHaloTexture(), [])

  const pageH = PAGE_W * slide.aspect
  const slabW = PAGE_W + FRAME
  const slabH = pageH + FRAME

  useFrame((state) => {
    const d = index - focus.get()
    const ad = Math.abs(d)
    const t = state.clock.elapsedTime
    const g = group.current
    const e = exit ? exit.get() : 0

    if (g) {
      let x = d * 1.15
      let y = Math.sin(t * 0.5 + seed) * 0.06
      let z = -d * GAP
      let ry = THREE.MathUtils.clamp(-d * 0.4, -0.8, 0.8)

      if (d < 0) {
        const p = -d
        x += -p * 1.7
        y += p * 1.35
        z += p * 1.1
        ry += -p * 0.5
      }

      if (isLast && e > 0) {
        // As exit begins, smoothly align the last slab directly in front of the lens
        x = THREE.MathUtils.lerp(x, 0, e)
        y = THREE.MathUtils.lerp(y, 0, e)
        ry = THREE.MathUtils.lerp(ry, 0, e)
        const s = THREE.MathUtils.lerp(1, 1.18, e)
        g.scale.set(s, s, s)
        g.position.set(x, y, z)
        g.rotation.set(0, ry, 0)
      } else {
        if (e > 0 && !isLast) {
          // Preceding slabs gracefully sink and vanish during exit
          y -= e * 3.5
          z -= e * 4.0
        }
        g.position.set(x, y, z)
        g.rotation.set(
          Math.sin(t * 0.4 + seed) * 0.03,
          ry,
          d * 0.02 + Math.sin(t * 0.3 + seed) * 0.01,
        )
        g.scale.setScalar(Math.max(0.6, 1 - ad * 0.06))
      }
    }

    if (isLast && transmissionMat.current && e > 0) {
      // Dynamic optical dispersion & chromatic aberration flare!
      transmissionMat.current.chromaticAberration = THREE.MathUtils.lerp(0.05, 0.65, e)
      transmissionMat.current.distortion = THREE.MathUtils.lerp(0.15, 0.75, e)
      transmissionMat.current.distortionScale = THREE.MathUtils.lerp(0.3, 0.8, e)
      transmissionMat.current.thickness = THREE.MathUtils.lerp(1.4, 3.2, e)
    }

    if (paperMat.current) {
      if (isLast && e > 0) {
        // Paper text gracefully diffuses into pure glass glow
        paperMat.current.opacity = Math.max(0, 1 - e * 1.8)
        paperMat.current.transparent = true
      }
      paperMat.current.emissiveIntensity = THREE.MathUtils.clamp(0.92 - ad * 0.32, 0.28, 0.92)
    }

    if (spine.current) {
      if (isLast && e > 0) {
        spine.current.emissiveIntensity = Math.min(6, 2.6 + e * 4.5)
      } else {
        spine.current.emissiveIntensity = Math.max(0.2, 2.6 - ad * 1.9)
      }
    }

    if (halo.current) {
      const material = halo.current.material as THREE.SpriteMaterial
      material.opacity = Math.max(0, (isLast && e > 0 ? 0.5 + e * 0.5 : 0.5) - ad * 0.46)
      const scale = Math.max(2.4, (isLast && e > 0 ? 6.4 + e * 6.0 : 6.4) - ad * 1.4)
      halo.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group ref={group}>
      <sprite ref={halo} position={[0, 0, -0.5]} scale={4}>
        <spriteMaterial
          map={haloTex}
          color={slide.accent}
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* Refractive glass body / frame with physical transmission material */}
      <RoundedBox args={[slabW, slabH, SLAB_D]} radius={0.09} smoothness={4}>
        <MeshTransmissionMaterial
          ref={transmissionMat}
          transmissionSampler
          backside={false}
          transmission={1}
          thickness={1.4}
          ior={1.45}
          roughness={0.07}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.06}
          color={bodyColor}
          attenuationColor={slide.accent}
          attenuationDistance={1.8}
          envMapIntensity={1.4}
        />
      </RoundedBox>

      {/* Readable page mounted on the front face of the glass */}
      <mesh position={[0, 0, SLAB_D / 2 + 0.012]}>
        <planeGeometry args={[PAGE_W, pageH]} />
        <meshStandardMaterial
          ref={paperMat}
          map={slide.texture}
          emissive={WHITE}
          emissiveMap={slide.texture}
          emissiveIntensity={0.7}
          roughness={0.92}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Accent spine down the leading edge, like a lit bookmark */}
      <mesh position={[-slabW / 2 + 0.07, 0, SLAB_D / 2 + 0.01]}>
        <boxGeometry args={[0.06, pageH, 0.05]} />
        <meshStandardMaterial
          ref={spine}
          color={slide.accent}
          emissive={slide.accent}
          emissiveIntensity={1}
          toneMapped={false}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

function AccentLight({ accent, exit }: { accent: MotionValue<string>; exit?: MotionValue<number> }) {
  const light = useRef<THREE.PointLight>(null)
  useFrame(() => {
    if (light.current) {
      light.current.color.set(accent.get())
      const e = exit ? exit.get() : 0
      light.current.intensity = 40 + e * 160
      light.current.position.set(0, 1.6 - e * 0.8, 4.5 - e * 2.5)
    }
  })
  return <pointLight ref={light} position={[0, 1.6, 4.5]} intensity={40} distance={28} decay={2} />
}

function Scene({
  slides,
  progress,
  exit,
  accent,
  lowPower = false,
}: {
  slides: Slide[]
  progress: MotionValue<number>
  exit?: MotionValue<number>
  accent: MotionValue<string>
  lowPower?: boolean
}) {
  const smooth = useSpring(progress, { stiffness: 70, damping: 26, mass: 0.4, restDelta: 0.0004 })
  const focus = useTransform(smooth, (p) => p * Math.max(1, slides.length - 1))
  const lastIndex = Math.max(0, slides.length - 1)

  return (
    <>
      <color attach="background" args={['#0c0a08']} />
      <fog attach="fog" args={['#161009', 14, 46]} />

      <Backdrop />
      <CameraRig exit={exit} />

      <ambientLight intensity={0.5} color="#6a5539" />
      <directionalLight position={[3, 4, 6]} intensity={1.8} color="#ffe9c2" />
      <directionalLight position={[-5, -2, 2]} intensity={0.6} color="#7fa8ff" />
      <AccentLight accent={accent} exit={exit} />

      <Environment resolution={lowPower ? 128 : 256} frames={1}>
        <color attach="background" args={['#080706']} />
        <Lightformer form="rect" intensity={3} color="#fff0d6" scale={[10, 10, 1]} position={[0, 6, -9]} />
        <Lightformer form="ring" intensity={2.2} color="#9fd0ff" scale={[5, 5, 1]} position={[-9, 1, -3]} />
        <Lightformer form="circle" intensity={2} color="#ffb27a" scale={[5, 5, 1]} position={[9, -2, -3]} />
      </Environment>

      <Sparkles count={60} scale={[16, 11, 10]} size={2.2} speed={0.3} opacity={0.5} color="#e7c98a" noise={1} />

      {slides.map((slide, index) => (
        <GlassSlab
          key={slide.id}
          slide={slide}
          index={index}
          focus={focus}
          exit={exit}
          isLast={index === lastIndex}
        />
      ))}
    </>
  )
}

export default function ResearchArchive({
  progress,
  exit,
  papers,
  accent,
  pdf,
  active = true,
  lowPower = false,
}: {
  progress: MotionValue<number>
  exit?: MotionValue<number>
  papers: ArchivePaper[]
  accent: MotionValue<string>
  pdf?: RenderedPdf | null
  active?: boolean
  lowPower?: boolean
}) {
  // Build the slides from an uploaded PDF if we have one, otherwise the samples.
  const slides = useMemo<Slide[]>(() => {
    if (pdf && pdf.pages.length) {
      return pdf.pages.map((canvas, i) => {
        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 8
        return {
          id: `pdf-${i}`,
          accent: accentForIndex(i),
          texture,
          aspect: canvas.height / canvas.width,
        }
      })
    }

    return papers.map((paper) => {
      const canvas = document.createElement('canvas')
      canvas.width = TEX_W
      canvas.height = TEX_H
      drawPaper(canvas, paper)
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      return {
        id: paper.id,
        accent: paper.accent,
        texture,
        aspect: TEX_H / TEX_W,
      }
    })
  }, [pdf, papers])

  // Sample sheets are drawn with Google Fonts that load async; repaint once
  // they're ready. PDF pages are already rasterised, so they skip this.
  useEffect(() => {
    if (pdf && pdf.pages.length) return
    let cancelled = false
    document.fonts?.ready?.then(() => {
      if (cancelled) return
      slides.forEach((slide, i) => {
        const image = slide.texture.image as HTMLCanvasElement
        drawPaper(image, papers[i])
        slide.texture.needsUpdate = true
      })
    })
    return () => {
      cancelled = true
    }
  }, [slides, papers, pdf])

  // Dispose GPU textures when the slide set changes or the scene unmounts.
  useEffect(() => {
    return () => {
      slides.forEach((slide) => slide.texture.dispose())
    }
  }, [slides])

  const { canvasKey, onCreated } = useWebGLResilience()
  return (
    <div className="archive-canvas" aria-hidden="true">
      <Canvas
        key={canvasKey}
        onCreated={onCreated}
        // Idle (demand) while off-screen so the glass reading-room stops
        // rendering when scrolled away — see ContactConstellation.
        frameloop={active ? 'always' : 'demand'}
        dpr={[1, lowPower ? 1.2 : 1.6]}
        camera={{ position: [0, 0.3, 9], fov: 30 }}
        gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene slides={slides} progress={progress} exit={exit} accent={accent} lowPower={lowPower} />
        </Suspense>
      </Canvas>
    </div>
  )
}
