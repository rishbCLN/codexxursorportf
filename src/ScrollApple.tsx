import { motion, useAnimationControls, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const APPLE_BODY = 'M60 39C50 29 34 31 27 43C17 59 24 84 40 94C48 99 53 93 60 93C67 93 72 99 80 94C96 84 103 59 93 43C86 31 70 29 60 39Z'
const BITE_POINTS = [[92, 45], [96, 61], [91, 78], [29, 52], [25, 69], [35, 86]]
const BITE_SIZES = [12, 13, 14, 13, 14, 12]

export default function ScrollApple() {
  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()
  const controls = useAnimationControls()
  const previousStage = useRef(0)
  const [biteStage, setBiteStage] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const nextStage = Math.min(6, Math.floor(progress * 6.35))
    setBiteStage((current) => current === nextStage ? current : nextStage)
  })

  useEffect(() => {
    const previous = previousStage.current

    if (reduceMotion) {
      controls.set({ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 })
    } else if (previous === biteStage && biteStage === 0) {
      void controls.start({ opacity: 1, y: 0, transition: { delay: 1.1, duration: .65 } })
    } else {
      const direction = biteStage > previous ? (biteStage % 2 ? -1 : 1) : 1
      void controls.start({
        opacity: 1,
        x: [0, direction * 1.2, direction * -1, direction * .65, direction * -.3, 0],
        rotate: [0, direction * 2, direction * -1.5, direction * .8, direction * -.35, 0],
        scale: [1, .965, 1.018, .992, 1.006, 1],
        transition: { duration: .52, times: [0, .18, .38, .58, .78, 1], ease: [0.22, 1, 0.36, 1] },
      })
    }

    previousStage.current = biteStage
  }, [biteStage, controls, reduceMotion])

  const biteTransition = reduceMotion
    ? { duration: 0 }
    : { duration: .46, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div className="scroll-apple" aria-hidden="true">
      <motion.svg
        className="silver-apple"
        viewBox="0 0 120 120"
        initial={{ opacity: 0, y: -8 }}
        animate={controls}
      >
        <defs>
          <linearGradient id="apple-metal" x1=".18" y1=".1" x2=".82" y2=".95">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".27" stopColor="#cdd1d3" />
            <stop offset=".52" stopColor="#777d81" />
            <stop offset=".72" stopColor="#e9ebec" />
            <stop offset="1" stopColor="#5c6266" />
          </linearGradient>
          <linearGradient id="core-metal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#858b8e" />
            <stop offset=".5" stopColor="#33383b" />
            <stop offset="1" stopColor="#aeb3b5" />
          </linearGradient>
          <filter id="apple-relief" x="-35%" y="-35%" width="170%" height="180%">
            <feDropShadow dx="-1.4" dy="-1.4" stdDeviation="1" floodColor="#fff" floodOpacity=".8" />
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#000" floodOpacity=".72" />
          </filter>
          <mask id="eaten-metal-apple" maskUnits="userSpaceOnUse" x="15" y="20" width="90" height="85">
            <path d={APPLE_BODY} fill="white" />
            {BITE_POINTS.map(([cx, cy], index) => (
              <motion.circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                animate={{ r: biteStage > index ? BITE_SIZES[index] : 0 }}
                transition={biteTransition}
                fill="black"
              />
            ))}
          </mask>
        </defs>

        <g filter="url(#apple-relief)">
          <motion.g animate={{ opacity: biteStage >= 4 ? 1 : 0 }} transition={biteTransition}>
            <path d="M55 36C59 32 64 32 67 36C71 51 68 81 73 93C67 98 54 98 48 93C53 79 50 51 55 36Z" fill="url(#core-metal)" />
            <ellipse cx="56" cy="61" rx="2.2" ry="4.5" fill="#24282a" transform="rotate(-18 56 61)" />
            <ellipse cx="65" cy="69" rx="2.2" ry="4.5" fill="#24282a" transform="rotate(18 65 69)" />
          </motion.g>
          <g mask="url(#eaten-metal-apple)">
            <path d={APPLE_BODY} fill="url(#apple-metal)" />
            <path className="metal-apple-shine" d="M36 42C29 52 29 67 35 77" />
          </g>
          <path className="metal-stem" d="M59 39C58 29 61 21 68 16" />
          <path className="metal-leaf" d="M65 25C73 13 88 17 92 21C85 31 74 34 65 25Z" />
          <path className="metal-leaf-vein" d="M68 25L88 21" />
        </g>

      </motion.svg>
    </div>
  )
}
