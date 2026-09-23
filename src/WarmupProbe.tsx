import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { signalHeroReady } from './heroReady'

// Counts a few rendered frames inside a hero canvas, then reports ready exactly
// once (mount + program compile + first composites are done). Lives in its own
// module so only the lazy 3D chunks pull in @react-three/fiber — never the main
// bundle (see the note in heroReady.ts).
export function WarmupProbe({ frames = 3 }: { frames?: number }) {
  const n = useRef(0)
  const done = useRef(false)
  useFrame(() => {
    if (done.current) return
    n.current += 1
    if (n.current >= frames) {
      done.current = true
      signalHeroReady()
    }
  })
  return null
}
