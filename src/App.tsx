import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  AudioLines,
  Binary,
  Box,
  Braces,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Code2,
  Cpu,
  Database,
  Gauge,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  MoveRight,
  Pause,
  Play,
  Radio,
  ScanLine,
  TerminalSquare,
  Workflow,
  X,
  Zap,
} from 'lucide-react'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Group, Mesh } from 'three'

const projects = [
  {
    index: '01',
    title: 'NEURAL\nWEATHER',
    type: 'EXPERIMENTAL / AI',
    year: '2026',
    description: 'A living climate interface that transforms atmospheric data into generative spatial systems.',
    tags: ['NEXT.JS', 'THREE.JS', 'GLSL'],
    theme: 'weather',
  },
  {
    index: '02',
    title: 'NOIR\nSYSTEMS',
    type: 'COMMERCE / PLATFORM',
    year: '2025',
    description: 'An uncompromising digital flagship and modular commerce engine for an independent fashion house.',
    tags: ['REACT', 'WEBGL', 'SHOPIFY'],
    theme: 'noir',
  },
  {
    index: '03',
    title: 'SYNTHETIC\nMEMORY',
    type: 'ARCHIVE / CULTURE',
    year: '2025',
    description: 'A non-linear cultural archive where sound, image, and language collide in real time.',
    tags: ['TYPESCRIPT', 'R3F', 'WEB AUDIO'],
    theme: 'memory',
  },
]

const capabilities = [
  ['01', 'CREATIVE DEVELOPMENT', 'Interfaces with a point of view. Built from first principles with motion, sound, and interaction as core materials.'],
  ['02', 'FRONTEND ARCHITECTURE', 'Scalable systems, thoughtful APIs, and production code engineered to remain fast under pressure.'],
  ['03', '3D & WEBGL', 'Real-time worlds, custom shaders, and spatial experiences optimized for the open web.'],
  ['04', 'TECHNICAL DIRECTION', 'A practical bridge between ambitious creative vision and dependable engineering execution.'],
]

const experiments = [
  {
    id: 'EXP_001',
    title: 'VECTOR BLOOM',
    category: 'WEBGL',
    year: '2026',
    status: 'LIVE',
    color: '#c6ff00',
    secondary: '#6df7ff',
    shape: 'orbital',
    description: 'Reactive vector fields mapped through a fluid particle lattice.',
  },
  {
    id: 'EXP_002',
    title: 'CHROMA SHIFT',
    category: 'MOTION',
    year: '2026',
    status: 'LIVE',
    color: '#ff4db8',
    secondary: '#ffb000',
    shape: 'prism',
    description: 'A kinetic type engine with variable chromatic aberration.',
  },
  {
    id: 'EXP_003',
    title: 'SOFT BODY 01',
    category: 'WEBGL',
    year: '2026',
    status: 'R&D',
    color: '#6df7ff',
    secondary: '#755cff',
    shape: 'membrane',
    description: 'GPU-driven surface deformation reacting to pointer velocity.',
  },
  {
    id: 'EXP_004',
    title: 'SIGNAL / NOISE',
    category: 'GENERATIVE',
    year: '2025',
    status: 'LIVE',
    color: '#f2f1eb',
    secondary: '#c6ff00',
    shape: 'signal',
    description: 'A deterministic system for drawing order from random inputs.',
  },
  {
    id: 'EXP_005',
    title: 'TYPE CASCADE',
    category: 'MOTION',
    year: '2025',
    status: 'ARCHIVE',
    color: '#ff6b35',
    secondary: '#ffdd33',
    shape: 'cascade',
    description: 'Variable type choreographed across depth and scroll velocity.',
  },
  {
    id: 'EXP_006',
    title: 'DREAM INDEX',
    category: 'GENERATIVE',
    year: '2025',
    status: 'LIVE',
    color: '#de9cff',
    secondary: '#83fff2',
    shape: 'index',
    description: 'Latent visual fragments catalogued by mood and texture.',
  },
  {
    id: 'EXP_007',
    title: 'VOID TUNNEL',
    category: 'WEBGL',
    year: '2025',
    status: 'R&D',
    color: '#ffffff',
    secondary: '#5c74ff',
    shape: 'tunnel',
    description: 'An infinite signed-distance corridor rendered in one shader.',
  },
  {
    id: 'EXP_008',
    title: 'SONIC DUST',
    category: 'GENERATIVE',
    year: '2024',
    status: 'LIVE',
    color: '#ffd447',
    secondary: '#ff4267',
    shape: 'dust',
    description: 'Frequency data translated into a volatile particle score.',
  },
  {
    id: 'EXP_009',
    title: 'MONO MACHINE',
    category: 'MOTION',
    year: '2024',
    status: 'ARCHIVE',
    color: '#eeeeee',
    secondary: '#777777',
    shape: 'machine',
    description: 'Mechanical motion language built from strict monochrome rules.',
  },
]

const experience = [
  {
    period: '2023 — NOW',
    role: 'INDEPENDENT CREATIVE DEVELOPER',
    studio: 'ALEX RIVERA STUDIO',
    location: 'NEW YORK / GLOBAL',
    detail: 'Partnering directly with cultural institutions, product teams, and independent founders to create defining digital work.',
    clients: ['NIKE', 'APPLE', 'NEW MUSEUM', 'ARC’TERYX'],
  },
  {
    period: '2020 — 2023',
    role: 'TECHNICAL DIRECTOR',
    studio: 'FORM&FUNCTION',
    location: 'NEW YORK',
    detail: 'Led a multidisciplinary engineering group delivering experimental platforms, commerce systems, and installations.',
    clients: ['GOOGLE', 'SPOTIFY', 'PATAGONIA', 'SONOS'],
  },
  {
    period: '2017 — 2020',
    role: 'SENIOR CREATIVE DEVELOPER',
    studio: 'NORTH / EAST',
    location: 'LONDON',
    detail: 'Built award-winning campaign experiences and codified the studio’s approach to motion, WebGL, and accessibility.',
    clients: ['ADIDAS', 'V&A', 'MONOCLE', 'LEGO'],
  },
  {
    period: '2014 — 2017',
    role: 'INTERACTION ENGINEER',
    studio: 'FIELD OFFICE',
    location: 'BERLIN',
    detail: 'Explored the emerging browser graphics stack through installations, identity systems, and generative tools.',
    clients: ['A24', 'NASA JPL', 'MIT', 'VITRA'],
  },
]

const principles = [
  {
    number: '01',
    title: 'MOTION IS\nINFORMATION',
    body: 'Animation is not decoration. It explains hierarchy, establishes causality, and gives interfaces a physical logic people can understand.',
    accent: 'acid',
  },
  {
    number: '02',
    title: 'SPEED IS\nA FEATURE',
    body: 'Visual ambition means nothing if the work cannot move at sixty frames per second on the device already in someone’s hand.',
    accent: 'cyan',
  },
  {
    number: '03',
    title: 'SYSTEMS CREATE\nFREEDOM',
    body: 'Strong constraints make room for surprise. Every expressive moment should emerge from a coherent and maintainable foundation.',
    accent: 'pink',
  },
  {
    number: '04',
    title: 'DETAILS CARRY\nTHE IDEA',
    body: 'The final ten percent is where a digital product gains character: rhythm, sound, easing, copy, focus states, and edge cases.',
    accent: 'orange',
  },
]

const technologies = [
  'REACT',
  'TYPESCRIPT',
  'THREE.JS',
  'WEBGL',
  'GLSL',
  'FRAMER MOTION',
  'NEXT.JS',
  'NODE.JS',
  'R3F',
  'WEB AUDIO',
  'GSAP',
  'VITE',
  'D3.JS',
  'CANVAS',
  'WASM',
  'FIGMA',
]

const recognition = [
  ['AWWWARDS', 'INDEPENDENT OF THE DAY', '2026'],
  ['CSS DESIGN AWARDS', 'SPECIAL KUDOS × 3', '2026'],
  ['THE FWA', 'SITE OF THE DAY', '2025'],
  ['AWWWARDS', 'DEVELOPER AWARD × 4', '2025'],
  ['CSS DESIGN AWARDS', 'WEBSITE OF THE DAY', '2024'],
  ['TYPE DIRECTORS CLUB', 'CERTIFICATE OF EXCELLENCE', '2024'],
]

type SignalNode = {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  driftX: number
  driftY: number
  hue: number
}

