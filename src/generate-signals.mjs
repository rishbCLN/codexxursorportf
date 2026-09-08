import { readFileSync, writeFileSync } from 'node:fs'

const nodeCount = 640

const randomFor = (seed) => {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return value - Math.floor(value)
}

const data = Array.from({ length: nodeCount }, (_, index) => {
  const id = index + 1
  const x = (randomFor(id) * 100).toFixed(3)
  const y = (randomFor(id + 701) * 100).toFixed(3)
  const size = (1.5 + randomFor(id + 1402) * 6.5).toFixed(2)
  const opacity = (0.16 + randomFor(id + 2103) * 0.84).toFixed(3)
  const duration = (4.5 + randomFor(id + 2804) * 16).toFixed(2)
  const delay = (-randomFor(id + 3505) * 12).toFixed(2)
  const driftX = (-60 + randomFor(id + 4206) * 120).toFixed(2)
  const driftY = (-60 + randomFor(id + 4907) * 120).toFixed(2)
  const hue = Math.floor(randomFor(id + 5608) * 110)

  return [
    '  {',
    `    id: ${id}, x: ${x}, y: ${y},`,
    `    size: ${size}, opacity: ${opacity},`,
    `    duration: ${duration}, delay: ${delay},`,
    `    driftX: ${driftX}, driftY: ${driftY},`,
    `    hue: ${hue},`,
    '  },',
  ].join('\n')
}).join('\n')

const nodeStyles = Array.from({ length: nodeCount }, (_, index) => {
  const id = index + 1
  const layer = id % 8
  const blur = layer === 0 ? '1.2px' : layer < 3 ? '.45px' : '0'
  const blend = id % 11 === 0 ? 'screen' : 'normal'

  return [
    `.signal-node:nth-child(${id}) {`,
    `  z-index: ${layer};`,
    `  filter: blur(${blur});`,
    `  mix-blend-mode: ${blend};`,
    '}',
  ].join('\n')
}).join('\n\n')

const appPath = new URL('./App.tsx', import.meta.url)
const stylesPath = new URL('./styles.css', import.meta.url)
const app = readFileSync(appPath, 'utf8')
const styles = readFileSync(stylesPath, 'utf8')

const nextApp = app.replace(
  /  \/\* SIGNAL_NODE_DATA_START \*\/[\s\S]*?  \/\* SIGNAL_NODE_DATA_END \*\//,
  `  /* SIGNAL_NODE_DATA_START */\n${data}\n  /* SIGNAL_NODE_DATA_END */`,
)

const nextStyles = styles.replace(
  /\/\* SIGNAL_NODE_STYLES_START \*\/[\s\S]*?\/\* SIGNAL_NODE_STYLES_END \*\//,
  `/* SIGNAL_NODE_STYLES_START */\n${nodeStyles}\n/* SIGNAL_NODE_STYLES_END */`,
)

writeFileSync(appPath, nextApp)
writeFileSync(stylesPath, nextStyles)
