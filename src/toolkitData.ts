// Shared toolkit lobe data — deliberately free of any three.js / R3F / icon
// imports so the DOM overlay (App.tsx) can read it without pulling the WebGL
// bundle (or the whole simple-icons set) into the initial chunk. ToolkitCortex
// resolves the `si` slug to a real simple-icons logo for the 3D orbit, so the
// overlay text and the 3D logos never drift.

export type ToolkitTool = {
  name: string // short label shown in the DOM
  si: string // simple-icons named export, e.g. "siReact"
}

export type ToolkitCluster = {
  name: string
  code: string
  accent: string
  items: ToolkitTool[]
}

export const TOOLKIT_CLUSTERS: ToolkitCluster[] = [
  {
    name: 'LANGUAGES',
    code: 'LN',
    accent: '#e7b65c',
    items: [
      { name: 'JavaScript', si: 'siJavascript' },
      { name: 'TypeScript', si: 'siTypescript' },
      { name: 'C++', si: 'siCplusplus' },
      { name: 'Python', si: 'siPython' },
      { name: 'Rust', si: 'siRust' },
      { name: 'Go', si: 'siGo' },
    ],
  },
  {
    name: 'INTERFACE',
    code: 'UI',
    accent: '#ff7ac2',
    items: [
      { name: 'React', si: 'siReact' },
      { name: 'Next.js', si: 'siNextdotjs' },
      { name: 'Tailwind', si: 'siTailwindcss' },
      { name: 'Figma', si: 'siFigma' },
      { name: 'HTML5', si: 'siHtml5' },
      { name: 'Sass', si: 'siSass' },
    ],
  },
  {
    name: '3D / MOTION',
    code: 'MX',
    accent: '#6df7ff',
    items: [
      { name: 'Three.js', si: 'siThreedotjs' },
      { name: 'WebGL', si: 'siWebgl' },
      { name: 'WebGPU', si: 'siWebgpu' },
      { name: 'GSAP', si: 'siGreensock' },
      { name: 'Framer', si: 'siFramer' },
      { name: 'Blender', si: 'siBlender' },
    ],
  },
  {
    name: 'SYSTEMS',
    code: 'SY',
    accent: '#b8a0ff',
    items: [
      { name: 'Node.js', si: 'siNodedotjs' },
      { name: 'Vite', si: 'siVite' },
      { name: 'WASM', si: 'siWebassembly' },
      { name: 'Docker', si: 'siDocker' },
      { name: 'GraphQL', si: 'siGraphql' },
      { name: 'Git', si: 'siGit' },
    ],
  },
]

export const TOOLKIT_ACCENTS = TOOLKIT_CLUSTERS.map((c) => c.accent)

export type ToolkitFlatTool = ToolkitTool & { cluster: number; local: number; accent: string }

// Flat tool list, tagged with its lobe + its position within that lobe, so a
// hovered tool maps straight to a 3D logo. Cluster sizes can differ, so use
// TOOLKIT_CLUSTER_OFFSET (not cluster*N) to find a lobe's first flat index.
export const TOOLKIT_TOOLS: ToolkitFlatTool[] = TOOLKIT_CLUSTERS.flatMap((cluster, c) =>
  cluster.items.map((tool, local) => ({ ...tool, cluster: c, local, accent: cluster.accent })),
)

// First flat index of each cluster within TOOLKIT_TOOLS.
export const TOOLKIT_CLUSTER_OFFSET: number[] = (() => {
  const offsets: number[] = []
  let acc = 0
  for (const cluster of TOOLKIT_CLUSTERS) {
    offsets.push(acc)
    acc += cluster.items.length
  }
  return offsets
})()