const signalNodes: SignalNode[] = [
  /* SIGNAL_NODE_DATA_START */
  {
    id: 1, x: 74.008, y: 47.646,
    size: 5.00, opacity: 0.427,
    duration: 7.58, delay: -4.70,
    driftX: -55.48, driftY: -26.45,
    hue: 63,
  },
  {
    id: 2, x: 56.440, y: 8.621,
    size: 4.30, opacity: 0.164,
    duration: 17.28, delay: -3.64,
    driftX: 3.36, driftY: 1.35,
    hue: 66,
  },
  {
    id: 3, x: 45.475, y: 66.425,
    size: 2.73, opacity: 0.283,
    duration: 16.75, delay: -5.03,
    driftX: 46.67, driftY: -31.43,
    hue: 93,
  },
  {
    id: 4, x: 27.240, y: 41.191,
    size: 7.48, opacity: 0.977,
    duration: 16.44, delay: -10.40,
    driftX: 6.57, driftY: -31.91,
    hue: 90,
  },
  {
    id: 5, x: 82.345, y: 39.049,
    size: 6.55, opacity: 0.789,
    duration: 11.65, delay: -0.66,
    driftX: -48.61, driftY: -42.75,
    hue: 97,
  },
  {
    id: 6, x: 75.284, y: 62.206,
    size: 3.83, opacity: 0.356,
    duration: 12.45, delay: -5.68,
    driftX: 37.53, driftY: -45.18,
    hue: 14,
  },
  {
    id: 7, x: 50.376, y: 60.184,
    size: 4.97, opacity: 0.729,
    duration: 11.99, delay: -11.17,
    driftX: -7.38, driftY: -6.08,
    hue: 16,
  },
  {
    id: 8, x: 52.344, y: 92.282,
    size: 1.85, opacity: 0.748,
    duration: 4.70, delay: -1.87,
    driftX: 46.02, driftY: 19.03,
    hue: 69,
  },
  {
    id: 9, x: 52.178, y: 46.543,
    size: 5.38, opacity: 0.474,
    duration: 11.94, delay: -10.33,
    driftX: -11.49, driftY: -10.98,
    hue: 71,
  },
  {
    id: 10, x: 1.990, y: 87.964,
    size: 2.55, opacity: 0.741,
    duration: 15.91, delay: -2.21,
    driftX: 47.88, driftY: 57.76,
    hue: 26,
  },
  {
    id: 11, x: 59.234, y: 59.816,
    size: 6.32, opacity: 0.833,
    duration: 9.56, delay: -1.04,
    driftX: -23.95, driftY: -32.77,
    hue: 29,
  },
  {
    id: 12, x: 61.112, y: 91.629,
    size: 4.73, opacity: 0.899,
    duration: 17.91, delay: -4.61,
    driftX: 13.80, driftY: 0.59,
    hue: 103,
  },
  {
    id: 13, x: 40.132, y: 28.704,
    size: 3.00, opacity: 0.820,
    duration: 6.29, delay: -6.75,
    driftX: -40.76, driftY: 14.28,
    hue: 27,
  },
  {
    id: 14, x: 84.906, y: 73.571,
    size: 3.74, opacity: 0.835,
    duration: 17.59, delay: -9.69,
    driftX: -42.14, driftY: -17.68,
    hue: 87,
  },
  {
    id: 15, x: 34.080, y: 58.632,
    size: 5.53, opacity: 0.400,
    duration: 7.03, delay: -3.39,
    driftX: -35.41, driftY: 55.29,
    hue: 66,
  },
  {
    id: 16, x: 42.241, y: 46.097,
    size: 5.36, opacity: 0.488,
    duration: 12.03, delay: -11.73,
    driftX: -7.74, driftY: -56.47,
    hue: 102,
  },
  {
    id: 17, x: 23.781, y: 80.169,
    size: 5.85, opacity: 0.456,
    duration: 16.77, delay: -10.73,
    driftX: 4.80, driftY: 52.35,
    hue: 73,
  },
  {
    id: 18, x: 98.731, y: 10.241,
    size: 3.19, opacity: 0.515,
    duration: 8.16, delay: -4.36,
    driftX: 9.68, driftY: -53.57,
    hue: 14,
  },
  {
    id: 19, x: 70.998, y: 28.817,
    size: 5.59, opacity: 0.761,
    duration: 17.09, delay: -3.99,
    driftX: 33.80, driftY: -41.61,
    hue: 23,
  },
  {
    id: 20, x: 86.556, y: 43.842,
    size: 2.21, opacity: 0.788,
    duration: 14.80, delay: -1.41,
    driftX: -38.14, driftY: -46.05,
    hue: 0,
  },
  {
    id: 21, x: 85.196, y: 78.132,
    size: 5.96, opacity: 0.225,
    duration: 16.23, delay: -8.48,
    driftX: -23.74, driftY: 22.10,
    hue: 61,
  },
  {
    id: 22, x: 4.346, y: 99.305,
    size: 6.10, opacity: 0.244,
    duration: 10.42, delay: -6.77,
    driftX: -39.02, driftY: -30.38,
    hue: 103,
  },
  {
    id: 23, x: 62.806, y: 54.062,
    size: 1.71, opacity: 0.226,
    duration: 8.12, delay: -4.17,
    driftX: -16.16, driftY: -0.50,
    hue: 96,
  },
  {
    id: 24, x: 93.352, y: 39.656,
    size: 5.89, opacity: 0.677,
    duration: 9.57, delay: -0.26,
    driftX: -40.02, driftY: 1.05,
    hue: 26,
  },
  {
    id: 25, x: 22.815, y: 5.933,
    size: 6.22, opacity: 0.211,
    duration: 11.03, delay: -4.07,
    driftX: 1.96, driftY: 35.64,
    hue: 58,
  },
  {
    id: 26, x: 76.585, y: 73.478,
    size: 6.81, opacity: 0.902,
    duration: 16.51, delay: -3.30,
    driftX: -14.52, driftY: 4.36,
    hue: 14,
  },
  {
    id: 27, x: 15.483, y: 7.302,
    size: 7.48, opacity: 0.169,
    duration: 17.34, delay: -11.55,
    driftX: -36.10, driftY: 33.55,
    hue: 70,
  },
  {
    id: 28, x: 91.190, y: 49.891,
    size: 7.57, opacity: 0.948,
    duration: 8.63, delay: -10.03,
    driftX: -42.77, driftY: 46.36,
    hue: 107,
  },
  {
    id: 29, x: 17.799, y: 91.954,
    size: 6.59, opacity: 0.583,
    duration: 16.13, delay: -5.81,
    driftX: 43.28, driftY: -34.57,
    hue: 10,
  },
  {
    id: 30, x: 34.370, y: 18.631,
    size: 5.39, opacity: 0.270,
    duration: 10.80, delay: -10.94,
    driftX: -44.11, driftY: -56.25,
    hue: 13,
  },
  {
    id: 31, x: 56.368, y: 55.256,
    size: 1.63, opacity: 0.751,
    duration: 10.32, delay: -4.50,
    driftX: -44.85, driftY: 0.17,
    hue: 52,
  },
  {
    id: 32, x: 36.775, y: 5.660,
    size: 1.85, opacity: 0.344,
    duration: 16.54, delay: -6.62,
    driftX: -18.97, driftY: -39.32,
    hue: 47,
  },
  {
    id: 33, x: 40.432, y: 86.017,
    size: 3.85, opacity: 0.231,
    duration: 15.46, delay: -6.30,
    driftX: -43.86, driftY: 54.21,
    hue: 4,
  },
  {
    id: 34, x: 57.015, y: 7.197,
    size: 7.08, opacity: 0.270,
    duration: 17.81, delay: -9.75,
    driftX: 51.46, driftY: -14.49,
    hue: 47,
  },
  {
    id: 35, x: 11.458, y: 81.613,
    size: 4.83, opacity: 0.860,
    duration: 19.60, delay: -0.41,
    driftX: 10.23, driftY: -32.58,
    hue: 86,
  },
  {
    id: 36, x: 63.963, y: 64.245,
    size: 7.65, opacity: 0.549,
    duration: 9.26, delay: -6.50,
    driftX: -2.44, driftY: -15.31,
    hue: 97,
  },
  {
    id: 37, x: 96.066, y: 94.285,
    size: 1.55, opacity: 0.449,
    duration: 9.71, delay: -1.94,
    driftX: -32.05, driftY: -23.67,
    hue: 28,
  },
  {
    id: 38, x: 24.883, y: 62.165,
    size: 4.77, opacity: 0.634,
    duration: 15.09, delay: -5.13,
    driftX: -3.13, driftY: 53.83,
    hue: 88,
  },
  {
    id: 39, x: 26.216, y: 64.616,
    size: 4.19, opacity: 0.773,
    duration: 16.47, delay: -7.58,
    driftX: 10.06, driftY: -28.00,
    hue: 19,
  },
  {
    id: 40, x: 78.223, y: 91.611,
    size: 7.15, opacity: 0.405,
    duration: 10.20, delay: -1.27,
    driftX: 2.66, driftY: -19.14,
    hue: 8,
  },
  {
    id: 41, x: 85.399, y: 4.554,
    size: 2.10, opacity: 0.947,
    duration: 8.70, delay: -6.12,
    driftX: 41.75, driftY: -15.80,
    hue: 24,
  },
  {
    id: 42, x: 63.983, y: 23.428,
    size: 2.13, opacity: 0.286,
    duration: 19.20, delay: -7.42,
    driftX: -43.28, driftY: -0.67,
    hue: 2,
  },
  {
    id: 43, x: 7.996, y: 89.542,
    size: 7.72, opacity: 0.768,
    duration: 11.83, delay: -8.17,
    driftX: -31.65, driftY: -51.36,
    hue: 106,
  },
  {
    id: 44, x: 49.803, y: 30.246,
    size: 5.07, opacity: 0.960,
    duration: 15.28, delay: -7.04,
    driftX: -27.99, driftY: -43.87,
    hue: 6,
  },
  {
    id: 45, x: 80.868, y: 35.068,
    size: 5.03, opacity: 0.870,
    duration: 19.88, delay: -9.41,
    driftX: -8.91, driftY: -50.24,
    hue: 92,
  },
  {
    id: 46, x: 73.841, y: 50.146,
    size: 7.91, opacity: 0.954,
    duration: 16.95, delay: -5.63,
    driftX: -23.57, driftY: -29.65,
    hue: 83,
  },
  {
    id: 47, x: 8.852, y: 16.106,
    size: 5.27, opacity: 0.951,
    duration: 12.08, delay: -4.52,
    driftX: 19.49, driftY: 14.15,
    hue: 62,
  },
  {
    id: 48, x: 43.320, y: 16.577,
    size: 4.31, opacity: 0.994,
    duration: 11.18, delay: -1.10,
    driftX: -41.04, driftY: 8.60,
    hue: 103,
  },
  {
    id: 49, x: 98.522, y: 98.892,
    size: 7.48, opacity: 0.741,
    duration: 5.96, delay: -3.73,
    driftX: -21.75, driftY: -28.07,
    hue: 58,
  },
  {
    id: 50, x: 90.769, y: 17.955,
    size: 2.42, opacity: 0.754,
    duration: 16.31, delay: -11.07,
    driftX: -18.69, driftY: -15.92,
    hue: 84,
  },
  {
    id: 51, x: 48.150, y: 64.867,
    size: 5.28, opacity: 0.915,
    duration: 5.24, delay: -7.95,
    driftX: -48.50, driftY: -41.44,
    hue: 90,
  },
  {
    id: 52, x: 35.120, y: 54.639,
    size: 5.89, opacity: 0.746,
    duration: 19.23, delay: -1.77,
    driftX: -53.03, driftY: -15.21,
    hue: 81,
  },
  {
    id: 53, x: 49.103, y: 95.594,
    size: 3.71, opacity: 0.945,
    duration: 14.89, delay: -0.88,
    driftX: 0.53, driftY: 40.74,
    hue: 71,
  },
  {
    id: 54, x: 7.661, y: 73.627,
    size: 7.12, opacity: 0.722,
    duration: 8.45, delay: -2.55,
    driftX: -5.63, driftY: 26.32,
    hue: 61,
  },
  {
    id: 55, x: 91.041, y: 72.866,
    size: 4.91, opacity: 0.352,
    duration: 13.94, delay: -4.82,
    driftX: 33.36, driftY: -55.98,
    hue: 29,
  },
  {
    id: 56, x: 29.375, y: 75.024,
    size: 5.53, opacity: 0.423,
    duration: 10.36, delay: -8.47,
    driftX: 4.58, driftY: 22.97,
    hue: 53,
  },
  {
    id: 57, x: 34.114, y: 22.594,
    size: 3.53, opacity: 0.491,
    duration: 9.76, delay: -1.94,
    driftX: 42.33, driftY: -46.47,
    hue: 15,
  },
  {
    id: 58, x: 61.673, y: 46.651,
    size: 7.63, opacity: 0.528,
    duration: 14.66, delay: -4.34,
    driftX: -58.19, driftY: 3.08,
    hue: 11,
  },
  {
    id: 59, x: 59.457, y: 92.068,
    size: 6.49, opacity: 0.902,
    duration: 12.33, delay: -5.89,
    driftX: 24.94, driftY: 32.02,
    hue: 6,
  },
  {
    id: 60, x: 51.363, y: 74.246,
    size: 7.85, opacity: 0.365,
    duration: 18.35, delay: -6.66,
    driftX: 26.31, driftY: -52.80,
    hue: 37,
  },
  {
    id: 61, x: 28.344, y: 12.718,
    size: 6.68, opacity: 0.788,
    duration: 14.02, delay: -2.31,
    driftX: -50.49, driftY: 33.73,
    hue: 52,
  },
  {
    id: 62, x: 94.021, y: 65.279,
    size: 6.39, opacity: 0.733,
    duration: 8.27, delay: -7.15,
    driftX: 5.28, driftY: 10.00,
    hue: 56,
  },
  {
    id: 63, x: 95.562, y: 76.986,
    size: 2.86, opacity: 0.645,
    duration: 20.22, delay: -7.22,
    driftX: 49.59, driftY: -26.92,
    hue: 68,
  },
  {
    id: 64, x: 13.952, y: 16.618,
    size: 1.91, opacity: 0.220,
    duration: 18.28, delay: -6.31,
    driftX: -41.66, driftY: 8.94,
    hue: 85,
  },
  {
    id: 65, x: 69.938, y: 48.272,
    size: 1.94, opacity: 0.895,
    duration: 12.19, delay: -11.86,
    driftX: -6.29, driftY: -7.46,
    hue: 57,
  },
  {
    id: 66, x: 8.168, y: 88.521,
    size: 6.49, opacity: 0.442,
    duration: 5.17, delay: -2.64,
    driftX: 30.16, driftY: 14.93,
    hue: 20,
  },
  {
    id: 67, x: 98.737, y: 77.130,
    size: 3.88, opacity: 0.682,
    duration: 8.11, delay: -8.54,
    driftX: 23.72, driftY: 1.91,
    hue: 42,
  },
  {
    id: 68, x: 53.153, y: 28.243,
    size: 4.40, opacity: 0.178,
    duration: 10.50, delay: -10.72,
    driftX: 59.92, driftY: -49.18,
    hue: 36,
  },
  {
    id: 69, x: 39.994, y: 4.657,
    size: 6.21, opacity: 0.569,
    duration: 13.40, delay: -2.55,
    driftX: -9.61, driftY: 55.19,
    hue: 57,
  },
  {
    id: 70, x: 59.741, y: 39.057,
    size: 7.58, opacity: 0.179,
    duration: 16.52, delay: -10.88,
    driftX: 14.69, driftY: -2.71,
    hue: 102,
  },
  {
    id: 71, x: 44.720, y: 33.226,
    size: 5.17, opacity: 0.997,
    duration: 11.39, delay: -2.90,
    driftX: -2.57, driftY: 50.65,
    hue: 62,
  },
  {
    id: 72, x: 46.415, y: 73.964,
    size: 7.42, opacity: 0.885,
    duration: 6.48, delay: -5.78,
    driftX: 38.04, driftY: 49.47,
    hue: 105,
  },
  {
    id: 73, x: 0.476, y: 69.369,
    size: 6.10, opacity: 0.819,
    duration: 13.85, delay: -9.90,
    driftX: -42.56, driftY: 37.16,
    hue: 23,
  },
  {
    id: 74, x: 72.903, y: 1.760,
    size: 7.97, opacity: 0.800,
    duration: 14.95, delay: -10.99,
    driftX: 36.32, driftY: -20.41,
    hue: 29,
  },
  {
    id: 75, x: 33.315, y: 8.757,
    size: 2.94, opacity: 0.208,
    duration: 11.16, delay: -11.98,
    driftX: -30.96, driftY: 30.02,
    hue: 74,
  },
  {
    id: 76, x: 23.584, y: 33.330,
    size: 7.69, opacity: 0.735,
    duration: 14.17, delay: -6.38,
    driftX: 5.84, driftY: 3.50,
    hue: 54,
  },
  {
    id: 77, x: 81.963, y: 33.660,
    size: 5.63, opacity: 0.497,
    duration: 18.47, delay: -7.04,
    driftX: -11.51, driftY: -27.52,
    hue: 48,
  },
  {
    id: 78, x: 98.006, y: 0.258,
    size: 3.14, opacity: 0.815,
    duration: 7.20, delay: -11.89,
    driftX: -16.54, driftY: -47.30,
    hue: 29,
  },
  {
    id: 79, x: 26.860, y: 69.712,
    size: 4.62, opacity: 0.232,
    duration: 12.62, delay: -10.89,
    driftX: 4.09, driftY: -10.51,
    hue: 57,
  },
  {
    id: 80, x: 8.723, y: 3.857,
    size: 3.19, opacity: 0.652,
    duration: 15.68, delay: -7.09,
    driftX: 39.28, driftY: -24.13,
    hue: 76,
  },
  {
    id: 81, x: 53.068, y: 12.544,
    size: 3.92, opacity: 0.258,
    duration: 13.85, delay: -10.69,
    driftX: 43.98, driftY: 53.25,
    hue: 103,
  },
  {
    id: 82, x: 37.953, y: 48.112,
    size: 2.18, opacity: 0.769,
    duration: 18.13, delay: -10.18,
    driftX: 29.89, driftY: -54.30,
    hue: 57,
  },
  {
    id: 83, x: 68.323, y: 28.541,
    size: 6.07, opacity: 0.754,
    duration: 19.70, delay: -5.24,
    driftX: 22.21, driftY: 24.40,
    hue: 49,
  },
  {
    id: 84, x: 76.509, y: 78.465,
    size: 3.30, opacity: 0.465,
    duration: 16.31, delay: -11.89,
    driftX: 49.83, driftY: -42.41,
    hue: 34,
  },
  {
    id: 85, x: 62.166, y: 35.964,
    size: 5.52, opacity: 0.309,
    duration: 6.71, delay: -0.24,
    driftX: 38.21, driftY: -1.46,
    hue: 42,
  },
  {
    id: 86, x: 61.384, y: 47.583,
    size: 2.61, opacity: 0.723,
    duration: 15.80, delay: -10.76,
    driftX: 43.58, driftY: 57.48,
    hue: 101,
  },
  {
    id: 87, x: 12.975, y: 26.896,
    size: 3.41, opacity: 0.806,
    duration: 9.99, delay: -5.79,
    driftX: 7.59, driftY: -54.18,
    hue: 43,
  },
  {
    id: 88, x: 45.844, y: 49.656,
    size: 3.23, opacity: 0.953,
    duration: 19.75, delay: -7.73,
    driftX: -11.85, driftY: 31.43,
    hue: 2,
  },
  {
    id: 89, x: 58.181, y: 1.012,
    size: 3.30, opacity: 0.849,
    duration: 8.39, delay: -10.58,
    driftX: -1.00, driftY: 20.25,
    hue: 64,
  },
  {
    id: 90, x: 17.386, y: 16.679,
    size: 4.46, opacity: 0.952,
    duration: 7.18, delay: -11.85,
    driftX: 45.29, driftY: 35.75,
    hue: 40,
  },
  {
    id: 91, x: 27.218, y: 12.656,
    size: 2.89, opacity: 0.371,
    duration: 11.56, delay: -6.35,
    driftX: 42.60, driftY: 46.75,
    hue: 76,
  },
  {
    id: 92, x: 93.424, y: 32.713,
    size: 7.39, opacity: 0.848,
    duration: 15.61, delay: -10.88,
    driftX: -48.81, driftY: 29.92,
    hue: 20,
  },
  {
    id: 93, x: 61.855, y: 83.256,
    size: 7.86, opacity: 0.161,
    duration: 19.87, delay: -7.78,
    driftX: -34.97, driftY: 28.39,
    hue: 41,
  },
  {
    id: 94, x: 66.272, y: 70.607,
    size: 3.54, opacity: 0.687,
    duration: 11.83, delay: -8.72,
    driftX: -1.84, driftY: -39.10,
    hue: 29,
  },
  {
    id: 95, x: 84.177, y: 57.795,
    size: 5.15, opacity: 0.804,
    duration: 4.64, delay: -3.68,
    driftX: -17.93, driftY: 23.85,
    hue: 105,
  },
  {
    id: 96, x: 35.620, y: 87.388,
    size: 7.39, opacity: 0.936,
    duration: 8.58, delay: -11.14,
    driftX: 17.56, driftY: 34.34,
    hue: 20,
  },
  {
    id: 97, x: 83.893, y: 45.454,
    size: 2.90, opacity: 0.775,
    duration: 4.63, delay: -4.62,
    driftX: -23.22, driftY: 0.61,
    hue: 100,
  },
  {
    id: 98, x: 45.874, y: 58.677,
    size: 7.30, opacity: 0.939,
    duration: 12.00, delay: -2.36,
    driftX: -10.98, driftY: 29.81,
    hue: 43,
  },
  {
    id: 99, x: 26.834, y: 95.246,
    size: 3.64, opacity: 0.689,
    duration: 8.20, delay: -9.55,
    driftX: -48.86, driftY: 1.87,
    hue: 38,
  },
  {
    id: 100, x: 58.899, y: 60.451,
    size: 3.59, opacity: 0.664,
    duration: 16.54, delay: -9.84,
    driftX: 0.40, driftY: -44.08,
    hue: 51,
  },
  {
    id: 101, x: 3.845, y: 0.225,
    size: 6.40, opacity: 0.812,
    duration: 10.02, delay: -9.58,
    driftX: -57.30, driftY: -19.30,
    hue: 87,
  },
  {
    id: 102, x: 35.507, y: 4.665,
    size: 7.60, opacity: 0.565,
    duration: 20.02, delay: -0.22,
    driftX: 20.81, driftY: 14.38,
    hue: 31,
  },
  {
    id: 103, x: 88.112, y: 18.200,
    size: 7.24, opacity: 0.683,
    duration: 7.77, delay: -11.46,
    driftX: 22.85, driftY: 6.89,
    hue: 20,
  },
  {
    id: 104, x: 19.319, y: 45.874,
    size: 2.79, opacity: 0.241,
    duration: 18.67, delay: -7.95,
    driftX: -49.93, driftY: -23.98,
    hue: 70,
  },
  {
    id: 105, x: 90.974, y: 81.210,
    size: 6.62, opacity: 0.579,
    duration: 18.16, delay: -5.69,
    driftX: -33.06, driftY: 28.42,
    hue: 34,
  },
  {
    id: 106, x: 64.952, y: 64.010,
    size: 5.79, opacity: 0.880,
    duration: 12.88, delay: -3.52,
    driftX: -29.52, driftY: -35.79,
    hue: 108,
  },
  {
    id: 107, x: 75.925, y: 9.496,
    size: 7.34, opacity: 0.472,
    duration: 11.39, delay: -3.96,
    driftX: 54.22, driftY: 51.39,
    hue: 20,
  },
  {
    id: 108, x: 6.749, y: 92.760,
    size: 5.95, opacity: 0.196,
    duration: 12.60, delay: -5.61,
    driftX: 52.42, driftY: -8.91,
    hue: 80,
  },
  {
    id: 109, x: 67.489, y: 41.292,
    size: 5.76, opacity: 0.663,
    duration: 7.57, delay: -1.60,
    driftX: 55.28, driftY: -2.64,
    hue: 66,
  },
  {
    id: 110, x: 94.012, y: 30.684,
    size: 5.83, opacity: 0.975,
    duration: 6.71, delay: -11.88,
    driftX: 36.67, driftY: -34.74,
    hue: 7,
  },
  {
    id: 111, x: 57.660, y: 40.571,
    size: 4.62, opacity: 0.778,
    duration: 19.85, delay: -2.55,
    driftX: -54.88, driftY: -26.08,
    hue: 25,
  },
  {
    id: 112, x: 54.144, y: 40.046,
    size: 3.21, opacity: 0.553,
    duration: 13.48, delay: -0.18,
    driftX: 48.48, driftY: 13.36,
    hue: 86,
  },
  {
    id: 113, x: 63.323, y: 73.373,
    size: 5.65, opacity: 0.726,
    duration: 5.78, delay: -7.40,
    driftX: -51.37, driftY: -17.73,
    hue: 43,
  },
  {
    id: 114, x: 62.001, y: 30.903,
    size: 2.53, opacity: 0.833,
    duration: 19.09, delay: -8.93,
    driftX: 32.14, driftY: -12.14,
    hue: 33,
  },
  {
    id: 115, x: 96.238, y: 54.892,
    size: 7.89, opacity: 0.705,
    duration: 9.91, delay: -0.16,
    driftX: -42.99, driftY: 32.83,
    hue: 70,
  },
  {
    id: 116, x: 91.464, y: 80.557,
    size: 6.00, opacity: 0.642,
    duration: 11.20, delay: -4.23,
    driftX: -12.16, driftY: -48.43,
    hue: 31,
  },
  {
    id: 117, x: 3.019, y: 98.294,
    size: 4.18, opacity: 0.657,
    duration: 19.24, delay: -9.97,
    driftX: 33.92, driftY: 27.80,
    hue: 47,
  },
  {
    id: 118, x: 81.893, y: 39.611,
    size: 2.15, opacity: 0.248,
    duration: 13.85, delay: -4.84,
    driftX: -50.19, driftY: 32.10,
    hue: 23,
  },
  {
    id: 119, x: 90.265, y: 4.166,
    size: 7.67, opacity: 0.549,
    duration: 15.68, delay: -9.04,
    driftX: -23.22, driftY: -5.19,
    hue: 79,
  },
  {
    id: 120, x: 31.742, y: 90.746,
    size: 3.56, opacity: 0.388,
    duration: 9.73, delay: -5.74,
    driftX: 19.16, driftY: -58.88,
    hue: 79,
  },
  {
    id: 121, x: 14.832, y: 16.078,
    size: 6.38, opacity: 0.830,
    duration: 20.33, delay: -0.13,
    driftX: -38.65, driftY: 29.55,
    hue: 20,
  },
  {
    id: 122, x: 99.816, y: 51.558,
    size: 5.75, opacity: 0.304,
    duration: 7.44, delay: -10.62,
    driftX: 43.69, driftY: 2.77,
    hue: 47,
  },
  {
    id: 123, x: 59.273, y: 71.675,
    size: 5.22, opacity: 0.198,
    duration: 5.93, delay: -10.84,
    driftX: 41.60, driftY: 55.38,
    hue: 39,
  },
  {
    id: 124, x: 73.312, y: 19.729,
    size: 5.00, opacity: 0.874,
    duration: 8.34, delay: -2.70,
    driftX: 43.27, driftY: -47.70,
    hue: 19,
  },
  {
    id: 125, x: 60.339, y: 96.120,
    size: 2.00, opacity: 0.417,
    duration: 19.66, delay: -10.03,
    driftX: 46.14, driftY: -39.65,
    hue: 90,
  },
  {
    id: 126, x: 75.666, y: 80.283,
    size: 6.37, opacity: 0.822,
    duration: 20.06, delay: -3.57,
    driftX: 25.47, driftY: 56.37,
    hue: 67,
  },
  {
    id: 127, x: 59.197, y: 96.859,
    size: 7.93, opacity: 0.861,
    duration: 6.03, delay: -3.86,
    driftX: -5.14, driftY: -30.85,
    hue: 96,
  },
  {
    id: 128, x: 30.598, y: 18.237,
    size: 3.75, opacity: 0.164,
    duration: 5.25, delay: -1.05,
    driftX: 8.27, driftY: 23.23,
    hue: 63,
  },
  {
    id: 129, x: 19.246, y: 32.971,
    size: 4.52, opacity: 0.673,
    duration: 6.87, delay: -9.46,
    driftX: -17.12, driftY: -30.51,
    hue: 13,
  },
  {
    id: 130, x: 8.774, y: 1.385,
    size: 6.09, opacity: 0.323,
    duration: 11.28, delay: -10.65,
    driftX: -2.25, driftY: -46.70,
    hue: 108,
  },
  {
    id: 131, x: 38.397, y: 78.786,
    size: 4.18, opacity: 0.337,
    duration: 19.45, delay: -2.25,
    driftX: 2.93, driftY: -57.45,
    hue: 41,
  },
  {
    id: 132, x: 89.063, y: 60.548,
    size: 4.08, opacity: 0.974,
    duration: 5.05, delay: -5.77,
    driftX: 10.21, driftY: 7.39,
    hue: 63,
  },
  {
    id: 133, x: 41.170, y: 7.934,
    size: 6.62, opacity: 0.418,
    duration: 5.85, delay: -1.08,
    driftX: 40.58, driftY: -9.83,
    hue: 56,
  },
  {
    id: 134, x: 28.669, y: 53.299,
    size: 3.98, opacity: 0.717,
    duration: 8.34, delay: -9.98,
    driftX: -17.08, driftY: -44.69,
    hue: 77,
  },
  {
    id: 135, x: 1.206, y: 39.404,
    size: 2.75, opacity: 0.795,
    duration: 12.35, delay: -0.90,
    driftX: -11.88, driftY: 57.94,
    hue: 10,
  },
  {
    id: 136, x: 1.757, y: 16.047,
    size: 4.03, opacity: 0.358,
    duration: 14.62, delay: -11.59,
    driftX: -24.13, driftY: 28.07,
    hue: 108,
  },
  {
    id: 137, x: 54.688, y: 92.125,
    size: 7.72, opacity: 0.966,
    duration: 10.60, delay: -10.77,
    driftX: -22.75, driftY: -57.50,
    hue: 43,
  },
  {
    id: 138, x: 51.907, y: 45.352,
    size: 6.46, opacity: 0.523,
    duration: 6.16, delay: -0.36,
    driftX: -49.83, driftY: 12.97,
    hue: 56,
  },
  {
    id: 139, x: 35.710, y: 66.200,
    size: 7.53, opacity: 0.255,
    duration: 7.50, delay: -1.31,
    driftX: -56.24, driftY: 50.72,
    hue: 77,
  },
  {
    id: 140, x: 33.752, y: 85.948,
    size: 2.04, opacity: 0.491,
    duration: 11.90, delay: -5.25,
    driftX: -40.62, driftY: 13.32,
    hue: 15,
  },
  {
    id: 141, x: 6.549, y: 98.600,
    size: 7.06, opacity: 0.607,
    duration: 20.39, delay: -5.48,
    driftX: 56.63, driftY: 28.83,
    hue: 14,
  },
  {
    id: 142, x: 8.912, y: 75.578,
    size: 3.15, opacity: 0.833,
    duration: 20.17, delay: -9.54,
    driftX: -35.60, driftY: -11.63,
    hue: 57,
  },
  {
    id: 143, x: 96.049, y: 27.683,
    size: 2.39, opacity: 0.208,
    duration: 17.51, delay: -11.29,
    driftX: 26.28, driftY: -59.70,
    hue: 3,
  },
  {
    id: 144, x: 6.484, y: 16.200,
    size: 3.54, opacity: 0.201,
    duration: 18.18, delay: -8.24,
    driftX: 38.71, driftY: 17.89,
    hue: 12,
  },
  {
    id: 145, x: 21.561, y: 15.784,
    size: 6.22, opacity: 0.720,
    duration: 10.15, delay: -3.09,
    driftX: 1.38, driftY: -32.21,
    hue: 31,
  },
  {
    id: 146, x: 53.057, y: 79.446,
    size: 4.07, opacity: 0.817,
    duration: 17.97, delay: -1.09,
    driftX: -59.14, driftY: 14.74,
    hue: 102,
  },
  {
    id: 147, x: 48.605, y: 0.093,
    size: 6.10, opacity: 0.856,
    duration: 5.30, delay: -3.47,
    driftX: 41.41, driftY: -9.20,
    hue: 45,
  },
  {
    id: 148, x: 34.110, y: 42.484,
    size: 2.74, opacity: 0.850,
    duration: 10.86, delay: -6.21,
    driftX: -5.70, driftY: -54.58,
    hue: 30,
  },
  {
    id: 149, x: 9.565, y: 78.518,
    size: 1.92, opacity: 0.435,
    duration: 11.58, delay: -8.73,
    driftX: 55.36, driftY: -48.48,
    hue: 7,
  },
  {
    id: 150, x: 38.399, y: 27.977,
    size: 5.97, opacity: 0.490,
    duration: 8.26, delay: -4.70,
    driftX: 8.61, driftY: 55.48,
    hue: 11,
  },
  {
    id: 151, x: 92.242, y: 33.107,
    size: 7.81, opacity: 0.300,
    duration: 18.06, delay: -6.72,
    driftX: 10.88, driftY: -25.10,
    hue: 97,
  },
  {
    id: 152, x: 46.160, y: 15.530,
    size: 3.97, opacity: 0.205,
    duration: 16.18, delay: -0.40,
    driftX: -10.11, driftY: 16.80,
    hue: 109,
  },
  {
    id: 153, x: 22.408, y: 27.990,
    size: 3.55, opacity: 0.865,
    duration: 5.00, delay: -7.23,
    driftX: 20.59, driftY: -54.24,
    hue: 65,
  },
  {
    id: 154, x: 17.907, y: 69.542,
    size: 6.14, opacity: 0.950,
    duration: 15.32, delay: -11.63,
    driftX: -27.79, driftY: 41.41,
    hue: 107,
  },
  {
    id: 155, x: 97.750, y: 95.234,
    size: 6.15, opacity: 0.413,
    duration: 18.95, delay: -10.18,
    driftX: -52.03, driftY: -34.90,
    hue: 1,
  },
  {
    id: 156, x: 33.632, y: 74.317,
    size: 3.95, opacity: 0.663,
    duration: 7.56, delay: -8.64,
    driftX: 30.05, driftY: 35.71,
    hue: 99,
  },
  {
    id: 157, x: 18.996, y: 30.789,
    size: 7.72, opacity: 0.488,
    duration: 11.25, delay: -10.26,
    driftX: 16.76, driftY: -36.16,
    hue: 76,
  },
  {
    id: 158, x: 52.278, y: 22.446,
    size: 6.59, opacity: 0.217,
    duration: 5.55, delay: -5.23,
    driftX: -35.55, driftY: 7.64,
    hue: 96,
  },
  {
    id: 159, x: 6.473, y: 57.833,
    size: 2.12, opacity: 0.499,
    duration: 13.25, delay: -11.60,
    driftX: 13.53, driftY: -15.06,
    hue: 2,
  },
  {
    id: 160, x: 51.859, y: 41.565,
    size: 4.02, opacity: 0.265,
    duration: 9.61, delay: -4.96,
    driftX: -8.69, driftY: 19.24,
    hue: 5,
  },
  {
    id: 161, x: 37.151, y: 54.953,
    size: 2.62, opacity: 0.495,
    duration: 5.11, delay: -11.27,
    driftX: 1.99, driftY: -34.64,
    hue: 80,
  },
  {
    id: 162, x: 14.505, y: 75.873,
    size: 3.60, opacity: 0.821,
    duration: 13.92, delay: -3.28,
    driftX: -10.56, driftY: 39.71,
    hue: 62,
  },
  {
    id: 163, x: 77.620, y: 84.028,
    size: 7.83, opacity: 0.966,
    duration: 18.50, delay: -6.51,
    driftX: 22.44, driftY: 29.82,
    hue: 57,
  },
  {
    id: 164, x: 18.967, y: 71.575,
    size: 3.81, opacity: 0.996,
    duration: 13.47, delay: -4.76,
    driftX: -9.07, driftY: 56.73,
    hue: 85,
  },
  {
    id: 165, x: 53.626, y: 65.331,
    size: 3.18, opacity: 0.633,
    duration: 10.50, delay: -7.28,
    driftX: -28.15, driftY: -36.21,
    hue: 64,
  },
  {
    id: 166, x: 89.450, y: 62.324,
    size: 4.37, opacity: 0.491,
    duration: 13.60, delay: -4.10,
    driftX: -13.26, driftY: -7.28,
    hue: 11,
  },
  {
    id: 167, x: 93.062, y: 62.876,
    size: 3.53, opacity: 0.408,
    duration: 7.35, delay: -4.16,
    driftX: 59.53, driftY: -25.45,
    hue: 58,
  },
  {
    id: 168, x: 13.632, y: 29.089,
    size: 2.99, opacity: 0.212,
    duration: 11.38, delay: -1.42,
    driftX: 2.98, driftY: -21.17,
    hue: 18,
  },
  {
    id: 169, x: 96.878, y: 53.257,
    size: 5.93, opacity: 0.695,
    duration: 11.26, delay: -1.53,
    driftX: -22.50, driftY: 29.21,
    hue: 88,
  },
  {
    id: 170, x: 73.474, y: 86.948,
    size: 6.06, opacity: 0.578,
    duration: 16.04, delay: -7.60,
    driftX: 42.65, driftY: -33.78,
    hue: 62,
  },
  {
    id: 171, x: 12.777, y: 75.379,
    size: 3.24, opacity: 0.810,
    duration: 8.78, delay: -10.98,
    driftX: 4.52, driftY: 13.50,
    hue: 41,
  },
  {
    id: 172, x: 17.451, y: 11.725,
    size: 7.93, opacity: 0.731,
    duration: 13.20, delay: -10.28,
    driftX: -4.74, driftY: 38.47,
    hue: 5,
  },
  {
    id: 173, x: 41.757, y: 6.689,
    size: 5.78, opacity: 0.488,
    duration: 17.24, delay: -8.99,
    driftX: 0.36, driftY: 26.97,
    hue: 37,
  },
  {
    id: 174, x: 80.611, y: 92.589,
    size: 4.60, opacity: 0.416,
    duration: 10.64, delay: -10.63,
    driftX: 13.49, driftY: -12.63,
    hue: 6,
  },
  {
    id: 175, x: 10.452, y: 43.575,
    size: 2.31, opacity: 0.417,
    duration: 10.76, delay: -0.68,
    driftX: 11.52, driftY: -10.47,
    hue: 60,
  },
  {
    id: 176, x: 84.269, y: 59.211,
    size: 3.70, opacity: 0.369,
    duration: 10.44, delay: -7.68,
    driftX: 33.20, driftY: 55.44,
    hue: 54,
  },
  {
    id: 177, x: 93.641, y: 91.711,
    size: 4.25, opacity: 0.937,
    duration: 6.52, delay: -1.04,
    driftX: -31.23, driftY: 7.35,
    hue: 64,
  },
  {
    id: 178, x: 31.682, y: 91.339,
    size: 3.34, opacity: 0.827,
    duration: 12.13, delay: -3.97,
    driftX: 13.99, driftY: -30.95,
    hue: 0,
  },
  {
    id: 179, x: 47.410, y: 29.833,
    size: 4.48, opacity: 0.275,
    duration: 6.14, delay: -10.76,
    driftX: 23.48, driftY: -32.91,
    hue: 29,
  },
  {
    id: 180, x: 22.369, y: 70.224,
    size: 5.43, opacity: 0.646,
    duration: 13.81, delay: -11.47,
    driftX: 13.21, driftY: 46.75,
    hue: 45,
  },
  {
    id: 181, x: 28.518, y: 28.852,
    size: 3.77, opacity: 0.566,
    duration: 7.98, delay: -0.39,
    driftX: -5.64, driftY: -51.07,
    hue: 61,
  },
  {
    id: 182, x: 25.018, y: 37.901,
    size: 7.95, opacity: 0.996,
    duration: 18.53, delay: -4.02,
    driftX: 12.11, driftY: 1.72,
    hue: 72,
  },
  {
    id: 183, x: 73.802, y: 59.926,
    size: 4.46, opacity: 0.982,
    duration: 19.20, delay: -10.54,
    driftX: -2.57, driftY: 33.09,
    hue: 98,
  },
  {
    id: 184, x: 66.254, y: 81.450,
    size: 4.76, opacity: 0.328,
    duration: 8.12, delay: -1.35,
    driftX: 40.92, driftY: -12.79,
    hue: 8,
  },
  {
    id: 185, x: 24.728, y: 96.321,
    size: 4.29, opacity: 0.836,
    duration: 14.76, delay: -11.08,
    driftX: 9.22, driftY: -10.02,
    hue: 9,
  },
  {
    id: 186, x: 78.649, y: 60.887,
    size: 6.68, opacity: 0.969,
    duration: 12.63, delay: -8.37,
    driftX: -20.28, driftY: 46.07,
    hue: 49,
  },
  {
    id: 187, x: 50.959, y: 61.570,
    size: 2.53, opacity: 0.829,
    duration: 11.53, delay: -1.20,
    driftX: -0.83, driftY: 3.51,
    hue: 1,
  },
  {
    id: 188, x: 62.224, y: 64.724,
    size: 5.85, opacity: 0.605,
    duration: 10.30, delay: -11.39,
    driftX: 39.83, driftY: 49.00,
    hue: 89,
  },
  {
    id: 189, x: 72.382, y: 7.373,
    size: 3.86, opacity: 0.814,
    duration: 8.04, delay: -4.64,
    driftX: -49.17, driftY: 51.18,
    hue: 104,
  },
  {
    id: 190, x: 2.531, y: 1.676,
    size: 4.39, opacity: 0.745,
    duration: 13.07, delay: -2.98,
    driftX: 3.01, driftY: -53.87,
    hue: 96,
  },
  {
    id: 191, x: 78.055, y: 21.309,
    size: 5.13, opacity: 0.719,
    duration: 14.60, delay: -0.74,
    driftX: 7.53, driftY: 57.55,
    hue: 96,
  },
  {
    id: 192, x: 62.681, y: 91.167,
    size: 4.22, opacity: 0.862,
    duration: 19.89, delay: -11.51,
    driftX: -10.80, driftY: 25.88,
    hue: 103,
  },
  {
    id: 193, x: 93.485, y: 38.125,
    size: 6.67, opacity: 0.325,
    duration: 16.06, delay: -3.74,
    driftX: 20.97, driftY: 48.29,
    hue: 23,
  },
  {
    id: 194, x: 83.480, y: 55.815,
    size: 4.70, opacity: 0.292,
    duration: 16.85, delay: -4.43,
    driftX: -8.76, driftY: -35.25,
    hue: 38,
  },
  {
    id: 195, x: 79.346, y: 73.546,
    size: 6.29, opacity: 0.717,
    duration: 9.68, delay: -8.82,
    driftX: 40.02, driftY: -37.98,
    hue: 56,
  },
  {
    id: 196, x: 72.209, y: 92.471,
    size: 7.30, opacity: 0.774,
    duration: 14.83, delay: -6.76,
    driftX: -57.91, driftY: 52.39,
    hue: 84,
  },
  {
    id: 197, x: 80.442, y: 13.008,
    size: 5.00, opacity: 0.900,
    duration: 6.86, delay: -11.84,
    driftX: 6.32, driftY: -4.53,
    hue: 33,
  },
  {
    id: 198, x: 57.212, y: 40.023,
    size: 7.28, opacity: 0.578,
    duration: 7.23, delay: -0.63,
    driftX: -24.30, driftY: 57.88,
    hue: 60,
  },
  {
    id: 199, x: 39.611, y: 64.594,
    size: 6.00, opacity: 0.382,
    duration: 20.39, delay: -8.58,
    driftX: -5.26, driftY: -10.89,
    hue: 79,
  },
  {
    id: 200, x: 63.274, y: 34.880,
    size: 7.27, opacity: 0.452,
    duration: 15.75, delay: -5.60,
    driftX: -55.97, driftY: -54.14,
    hue: 4,
  },
  {
    id: 201, x: 51.072, y: 82.690,
    size: 4.65, opacity: 0.309,
    duration: 18.00, delay: -6.99,
    driftX: 9.54, driftY: 0.35,
    hue: 47,
  },
  {
    id: 202, x: 91.186, y: 16.328,
    size: 2.33, opacity: 0.937,
    duration: 8.34, delay: -10.05,
    driftX: 16.08, driftY: 17.29,
    hue: 93,
  },
  {
    id: 203, x: 71.810, y: 57.361,
    size: 2.86, opacity: 0.296,
    duration: 13.23, delay: -11.74,
    driftX: -50.46, driftY: 15.47,
    hue: 96,
  },
  {
    id: 204, x: 10.410, y: 35.758,
    size: 7.11, opacity: 0.404,
    duration: 14.88, delay: -0.62,
    driftX: 18.15, driftY: -3.38,
    hue: 3,
  },
  {
    id: 205, x: 28.132, y: 4.314,
    size: 7.44, opacity: 0.654,
    duration: 14.67, delay: -4.12,
    driftX: 40.75, driftY: 29.08,
    hue: 105,
  },
  {
    id: 206, x: 89.951, y: 39.330,
    size: 5.30, opacity: 0.318,
    duration: 13.26, delay: -11.70,
    driftX: 24.28, driftY: -16.46,
    hue: 52,
  },
  {
    id: 207, x: 63.543, y: 52.679,
    size: 7.97, opacity: 0.733,
    duration: 7.47, delay: -7.68,
    driftX: -40.80, driftY: 33.61,
    hue: 106,
  },
  {
    id: 208, x: 91.383, y: 10.360,
    size: 6.54, opacity: 0.890,
    duration: 14.65, delay: -1.71,
    driftX: 24.37, driftY: 37.53,
    hue: 32,
  },
  {
    id: 209, x: 7.345, y: 57.191,
    size: 5.07, opacity: 0.505,
    duration: 10.93, delay: -0.28,
    driftX: -55.79, driftY: -39.60,
    hue: 20,
  },
  {
    id: 210, x: 12.757, y: 20.975,
    size: 1.72, opacity: 0.943,
    duration: 17.29, delay: -3.81,
    driftX: -20.78, driftY: -39.64,
    hue: 77,
  },
  {
    id: 211, x: 6.885, y: 52.436,
    size: 7.75, opacity: 0.257,
    duration: 5.89, delay: -1.33,
    driftX: 42.24, driftY: 9.61,
    hue: 90,
  },
  {
    id: 212, x: 4.966, y: 35.455,
    size: 7.77, opacity: 0.183,
    duration: 11.72, delay: -10.10,
    driftX: 57.89, driftY: 37.97,
    hue: 72,
  },
  {
    id: 213, x: 25.378, y: 3.573,
    size: 3.93, opacity: 0.566,
    duration: 19.05, delay: -8.92,
    driftX: 22.56, driftY: 23.32,
    hue: 107,
  },
  {
    id: 214, x: 54.129, y: 65.060,
    size: 5.39, opacity: 0.188,
    duration: 16.65, delay: -0.67,
    driftX: 20.13, driftY: -38.44,
    hue: 82,
  },
  {
    id: 215, x: 54.360, y: 94.115,
    size: 5.57, opacity: 0.595,
    duration: 9.39, delay: -8.14,
    driftX: 29.10, driftY: 33.27,
    hue: 12,
  },
  {
    id: 216, x: 41.456, y: 86.542,
    size: 1.78, opacity: 0.585,
    duration: 19.10, delay: -11.65,
    driftX: -44.86, driftY: 2.49,
    hue: 18,
  },
  {
    id: 217, x: 40.971, y: 3.257,
    size: 3.78, opacity: 0.422,
    duration: 7.39, delay: -3.19,
    driftX: 34.03, driftY: 4.43,
    hue: 76,
  },
  {
    id: 218, x: 93.899, y: 17.896,
    size: 2.12, opacity: 0.309,
    duration: 14.27, delay: -7.46,
    driftX: 29.85, driftY: 1.64,
    hue: 48,
  },
  {
    id: 219, x: 11.120, y: 52.233,
    size: 3.14, opacity: 0.837,
    duration: 5.01, delay: -0.67,
    driftX: -36.90, driftY: 43.41,
    hue: 26,
  },
  {
    id: 220, x: 82.139, y: 42.058,
    size: 2.52, opacity: 0.281,
    duration: 12.61, delay: -11.17,
    driftX: -28.91, driftY: -21.86,
    hue: 64,
  },
  {
    id: 221, x: 76.539, y: 74.305,
    size: 3.28, opacity: 0.686,
    duration: 16.82, delay: -11.79,
    driftX: -50.36, driftY: -27.68,
    hue: 92,
  },
  {
    id: 222, x: 98.533, y: 85.008,
    size: 2.52, opacity: 0.369,
    duration: 14.74, delay: -4.16,
    driftX: 49.68, driftY: 21.99,
    hue: 98,
  },
  {
    id: 223, x: 78.712, y: 4.018,
    size: 2.39, opacity: 0.474,
    duration: 15.45, delay: -8.01,
    driftX: -59.63, driftY: 36.62,
    hue: 2,
  },
  {
    id: 224, x: 84.326, y: 47.209,
    size: 6.48, opacity: 0.325,
    duration: 18.74, delay: -1.54,
    driftX: 31.81, driftY: -24.58,
    hue: 23,
  },
  {
    id: 225, x: 58.756, y: 76.016,
    size: 3.47, opacity: 0.475,
    duration: 18.55, delay: -2.04,
    driftX: 24.98, driftY: 44.45,
    hue: 80,
  },
  {
    id: 226, x: 38.852, y: 52.600,
    size: 2.73, opacity: 0.372,
    duration: 6.26, delay: -1.68,
    driftX: -22.61, driftY: -19.44,
    hue: 33,
  },
  {
    id: 227, x: 50.294, y: 33.650,
    size: 2.83, opacity: 0.836,
    duration: 10.32, delay: -0.57,
    driftX: 43.46, driftY: 29.83,
    hue: 13,
  },
  {
    id: 228, x: 48.604, y: 5.803,
    size: 5.96, opacity: 0.748,
    duration: 19.08, delay: -0.61,
    driftX: -23.59, driftY: 32.70,
    hue: 10,
  },
  {
    id: 229, x: 74.616, y: 2.422,
    size: 3.77, opacity: 0.354,
    duration: 15.98, delay: -7.73,
    driftX: 44.65, driftY: 36.71,
    hue: 26,
  },
  {
    id: 230, x: 22.474, y: 48.782,
    size: 6.01, opacity: 0.938,
    duration: 8.68, delay: -8.15,
    driftX: 46.78, driftY: 15.53,
    hue: 27,
  },
  {
    id: 231, x: 59.264, y: 12.813,
    size: 3.51, opacity: 0.252,
    duration: 6.42, delay: -1.99,
    driftX: -42.27, driftY: -45.54,
    hue: 8,
  },
  {
    id: 232, x: 40.363, y: 38.878,
    size: 1.57, opacity: 0.396,
    duration: 15.11, delay: -6.31,
    driftX: 33.81, driftY: 15.70,
    hue: 71,
  },
  {
    id: 233, x: 21.670, y: 47.770,
    size: 4.93, opacity: 0.759,
    duration: 10.19, delay: -5.72,
    driftX: 47.77, driftY: -20.72,
    hue: 80,
  },
  {
    id: 234, x: 80.994, y: 66.269,
    size: 7.63, opacity: 0.866,
    duration: 13.23, delay: -1.33,
    driftX: 43.35, driftY: -23.48,
    hue: 25,
  },
  {
    id: 235, x: 53.840, y: 1.122,
    size: 6.99, opacity: 0.553,
    duration: 19.02, delay: -9.23,
    driftX: 9.65, driftY: -19.81,
    hue: 48,
  },
  {
    id: 236, x: 76.482, y: 44.343,
    size: 5.51, opacity: 0.259,
    duration: 18.22, delay: -5.51,
    driftX: 17.93, driftY: 57.60,
    hue: 53,
  },
  {
    id: 237, x: 25.221, y: 23.003,
    size: 3.27, opacity: 0.987,
    duration: 18.58, delay: -8.47,
    driftX: -21.78, driftY: 42.36,
    hue: 82,
  },
  {
    id: 238, x: 27.483, y: 23.230,
    size: 4.77, opacity: 0.293,
    duration: 16.27, delay: -10.73,
    driftX: -13.13, driftY: -0.19,
    hue: 83,
  },
  {
    id: 239, x: 58.542, y: 45.565,
    size: 4.00, opacity: 0.804,
    duration: 6.66, delay: -0.05,
    driftX: 30.51, driftY: 23.40,
    hue: 9,
  },
  {
    id: 240, x: 96.156, y: 23.438,
    size: 6.93, opacity: 0.850,
    duration: 5.16, delay: -10.47,
    driftX: 46.19, driftY: -32.75,
    hue: 14,
  },
  {
    id: 241, x: 91.069, y: 86.799,
    size: 7.90, opacity: 0.451,
    duration: 13.66, delay: -5.37,
    driftX: -13.65, driftY: -26.02,
    hue: 27,
  },
  {
    id: 242, x: 73.496, y: 23.540,
    size: 2.31, opacity: 0.843,
    duration: 13.39, delay: -5.03,
    driftX: -56.12, driftY: 43.31,
    hue: 30,
  },
  {
    id: 243, x: 7.995, y: 29.239,
    size: 4.95, opacity: 0.779,
    duration: 4.67, delay: -1.65,
    driftX: 29.58, driftY: -45.34,
    hue: 95,
  },
  {
    id: 244, x: 97.857, y: 58.486,
    size: 6.90, opacity: 0.195,
    duration: 8.47, delay: -5.21,
    driftX: -20.72, driftY: -55.14,
    hue: 41,
  },
  {
    id: 245, x: 57.286, y: 59.809,
    size: 5.29, opacity: 0.476,
    duration: 17.98, delay: -4.13,
    driftX: -25.95, driftY: 54.31,
    hue: 77,
  },
  {
    id: 246, x: 18.491, y: 96.776,
    size: 2.71, opacity: 0.333,
    duration: 15.76, delay: -4.76,
    driftX: -48.78, driftY: 11.19,
    hue: 19,
  },
  {
    id: 247, x: 72.489, y: 26.573,
    size: 7.72, opacity: 0.370,
    duration: 9.61, delay: -8.28,
    driftX: -18.78, driftY: -11.68,
    hue: 89,
  },
  {
    id: 248, x: 22.320, y: 11.899,
    size: 1.75, opacity: 0.325,
    duration: 7.21, delay: -10.99,
    driftX: -49.74, driftY: -59.83,
    hue: 43,
  },
  {
    id: 249, x: 18.398, y: 16.224,
    size: 4.52, opacity: 0.599,
    duration: 7.85, delay: -4.95,
    driftX: -57.96, driftY: -7.88,
    hue: 37,
  },
  {
    id: 250, x: 26.048, y: 56.908,
    size: 6.06, opacity: 0.713,
    duration: 13.15, delay: -8.67,
    driftX: 19.79, driftY: -43.30,
    hue: 14,
  },
  {
    id: 251, x: 7.084, y: 18.958,
    size: 6.44, opacity: 0.324,
    duration: 8.56, delay: -5.86,
    driftX: -6.75, driftY: 55.55,
    hue: 91,
  },
  {
    id: 252, x: 51.042, y: 23.717,
    size: 2.28, opacity: 0.204,
    duration: 6.51, delay: -8.54,
    driftX: -26.26, driftY: -27.59,
    hue: 44,
  },
  {
    id: 253, x: 21.995, y: 78.869,
    size: 3.26, opacity: 0.644,
    duration: 20.19, delay: -11.49,
    driftX: -29.68, driftY: -20.14,
    hue: 38,
  },
  {
    id: 254, x: 46.647, y: 79.705,
    size: 6.81, opacity: 0.420,
    duration: 20.06, delay: -0.27,
    driftX: -48.38, driftY: -8.77,
    hue: 66,
  },
  {
    id: 255, x: 41.406, y: 73.068,
    size: 4.50, opacity: 0.926,
    duration: 9.63, delay: -1.71,
    driftX: -46.22, driftY: -50.26,
    hue: 19,
  },
  {
    id: 256, x: 0.244, y: 4.469,
    size: 5.18, opacity: 0.276,
    duration: 13.77, delay: -2.51,
    driftX: 29.71, driftY: -37.64,
    hue: 9,
  },
  {
    id: 257, x: 36.743, y: 15.058,
    size: 4.97, opacity: 0.847,
    duration: 16.89, delay: -6.01,
    driftX: -32.82, driftY: -44.72,
    hue: 94,
  },
  {
    id: 258, x: 97.861, y: 89.835,
    size: 4.81, opacity: 0.964,
    duration: 6.27, delay: -3.52,
    driftX: 7.90, driftY: 15.46,
    hue: 34,
  },
  {
    id: 259, x: 57.291, y: 82.030,
    size: 5.60, opacity: 0.212,
    duration: 19.82, delay: -10.58,
    driftX: -45.12, driftY: -32.61,
    hue: 50,
  },
  {
    id: 260, x: 19.745, y: 76.814,
    size: 2.65, opacity: 0.854,
    duration: 17.97, delay: -4.01,
    driftX: -23.50, driftY: -15.58,
    hue: 7,
  },
  {
    id: 261, x: 44.113, y: 68.434,
    size: 5.19, opacity: 0.212,
    duration: 17.26, delay: -9.92,
    driftX: 14.72, driftY: -21.88,
    hue: 22,
  },
  {
    id: 262, x: 69.224, y: 53.774,
    size: 5.71, opacity: 0.790,
    duration: 5.69, delay: -8.98,
    driftX: 59.36, driftY: -13.23,
    hue: 42,
  },
  {
    id: 263, x: 40.948, y: 33.719,
    size: 4.40, opacity: 0.488,
    duration: 5.74, delay: -0.63,
    driftX: -22.25, driftY: 20.07,
    hue: 59,
  },
  {
    id: 264, x: 14.989, y: 63.107,
    size: 4.34, opacity: 0.707,
    duration: 19.07, delay: -7.02,
    driftX: -36.30, driftY: -16.02,
    hue: 77,
  },
  {
    id: 265, x: 73.780, y: 67.605,
    size: 4.84, opacity: 0.905,
    duration: 5.48, delay: -8.37,
    driftX: -8.44, driftY: 51.37,
    hue: 18,
  },
  {
    id: 266, x: 60.485, y: 13.620,
    size: 1.78, opacity: 0.863,
    duration: 8.69, delay: -9.63,
    driftX: 11.74, driftY: 52.37,
    hue: 26,
  },
  {
    id: 267, x: 27.678, y: 62.876,
    size: 7.66, opacity: 0.470,
    duration: 7.97, delay: -8.06,
    driftX: -58.44, driftY: 2.33,
    hue: 49,
  },
  {
    id: 268, x: 52.389, y: 87.567,
    size: 5.84, opacity: 0.922,
    duration: 18.61, delay: -1.19,
    driftX: 12.75, driftY: 11.73,
    hue: 17,
  },
  {
    id: 269, x: 31.699, y: 86.565,
    size: 6.11, opacity: 0.956,
    duration: 6.24, delay: -7.33,
    driftX: 49.06, driftY: -0.37,
    hue: 70,
  },
  {
    id: 270, x: 43.857, y: 63.935,
    size: 5.40, opacity: 0.210,
    duration: 8.44, delay: -10.44,
    driftX: -52.21, driftY: -41.73,
    hue: 94,
  },
  {
    id: 271, x: 14.339, y: 16.469,
    size: 7.99, opacity: 0.871,
    duration: 11.66, delay: -0.36,
    driftX: 35.09, driftY: -3.56,
    hue: 66,
  },
  {
    id: 272, x: 7.481, y: 18.594,
    size: 2.71, opacity: 0.737,
    duration: 17.77, delay: -7.54,
    driftX: -49.13, driftY: 39.95,
    hue: 79,
  },
  {
    id: 273, x: 28.550, y: 42.958,
    size: 2.25, opacity: 0.519,
    duration: 7.64, delay: -11.99,
    driftX: -30.11, driftY: -48.76,
    hue: 55,
  },
  {
    id: 274, x: 27.976, y: 93.238,
    size: 1.53, opacity: 0.368,
    duration: 15.93, delay: -11.98,
    driftX: -41.77, driftY: -30.23,
    hue: 103,
  },
  {
    id: 275, x: 48.318, y: 40.198,
    size: 5.95, opacity: 0.466,
    duration: 14.50, delay: -1.63,
    driftX: 41.95, driftY: 28.94,
    hue: 36,
  },
  {
    id: 276, x: 78.496, y: 51.922,
    size: 3.35, opacity: 0.161,
    duration: 12.41, delay: -6.79,
    driftX: 4.89, driftY: 29.36,
    hue: 68,
  },
  {
    id: 277, x: 16.629, y: 88.758,
    size: 2.10, opacity: 0.544,
    duration: 7.80, delay: -7.08,
    driftX: -58.87, driftY: -35.76,
    hue: 79,
  },
  {
    id: 278, x: 4.063, y: 89.953,
    size: 6.78, opacity: 0.527,
    duration: 17.12, delay: -8.32,
    driftX: 58.02, driftY: 23.06,
    hue: 88,
  },
  {
    id: 279, x: 56.687, y: 84.241,
    size: 5.13, opacity: 0.796,
    duration: 11.39, delay: -7.46,
    driftX: -49.43, driftY: 30.10,
    hue: 25,
  },
  {
    id: 280, x: 62.514, y: 67.859,
    size: 2.37, opacity: 0.537,
    duration: 5.59, delay: -6.92,
    driftX: 41.16, driftY: 37.86,
    hue: 1,
  },
  {
    id: 281, x: 99.503, y: 84.560,
    size: 1.70, opacity: 0.606,
    duration: 4.78, delay: -8.68,
    driftX: -15.75, driftY: 51.70,
    hue: 1,
  },
  {
    id: 282, x: 45.228, y: 31.738,
    size: 4.90, opacity: 0.695,
    duration: 13.53, delay: -2.04,
    driftX: -51.06, driftY: 40.66,
    hue: 24,
  },
  {
    id: 283, x: 8.173, y: 71.172,
    size: 6.86, opacity: 0.467,
    duration: 6.23, delay: -7.78,
    driftX: -40.96, driftY: -4.26,
    hue: 101,
  },
  {
    id: 284, x: 57.189, y: 14.724,
    size: 1.54, opacity: 0.766,
    duration: 5.41, delay: -3.05,
    driftX: -12.92, driftY: 43.11,
    hue: 12,
  },
  {
    id: 285, x: 81.344, y: 68.747,
    size: 3.54, opacity: 0.510,
    duration: 17.15, delay: -1.70,
    driftX: 44.33, driftY: -58.68,
    hue: 85,
  },
  {
    id: 286, x: 90.479, y: 1.086,
    size: 2.91, opacity: 0.259,
    duration: 15.20, delay: -11.97,
    driftX: 21.94, driftY: -40.61,
    hue: 96,
  },
  {
    id: 287, x: 59.050, y: 51.468,
    size: 6.63, opacity: 0.436,
    duration: 13.90, delay: -11.92,
    driftX: -36.13, driftY: 1.48,
    hue: 89,
  },
  {
    id: 288, x: 29.649, y: 89.182,
    size: 6.04, opacity: 0.881,
    duration: 10.17, delay: -11.84,
    driftX: -34.63, driftY: -39.75,
    hue: 62,
  },
  {
    id: 289, x: 31.826, y: 87.793,
    size: 6.88, opacity: 0.891,
    duration: 15.60, delay: -4.85,
    driftX: -52.35, driftY: -4.99,
    hue: 49,
  },
  {
    id: 290, x: 65.331, y: 82.818,
    size: 5.28, opacity: 0.315,
    duration: 7.53, delay: -1.02,
    driftX: -26.18, driftY: -45.14,
    hue: 101,
  },
  {
    id: 291, x: 87.713, y: 64.458,
    size: 1.72, opacity: 0.494,
    duration: 19.11, delay: -8.04,
    driftX: 28.25, driftY: -13.70,
    hue: 79,
  },
  {
    id: 292, x: 60.138, y: 77.074,
    size: 6.62, opacity: 0.340,
    duration: 11.00, delay: -11.79,
    driftX: -18.23, driftY: 4.46,
    hue: 39,
  },
  {
    id: 293, x: 22.728, y: 5.131,
    size: 4.17, opacity: 0.927,
    duration: 16.37, delay: -3.54,
    driftX: 40.33, driftY: 26.42,
    hue: 40,
  },
  {
    id: 294, x: 24.204, y: 66.847,
    size: 5.31, opacity: 0.301,
    duration: 11.97, delay: -9.85,
    driftX: -0.56, driftY: 39.59,
    hue: 75,
  },
  {
    id: 295, x: 46.020, y: 62.561,
    size: 4.73, opacity: 0.864,
    duration: 6.10, delay: -1.86,
    driftX: 51.02, driftY: 47.53,
    hue: 9,
  },
  {
    id: 296, x: 53.155, y: 23.856,
    size: 5.10, opacity: 0.427,
    duration: 11.73, delay: -1.23,
    driftX: -40.41, driftY: -18.11,
    hue: 32,
  },
  {
    id: 297, x: 26.197, y: 34.335,
    size: 2.72, opacity: 0.487,
    duration: 5.97, delay: -0.28,
    driftX: -9.19, driftY: -40.29,
    hue: 83,
  },
  {
    id: 298, x: 71.751, y: 56.644,
    size: 6.93, opacity: 0.254,
    duration: 12.03, delay: -0.06,
    driftX: -15.69, driftY: -59.68,
    hue: 81,
  },
  {
    id: 299, x: 21.245, y: 26.973,
    size: 1.53, opacity: 0.638,
    duration: 5.72, delay: -6.17,
    driftX: 48.01, driftY: -10.53,
    hue: 96,
  },
  {
    id: 300, x: 56.093, y: 98.674,
    size: 3.78, opacity: 0.853,
    duration: 9.58, delay: -3.44,
    driftX: -37.82, driftY: -54.16,
    hue: 13,
  },
  {
    id: 301, x: 93.294, y: 10.189,
    size: 1.86, opacity: 0.968,
    duration: 18.61, delay: -8.87,
    driftX: -14.09, driftY: 40.66,
    hue: 27,
  },
  {
    id: 302, x: 71.740, y: 44.367,
    size: 7.94, opacity: 0.681,
    duration: 19.94, delay: -8.47,
    driftX: -52.14, driftY: 46.40,
    hue: 20,
  },
  {
    id: 303, x: 53.579, y: 79.877,
    size: 4.33, opacity: 0.619,
    duration: 17.22, delay: -3.67,
    driftX: 33.52, driftY: -24.75,
    hue: 76,
  },
  {
    id: 304, x: 43.101, y: 40.625,
    size: 4.99, opacity: 0.556,
    duration: 11.25, delay: -4.48,
    driftX: -31.87, driftY: 17.28,
    hue: 92,
  },
  {
    id: 305, x: 83.385, y: 31.235,
    size: 5.04, opacity: 0.635,
    duration: 8.15, delay: -4.82,
    driftX: -15.79, driftY: 29.14,
    hue: 86,
  },
  {
    id: 306, x: 67.762, y: 14.869,
    size: 3.56, opacity: 0.738,
    duration: 8.72, delay: -1.73,
    driftX: -46.61, driftY: 36.75,
    hue: 72,
  },
  {
    id: 307, x: 9.469, y: 37.604,
    size: 5.90, opacity: 0.216,
    duration: 17.86, delay: -6.48,
    driftX: 11.63, driftY: -35.86,
    hue: 15,
  },
  {
    id: 308, x: 95.295, y: 45.886,
    size: 5.98, opacity: 0.900,
    duration: 6.73, delay: -10.97,
    driftX: 50.04, driftY: 25.83,
    hue: 6,
  },
  {
    id: 309, x: 93.135, y: 1.588,
    size: 3.69, opacity: 0.217,
    duration: 14.78, delay: -8.76,
    driftX: -21.06, driftY: -0.15,
    hue: 73,
  },
  {
    id: 310, x: 63.782, y: 20.769,
    size: 5.67, opacity: 0.833,
    duration: 14.43, delay: -0.89,
    driftX: 30.29, driftY: -22.76,
    hue: 81,
  },
  {
    id: 311, x: 11.859, y: 54.809,
    size: 6.37, opacity: 0.875,
    duration: 8.62, delay: -3.23,
    driftX: 8.22, driftY: -57.00,
    hue: 15,
  },
  {
    id: 312, x: 19.343, y: 85.129,
    size: 7.51, opacity: 0.168,
    duration: 7.46, delay: -2.95,
    driftX: -3.96, driftY: -39.33,
    hue: 77,
  },
  {
    id: 313, x: 11.985, y: 76.400,
    size: 6.84, opacity: 0.372,
    duration: 18.26, delay: -7.58,
    driftX: 1.57, driftY: -35.85,
    hue: 0,
  },
  {
    id: 314, x: 71.052, y: 3.282,
    size: 4.22, opacity: 0.412,
    duration: 6.24, delay: -0.48,
    driftX: 59.87, driftY: 58.76,
    hue: 76,
  },
  {
    id: 315, x: 90.989, y: 8.420,
    size: 2.73, opacity: 0.811,
    duration: 13.04, delay: -10.92,
    driftX: -30.87, driftY: -6.85,
    hue: 63,
  },
  {
    id: 316, x: 93.683, y: 75.510,
    size: 3.16, opacity: 0.744,
    duration: 18.03, delay: -5.73,
    driftX: 22.80, driftY: 9.51,
    hue: 32,
  },
  {
    id: 317, x: 34.278, y: 47.726,
    size: 3.98, opacity: 0.455,
    duration: 19.41, delay: -10.36,
    driftX: -41.92, driftY: 35.93,
    hue: 101,
  },
  {
    id: 318, x: 79.540, y: 22.552,
    size: 3.46, opacity: 0.427,
    duration: 18.58, delay: -4.57,
    driftX: -39.53, driftY: 16.03,
    hue: 17,
  },
  {
    id: 319, x: 94.112, y: 9.288,
    size: 2.04, opacity: 0.856,
    duration: 17.72, delay: -10.56,
    driftX: 26.11, driftY: 55.84,
    hue: 21,
  },
  {
    id: 320, x: 11.814, y: 6.522,
    size: 4.05, opacity: 0.880,
    duration: 7.52, delay: -2.43,
    driftX: -33.24, driftY: 55.22,
    hue: 44,
  },
  {
    id: 321, x: 50.633, y: 1.685,
    size: 3.97, opacity: 0.482,
    duration: 19.02, delay: -11.27,
    driftX: 3.19, driftY: 14.65,
    hue: 57,
  },
  {
    id: 322, x: 43.238, y: 58.280,
    size: 2.08, opacity: 0.415,
    duration: 7.35, delay: -8.37,
    driftX: 49.16, driftY: -44.15,
    hue: 23,
  },
  {
    id: 323, x: 9.749, y: 15.058,
    size: 3.06, opacity: 0.953,
    duration: 20.35, delay: -1.90,
    driftX: 3.51, driftY: -59.00,
    hue: 40,
  },
  {
    id: 324, x: 33.605, y: 76.088,
    size: 5.90, opacity: 0.636,
    duration: 12.87, delay: -0.94,
    driftX: 7.39, driftY: -16.18,
    hue: 76,
  },
  {
    id: 325, x: 38.017, y: 69.797,
    size: 6.26, opacity: 0.503,
    duration: 4.60, delay: -9.13,
    driftX: -4.07, driftY: -22.95,
    hue: 31,
  },
  {
    id: 326, x: 22.363, y: 27.643,
    size: 2.23, opacity: 0.533,
    duration: 18.06, delay: -11.71,
    driftX: -13.66, driftY: -26.34,
    hue: 46,
  },
  {
    id: 327, x: 93.390, y: 7.078,
    size: 4.17, opacity: 0.801,
    duration: 14.61, delay: -0.19,
    driftX: -46.16, driftY: -21.81,
    hue: 31,
  },
  {
    id: 328, x: 77.821, y: 69.090,
    size: 7.99, opacity: 0.870,
    duration: 7.37, delay: -0.48,
    driftX: 29.28, driftY: 57.87,
    hue: 33,
  },
  {
    id: 329, x: 97.515, y: 44.154,
    size: 4.35, opacity: 0.646,
    duration: 15.99, delay: -7.06,
    driftX: 3.88, driftY: -18.39,
    hue: 14,
  },
  {
    id: 330, x: 26.206, y: 1.557,
    size: 1.98, opacity: 0.460,
    duration: 11.63, delay: -11.29,
    driftX: 47.98, driftY: -45.69,
    hue: 33,
  },
  {
    id: 331, x: 68.018, y: 15.012,
    size: 4.71, opacity: 0.894,
    duration: 11.16, delay: -1.08,
    driftX: -27.99, driftY: 48.23,
    hue: 84,
  },
  {
    id: 332, x: 45.746, y: 38.010,
    size: 4.58, opacity: 0.289,
    duration: 12.72, delay: -7.31,
    driftX: 43.67, driftY: -41.75,
    hue: 21,
  },
  {
    id: 333, x: 17.798, y: 85.949,
    size: 1.69, opacity: 0.557,
    duration: 6.95, delay: -0.85,
    driftX: -3.58, driftY: -58.01,
    hue: 34,
  },
  {
    id: 334, x: 81.127, y: 36.949,
    size: 7.18, opacity: 0.923,
    duration: 9.06, delay: -7.70,
    driftX: -36.14, driftY: 49.45,
    hue: 99,
  },
  {
    id: 335, x: 63.165, y: 24.626,
    size: 1.60, opacity: 0.555,
    duration: 9.92, delay: -6.34,
    driftX: -30.66, driftY: -29.99,
    hue: 98,
  },
  {
    id: 336, x: 10.219, y: 10.819,
    size: 2.42, opacity: 0.230,
    duration: 11.31, delay: -11.24,
    driftX: 27.13, driftY: 0.29,
    hue: 47,
  },
  {
    id: 337, x: 13.247, y: 91.490,
    size: 6.02, opacity: 0.575,
    duration: 15.71, delay: -8.10,
    driftX: 54.06, driftY: -8.57,
    hue: 15,
  },
  {
    id: 338, x: 45.619, y: 45.624,
    size: 6.51, opacity: 0.414,
    duration: 6.73, delay: -1.56,
    driftX: -36.51, driftY: -18.39,
    hue: 56,
  },
  {
    id: 339, x: 9.477, y: 68.473,
    size: 4.90, opacity: 0.798,
    duration: 14.43, delay: -8.57,
    driftX: -28.89, driftY: 37.53,
    hue: 17,
  },
  {
    id: 340, x: 70.316, y: 89.501,
    size: 2.06, opacity: 0.249,
    duration: 12.84, delay: -4.37,
    driftX: -25.66, driftY: -22.05,
    hue: 106,
  },
  {
    id: 341, x: 82.398, y: 15.546,
    size: 4.99, opacity: 0.250,
    duration: 9.47, delay: -4.16,
    driftX: 20.52, driftY: 57.52,
    hue: 90,
  },
  {
    id: 342, x: 30.658, y: 30.136,
    size: 2.03, opacity: 0.848,
    duration: 13.50, delay: -7.78,
    driftX: 40.58, driftY: 44.68,
    hue: 31,
  },
  {
    id: 343, x: 92.007, y: 80.815,
    size: 6.31, opacity: 0.908,
    duration: 9.03, delay: -9.57,
    driftX: -40.81, driftY: -34.74,
    hue: 47,
  },
  {
    id: 344, x: 30.173, y: 74.349,
    size: 6.57, opacity: 0.899,
    duration: 5.04, delay: -0.64,
    driftX: 21.82, driftY: -42.76,
    hue: 60,
  },
  {
    id: 345, x: 16.230, y: 36.093,
    size: 1.88, opacity: 0.331,
    duration: 9.53, delay: -8.12,
    driftX: 22.24, driftY: 25.19,
    hue: 92,
  },
  {
    id: 346, x: 97.791, y: 39.326,
    size: 4.02, opacity: 0.358,
    duration: 12.97, delay: -2.05,
    driftX: 19.51, driftY: 25.20,
    hue: 62,
  },
  {
    id: 347, x: 17.910, y: 23.876,
    size: 6.00, opacity: 0.530,
    duration: 17.32, delay: -2.42,
    driftX: 7.40, driftY: 40.74,
    hue: 24,
  },
  {
    id: 348, x: 14.295, y: 4.842,
    size: 1.94, opacity: 0.772,
    duration: 10.49, delay: -8.71,
    driftX: 12.19, driftY: 45.03,
    hue: 72,
  },
  {
    id: 349, x: 70.440, y: 54.987,
    size: 6.17, opacity: 0.869,
    duration: 15.43, delay: -1.90,
    driftX: 53.50, driftY: -29.02,
    hue: 76,
  },
  {
    id: 350, x: 59.658, y: 96.301,
    size: 3.58, opacity: 0.888,
    duration: 17.73, delay: -4.21,
    driftX: -53.45, driftY: -38.56,
    hue: 3,
  },
  {
    id: 351, x: 68.019, y: 12.835,
    size: 2.46, opacity: 0.580,
    duration: 15.34, delay: -11.32,
    driftX: -26.44, driftY: -38.99,
    hue: 60,
  },
  {
    id: 352, x: 48.437, y: 49.170,
    size: 4.51, opacity: 0.604,
    duration: 9.21, delay: -5.23,
    driftX: 40.84, driftY: -14.17,
    hue: 102,
  },
  {
    id: 353, x: 75.478, y: 94.492,
    size: 2.10, opacity: 0.848,
    duration: 9.21, delay: -4.46,
    driftX: 14.90, driftY: 53.59,
    hue: 48,
  },
  {
    id: 354, x: 77.124, y: 40.952,
    size: 7.03, opacity: 0.829,
    duration: 10.82, delay: -6.47,
    driftX: 3.27, driftY: -52.31,
    hue: 44,
  },
  {
    id: 355, x: 37.907, y: 6.784,
    size: 2.82, opacity: 0.812,
    duration: 9.25, delay: -8.29,
    driftX: 3.41, driftY: 59.41,
    hue: 105,
  },
  {
    id: 356, x: 35.104, y: 11.071,
    size: 3.94, opacity: 0.665,
    duration: 10.34, delay: -10.03,
    driftX: 32.68, driftY: 9.55,
    hue: 89,
  },
  {
    id: 357, x: 20.621, y: 90.181,
    size: 2.78, opacity: 0.383,
    duration: 10.73, delay: -6.83,
    driftX: 26.74, driftY: 54.01,
    hue: 104,
  },
  {
    id: 358, x: 44.933, y: 66.777,
    size: 5.65, opacity: 0.429,
    duration: 19.03, delay: -6.24,
    driftX: 44.04, driftY: 23.83,
    hue: 28,
  },
  {
    id: 359, x: 32.408, y: 46.957,
    size: 6.29, opacity: 0.552,
    duration: 15.57, delay: -5.86,
    driftX: -56.82, driftY: 50.78,
    hue: 108,
  },
  {
    id: 360, x: 27.272, y: 30.261,
    size: 1.71, opacity: 0.533,
    duration: 14.43, delay: -10.03,
    driftX: 41.42, driftY: 1.05,
    hue: 13,
  },
  {
    id: 361, x: 69.698, y: 58.226,
    size: 4.74, opacity: 0.693,
    duration: 7.49, delay: -1.12,
    driftX: -19.63, driftY: -32.36,
    hue: 79,
  },
  {
    id: 362, x: 77.964, y: 52.193,
    size: 3.77, opacity: 0.449,
    duration: 19.94, delay: -0.93,
    driftX: 4.95, driftY: 22.23,
    hue: 28,
  },
  {
    id: 363, x: 55.559, y: 84.532,
    size: 5.02, opacity: 0.309,
    duration: 13.47, delay: -2.87,
    driftX: -24.61, driftY: -37.44,
    hue: 87,
  },
  {
    id: 364, x: 4.587, y: 85.168,
    size: 6.47, opacity: 0.920,
    duration: 12.00, delay: -8.91,
    driftX: 30.72, driftY: -57.43,
    hue: 73,
  },
  {
    id: 365, x: 39.603, y: 26.585,
    size: 2.49, opacity: 0.630,
    duration: 16.49, delay: -7.04,
    driftX: -7.92, driftY: -13.60,
    hue: 37,
  },
  {
    id: 366, x: 98.634, y: 59.830,
    size: 4.75, opacity: 0.562,
    duration: 18.34, delay: -7.99,
    driftX: 2.11, driftY: -7.50,
    hue: 21,
  },
  {
    id: 367, x: 58.475, y: 97.631,
    size: 5.47, opacity: 0.727,
    duration: 12.90, delay: -7.80,
    driftX: -47.48, driftY: 1.44,
    hue: 11,
  },
  {
    id: 368, x: 65.995, y: 36.181,
    size: 2.06, opacity: 0.223,
    duration: 5.37, delay: -9.64,
    driftX: 21.07, driftY: 5.75,
    hue: 101,
  },
  {
    id: 369, x: 83.770, y: 33.472,
    size: 6.05, opacity: 0.953,
    duration: 8.56, delay: -5.37,
    driftX: 3.27, driftY: -30.64,
    hue: 77,
  },
  {
    id: 370, x: 89.573, y: 90.347,
    size: 6.72, opacity: 0.830,
    duration: 9.32, delay: -1.82,
    driftX: 15.19, driftY: -23.14,
    hue: 38,
  },
  {
    id: 371, x: 63.240, y: 22.909,
    size: 4.67, opacity: 0.553,
    duration: 9.44, delay: -2.11,
    driftX: -14.49, driftY: -38.12,
    hue: 64,
  },
  {
    id: 372, x: 53.442, y: 28.380,
    size: 7.36, opacity: 0.267,
    duration: 16.42, delay: -3.54,
    driftX: 4.17, driftY: 4.83,
    hue: 103,
  },
  {
    id: 373, x: 88.618, y: 93.349,
    size: 5.22, opacity: 0.990,
    duration: 14.31, delay: -10.62,
    driftX: -54.64, driftY: -35.04,
    hue: 75,
  },
  {
    id: 374, x: 96.958, y: 47.811,
    size: 3.05, opacity: 0.446,
    duration: 17.01, delay: -1.71,
    driftX: 12.09, driftY: -49.81,
    hue: 13,
  },
  {
    id: 375, x: 35.102, y: 68.485,
    size: 6.40, opacity: 0.698,
    duration: 4.93, delay: -7.28,
    driftX: -14.09, driftY: -9.19,
    hue: 41,
  },
  {
    id: 376, x: 76.168, y: 87.096,
    size: 3.70, opacity: 0.978,
    duration: 11.66, delay: -0.87,
    driftX: 20.71, driftY: 54.20,
    hue: 42,
  },
  {
    id: 377, x: 71.660, y: 13.869,
    size: 5.53, opacity: 0.707,
    duration: 8.88, delay: -10.96,
    driftX: -56.38, driftY: -14.78,
    hue: 68,
  },
  {
    id: 378, x: 73.886, y: 5.016,
    size: 2.81, opacity: 0.356,
    duration: 4.88, delay: -1.25,
    driftX: -53.94, driftY: -9.17,
    hue: 58,
  },
  {
    id: 379, x: 8.660, y: 41.413,
    size: 4.34, opacity: 0.552,
    duration: 15.87, delay: -6.70,
    driftX: 48.16, driftY: -8.90,
    hue: 40,
  },
  {
    id: 380, x: 63.737, y: 13.853,
    size: 3.07, opacity: 0.259,
    duration: 7.95, delay: -1.19,
    driftX: -28.91, driftY: 9.32,
    hue: 13,
  },
  {
    id: 381, x: 35.001, y: 81.929,
    size: 6.74, opacity: 0.185,
    duration: 13.94, delay: -8.33,
    driftX: -3.69, driftY: -39.37,
    hue: 95,
  },
  {
    id: 382, x: 36.975, y: 52.124,
    size: 5.24, opacity: 0.681,
    duration: 15.37, delay: -7.74,
    driftX: 14.82, driftY: 12.79,
    hue: 80,
  },
  {
    id: 383, x: 78.563, y: 56.421,
    size: 6.09, opacity: 0.523,
    duration: 19.34, delay: -8.03,
    driftX: -19.51, driftY: -3.42,
    hue: 56,
  },
  {
    id: 384, x: 65.404, y: 57.479,
    size: 2.77, opacity: 0.705,
    duration: 13.22, delay: -3.08,
    driftX: -3.33, driftY: -6.24,
    hue: 29,
  },
  {
    id: 385, x: 41.230, y: 45.714,
    size: 7.10, opacity: 0.240,
    duration: 9.40, delay: -8.38,
    driftX: -41.00, driftY: 8.97,
    hue: 15,
  },
  {
    id: 386, x: 83.209, y: 73.055,
    size: 3.44, opacity: 0.216,
    duration: 19.95, delay: -4.11,
    driftX: 8.17, driftY: 9.33,
    hue: 1,
  },
  {
    id: 387, x: 13.495, y: 90.999,
    size: 3.39, opacity: 0.471,
    duration: 11.16, delay: -4.99,
    driftX: 33.46, driftY: 3.34,
    hue: 32,
  },
  {
    id: 388, x: 30.887, y: 40.561,
    size: 6.45, opacity: 0.709,
    duration: 15.91, delay: -7.71,
    driftX: -58.82, driftY: -6.54,
    hue: 64,
  },
  {
    id: 389, x: 41.755, y: 0.208,
    size: 7.29, opacity: 0.334,
    duration: 17.24, delay: -5.93,
    driftX: 54.06, driftY: 42.71,
    hue: 26,
  },
  {
    id: 390, x: 23.295, y: 7.508,
    size: 7.14, opacity: 0.778,
    duration: 10.06, delay: -8.47,
    driftX: -48.58, driftY: 50.95,
    hue: 10,
  },
  {
    id: 391, x: 16.328, y: 53.382,
    size: 3.87, opacity: 0.280,
    duration: 11.25, delay: -2.78,
    driftX: 59.15, driftY: 7.48,
    hue: 85,
  },
  {
    id: 392, x: 66.820, y: 49.490,
    size: 4.88, opacity: 0.789,
    duration: 6.31, delay: -8.26,
    driftX: -39.51, driftY: -11.71,
    hue: 76,
  },
  {
    id: 393, x: 52.783, y: 24.805,
    size: 3.95, opacity: 0.656,
    duration: 11.19, delay: -5.47,
    driftX: -48.02, driftY: -1.49,
    hue: 95,
  },
  {
    id: 394, x: 96.718, y: 31.124,
    size: 3.96, opacity: 0.998,
    duration: 7.02, delay: -7.70,
    driftX: -51.41, driftY: 44.21,
    hue: 91,
  },
  {
    id: 395, x: 21.470, y: 48.419,
    size: 2.39, opacity: 0.300,
    duration: 11.06, delay: -8.41,
    driftX: -7.63, driftY: 1.17,
    hue: 62,
  },
  {
    id: 396, x: 73.367, y: 83.419,
    size: 2.33, opacity: 0.462,
    duration: 19.12, delay: -5.70,
    driftX: 36.21, driftY: -16.35,
    hue: 35,
  },
  {
    id: 397, x: 64.314, y: 71.184,
    size: 7.85, opacity: 0.603,
    duration: 17.34, delay: -4.33,
    driftX: 10.61, driftY: 31.74,
    hue: 56,
  },
  {
    id: 398, x: 69.472, y: 45.699,
    size: 7.74, opacity: 0.243,
    duration: 10.07, delay: -5.64,
    driftX: 24.02, driftY: 21.38,
    hue: 74,
  },
  {
    id: 399, x: 44.287, y: 89.812,
    size: 5.09, opacity: 0.667,
    duration: 13.23, delay: -7.74,
    driftX: 15.62, driftY: 35.98,
    hue: 29,
  },
  {
    id: 400, x: 71.200, y: 10.547,
    size: 5.76, opacity: 0.325,
    duration: 18.15, delay: -9.26,
    driftX: 44.97, driftY: 4.70,
    hue: 20,
  },
  {
    id: 401, x: 38.929, y: 94.376,
    size: 7.08, opacity: 0.669,
    duration: 14.61, delay: -6.21,
    driftX: 42.46, driftY: -25.40,
    hue: 69,
  },
  {
    id: 402, x: 72.918, y: 29.655,
    size: 4.59, opacity: 0.924,
    duration: 9.03, delay: -7.02,
    driftX: 31.47, driftY: 25.64,
    hue: 37,
  },
  {
    id: 403, x: 29.739, y: 4.985,
    size: 6.91, opacity: 0.958,
    duration: 8.01, delay: -7.47,
    driftX: -26.33, driftY: -53.38,
    hue: 82,
  },
  {
    id: 404, x: 6.125, y: 69.925,
    size: 1.60, opacity: 0.522,
    duration: 13.76, delay: -3.53,
    driftX: -37.68, driftY: -29.21,
    hue: 15,
  },
  {
    id: 405, x: 81.911, y: 82.647,
    size: 7.56, opacity: 0.988,
    duration: 12.85, delay: -5.18,
    driftX: 13.07, driftY: 59.07,
    hue: 0,
  },
  {
    id: 406, x: 97.406, y: 2.987,
    size: 7.86, opacity: 0.962,
    duration: 8.85, delay: -7.97,
    driftX: 7.77, driftY: 46.33,
    hue: 21,
  },
  {
    id: 407, x: 57.214, y: 54.716,
    size: 7.10, opacity: 0.633,
    duration: 4.76, delay: -8.97,
    driftX: -59.85, driftY: 58.53,
    hue: 103,
  },
  {
    id: 408, x: 32.628, y: 84.374,
    size: 7.46, opacity: 0.313,
    duration: 17.12, delay: -1.50,
    driftX: -16.57, driftY: 20.60,
    hue: 4,
  },
  {
    id: 409, x: 78.235, y: 56.087,
    size: 3.98, opacity: 0.190,
    duration: 9.34, delay: -11.12,
    driftX: -22.22, driftY: 46.65,
    hue: 70,
  },
  {
    id: 410, x: 36.979, y: 10.726,
    size: 2.39, opacity: 0.501,
    duration: 15.05, delay: -1.80,
    driftX: 40.59, driftY: 59.08,
    hue: 86,
  },
  {
    id: 411, x: 77.962, y: 38.537,
    size: 7.48, opacity: 0.921,
    duration: 11.06, delay: -3.32,
    driftX: 31.39, driftY: -44.92,
    hue: 73,
  },
  {
    id: 412, x: 10.058, y: 50.765,
    size: 5.27, opacity: 0.232,
    duration: 16.26, delay: -3.57,
    driftX: -5.26, driftY: -7.02,
    hue: 87,
  },
  {
    id: 413, x: 89.651, y: 92.783,
    size: 7.39, opacity: 0.325,
    duration: 15.53, delay: -10.83,
    driftX: 52.58, driftY: 39.52,
    hue: 78,
  },
  {
    id: 414, x: 26.054, y: 66.754,
    size: 2.25, opacity: 0.837,
    duration: 11.66, delay: -1.05,
    driftX: -20.19, driftY: 2.77,
    hue: 88,
  },
  {
    id: 415, x: 15.186, y: 50.280,
    size: 6.74, opacity: 0.388,
    duration: 7.89, delay: -2.93,
    driftX: 28.16, driftY: -9.77,
    hue: 23,
  },
  {
    id: 416, x: 95.573, y: 28.598,
    size: 7.36, opacity: 0.303,
    duration: 4.80, delay: -0.62,
    driftX: -30.79, driftY: 12.97,
    hue: 62,
  },
  {
    id: 417, x: 85.225, y: 2.003,
    size: 5.71, opacity: 0.671,
    duration: 8.53, delay: -6.11,
    driftX: 19.02, driftY: 39.47,
    hue: 71,
  },
  {
    id: 418, x: 87.956, y: 3.013,
    size: 7.17, opacity: 0.471,
    duration: 16.96, delay: -9.19,
    driftX: 16.70, driftY: 12.72,
    hue: 87,
  },
  {
    id: 419, x: 47.335, y: 70.497,
    size: 6.07, opacity: 0.985,
    duration: 9.03, delay: -7.25,
    driftX: -56.06, driftY: -52.38,
    hue: 7,
  },
  {
    id: 420, x: 6.611, y: 14.147,
    size: 4.31, opacity: 0.921,
    duration: 13.98, delay: -8.75,
    driftX: -11.09, driftY: -52.75,
    hue: 3,
  },
  {
    id: 421, x: 36.560, y: 6.571,
    size: 4.77, opacity: 0.226,
    duration: 7.94, delay: -5.98,
    driftX: 12.53, driftY: 38.15,
    hue: 108,
  },
  {
    id: 422, x: 66.780, y: 85.421,
    size: 2.98, opacity: 0.584,
    duration: 15.54, delay: -10.25,
    driftX: -8.13, driftY: -55.84,
    hue: 99,
  },
  {
    id: 423, x: 16.542, y: 9.238,
    size: 2.41, opacity: 0.283,
    duration: 14.46, delay: -8.08,
    driftX: -12.28, driftY: 12.69,
    hue: 63,
  },
  {
    id: 424, x: 64.578, y: 12.925,
    size: 3.65, opacity: 0.315,
    duration: 11.60, delay: -3.16,
    driftX: 57.23, driftY: -42.74,
    hue: 106,
  },
  {
    id: 425, x: 75.155, y: 69.103,
    size: 3.03, opacity: 0.680,
    duration: 12.40, delay: -1.67,
    driftX: -31.41, driftY: 46.43,
    hue: 94,
  },
  {
    id: 426, x: 85.357, y: 86.936,
    size: 7.96, opacity: 0.481,
    duration: 8.06, delay: -1.95,
    driftX: -45.95, driftY: 26.99,
    hue: 40,
  },
  {
    id: 427, x: 34.965, y: 18.208,
    size: 3.32, opacity: 0.645,
    duration: 6.89, delay: -5.51,
    driftX: 49.39, driftY: -0.05,
    hue: 69,
  },
  {
    id: 428, x: 83.965, y: 78.253,
    size: 5.77, opacity: 0.846,
    duration: 8.81, delay: -9.55,
    driftX: -24.60, driftY: -18.12,
    hue: 93,
  },
  {
    id: 429, x: 96.425, y: 78.276,
    size: 3.89, opacity: 0.681,
    duration: 9.87, delay: -9.53,
    driftX: 57.99, driftY: -59.75,
    hue: 104,
  },
  {
    id: 430, x: 60.984, y: 54.090,
    size: 3.62, opacity: 0.318,
    duration: 9.89, delay: -4.48,
    driftX: 52.98, driftY: 55.46,
    hue: 79,
  },
  {
    id: 431, x: 33.212, y: 24.709,
    size: 7.40, opacity: 0.784,
    duration: 7.55, delay: -5.25,
    driftX: -25.02, driftY: 16.62,
    hue: 51,
  },
  {
    id: 432, x: 79.001, y: 72.868,
    size: 2.42, opacity: 0.392,
    duration: 7.56, delay: -11.35,
    driftX: 8.59, driftY: 5.48,
    hue: 105,
  },
  {
    id: 433, x: 47.972, y: 74.508,
    size: 4.64, opacity: 0.350,
    duration: 14.31, delay: -1.64,
    driftX: -36.81, driftY: 9.07,
    hue: 12,
  },
  {
    id: 434, x: 37.539, y: 68.749,
    size: 6.95, opacity: 0.486,
    duration: 9.69, delay: -10.17,
    driftX: 45.55, driftY: 32.22,
    hue: 80,
  },
  {
    id: 435, x: 98.212, y: 13.610,
    size: 6.65, opacity: 0.328,
    duration: 15.43, delay: -2.92,
    driftX: 43.00, driftY: 55.04,
    hue: 27,
  },
  {
    id: 436, x: 63.123, y: 65.745,
    size: 2.67, opacity: 0.980,
    duration: 13.00, delay: -11.58,
    driftX: -26.90, driftY: -28.88,
    hue: 60,
  },
  {
    id: 437, x: 54.168, y: 62.562,
    size: 7.51, opacity: 0.509,
    duration: 5.33, delay: -3.07,
    driftX: -33.71, driftY: -52.68,
    hue: 25,
  },
  {
    id: 438, x: 76.422, y: 12.624,
    size: 6.58, opacity: 0.822,
    duration: 18.89, delay: -5.25,
    driftX: -16.74, driftY: -34.46,
    hue: 37,
  },
  {
    id: 439, x: 75.478, y: 93.118,
    size: 2.35, opacity: 0.244,
    duration: 16.49, delay: -5.20,
    driftX: 16.71, driftY: -13.67,
    hue: 72,
  },
  {
    id: 440, x: 47.354, y: 77.122,
    size: 1.87, opacity: 0.744,
    duration: 15.89, delay: -3.47,
    driftX: -30.38, driftY: -46.53,
    hue: 105,
  },
  {
    id: 441, x: 8.483, y: 28.839,
    size: 4.50, opacity: 0.843,
    duration: 6.26, delay: -11.39,
    driftX: -47.53, driftY: 13.71,
    hue: 35,
  },
  {
    id: 442, x: 92.562, y: 26.058,
    size: 1.94, opacity: 0.938,
    duration: 13.72, delay: -3.65,
    driftX: 39.71, driftY: -28.96,
    hue: 91,
  },
  {
    id: 443, x: 90.073, y: 68.077,
    size: 3.95, opacity: 0.239,
    duration: 10.20, delay: -0.58,
    driftX: -51.25, driftY: -1.51,
    hue: 25,
  },
  {
    id: 444, x: 17.549, y: 62.496,
    size: 7.84, opacity: 0.862,
    duration: 7.18, delay: -7.78,
    driftX: -50.06, driftY: 41.48,
    hue: 74,
  },
  {
    id: 445, x: 42.952, y: 31.221,
    size: 5.87, opacity: 0.624,
    duration: 17.67, delay: -9.03,
    driftX: 58.17, driftY: 0.34,
    hue: 4,
  },
  {
    id: 446, x: 40.390, y: 37.807,
    size: 2.58, opacity: 0.348,
    duration: 12.64, delay: -3.40,
    driftX: -40.97, driftY: -21.52,
    hue: 56,
  },
  {
    id: 447, x: 51.716, y: 15.804,
    size: 4.76, opacity: 0.712,
    duration: 18.38, delay: -8.49,
    driftX: 12.09, driftY: -1.98,
    hue: 16,
  },
  {
    id: 448, x: 87.010, y: 86.803,
    size: 6.98, opacity: 0.683,
    duration: 11.91, delay: -11.50,
    driftX: -7.65, driftY: -20.54,
    hue: 90,
  },
  {
    id: 449, x: 61.112, y: 90.533,
    size: 2.39, opacity: 0.732,
    duration: 10.02, delay: -10.27,
    driftX: 38.75, driftY: 4.14,
    hue: 17,
  },
  {
    id: 450, x: 62.681, y: 90.458,
    size: 3.98, opacity: 0.752,
    duration: 20.29, delay: -4.67,
    driftX: -31.98, driftY: 42.35,
    hue: 96,
  },
  {
    id: 451, x: 21.266, y: 19.118,
    size: 2.43, opacity: 0.868,
    duration: 13.74, delay: -5.51,
    driftX: 22.27, driftY: -53.58,
    hue: 39,
  },
  {
    id: 452, x: 17.590, y: 76.731,
    size: 7.63, opacity: 0.595,
    duration: 8.74, delay: -8.77,
    driftX: 51.62, driftY: -42.94,
    hue: 80,
  },
  {
    id: 453, x: 59.129, y: 97.741,
    size: 7.49, opacity: 0.624,
    duration: 6.93, delay: -6.77,
    driftX: 53.31, driftY: 20.14,
    hue: 60,
  },
  {
    id: 454, x: 45.449, y: 82.572,
    size: 5.71, opacity: 0.571,
    duration: 9.65, delay: -1.92,
    driftX: -53.34, driftY: -6.51,
    hue: 30,
  },
  {
    id: 455, x: 16.931, y: 70.551,
    size: 6.69, opacity: 0.711,
    duration: 11.55, delay: -1.49,
    driftX: -30.19, driftY: 18.51,
    hue: 38,
  },
  {
    id: 456, x: 40.300, y: 19.919,
    size: 6.04, opacity: 0.656,
    duration: 12.48, delay: -1.98,
    driftX: -15.26, driftY: -3.91,
    hue: 105,
  },
  {
    id: 457, x: 30.299, y: 45.765,
    size: 1.61, opacity: 0.802,
    duration: 11.39, delay: -8.18,
    driftX: -30.00, driftY: 6.15,
    hue: 107,
  },
  {
    id: 458, x: 36.856, y: 7.243,
    size: 3.43, opacity: 0.382,
    duration: 7.13, delay: -6.70,
    driftX: 15.23, driftY: -13.85,
    hue: 103,
  },
  {
    id: 459, x: 23.989, y: 0.378,
    size: 6.79, opacity: 0.770,
    duration: 16.38, delay: -1.74,
    driftX: -30.96, driftY: 53.96,
    hue: 99,
  },
  {
    id: 460, x: 36.261, y: 7.681,
    size: 6.70, opacity: 0.782,
    duration: 18.15, delay: -3.17,
    driftX: 22.09, driftY: -59.17,
    hue: 23,
  },
  {
    id: 461, x: 7.654, y: 28.372,
    size: 6.97, opacity: 0.534,
    duration: 13.55, delay: -3.52,
    driftX: 20.46, driftY: -4.38,
    hue: 29,
  },
  {
    id: 462, x: 63.682, y: 15.082,
    size: 5.02, opacity: 0.511,
    duration: 18.59, delay: -7.92,
    driftX: 48.62, driftY: -34.71,
    hue: 11,
  },
  {
    id: 463, x: 12.538, y: 39.052,
    size: 6.33, opacity: 0.510,
    duration: 13.04, delay: -7.69,
    driftX: -23.36, driftY: -48.80,
    hue: 76,
  },
  {
    id: 464, x: 12.390, y: 26.664,
    size: 2.66, opacity: 0.446,
    duration: 7.33, delay: -11.04,
    driftX: 25.02, driftY: -42.20,
    hue: 81,
  },
  {
    id: 465, x: 11.576, y: 58.408,
    size: 4.88, opacity: 0.427,
    duration: 16.58, delay: -4.90,
    driftX: 27.34, driftY: -37.94,
    hue: 26,
  },
  {
    id: 466, x: 73.051, y: 48.169,
    size: 4.07, opacity: 0.614,
    duration: 17.36, delay: -7.24,
    driftX: 44.74, driftY: 50.51,
    hue: 101,
  },
  {
    id: 467, x: 99.950, y: 92.398,
    size: 7.43, opacity: 0.469,
    duration: 17.02, delay: -7.74,
    driftX: 49.49, driftY: 42.62,
    hue: 38,
  },
  {
    id: 468, x: 92.792, y: 59.623,
    size: 7.58, opacity: 1.000,
    duration: 12.83, delay: -0.48,
    driftX: -20.53, driftY: -16.88,
    hue: 95,
  },
  {
    id: 469, x: 30.155, y: 60.755,
    size: 5.66, opacity: 0.252,
    duration: 8.70, delay: -1.38,
    driftX: -49.48, driftY: -33.85,
    hue: 19,
  },
  {
    id: 470, x: 4.534, y: 63.930,
    size: 2.64, opacity: 0.729,
    duration: 7.64, delay: -0.68,
    driftX: -19.41, driftY: 9.58,
    hue: 54,
  },
  {
    id: 471, x: 57.088, y: 65.915,
    size: 3.48, opacity: 0.592,
    duration: 12.90, delay: -0.10,
    driftX: 52.77, driftY: -33.84,
    hue: 24,
  },
  {
    id: 472, x: 90.251, y: 61.299,
    size: 3.26, opacity: 0.577,
    duration: 5.05, delay: -9.28,
    driftX: -19.67, driftY: 33.44,
    hue: 54,
  },
  {
    id: 473, x: 42.421, y: 13.502,
    size: 6.21, opacity: 0.777,
    duration: 18.12, delay: -1.99,
    driftX: -16.44, driftY: -43.77,
    hue: 0,
  },
  {
    id: 474, x: 18.366, y: 10.697,
    size: 1.54, opacity: 0.246,
    duration: 15.26, delay: -4.00,
    driftX: -34.76, driftY: 6.98,
    hue: 49,
  },
  {
    id: 475, x: 50.957, y: 23.325,
    size: 2.92, opacity: 0.955,
    duration: 6.89, delay: -0.52,
    driftX: -31.61, driftY: -45.50,
    hue: 106,
  },
  {
    id: 476, x: 21.080, y: 61.986,
    size: 1.72, opacity: 0.313,
    duration: 6.44, delay: -2.95,
    driftX: -14.39, driftY: 32.16,
    hue: 78,
  },
  {
    id: 477, x: 32.183, y: 68.088,
    size: 4.16, opacity: 0.273,
    duration: 14.11, delay: -8.89,
    driftX: 32.25, driftY: -30.92,
    hue: 78,
  },
  {
    id: 478, x: 58.042, y: 66.887,
    size: 5.72, opacity: 0.305,
    duration: 11.60, delay: -9.80,
    driftX: -31.46, driftY: 51.63,
    hue: 8,
  },
  {
    id: 479, x: 93.842, y: 39.018,
    size: 4.27, opacity: 0.357,
    duration: 17.46, delay: -10.19,
    driftX: -39.65, driftY: 56.41,
    hue: 12,
  },
  {
    id: 480, x: 62.919, y: 41.933,
    size: 4.56, opacity: 0.947,
    duration: 9.16, delay: -5.24,
    driftX: -3.42, driftY: 12.48,
    hue: 83,
  },
  {
    id: 481, x: 1.862, y: 82.923,
    size: 6.58, opacity: 0.615,
    duration: 16.88, delay: -3.72,
    driftX: 35.41, driftY: -12.55,
    hue: 87,
  },
  {
    id: 482, x: 94.237, y: 51.795,
    size: 1.78, opacity: 0.839,
    duration: 10.73, delay: -0.00,
    driftX: -29.81, driftY: -33.07,
    hue: 29,
  },
  {
    id: 483, x: 93.193, y: 86.554,
    size: 4.27, opacity: 0.819,
    duration: 17.55, delay: -8.66,
    driftX: -45.13, driftY: 42.61,
    hue: 46,
  },
  {
    id: 484, x: 12.668, y: 99.399,
    size: 6.03, opacity: 0.816,
    duration: 16.24, delay: -11.00,
    driftX: 16.96, driftY: 18.45,
    hue: 61,
  },
  {
    id: 485, x: 93.132, y: 46.779,
    size: 3.85, opacity: 0.268,
    duration: 19.55, delay: -4.33,
    driftX: -28.53, driftY: -53.36,
    hue: 11,
  },
  {
    id: 486, x: 21.350, y: 17.019,
    size: 1.93, opacity: 0.873,
    duration: 5.72, delay: -3.57,
    driftX: -43.29, driftY: -47.83,
    hue: 75,
  },
  {
    id: 487, x: 9.397, y: 62.701,
    size: 1.69, opacity: 0.459,
    duration: 14.62, delay: -0.40,
    driftX: -16.32, driftY: 56.42,
    hue: 68,
  },
  {
    id: 488, x: 11.686, y: 71.225,
    size: 1.90, opacity: 0.278,
    duration: 12.58, delay: -6.97,
    driftX: 28.91, driftY: 42.41,
    hue: 42,
  },
  {
    id: 489, x: 66.696, y: 45.296,
    size: 7.79, opacity: 0.463,
    duration: 10.03, delay: -9.16,
    driftX: 48.55, driftY: -21.28,
    hue: 107,
  },
  {
    id: 490, x: 25.860, y: 29.345,
    size: 1.84, opacity: 0.329,
    duration: 19.15, delay: -5.21,
    driftX: -27.93, driftY: -34.26,
    hue: 80,
  },
  {
    id: 491, x: 55.817, y: 9.493,
    size: 6.98, opacity: 0.290,
    duration: 5.18, delay: -11.85,
    driftX: 15.58, driftY: 41.64,
    hue: 12,
  },
  {
    id: 492, x: 25.807, y: 88.134,
    size: 5.67, opacity: 0.383,
    duration: 6.20, delay: -11.61,
    driftX: 19.60, driftY: -56.13,
    hue: 87,
  },
  {
    id: 493, x: 79.140, y: 47.375,
    size: 6.27, opacity: 0.265,
    duration: 7.27, delay: -4.57,
    driftX: -33.00, driftY: 24.15,
    hue: 96,
  },
  {
    id: 494, x: 14.651, y: 66.760,
    size: 3.12, opacity: 0.633,
    duration: 10.31, delay: -0.26,
    driftX: 19.32, driftY: 45.68,
    hue: 19,
  },
  {
    id: 495, x: 42.516, y: 82.660,
    size: 4.38, opacity: 0.493,
    duration: 19.71, delay: -6.82,
    driftX: 4.68, driftY: 49.80,
    hue: 98,
  },
  {
    id: 496, x: 16.216, y: 7.403,
    size: 7.71, opacity: 0.893,
    duration: 7.58, delay: -10.13,
    driftX: -22.80, driftY: 31.35,
    hue: 70,
  },
  {
    id: 497, x: 49.140, y: 78.449,
    size: 2.07, opacity: 0.944,
    duration: 8.49, delay: -5.77,
    driftX: 27.67, driftY: 20.47,
    hue: 95,
  },
  {
    id: 498, x: 70.215, y: 61.054,
    size: 2.55, opacity: 0.695,
    duration: 13.72, delay: -4.31,
    driftX: -22.89, driftY: 44.60,
    hue: 96,
  },
  {
    id: 499, x: 9.598, y: 60.764,
    size: 2.63, opacity: 0.487,
    duration: 4.98, delay: -1.57,
    driftX: 12.14, driftY: 30.71,
    hue: 59,
  },
  {
    id: 500, x: 32.750, y: 79.450,
    size: 7.62, opacity: 0.664,
    duration: 6.74, delay: -1.70,
    driftX: -17.15, driftY: -15.69,
    hue: 21,
  },
  {
    id: 501, x: 84.318, y: 62.050,
    size: 7.53, opacity: 0.477,
    duration: 17.75, delay: -5.08,
    driftX: 9.75, driftY: 24.06,
    hue: 61,
  },
  {
    id: 502, x: 19.439, y: 39.615,
    size: 5.05, opacity: 0.559,
    duration: 10.99, delay: -1.48,
    driftX: 23.50, driftY: 41.16,
    hue: 57,
  },
  {
    id: 503, x: 33.565, y: 25.424,
    size: 6.86, opacity: 0.507,
    duration: 6.64, delay: -3.92,
    driftX: -26.24, driftY: 28.43,
    hue: 1,
  },
  {
    id: 504, x: 93.417, y: 84.653,
    size: 4.43, opacity: 0.614,
    duration: 18.67, delay: -5.13,
    driftX: -6.97, driftY: -16.86,
    hue: 5,
  },
  {
    id: 505, x: 22.327, y: 86.163,
    size: 2.09, opacity: 0.504,
    duration: 17.04, delay: -11.52,
    driftX: 45.84, driftY: -9.37,
    hue: 53,
  },
  {
    id: 506, x: 69.686, y: 47.601,
    size: 4.38, opacity: 0.190,
    duration: 8.26, delay: -5.00,
    driftX: 13.82, driftY: -31.05,
    hue: 109,
  },
  {
    id: 507, x: 59.006, y: 7.652,
    size: 2.98, opacity: 0.269,
    duration: 6.45, delay: -5.49,
    driftX: -22.52, driftY: 55.50,
    hue: 109,
  },
  {
    id: 508, x: 50.068, y: 4.248,
    size: 7.54, opacity: 0.263,
    duration: 4.79, delay: -6.38,
    driftX: 43.55, driftY: -56.12,
    hue: 51,
  },
  {
    id: 509, x: 89.750, y: 32.687,
    size: 7.65, opacity: 0.825,
    duration: 5.51, delay: -5.40,
    driftX: -1.26, driftY: -32.85,
    hue: 0,
  },
  {
    id: 510, x: 85.691, y: 45.705,
    size: 5.24, opacity: 0.495,
    duration: 6.77, delay: -11.05,
    driftX: 54.40, driftY: -59.70,
    hue: 24,
  },
  {
    id: 511, x: 53.909, y: 64.819,
    size: 3.74, opacity: 0.203,
    duration: 19.41, delay: -10.58,
    driftX: -41.70, driftY: 58.94,
    hue: 18,
  },
  {
    id: 512, x: 74.881, y: 80.330,
    size: 3.27, opacity: 0.196,
    duration: 19.84, delay: -5.97,
    driftX: 34.00, driftY: 55.43,
    hue: 89,
  },
  {
    id: 513, x: 34.317, y: 60.420,
    size: 1.58, opacity: 0.453,
    duration: 6.68, delay: -7.37,
    driftX: -38.99, driftY: -30.30,
    hue: 54,
  },
  {
    id: 514, x: 77.076, y: 95.486,
    size: 2.35, opacity: 0.918,
    duration: 14.64, delay: -3.15,
    driftX: 31.92, driftY: 9.41,
    hue: 23,
  },
  {
    id: 515, x: 44.893, y: 88.660,
    size: 7.09, opacity: 0.957,
    duration: 17.57, delay: -3.62,
    driftX: -0.83, driftY: 54.99,
    hue: 17,
  },
  {
    id: 516, x: 88.040, y: 22.456,
    size: 7.75, opacity: 0.545,
    duration: 9.00, delay: -3.50,
    driftX: -46.72, driftY: 59.28,
    hue: 82,
  },
  {
    id: 517, x: 46.197, y: 74.813,
    size: 2.31, opacity: 0.956,
    duration: 12.18, delay: -10.22,
    driftX: 31.90, driftY: 43.76,
    hue: 23,
  },
  {
    id: 518, x: 77.759, y: 75.959,
    size: 5.87, opacity: 0.864,
    duration: 14.77, delay: -8.07,
    driftX: 9.31, driftY: -44.15,
    hue: 81,
  },
  {
    id: 519, x: 76.163, y: 33.781,
    size: 5.30, opacity: 0.465,
    duration: 6.30, delay: -8.55,
    driftX: -38.83, driftY: -23.35,
    hue: 2,
  },
  {
    id: 520, x: 17.917, y: 61.760,
    size: 7.11, opacity: 0.471,
    duration: 16.53, delay: -3.48,
    driftX: 26.76, driftY: 21.29,
    hue: 88,
  },
  {
    id: 521, x: 96.854, y: 59.923,
    size: 2.36, opacity: 0.530,
    duration: 13.79, delay: -5.82,
    driftX: -6.12, driftY: -8.31,
    hue: 7,
  },
  {
    id: 522, x: 86.900, y: 81.771,
    size: 5.81, opacity: 0.896,
    duration: 19.88, delay: -5.45,
    driftX: 30.29, driftY: -20.74,
    hue: 84,
  },
  {
    id: 523, x: 60.539, y: 13.381,
    size: 7.69, opacity: 0.653,
    duration: 13.27, delay: -9.83,
    driftX: -11.79, driftY: -27.23,
    hue: 72,
  },
  {
    id: 524, x: 39.280, y: 49.636,
    size: 6.36, opacity: 0.657,
    duration: 8.05, delay: -10.03,
    driftX: 40.87, driftY: 31.28,
    hue: 95,
  },
  {
    id: 525, x: 39.458, y: 25.881,
    size: 7.51, opacity: 0.542,
    duration: 9.87, delay: -8.37,
    driftX: 22.30, driftY: 32.62,
    hue: 34,
  },
  {
    id: 526, x: 86.500, y: 62.497,
    size: 2.25, opacity: 0.194,
    duration: 5.57, delay: -6.77,
    driftX: 49.01, driftY: 22.31,
    hue: 25,
  },
  {
    id: 527, x: 49.216, y: 52.611,
    size: 3.14, opacity: 0.676,
    duration: 14.06, delay: -2.72,
    driftX: -6.37, driftY: -39.72,
    hue: 11,
  },
  {
    id: 528, x: 3.000, y: 56.841,
    size: 7.25, opacity: 0.808,
    duration: 15.44, delay: -0.95,
    driftX: -28.79, driftY: 50.48,
    hue: 20,
  },
  {
    id: 529, x: 16.540, y: 40.017,
    size: 3.29, opacity: 0.488,
    duration: 9.05, delay: -8.92,
    driftX: 34.17, driftY: -32.22,
    hue: 78,
  },
  {
    id: 530, x: 26.637, y: 62.708,
    size: 3.94, opacity: 0.444,
    duration: 14.13, delay: -6.11,
    driftX: -57.75, driftY: -7.42,
    hue: 88,
  },
  {
    id: 531, x: 67.050, y: 46.157,
    size: 3.73, opacity: 0.231,
    duration: 17.13, delay: -3.28,
    driftX: 32.55, driftY: -11.06,
    hue: 100,
  },
  {
    id: 532, x: 8.549, y: 37.754,
    size: 2.30, opacity: 0.911,
    duration: 19.37, delay: -1.28,
    driftX: -51.78, driftY: -22.15,
    hue: 72,
  },
  {
    id: 533, x: 91.169, y: 71.940,
    size: 4.32, opacity: 0.255,
    duration: 17.49, delay: -6.86,
    driftX: -22.66, driftY: 11.64,
    hue: 41,
  },
  {
    id: 534, x: 40.270, y: 18.477,
    size: 7.60, opacity: 0.395,
    duration: 12.39, delay: -4.20,
    driftX: 28.73, driftY: -15.54,
    hue: 4,
  },
  {
    id: 535, x: 99.971, y: 30.419,
    size: 6.00, opacity: 0.828,
    duration: 6.50, delay: -2.58,
    driftX: -56.87, driftY: 29.85,
    hue: 81,
  },
  {
    id: 536, x: 41.620, y: 38.448,
    size: 4.14, opacity: 0.936,
    duration: 18.45, delay: -2.35,
    driftX: -32.85, driftY: 41.03,
    hue: 21,
  },
  {
    id: 537, x: 0.370, y: 92.252,
    size: 8.00, opacity: 0.539,
    duration: 11.99, delay: -4.17,
    driftX: -12.77, driftY: -22.50,
    hue: 31,
  },
  {
    id: 538, x: 12.993, y: 8.493,
    size: 3.79, opacity: 0.538,
    duration: 13.57, delay: -2.28,
    driftX: 34.84, driftY: -5.57,
    hue: 68,
  },
  {
    id: 539, x: 88.497, y: 26.947,
    size: 6.89, opacity: 0.814,
    duration: 8.08, delay: -7.61,
    driftX: 36.09, driftY: 10.35,
    hue: 16,
  },
  {
    id: 540, x: 65.091, y: 53.782,
    size: 4.38, opacity: 0.847,
    duration: 5.71, delay: -3.06,
    driftX: 18.22, driftY: -49.99,
    hue: 91,
  },
  {
    id: 541, x: 24.099, y: 76.500,
    size: 2.27, opacity: 0.322,
    duration: 19.09, delay: -6.71,
    driftX: 58.02, driftY: -58.13,
    hue: 87,
  },
  {
    id: 542, x: 23.597, y: 80.017,
    size: 1.77, opacity: 0.388,
    duration: 17.04, delay: -7.74,
    driftX: -22.88, driftY: 14.67,
    hue: 8,
  },
  {
    id: 543, x: 7.253, y: 17.052,
    size: 5.77, opacity: 0.835,
    duration: 9.78, delay: -3.41,
    driftX: -25.46, driftY: 49.27,
    hue: 60,
  },
  {
    id: 544, x: 80.322, y: 13.656,
    size: 7.31, opacity: 0.202,
    duration: 5.09, delay: -10.98,
    driftX: -48.86, driftY: 46.78,
    hue: 32,
  },
  {
    id: 545, x: 54.369, y: 46.405,
    size: 1.61, opacity: 0.396,
    duration: 17.01, delay: -1.79,
    driftX: 24.94, driftY: 16.63,
    hue: 48,
  },
  {
    id: 546, x: 49.603, y: 1.270,
    size: 3.68, opacity: 0.952,
    duration: 13.87, delay: -1.71,
    driftX: 32.66, driftY: 44.31,
    hue: 51,
  },
  {
    id: 547, x: 16.954, y: 78.210,
    size: 7.74, opacity: 0.600,
    duration: 16.92, delay: -9.52,
    driftX: -41.78, driftY: -17.70,
    hue: 81,
  },
  {
    id: 548, x: 93.959, y: 6.386,
    size: 2.42, opacity: 0.504,
    duration: 8.88, delay: -7.24,
    driftX: -27.35, driftY: 55.68,
    hue: 70,
  },
  {
    id: 549, x: 53.076, y: 81.944,
    size: 5.17, opacity: 0.588,
    duration: 6.03, delay: -4.47,
    driftX: -50.01, driftY: -13.43,
    hue: 1,
  },
  {
    id: 550, x: 59.153, y: 71.923,
    size: 6.45, opacity: 0.434,
    duration: 11.75, delay: -7.48,
    driftX: 21.64, driftY: -28.08,
    hue: 89,
  },
  {
    id: 551, x: 72.342, y: 85.442,
    size: 1.64, opacity: 0.972,
    duration: 16.47, delay: -7.31,
    driftX: -49.35, driftY: 41.98,
    hue: 27,
  },
  {
    id: 552, x: 21.440, y: 51.760,
    size: 7.37, opacity: 0.632,
    duration: 19.86, delay: -8.54,
    driftX: -50.64, driftY: 56.70,
    hue: 43,
  },
  {
    id: 553, x: 20.262, y: 87.044,
    size: 4.92, opacity: 0.248,
    duration: 5.67, delay: -0.51,
    driftX: 26.25, driftY: -31.50,
    hue: 98,
  },
  {
    id: 554, x: 68.124, y: 76.940,
    size: 3.55, opacity: 0.363,
    duration: 12.69, delay: -1.41,
    driftX: -14.92, driftY: -48.87,
    hue: 39,
  },
  {
    id: 555, x: 41.102, y: 1.692,
    size: 7.74, opacity: 0.515,
    duration: 20.41, delay: -1.98,
    driftX: 24.18, driftY: 22.54,
    hue: 52,
  },
  {
    id: 556, x: 20.442, y: 55.927,
    size: 7.09, opacity: 0.330,
    duration: 5.47, delay: -1.31,
    driftX: 8.29, driftY: 19.58,
    hue: 108,
  },
  {
    id: 557, x: 29.451, y: 38.757,
    size: 7.75, opacity: 0.796,
    duration: 16.23, delay: -6.82,
    driftX: -5.26, driftY: 44.77,
    hue: 57,
  },
  {
    id: 558, x: 97.922, y: 1.566,
    size: 2.24, opacity: 0.494,
    duration: 7.22, delay: -8.48,
    driftX: -47.56, driftY: -23.59,
    hue: 109,
  },
  {
    id: 559, x: 76.988, y: 15.202,
    size: 6.72, opacity: 0.351,
    duration: 9.67, delay: -0.15,
    driftX: 41.93, driftY: 36.75,
    hue: 40,
  },
  {
    id: 560, x: 87.157, y: 35.745,
    size: 5.05, opacity: 0.744,
    duration: 9.99, delay: -3.47,
    driftX: 25.14, driftY: 16.84,
    hue: 100,
  },
  {
    id: 561, x: 58.474, y: 69.737,
    size: 3.27, opacity: 0.562,
    duration: 17.40, delay: -0.22,
    driftX: -4.83, driftY: 43.51,
    hue: 72,
  },
  {
    id: 562, x: 71.533, y: 19.979,
    size: 2.34, opacity: 0.332,
    duration: 20.28, delay: -9.20,
    driftX: 13.81, driftY: -51.03,
    hue: 32,
  },
  {
    id: 563, x: 75.260, y: 11.126,
    size: 1.96, opacity: 0.515,
    duration: 12.13, delay: -10.96,
    driftX: -14.01, driftY: -11.82,
    hue: 18,
  },
  {
    id: 564, x: 18.015, y: 81.796,
    size: 1.88, opacity: 0.222,
    duration: 13.09, delay: -0.81,
    driftX: 3.32, driftY: 43.50,
    hue: 59,
  },
  {
    id: 565, x: 82.975, y: 71.175,
    size: 2.66, opacity: 0.617,
    duration: 11.99, delay: -5.82,
    driftX: -25.29, driftY: 29.62,
    hue: 97,
  },
  {
    id: 566, x: 15.533, y: 15.768,
    size: 1.82, opacity: 0.968,
    duration: 14.59, delay: -10.18,
    driftX: -25.24, driftY: 33.27,
    hue: 16,
  },
  {
    id: 567, x: 98.982, y: 8.469,
    size: 6.03, opacity: 0.690,
    duration: 7.37, delay: -4.00,
    driftX: -43.58, driftY: -35.85,
    hue: 58,
  },
  {
    id: 568, x: 3.647, y: 16.299,
    size: 6.41, opacity: 0.452,
    duration: 8.18, delay: -3.34,
    driftX: 18.83, driftY: 44.71,
    hue: 28,
  },
  {
    id: 569, x: 15.135, y: 21.375,
    size: 3.34, opacity: 0.903,
    duration: 13.83, delay: -5.27,
    driftX: 0.52, driftY: 47.37,
    hue: 10,
  },
  {
    id: 570, x: 66.598, y: 89.304,
    size: 2.47, opacity: 0.855,
    duration: 17.85, delay: -3.30,
    driftX: 12.82, driftY: -40.54,
    hue: 2,
  },
  {
    id: 571, x: 78.231, y: 26.882,
    size: 4.33, opacity: 0.213,
    duration: 11.38, delay: -0.97,
    driftX: 12.47, driftY: 32.37,
    hue: 14,
  },
  {
    id: 572, x: 84.552, y: 98.038,
    size: 5.22, opacity: 0.924,
    duration: 9.59, delay: -8.07,
    driftX: -10.30, driftY: 19.10,
    hue: 71,
  },
  {
    id: 573, x: 51.997, y: 63.456,
    size: 7.26, opacity: 0.632,
    duration: 10.11, delay: -9.27,
    driftX: 13.14, driftY: -30.82,
    hue: 80,
  },
  {
    id: 574, x: 76.426, y: 19.232,
    size: 3.41, opacity: 0.539,
    duration: 4.67, delay: -1.62,
    driftX: 45.17, driftY: -20.55,
    hue: 65,
  },
  {
    id: 575, x: 69.733, y: 72.336,
    size: 7.45, opacity: 0.959,
    duration: 4.80, delay: -7.49,
    driftX: 0.08, driftY: 38.08,
    hue: 72,
  },
  {
    id: 576, x: 11.318, y: 40.887,
    size: 5.06, opacity: 0.962,
    duration: 12.60, delay: -3.65,
    driftX: -24.93, driftY: -1.43,
    hue: 62,
  },
  {
    id: 577, x: 59.747, y: 54.717,
    size: 2.92, opacity: 0.597,
    duration: 11.87, delay: -9.24,
    driftX: -46.77, driftY: 10.43,
    hue: 11,
  },
  {
    id: 578, x: 88.576, y: 52.002,
    size: 6.54, opacity: 0.518,
    duration: 14.96, delay: -1.87,
    driftX: 27.41, driftY: -3.22,
    hue: 50,
  },
  {
    id: 579, x: 68.552, y: 87.459,
    size: 5.51, opacity: 0.859,
    duration: 19.35, delay: -11.34,
    driftX: 37.21, driftY: -58.43,
    hue: 97,
  },
  {
    id: 580, x: 49.331, y: 18.273,
    size: 1.77, opacity: 0.982,
    duration: 4.82, delay: -10.03,
    driftX: -32.05, driftY: 14.05,
    hue: 22,
  },
  {
    id: 581, x: 50.143, y: 59.607,
    size: 7.65, opacity: 0.318,
    duration: 15.10, delay: -1.42,
    driftX: -29.10, driftY: 46.53,
    hue: 77,
  },
  {
    id: 582, x: 4.768, y: 50.952,
    size: 4.15, opacity: 0.799,
    duration: 8.35, delay: -3.06,
    driftX: -6.71, driftY: 24.05,
    hue: 78,
  },
  {
    id: 583, x: 91.416, y: 39.537,
    size: 2.98, opacity: 0.422,
    duration: 9.90, delay: -4.31,
    driftX: 46.78, driftY: -43.43,
    hue: 83,
  },
  {
    id: 584, x: 73.981, y: 97.872,
    size: 6.35, opacity: 0.631,
    duration: 20.28, delay: -8.34,
    driftX: -51.78, driftY: 32.25,
    hue: 3,
  },
  {
    id: 585, x: 65.012, y: 89.216,
    size: 4.78, opacity: 0.287,
    duration: 12.06, delay: -9.30,
    driftX: -54.74, driftY: 41.58,
    hue: 30,
  },
  {
    id: 586, x: 54.709, y: 96.070,
    size: 4.69, opacity: 0.179,
    duration: 9.40, delay: -0.22,
    driftX: 27.88, driftY: 45.96,
    hue: 83,
  },
  {
    id: 587, x: 99.461, y: 21.133,
    size: 5.50, opacity: 0.705,
    duration: 6.55, delay: -6.29,
    driftX: -48.88, driftY: 44.70,
    hue: 25,
  },
  {
    id: 588, x: 78.770, y: 46.711,
    size: 3.98, opacity: 0.472,
    duration: 6.62, delay: -10.28,
    driftX: 23.93, driftY: 51.07,
    hue: 99,
  },
  {
    id: 589, x: 14.639, y: 72.030,
    size: 1.97, opacity: 0.554,
    duration: 11.82, delay: -2.66,
    driftX: 11.83, driftY: 50.68,
    hue: 99,
  },
  {
    id: 590, x: 35.081, y: 37.612,
    size: 3.09, opacity: 0.937,
    duration: 9.62, delay: -5.20,
    driftX: 41.06, driftY: 45.77,
    hue: 82,
  },
  {
    id: 591, x: 20.588, y: 4.971,
    size: 5.44, opacity: 0.596,
    duration: 15.31, delay: -7.49,
    driftX: 38.28, driftY: 2.59,
    hue: 17,
  },
  {
    id: 592, x: 53.656, y: 35.929,
    size: 7.48, opacity: 0.443,
    duration: 4.81, delay: -4.44,
    driftX: -18.21, driftY: -52.26,
    hue: 97,
  },
  {
    id: 593, x: 46.866, y: 24.365,
    size: 2.40, opacity: 0.434,
    duration: 17.02, delay: -5.31,
    driftX: 10.16, driftY: -36.46,
    hue: 97,
  },
  {
    id: 594, x: 61.965, y: 77.987,
    size: 2.10, opacity: 0.589,
    duration: 17.57, delay: -8.37,
    driftX: -43.49, driftY: 37.82,
    hue: 105,
  },
  {
    id: 595, x: 20.086, y: 9.022,
    size: 4.75, opacity: 0.251,
    duration: 4.70, delay: -9.22,
    driftX: 27.77, driftY: -32.71,
    hue: 24,
  },
  {
    id: 596, x: 2.074, y: 65.580,
    size: 5.41, opacity: 0.827,
    duration: 14.83, delay: -8.61,
    driftX: 19.15, driftY: -14.95,
    hue: 68,
  },
  {
    id: 597, x: 29.868, y: 13.365,
    size: 6.75, opacity: 0.732,
    duration: 13.81, delay: -9.76,
    driftX: -3.73, driftY: 53.19,
    hue: 44,
  },
  {
    id: 598, x: 17.749, y: 82.369,
    size: 1.81, opacity: 0.509,
    duration: 17.37, delay: -4.41,
    driftX: 5.83, driftY: -25.21,
    hue: 72,
  },
  {
    id: 599, x: 98.247, y: 66.256,
    size: 5.76, opacity: 0.162,
    duration: 9.64, delay: -11.91,
    driftX: 47.73, driftY: 10.62,
    hue: 99,
  },
  {
    id: 600, x: 88.186, y: 32.180,
    size: 3.45, opacity: 0.178,
    duration: 19.68, delay: -3.00,
    driftX: 8.52, driftY: 33.83,
    hue: 19,
  },
  {
    id: 601, x: 67.448, y: 54.035,
    size: 2.56, opacity: 0.619,
    duration: 10.87, delay: -2.14,
    driftX: -28.82, driftY: 48.94,
    hue: 77,
  },
  {
    id: 602, x: 83.991, y: 66.020,
    size: 7.63, opacity: 0.967,
    duration: 13.03, delay: -7.18,
    driftX: 26.84, driftY: 3.88,
    hue: 66,
  },
  {
    id: 603, x: 25.849, y: 84.170,
    size: 6.22, opacity: 0.984,
    duration: 19.79, delay: -3.27,
    driftX: -36.58, driftY: 11.73,
    hue: 66,
  },
  {
    id: 604, x: 98.236, y: 87.179,
    size: 2.93, opacity: 0.397,
    duration: 13.62, delay: -0.19,
    driftX: 58.28, driftY: -36.62,
    hue: 69,
  },
  {
    id: 605, x: 6.611, y: 46.874,
    size: 6.59, opacity: 0.208,
    duration: 13.75, delay: -6.26,
    driftX: 28.53, driftY: 51.65,
    hue: 103,
  },
  {
    id: 606, x: 93.012, y: 46.683,
    size: 7.64, opacity: 0.386,
    duration: 8.45, delay: -9.16,
    driftX: 19.69, driftY: -2.85,
    hue: 29,
  },
  {
    id: 607, x: 6.790, y: 73.126,
    size: 1.92, opacity: 0.884,
    duration: 10.70, delay: -10.69,
    driftX: -46.78, driftY: 38.22,
    hue: 35,
  },
  {
    id: 608, x: 17.370, y: 48.906,
    size: 4.19, opacity: 0.748,
    duration: 13.22, delay: -3.44,
    driftX: -5.00, driftY: -48.35,
    hue: 71,
  },
  {
    id: 609, x: 73.034, y: 40.295,
    size: 1.92, opacity: 0.767,
    duration: 6.61, delay: -2.05,
    driftX: -30.94, driftY: -55.52,
    hue: 20,
  },
  {
    id: 610, x: 34.730, y: 45.882,
    size: 6.86, opacity: 0.459,
    duration: 9.89, delay: -5.12,
    driftX: 49.13, driftY: 43.91,
    hue: 70,
  },
  {
    id: 611, x: 38.936, y: 4.249,
    size: 4.13, opacity: 0.799,
    duration: 20.21, delay: -0.78,
    driftX: -4.38, driftY: -17.97,
    hue: 43,
  },
  {
    id: 612, x: 81.439, y: 80.871,
    size: 4.45, opacity: 0.746,
    duration: 19.30, delay: -8.24,
    driftX: -21.06, driftY: -43.72,
    hue: 60,
  },
  {
    id: 613, x: 22.108, y: 59.138,
    size: 3.15, opacity: 0.408,
    duration: 6.59, delay: -0.74,
    driftX: 16.52, driftY: -59.55,
    hue: 42,
  },
  {
    id: 614, x: 52.732, y: 14.795,
    size: 7.23, opacity: 0.804,
    duration: 8.49, delay: -6.17,
    driftX: 32.49, driftY: -28.73,
    hue: 55,
  },
  {
    id: 615, x: 20.787, y: 12.084,
    size: 5.08, opacity: 0.596,
    duration: 12.46, delay: -8.93,
    driftX: 12.38, driftY: 17.96,
    hue: 79,
  },
  {
    id: 616, x: 0.319, y: 77.991,
    size: 1.63, opacity: 0.397,
    duration: 18.65, delay: -6.96,
    driftX: -47.45, driftY: -52.76,
    hue: 8,
  },
  {
    id: 617, x: 53.691, y: 85.582,
    size: 4.51, opacity: 0.904,
    duration: 16.44, delay: -3.56,
    driftX: 36.04, driftY: 31.41,
    hue: 79,
  },
  {
    id: 618, x: 84.989, y: 95.041,
    size: 6.06, opacity: 0.698,
    duration: 12.53, delay: -3.17,
    driftX: 33.74, driftY: 7.36,
    hue: 103,
  },
  {
    id: 619, x: 8.592, y: 40.843,
    size: 2.39, opacity: 0.321,
    duration: 18.09, delay: -0.39,
    driftX: -0.38, driftY: 51.21,
    hue: 52,
  },
  {
    id: 620, x: 99.913, y: 43.158,
    size: 7.32, opacity: 0.503,
    duration: 20.02, delay: -2.04,
    driftX: -12.36, driftY: -0.20,
    hue: 82,
  },
  {
    id: 621, x: 28.629, y: 38.712,
    size: 2.23, opacity: 0.422,
    duration: 6.13, delay: -7.18,
    driftX: 1.70, driftY: 19.84,
    hue: 75,
  },
  {
    id: 622, x: 50.643, y: 26.192,
    size: 5.72, opacity: 0.754,
    duration: 7.23, delay: -4.28,
    driftX: -28.60, driftY: -16.96,
    hue: 1,
  },
  {
    id: 623, x: 16.168, y: 67.838,
    size: 3.33, opacity: 0.871,
    duration: 8.97, delay: -6.69,
    driftX: -45.06, driftY: -28.21,
    hue: 81,
  },
  {
    id: 624, x: 87.630, y: 67.824,
    size: 7.29, opacity: 0.995,
    duration: 6.45, delay: -4.02,
    driftX: -7.49, driftY: -26.98,
    hue: 59,
  },
  {
    id: 625, x: 4.141, y: 39.357,
    size: 4.52, opacity: 0.232,
    duration: 17.44, delay: -0.09,
    driftX: 43.21, driftY: 31.90,
    hue: 30,
  },
  {
    id: 626, x: 65.072, y: 71.973,
    size: 3.39, opacity: 0.895,
    duration: 14.33, delay: -8.67,
    driftX: 59.84, driftY: 38.23,
    hue: 27,
  },
  {
    id: 627, x: 79.893, y: 95.300,
    size: 6.18, opacity: 0.701,
    duration: 8.21, delay: -11.28,
    driftX: 37.65, driftY: -39.26,
    hue: 49,
  },
  {
    id: 628, x: 49.054, y: 79.371,
    size: 6.91, opacity: 0.781,
    duration: 18.74, delay: -11.33,
    driftX: -52.96, driftY: -22.09,
    hue: 55,
  },
  {
    id: 629, x: 15.938, y: 66.315,
    size: 2.78, opacity: 0.296,
    duration: 12.52, delay: -6.94,
    driftX: -10.67, driftY: 19.17,
    hue: 75,
  },
  {
    id: 630, x: 85.031, y: 90.636,
    size: 7.84, opacity: 0.263,
    duration: 13.84, delay: -9.76,
    driftX: -14.17, driftY: 25.48,
    hue: 7,
  },
  {
    id: 631, x: 9.623, y: 34.259,
    size: 1.57, opacity: 0.185,
    duration: 12.09, delay: -0.42,
    driftX: 29.62, driftY: 38.99,
    hue: 39,
  },
  {
    id: 632, x: 36.280, y: 27.354,
    size: 1.90, opacity: 0.595,
    duration: 18.73, delay: -11.49,
    driftX: -58.34, driftY: 32.20,
    hue: 30,
  },
  {
    id: 633, x: 97.717, y: 82.013,
    size: 5.96, opacity: 0.768,
    duration: 16.61, delay: -11.88,
    driftX: 52.97, driftY: -38.31,
    hue: 16,
  },
  {
    id: 634, x: 5.662, y: 66.751,
    size: 4.79, opacity: 0.867,
    duration: 11.63, delay: -6.18,
    driftX: -56.76, driftY: -47.46,
    hue: 72,
  },
  {
    id: 635, x: 24.080, y: 90.982,
    size: 1.68, opacity: 0.769,
    duration: 13.27, delay: -0.89,
    driftX: -35.82, driftY: 13.15,
    hue: 47,
  },
  {
    id: 636, x: 19.394, y: 35.351,
    size: 6.19, opacity: 0.863,
    duration: 5.60, delay: -0.41,
    driftX: -46.76, driftY: -28.08,
    hue: 10,
  },
  {
    id: 637, x: 90.798, y: 99.987,
    size: 7.13, opacity: 0.949,
    duration: 17.75, delay: -5.13,
    driftX: 32.68, driftY: -5.20,
    hue: 56,
  },
  {
    id: 638, x: 2.519, y: 41.435,
    size: 7.29, opacity: 0.855,
    duration: 19.48, delay: -5.19,
    driftX: 20.39, driftY: -11.73,
    hue: 99,
  },
  {
    id: 639, x: 96.266, y: 59.641,
    size: 6.56, opacity: 0.811,
    duration: 9.15, delay: -3.20,
    driftX: 21.45, driftY: 57.73,
    hue: 49,
  },
  {
    id: 640, x: 4.479, y: 9.805,
    size: 2.26, opacity: 0.658,
    duration: 6.17, delay: -9.13,
    driftX: 25.27, driftY: -46.88,
    hue: 1,
  },
  /* SIGNAL_NODE_DATA_END */
]

