# Fix: scroll-direction-reversal shudder on mobile

## Goal
Kill the small bounce/shudder that fires at the *exact moment* the user reverses
swipe direction on mobile (down->up or up->down), in place. Preserve all existing
feel: hand-close timing (0 -> 0.46), hero scroll distance, and the native
sticky-scroll model.

## Root cause (reframed — supersedes the earlier "teleport" hypothesis for THIS symptom)
The symptom is now confirmed as "small shudder / bounce, like it overshot and
snapped back" at direction reversal — NOT a large teleport-to-top jump. That is
the fingerprint of a **momentum spring overshooting when its scroll target
reverses**, which is the exact failure this repo already fixed elsewhere with the
monotonic `useSmoothed` helper (`App.tsx:1668-1673`: "springing past and snapping
back… the jerk a few frames back").

`heroProgress` (`App.tsx:2048`) and `exit` (`App.tsx:996`) were already converted to
`useSmoothed`, so the hero and the Section 3->4 plunge no longer bounce. But three
scroll-position-linked `useSpring` scrubbers remain and still overshoot on reversal:

1. `ResearchArchive.tsx:457` — `useSpring(progress, {stiffness:70,damping:26,mass:0.4,restDelta:0.0004})`
   feeds `focus`, which positions every glass slab in the reading room. Most visible.
2. `App.tsx:2023` — `useSpring(scrollYProgress, {stiffness:100,damping:25,restDelta:0.001})`
   drives the global 2px top progress bar (`App.tsx:2170`).
3. `App.tsx:998` — `useSpring(reading, {stiffness:120,damping:30,mass:0.35})`
   drives the archive meter (`App.tsx:1146`).

Why mobile-only: Lenis is passive on touch (`syncTouch` unset -> defaults false;
`lenis.mjs:617` native passthrough). A finger flick-reverse feeds a sharp velocity
sign-flip straight into these springs; even an overdamped spring integrates velocity,
so it carries past the new target for a few frames then corrects back = the shudder.
Desktop smooth-wheel eases the input, hiding it. A first-order exponential lag
(`useSmoothed`) has no velocity term, so it can never overshoot — it only ever
approaches the current target. Fix = replace the remaining scroll-linked springs
with `useSmoothed`.

Note: framer-motion's `useScroll` reads native `scrollY`, not Lenis internals, so
Lenis velocity/`onNativeScroll` is NOT the driver of this symptom. Leaving the
existing `overflow-anchor:none` / `overscroll-behavior-y:none` CSS in place is fine
(harmless, unrelated to this bounce); it is not part of this change.

## Tasks (ordered)

### 1. Extract `useSmoothed` into a shared module (P0 — enables reuse in ResearchArchive)
- Create `src/useSmoothed.ts` with the hook moved verbatim from `App.tsx:1674-1689`:
  ```ts
  import { useAnimationFrame, useMotionValue } from 'framer-motion'
  import type { MotionValue } from 'framer-motion'

  // Monotonic exponential smoothing for a scroll-driven MotionValue. Unlike a
  // spring, it eases toward the target WITHOUT ever overshooting, so when the
  // scroll stops OR reverses the value glides to rest instead of springing past
  // and snapping back. tauMs is the feel dial (smaller = snappier).
  export function useSmoothed(source: MotionValue<number>, tauMs = 80) {
    const out = useMotionValue(source.get())
    useAnimationFrame((_, delta) => {
      const target = source.get()
      const cur = out.get()
      if (Math.abs(target - cur) < 0.00005) {
        if (cur !== target) out.set(target)
        return
      }
      const alpha = 1 - Math.exp(-delta / tauMs)
      out.set(cur + (target - cur) * alpha)
    })
    return out
  }
  ```
  Depends only on framer-motion. `App.tsx` lazy-imports `ResearchArchive`, which will
  import `./useSmoothed`; no import cycle (both point at the leaf module).

### 2. Update `App.tsx` to use the shared hook and drop the local copy (P0)
- Remove the local `useSmoothed` definition (`App.tsx:1674-1689`).
- Add `import { useSmoothed } from './useSmoothed'` near the other local hook imports.
- Import cleanup on `App.tsx:1`: **remove `useAnimationFrame`** from the framer-motion
  import (it was used ONLY by the extracted hook — verify with a search after editing).
  **Keep `useMotionValue`** (still used across `App.tsx`) and **keep `useSpring`**
  (still used by pointer/hover springs at lines ~202-203, 254-255, 609-610, 1533-1535 —
  those are pointer-driven, NOT scroll-linked, so they stay).

### 3. Convert the reading-room focus spring -> `useSmoothed` (P0 — primary visible fix)
- `ResearchArchive.tsx:457`: replace
  `const smooth = useSpring(progress, { stiffness: 70, damping: 26, mass: 0.4, restDelta: 0.0004 })`
  with `const smooth = useSmoothed(progress, 90)` (tau 90 matches the `exit` feel).
- `ResearchArchive.tsx:5`: change `import { useSpring, useTransform } from 'framer-motion'`
  to `import { useTransform } from 'framer-motion'` (useSpring is now unused there —
  it appears only on line 457) and add `import { useSmoothed } from './useSmoothed'`.

### 4. Convert the two remaining scroll-linked springs in `App.tsx` -> `useSmoothed` (P1 — consistency / global bar)
- `App.tsx:2023`: `const progress = useSmoothed(scrollYProgress, 110)` (was `useSpring`).
  Drives the global top progress bar; slightly softer tau is fine (decorative).
- `App.tsx:998`: `const meterScale = useSmoothed(reading, 90)` (was `useSpring`).
- After these two, re-verify whether `useSpring` is still referenced in `App.tsx`
  (it should be, via the pointer/hover springs) before removing it from the import.
  Only remove `useSpring` from the `App.tsx:1` import if a search shows zero remaining uses.

### Do NOT touch
- `SonicRing.tsx:222` `useSpring(useVelocity(progress))` — smooths *velocity* into trail
  length (a visual effect), not a position; expected to ease and is not the bounce.
- Any pointer/hover springs (cursor, PointerGlow, hero drift, Project tilt).
- `ReducedResearch` / `ResearchLeaf` spring (`App.tsx:843`) — dead path;
  `PlaygroundSection` always renders `<ArchiveResearch />`, and `ResearchLeaf` is only
  called with `reducedMotion` true, which drops its animated style. Leave as-is.
- Hand timing, hero scroll distance, `.hero`/stage `svh` heights, scroll model.

## Risks
- Feel drift: `useSmoothed` is a first-order lag, not a spring, so tracking feels a
  touch different from the old springs. tau values (90 / 110 / 90) are the dials;
  tune down for snappier, up for smoother. No overshoot at any tau.
- Import breakage: removing `useAnimationFrame` (App) and `useSpring` (ResearchArchive)
  must be gated on a post-edit search confirming they are truly unused, or `tsc`/lint
  will flag an unused import.

## Validation
- `npm run build` (`tsc -b && vite build`) — expect only the pre-existing chunk-size
  warning; no new TS errors (watch for unused-import errors from the import cleanups).
- `npm run lint` — expect the same 8 pre-existing errors + 2 warnings and ZERO new ones.
- Manual (device or DevTools touch emulation with mobile URL-bar): scroll down then
  reverse up (and up then down) inside the reading room, across a section boundary, and
  while watching the top progress bar. The in-place shudder at the reversal instant
  should be gone; motion should glide to rest without a backward snap.
- Confirm the reading-room feel and Section 3->4 hand-off still read smoothly.

## Notes for the implementer
- This is an implementation task requiring source edits; switch to an
  implementation-capable agent (e.g. Code) to execute.
- Working tree already has uncommitted edits from prior work (App.tsx,
  ContactConstellation.tsx, ResearchArchive.tsx, styles.css). These changes stack on
  top; commit only if the user explicitly asks.
- The design covers global (progress bar), Section 3 (reading room + meter), while the
  hero and the 3->4 plunge are already smoothed — so the fix holds regardless of which
  section the user happened to be in when they saw the shudder.