function Scene() {
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)

  useFrame((state, delta) => {
    if (!group.current || !core.current) return
    group.current.rotation.y += delta * 0.09
    group.current.rotation.x = state.pointer.y * 0.18
    group.current.rotation.z = state.pointer.x * -0.12
    core.current.rotation.y -= delta * 0.22
  })

  return (
    <group ref={group}>
      <Float speed={1.8} rotationIntensity={0.65} floatIntensity={1.2}>
        <mesh ref={core} scale={2.05}>
          <icosahedronGeometry args={[1, 24]} />
          <MeshDistortMaterial
            color="#bfff00"
            emissive="#395200"
            emissiveIntensity={0.6}
            roughness={0.32}
            metalness={0.86}
            distort={0.42}
            speed={2.2}
            wireframe
          />
        </mesh>
        <mesh scale={1.72}>
          <icosahedronGeometry args={[1, 5]} />
          <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.15} />
        </mesh>
        <mesh scale={1.75}>
          <torusGeometry args={[1.35, 0.012, 8, 100]} />
          <meshBasicMaterial color="#7df9ff" />
        </mesh>
      </Float>
      <Sparkles count={85} scale={7} size={1.6} speed={0.35} color="#7df9ff" opacity={0.7} />
    </group>
  )
}

function WebGLHero() {
  return (
    <div className="webgl-wrap" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 3]} color="#bfff00" intensity={30} />
        <pointLight position={[-4, -2, 2]} color="#7df9ff" intensity={20} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}

function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const smoothX = useSpring(x, { stiffness: 650, damping: 42, mass: 0.18 })
  const smoothY = useSpring(y, { stiffness: 650, damping: 42, mass: 0.18 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const move = (event: MouseEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setActive(Boolean((event.target as HTMLElement).closest('a, button, .project-visual')))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <motion.div
      className="cursor"
      data-active={active}
      style={{ x: smoothX, y: smoothY }}
      transition={{ type: 'spring' }}
    />
  )
}

function Loader() {
  const [visible, setVisible] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(100, Math.floor(((now - started) / 1350) * 100))
      setCount(progress)
      if (progress < 100) frame = requestAnimationFrame(tick)
      else window.setTimeout(() => setVisible(false), 240)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="loader" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <div className="loader-mark"><Asterisk size={20} /> AR / 26</div>
          <div className="loader-count">{String(count).padStart(3, '0')}</div>
          <div className="loader-track"><motion.span style={{ scaleX: count / 100 }} /></div>
          <p>COMPILING VISUAL SYSTEM</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function MagneticLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x, y }}
      onMouseMove={(event) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.a>
  )
}

function PointerGlow() {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const smoothX = useSpring(x, { stiffness: 80, damping: 24, mass: 0.7 })
  const smoothY = useSpring(y, { stiffness: 80, damping: 24, mass: 0.7 })

  useEffect(() => {
    const move = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return <motion.div className="pointer-glow" style={{ x: smoothX, y: smoothY }} aria-hidden="true" />
}

function ScrollCoordinates() {
  const { scrollYProgress } = useScroll()
  const [percentage, setPercentage] = useState(0)

  useEffect(() => scrollYProgress.on('change', (value) => setPercentage(Math.round(value * 100))), [scrollYProgress])

  return (
    <div className="scroll-coordinates" aria-hidden="true">
      <span>Y / {String(percentage).padStart(3, '0')}</span>
      <i />
      <span>SYS.ONLINE</span>
    </div>
  )
}

function SplitHeading({ lines, accent }: { lines: string[]; accent?: number }) {
  return (
    <h2 className="split-heading">
      {lines.map((line, index) => (
        <span className="split-line" key={line}>
          <motion.span
            className={index === accent ? 'is-accent' : ''}
            initial={{ y: '115%', rotate: 1.5 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h2>
  )
}

function TextScramble({ children }: { children: string }) {
  const [text, setText] = useState(children)
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*'
  const frame = useRef(0)

  const scramble = () => {
    cancelAnimationFrame(frame.current)
    let iteration = 0
    const render = () => {
      setText(
        children
          .split('')
          .map((letter, index) => {
            if (letter === ' ') return ' '
            if (index < iteration) return children[index]
            return glyphs[Math.floor(Math.random() * glyphs.length)]
          })
          .join(''),
      )
      iteration += 0.45
      if (iteration <= children.length) frame.current = requestAnimationFrame(render)
    }
    frame.current = requestAnimationFrame(render)
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return <span onMouseEnter={scramble}>{text}</span>
}

function LiveClock() {
  const [time, setTime] = useState('00:00:00')

  useEffect(() => {
    const update = () => {
      setTime(new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'America/New_York',
      }).format(new Date()))
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [])

  return <span>{time} EST</span>
}

function SoundControl() {
  const [playing, setPlaying] = useState(false)

  return (
    <button className="sound-control" onClick={() => setPlaying((current) => !current)} aria-label={`${playing ? 'Disable' : 'Enable'} ambient sound visualization`}>
      <span className={playing ? 'sound-bars is-playing' : 'sound-bars'} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
      </span>
      <span>SOUND {playing ? 'ON' : 'OFF'}</span>
    </button>
  )
}

function MetricsStrip() {
  const metrics = [
    ['10+', 'YEARS IN THE BROWSER'],
    ['47', 'PROJECTS SHIPPED'],
    ['19', 'GLOBAL AWARDS'],
    ['60', 'FRAMES / SECOND'],
  ]

  return (
    <section className="metrics-strip" aria-label="Selected metrics">
      {metrics.map(([value, label], index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.08 }}
        >
          <strong>{value}</strong>
          <span>{label}</span>
        </motion.div>
      ))}
    </section>
  )
}

function ProcessSection() {
  const steps = [
    {
      number: '01',
      phase: 'INTERROGATE',
      verb: 'UNDERSTAND',
      detail: 'Question assumptions, map constraints, and locate the emotional center of the problem before touching the interface.',
      output: 'STRATEGY / SYSTEM MAP',
      icon: ScanLine,
    },
    {
      number: '02',
      phase: 'PROTOTYPE',
      verb: 'MAKE',
      detail: 'Move directly into code. Test interaction, type, performance, and motion in the medium where the work will actually live.',
      output: 'WORKING PROTOTYPE',
      icon: Workflow,
    },
    {
      number: '03',
      phase: 'ENGINEER',
      verb: 'SYSTEMIZE',
      detail: 'Turn the strongest direction into a durable architecture with clear primitives, predictable behavior, and real data.',
      output: 'PRODUCTION BUILD',
      icon: Layers3,
    },
    {
      number: '04',
      phase: 'REFINE',
      verb: 'PRESSURIZE',
      detail: 'Test every device and edge case, remove friction, tune every frame, and make performance part of the aesthetic.',
      output: 'RELEASE / EVOLVE',
      icon: Gauge,
    },
  ]

  return (
    <section className="process-section" id="process">
      <div className="process-intro">
        <div className="section-tag"><span>04</span> / OPERATING SYSTEM</div>
        <Reveal>
          <p>NO BLACK BOX.<br /><i>JUST A CLEAR PROCESS</i><br />BUILT AROUND MAKING.</p>
        </Reveal>
      </div>
      <div className="process-list">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.article
              className="process-row"
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.75, delay: index * 0.06 }}
            >
              <div className="process-number">{step.number}</div>
              <div className="process-icon"><Icon /></div>
              <div className="process-title"><small>{step.phase}</small><h3>{step.verb}</h3></div>
              <p>{step.detail}</p>
              <span className="process-output"><Check /> {step.output}</span>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

function ExperimentVisual({ experiment, active }: { experiment: typeof experiments[number]; active: boolean }) {
  return (
    <div
      className={`experiment-visual shape-${experiment.shape} ${active ? 'is-active' : ''}`}
      style={{ '--experiment-color': experiment.color, '--experiment-secondary': experiment.secondary } as CSSProperties}
    >
      <div className="experiment-grid" />
      <div className="experiment-noise" />
      <motion.div className="experiment-shape shape-a" animate={{ rotate: active ? 360 : 12, scale: active ? 1 : 0.8 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="experiment-shape shape-b" animate={{ rotate: active ? -360 : -12, scale: active ? [0.85, 1.05, 0.85] : 0.7 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="experiment-shape shape-c" animate={{ x: active ? [-35, 35, -35] : 0, y: active ? [25, -25, 25] : 0 }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="experiment-readout">
        <span>{experiment.id}</span>
        <span>X {experiment.id.slice(-3)}.49</span>
        <span>Y {(Number(experiment.id.slice(-3)) * 1.73).toFixed(2)}</span>
      </div>
      <div className="experiment-center"><CircleDot /><span>RUNNING</span></div>
    </div>
  )
}

function PlaygroundSection() {
  const [filter, setFilter] = useState('ALL')
  const [selected, setSelected] = useState<(typeof experiments)[number] | null>(null)
  const filters = ['ALL', 'WEBGL', 'MOTION', 'GENERATIVE']
  const filtered = filter === 'ALL' ? experiments : experiments.filter((item) => item.category === filter)

  return (
    <section className="playground" id="playground">
      <div className="playground-head">
        <div>
          <div className="section-tag"><span>05</span> / PLAYGROUND</div>
          <SplitHeading lines={['CODE SKETCHES,', 'ODD MACHINES &', 'USEFUL ACCIDENTS.']} accent={2} />
        </div>
        <p>Small experiments are where new visual languages begin. This is a live index of unfinished ideas, rendering studies, and technical provocations.</p>
      </div>
      <div className="playground-toolbar">
        <div className="filter-buttons">
          {filters.map((item) => (
            <button key={item} className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>
              {item} <span>{item === 'ALL' ? experiments.length : experiments.filter((entry) => entry.category === item).length}</span>
            </button>
          ))}
        </div>
        <span className="archive-status"><Radio /> ARCHIVE ONLINE</span>
      </div>
      <motion.div className="experiment-grid-list" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((experiment, index) => (
            <motion.button
              className="experiment-card"
              key={experiment.id}
              layout
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.45, delay: index * 0.035 }}
              onClick={() => setSelected(experiment)}
            >
              <ExperimentVisual experiment={experiment} active={false} />
              <div className="experiment-card-info">
                <span>{experiment.id}</span>
                <h3>{experiment.title}</h3>
                <span>{experiment.category} / {experiment.year}</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {selected && (
          <motion.div className="experiment-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={selected.title}>
            <motion.div className="experiment-modal-inner" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close experiment"><X /></button>
              <ExperimentVisual experiment={selected} active />
              <div className="modal-copy">
                <span>{selected.id} / {selected.status}</span>
                <h3>{selected.title}</h3>
                <p>{selected.description}</p>
                <div><span>{selected.category}</span><span>{selected.year}</span><span>60 FPS</span></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ExperienceSection() {
  return (
    <section className="experience-section" id="experience">
      <div className="experience-head">
        <div className="section-tag"><span>06</span> / EXPERIENCE</div>
        <Reveal><h2>A DECADE OF<br /><i>MAKING IT REAL.</i></h2></Reveal>
      </div>
      <div className="experience-list">
        {experience.map((item, index) => (
          <motion.article
            className="experience-row"
            key={item.period}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="experience-index">0{index + 1}</span>
            <span className="experience-period">{item.period}</span>
            <div className="experience-role"><h3>{item.role}</h3><span>{item.studio}</span></div>
            <span className="experience-location">{item.location}</span>
            <p>{item.detail}</p>
            <div className="experience-clients">{item.clients.map((client) => <span key={client}>{client}</span>)}</div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function PrinciplesSection() {
  return (
    <section className="principles-section">
      <div className="principles-sticky">
        <div className="section-tag"><span>07</span> / PRINCIPLES</div>
        <h2>THE RULES<br />BEHIND THE<br /><i>WORK.</i></h2>
        <p>Not trends. Not a style guide. Four durable ideas that shape every technical and creative decision.</p>
      </div>
      <div className="principles-cards">
        {principles.map((principle, index) => (
          <motion.article
            className={`principle-card accent-${principle.accent}`}
            key={principle.number}
            initial={{ rotate: index % 2 === 0 ? -2 : 2, y: 80 }}
            whileInView={{ rotate: 0, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8 }}
          >
            <div className="principle-top"><span>{principle.number} / 04</span><Asterisk /></div>
            <h3>{principle.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
            <p>{principle.body}</p>
            <div className="principle-diagram">
              <i /><i /><i />
              <motion.b animate={{ rotate: 360 }} transition={{ duration: 12 + index * 3, repeat: Infinity, ease: 'linear' }} />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function TechnologySection() {
  const [activeTech, setActiveTech] = useState('THREE.JS')

  return (
    <section className="technology-section">
      <div className="tech-head">
        <div className="section-tag"><span>08</span> / TOOLKIT</div>
        <p>TOOLS CHANGE. CURIOSITY DOESN'T.</p>
      </div>
      <div className="tech-stage">
        <div className="tech-radar" aria-hidden="true">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}><i /></motion.div>
          <strong>{activeTech}</strong>
          <span>ACTIVE MODULE</span>
        </div>
        <div className="technology-cloud">
          {technologies.map((technology, index) => (
            <motion.button
              key={technology}
              className={activeTech === technology ? 'is-active' : ''}
              onMouseEnter={() => setActiveTech(technology)}
              onFocus={() => setActiveTech(technology)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.035 }}
            >
              {technology}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecognitionSection() {
  return (
    <section className="recognition-section">
      <div className="recognition-title">
        <div className="section-tag"><span>09</span> / RECOGNITION</div>
        <Reveal><h2>SELECTED<br /><i>SIGNALS.</i></h2></Reveal>
      </div>
      <div className="recognition-list">
        {recognition.map(([organization, award, year], index) => (
          <motion.div
            key={`${organization}-${award}`}
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
          >
            <span>0{index + 1}</span><strong>{organization}</strong><p>{award}</p><span>{year}</span><ArrowUpRight />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function TestimonialSection() {
  const testimonials = [
    {
      quote: 'Alex operates in the rare space where an impossible creative concept becomes an even better technical system.',
      person: 'MAYA CHEN',
      role: 'VP DESIGN / NORTHSTAR',
    },
    {
      quote: 'The work feels alive, but never arbitrary. Every surprising interaction is grounded in a remarkably clear engineering decision.',
      person: 'JON BELL',
      role: 'FOUNDER / OBJECT OFFICE',
    },
    {
      quote: 'He elevated the ambition of the entire team and still delivered the fastest experience we had ever shipped.',
      person: 'ELENA MORA',
      role: 'CREATIVE DIRECTOR / FORMA',
    },
  ]
  const [index, setIndex] = useState(0)
  const testimonial = testimonials[index]

  const change = (direction: number) => setIndex((current) => (current + direction + testimonials.length) % testimonials.length)

  return (
    <section className="testimonial-section">
      <div className="testimonial-counter">{String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</div>
      <AnimatePresence mode="wait">
        <motion.blockquote key={testimonial.person} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -25 }} transition={{ duration: 0.5 }}>
          “{testimonial.quote}”
          <footer><strong>{testimonial.person}</strong><span>{testimonial.role}</span></footer>
        </motion.blockquote>
      </AnimatePresence>
      <div className="testimonial-controls">
        <button onClick={() => change(-1)} aria-label="Previous testimonial"><ChevronLeft /></button>
        <button onClick={() => change(1)} aria-label="Next testimonial"><ChevronRight /></button>
      </div>
    </section>
  )
}

function SignalFieldSection() {
  const [mode, setMode] = useState<'FLOW' | 'BURST' | 'ORBIT'>('FLOW')
  const [frozen, setFrozen] = useState(false)
  const [frequency, setFrequency] = useState(62)

  return (
    <section className="signal-field-section">
      <div className="signal-field-head">
        <div className="section-tag"><span>09.5</span> / LIVE SYSTEM</div>
        <div><Radio /><span>640 NODES / 60 FPS</span></div>
      </div>
      <div className={`signal-field mode-${mode.toLowerCase()} ${frozen ? 'is-frozen' : ''}`} style={{ '--frequency': frequency } as CSSProperties}>
        <div className="signal-field-copy">
          <span>GENERATIVE STUDY / 026</span>
          <h2>EVERY POINT<br />IS A <i>SIGNAL.</i></h2>
          <p>A deterministic motion field assembled from individually tuned nodes. Change the system state and watch local rules become collective behavior.</p>
        </div>
        <div className="signal-node-field" aria-hidden="true">
          {signalNodes.map((node) => (
            <i
              className="signal-node"
              key={node.id}
              style={{
                '--node-x': `${node.x}%`,
                '--node-y': `${node.y}%`,
                '--node-size': `${node.size}px`,
                '--node-opacity': node.opacity,
                '--node-duration': `${node.duration}s`,
                '--node-delay': `${node.delay}s`,
                '--node-drift-x': `${node.driftX}px`,
                '--node-drift-y': `${node.driftY}px`,
                '--node-hue': node.hue,
              } as CSSProperties}
            />
          ))}
        </div>
        <div className="signal-rings" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="signal-controls">
          <div>
            {(['FLOW', 'BURST', 'ORBIT'] as const).map((item) => <button className={mode === item ? 'is-active' : ''} key={item} onClick={() => setMode(item)}>{item}</button>)}
          </div>
          <label>FREQUENCY <input type="range" min="20" max="100" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} /> <span>{frequency}%</span></label>
          <button className="signal-play" onClick={() => setFrozen((current) => !current)}>{frozen ? <Play /> : <Pause />} {frozen ? 'RESUME' : 'FREEZE'}</button>
        </div>
      </div>
    </section>
  )
}

function ProjectArt({ theme, title }: { theme: string; title: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className={`project-visual ${theme}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 0.985 }}
      transition={{ duration: 0.45 }}
    >
      <div className="visual-grid" />
      {theme === 'weather' && (
        <>
          <motion.div className="weather-orb" animate={{ rotate: hovered ? 160 : 0, scale: hovered ? 1.12 : 1 }} transition={{ duration: 1.4, ease: 'circOut' }} />
          <div className="weather-data">42.3601 N<br />71.0589 W</div>
          <div className="weather-temp">18°</div>
          <motion.div className="scanline" animate={{ y: hovered ? 380 : -50 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }} />
        </>
      )}
      {theme === 'noir' && (
        <>
          <motion.div className="noir-column left" animate={{ y: hovered ? -24 : 0 }} />
          <motion.div className="noir-column right" animate={{ y: hovered ? 24 : 0 }} />
          <div className="noir-word">NOIR</div>
          <div className="noir-cross">+</div>
        </>
      )}
      {theme === 'memory' && (
        <>
          <motion.div className="memory-disc" animate={{ rotate: hovered ? 180 : 0 }} transition={{ duration: 1.8, ease: 'circOut' }}>
            <div className="disc-core" />
          </motion.div>
          <div className="memory-copy">WHAT WE KEEP<br />KEEPS US</div>
          <div className="memory-index">ARCHIVE_0432</div>
        </>
      )}
      <motion.div className="view-project" animate={{ scale: hovered ? 1 : 0, rotate: hovered ? 0 : -45 }}>
        VIEW<br />CASE <ArrowUpRight size={15} />
      </motion.div>
      <span className="visual-title">{title.replace('\n', ' / ')}</span>
    </motion.div>
  )
}

function Project({ project }: { project: typeof projects[number] }) {
  return (
    <article className="project">
      <Reveal className="project-meta">
        <span>{project.index} / 03</span>
        <span>{project.type}</span>
        <span>{project.year}</span>
      </Reveal>
      <Reveal><ProjectArt theme={project.theme} title={project.title} /></Reveal>
      <Reveal className="project-info">
        <h3>{project.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3>
        <div className="project-details">
          <p>{project.description}</p>
          <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </Reveal>
    </article>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header>
      <a className="wordmark" href="#top" aria-label="Alex Rivera home">A<span>R</span><sup>26</sup></a>
      <div className="availability"><i /> AVAILABLE FOR SELECT PROJECTS <span>SEP '26</span></div>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
        <span>{open ? 'CLOSE' : 'MENU'}</span><b className={open ? 'is-open' : ''}><i /><i /></b>
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav className="menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
            {['WORK', 'ABOUT', 'CAPABILITIES', 'PLAYGROUND', 'CONTACT'].map((item, i) => (
              <motion.a href={`#${item.toLowerCase()}`} key={item} onClick={() => setOpen(false)} initial={{ y: 80 }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                <small>0{i + 1}</small>{item}<ArrowUpRight />
              </motion.a>
            ))}
            <div className="menu-footer"><span>NEW YORK / GLOBAL</span><LiveClock /><span>HELLO@ALEXRIVERA.DEV</span></div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 })
  const heroY = useTransform(scrollYProgress, [0, 0.2], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <>
      <Loader />
      <Cursor />
      <PointerGlow />
      <ScrollCoordinates />
      <motion.div className="progress" style={{ scaleX: progress }} />
      <Header />
      <main id="top">
        <section className="hero">
          <WebGLHero />
          <div className="hero-coordinate">40.7128° N<br />74.0060° W</div>
          <motion.div className="hero-copy" style={{ y: heroY, opacity: heroOpacity }}>
            <div className="eyebrow"><span>CREATIVE DEVELOPER</span><span>BASED IN NEW YORK</span></div>
            <h1>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>BUILDING</motion.span>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1.7, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}><em>DIGITAL</em> SYSTEMS</motion.span>
              <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>FOR THE UNREAL.</motion.span>
            </h1>
          </motion.div>
          <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /><p>DESIGN / CODE / MOTION<br />IN ONE CONTINUOUS SYSTEM</p></div>
          <div className="hero-systems" aria-hidden="true">
            <span><Activity /> GPU READY</span>
            <span><Globe2 /> LAT 40.7128</span>
            <span><Binary /> BUILD 26.09.08</span>
          </div>
        </section>

        <MetricsStrip />

        <section className="statement" id="about">
          <div className="section-tag"><span>01</span> / MANIFESTO</div>
          <Reveal>
            <p className="statement-copy">I PARTNER WITH <span>AMBITIOUS PEOPLE</span> TO SHAPE IDEAS INTO DIGITAL EXPERIENCES THAT FEEL <i>INEVITABLE</i>, NOT FAMILIAR.</p>
          </Reveal>
          <Reveal className="statement-foot">
            <p>Ten years at the intersection of engineering and design. Building expressive, high-performance work for screens of every size.</p>
            <Braces size={40} strokeWidth={1} />
          </Reveal>
        </section>

        <div className="marquee" aria-hidden="true">
          <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
            SELECTED WORK <Asterisk /> SELECTED WORK <Asterisk /> SELECTED WORK <Asterisk /> SELECTED WORK <Asterisk />
          </motion.div>
        </div>

        <section className="work" id="work">
          <div className="work-heading">
            <div className="section-tag"><span>02</span> / FEATURED PROJECTS</div>
            <p>BUILT TO MOVE.<br />BUILT TO MATTER.</p>
          </div>
          {projects.map((project) => <Project project={project} key={project.index} />)}
        </section>

        <section className="capabilities" id="capabilities">
          <div className="cap-head">
            <div className="section-tag"><span>03</span> / WHAT I DO</div>
            <Reveal><h2>ENGINEERING<br /><i>THE IMPOSSIBLE.</i></h2></Reveal>
          </div>
          <div className="cap-grid">
            {capabilities.map(([number, title, body], index) => (
              <motion.article key={number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}>
                <span>{number}</span>
                {index === 0 && <Code2 />}{index === 1 && <Braces />}{index === 2 && <Cpu />}{index === 3 && <Asterisk />}
                <h3>{title}</h3><p>{body}</p>
              </motion.article>
            ))}
          </div>
          <Reveal className="terminal">
            <div className="terminal-top"><span><i /><i /><i /></span><b>alex@rivera: ~/process</b><span>TSX</span></div>
            <pre><code><span className="line">01</span> <b>const</b> intent = <em>await</em> understand(problem);{`\n`}<span className="line">02</span> <b>const</b> system = craft({`{`}{`\n`}<span className="line">03</span>   strategy: <i>intent</i>,{`\n`}<span className="line">04</span>   design: <i>"precise + alive"</i>,{`\n`}<span className="line">05</span>   engineering: <i>"built to last"</i>,{`\n`}<span className="line">06</span> {`}`});{`\n`}<span className="line">07</span>{`\n`}<span className="line">08</span> ship(system).<em>then</em>(makeItUnforgettable);</code></pre>
          </Reveal>
          <div className="capability-modules">
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / A</span><Box /><h3>REAL-TIME GRAPHICS</h3><p>Custom shaders, particles, post-processing, procedural geometry, and disciplined rendering budgets.</p><b>THREE.JS / GLSL / R3F</b>
            </motion.article>
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / B</span><AudioLines /><h3>SPATIAL AUDIO</h3><p>Sound systems that respond to interaction, distance, sequence, and the emotional rhythm of an interface.</p><b>WEB AUDIO / TONE.JS</b>
            </motion.article>
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / C</span><Database /><h3>DESIGN SYSTEMS</h3><p>Flexible primitives and tokens that preserve creative intent across teams, platforms, and product states.</p><b>REACT / TYPESCRIPT</b>
            </motion.article>
            <motion.article whileHover={{ y: -8 }}>
              <span>MODULE / D</span><Zap /><h3>PERFORMANCE</h3><p>Instrumentation, profiling, loading strategy, asset pipelines, and motion tuned for actual hardware.</p><b>LIGHTHOUSE / RUM</b>
            </motion.article>
          </div>
        </section>

        <ProcessSection />

        <PlaygroundSection />

        <ExperienceSection />

        <PrinciplesSection />

        <TechnologySection />

        <RecognitionSection />

        <SignalFieldSection />

        <TestimonialSection />

        <section className="dispatch-section">
          <div className="dispatch-track">
            <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
              OPEN FOR COLLABORATION <Asterisk /> NEW YORK 2026 <Asterisk /> CREATIVE ENGINEERING <Asterisk /> OPEN FOR COLLABORATION <Asterisk /> NEW YORK 2026 <Asterisk /> CREATIVE ENGINEERING <Asterisk />
            </motion.div>
          </div>
          <div className="dispatch-grid">
            <div className="dispatch-copy">
              <div className="section-tag"><span>10</span> / TRANSMISSION</div>
              <h2>OCCASIONAL<br />NOTES FROM<br /><i>THE LAB.</i></h2>
              <p>Experiments, technical breakdowns, references, and unfinished thoughts. No growth hacks. No weekly obligation.</p>
            </div>
            <form className="dispatch-form" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="email">EMAIL ADDRESS</label>
              <div><input id="email" type="email" placeholder="YOU@DOMAIN.COM" required /><button type="submit" aria-label="Subscribe"><ArrowUpRight /></button></div>
              <span><i /> ENCRYPTED TRANSMISSION / ZERO SPAM</span>
            </form>
            <div className="dispatch-console">
              <span>CHANNEL_10</span><TerminalSquare /><strong>WAITING FOR INPUT</strong><i className="console-cursor" />
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="contact-orbit" aria-hidden="true"><span>LET'S MAKE SOMETHING REAL • LET'S MAKE SOMETHING REAL • </span><Asterisk /></div>
          <Reveal>
            <div className="section-tag"><span>04</span> / START A PROJECT</div>
            <h2>HAVE AN IDEA<br />THAT <i>SHOULDN'T</i><br />BE POSSIBLE?</h2>
          </Reveal>
          <div className="contact-actions">
            <MagneticLink href="mailto:hello@alexrivera.dev" className="contact-link"><TextScramble>LET'S TALK</TextScramble> <MoveRight /></MagneticLink>
            <div className="contact-status"><i /><span>RESPONSE TIME<br /><b>UNDER 48 HOURS</b></span></div>
          </div>
          <footer>
            <a href="#top" className="footer-mark">AR<sup>26</sup></a>
            <p>INDEPENDENT CREATIVE DEVELOPER<br />NEW YORK / WORKING GLOBALLY</p>
            <div className="socials"><a href="https://github.com" aria-label="GitHub"><Github /></a><a href="https://linkedin.com" aria-label="LinkedIn"><Linkedin /></a><a href="mailto:hello@alexrivera.dev" aria-label="Email"><Mail /></a></div>
            <a href="#top" className="back-top">BACK TO TOP <ArrowUpRight /></a>
          </footer>
          <div className="contact-utility"><LiveClock /><span>© 2026 ALEX RIVERA</span><SoundControl /></div>
        </section>
      </main>
    </>
  )
}

export default App
