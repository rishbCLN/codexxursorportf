# Diagnose: touch-during-inertia glitch on mobile

## Symptom (user, verbatim intent)
While a scroll is coasting on inertia in ANY direction (momentum slowly decaying),
the instant the user **touches the screen** or **swipes the opposite direction**,
a visible glitch fires. Mobile only. Happens regardless of section.

## Why we diagnose before fixing (do NOT skip to a fix)
The remaining scroll-linked springs were already replaced with monotonic
`useSmoothed` (commit `a021f17`), and a pure first-order lag halting on a plain
touch cannot by itself produce a glitch — it just eases to rest. A glitch at the
touch instant means **something in the source is discontinuous**, not merely
lagging. We must capture the raw signals on-device to know which discontinuity,
because the candidate fixes diverge sharply in risk (one is a harmless math tweak,
another changes carefully-tuned mobile scroll feel). Guessing a third time is the
failure mode to avoid.

## Confirmed architecture (read from code — anchors for the implementer)
- Lenis is created at `src/App.tsx:2108-2113` with only `lerp / wheelMultiplier /
  touchMultiplier / smoothWheel`. **`syncTouch` is unset → defaults false.**
- In `node_modules/lenis/dist/lenis.mjs:617`, touch events fail the
  `syncTouch && isTouch` guard, so Lenis sets `isScrolling = "native"`, calls
  `animate.stop()`, and returns. **On touch, Lenis does NOT smooth — scrolling is
  pure native browser momentum.** (Wheel/desktop still smooths via `smoothWheel`.)
- Lenis still listens to native `scroll` (`lenis.mjs:651 onNativeScroll`) and tracks
  `velocity / direction / isScrolling` with a 400ms reset, but the app does NOT
  subscribe to Lenis `'scroll'` — all visuals use framer-motion instead.
- All scroll visuals derive from framer-motion `useScroll()`:
  - Global progress bar + everything window-level: `App.tsx:2003` → `useSmoothed(scrollYProgress, 110)` (`App.tsx:2008`).
  - Hero scrub: `App.tsx:2012` (`heroRaw`) → `useSmoothed(heroMapped, 80)` (`App.tsx:2033`).
  - Reading room: `App.tsx:970` → `reading`/`exitRaw` → `useSmoothed(..., 90)` (`App.tsx:997,1002`) and `ResearchArchive.tsx:463`.
- framer `useScroll()` (window) computes progress as `scrollY / (scrollHeight − clientHeight)`.
  A change in `clientHeight` (mobile URL bar show/hide) moves the denominator.
- `vite.config.ts` has `server.host = true`, `port 5173`, `strictPort` — the dev
  server is already reachable from a phone on the same LAN. No config change needed.
- Existing minimal HUD: `ScrollCoordinates` (`App.tsx:626`) writes `Y / NNN` to the
  DOM from `scrollYProgress` — reference for the DOM-write pattern, but it is
  change-event driven (coalesced), so it is NOT sufficient to catch a per-frame spike.

## Leading candidates (the instrumentation must distinguish these)
- **A — URL-bar / viewport-denominator jump.** Touch toggles the mobile URL bar →
  `clientHeight`/`visualViewport.height` changes → framer progress denominator jumps
  → `rawP` steps while `scrollY` stays continuous. Fix would be math-only (stabilize
  the denominator), NO feel change. Prior CSS (`overflow-anchor:none`,
  `overscroll-behavior-y:none` in `styles.css:29-30`) targeted a related teleport but
  may not cover this.
- **B — native momentum-halt / rubber-band discontinuity.** Touch instantly cancels
  iOS/Android momentum; `scrollY` itself steps or rubber-bands at that frame. Fix
  would either re-seat the smoother on touchstart (small) or hand momentum to Lenis
  via `syncTouch` (FEEL CHANGE — needs approval).
- **C — residual smoother artifact.** `scrollY` and `rawP` continuous, but the
  `useSmoothed` output visibly diverges/whips on reversal. Fix = re-seat on
  touchstart or shorten tau (small feel dial).
- **D — Lenis model fight.** `isScrolling` flips native↔smooth, or
  `targetScroll/animatedScroll` diverge from `actualScroll` on touch. Fix = unify the
  model with `syncTouch` (FEEL CHANGE — needs approval).

## Phase 1 — Instrument + capture (executable NOW by an implementation-capable agent)
This is temporary, throwaway instrumentation. It is a source edit, so switch to an
implementation agent (e.g. Code) to execute. Gate everything behind a flag so it is
trivial to toggle and cannot ship by accident.

### Task 1 — Expose the Lenis instance for debugging (gated)
- Inside the Lenis effect (`App.tsx:2105-2139`), after `const lenis = new Lenis(...)`,
  add (gated by the debug flag below):
  `;(window as unknown as { __lenisDebug?: unknown }).__lenisDebug = lenis`
  and delete it in the effect cleanup. Purpose: let the overlay read
  `isScrolling / velocity / direction / animatedScroll / targetScroll / isTouching`.

### Task 2 — Add a temporary per-frame debug overlay component
- Create a self-contained component (temporary file, e.g. `src/ScrollDebugOverlay.tsx`,
  OR inline in `App.tsx` — implementer's choice, but keep it isolated for easy
  removal) rendered in the `App` return near `ScrollCoordinates` (`App.tsx:2154`).
- Gate render on `new URLSearchParams(location.search).has('debug')` OR
  `localStorage.getItem('scrollDebug')`. When off, render nothing.
- Run its OWN `requestAnimationFrame` loop (NOT `useMotionValueEvent`, which is
  coalesced) capturing each frame into a fixed-size ring buffer (~90 frames):
  - `t = performance.now()`
  - `scrollY = window.scrollY`
  - `vvH = window.visualViewport?.height ?? null`
  - `vvOffTop = window.visualViewport?.offsetTop ?? null`
  - `innerH = window.innerHeight`
  - `clientH = document.documentElement.clientHeight`
  - `scrollH = document.documentElement.scrollHeight`
  - `rawP = scrollYProgress.get()`  (pass the window `scrollYProgress` in as a prop)
  - `smP = progress.get()`          (pass the smoothed `progress` MotionValue in)
  - `lenis` snapshot from `window.__lenisDebug`: `isScrolling`, `velocity`,
    `direction`, `animatedScroll`, `targetScroll`, `isTouching`
  - `touch`: current phase from listeners below + last touch `dy`
- Compute per-frame deltas and mark a frame as a GLITCH frame when any of:
  - `abs(rawP - prevRawP) > 0.01` (progress step), or
  - `abs(scrollY - prevScrollY) > 120` while not during a fast continuous swipe, or
  - `vvH`/`clientH` changed vs previous frame (viewport resize).
- Attach `touchstart / touchmove / touchend` listeners (passive) to record phase and
  `dy`. **On `touchstart`, FREEZE the overlay**: stop updating for ~2.5s and render
  the ring buffer around the touch frame as a compact monospace table (newest ~20
  frames), highlighting glitch frames. Freezing is essential because a phone can't
  read a live-updating overlay at the glitch instant. Tapping again re-arms it.
- Overlay styling: `position:fixed; z-index:99999; top:0; left:0; right:0;
  font:10px/1.25 monospace; background:rgba(0,0,0,.8); color:#0f0; padding:6px;
  white-space:pre; pointer-events:none; max-height:60vh; overflow:hidden`.
- Also `console.table(buffer)` on the freeze so exact numbers are copyable over
  remote inspection.

### Task 3 — Verify it builds
- `npm run build` — expect only the pre-existing chunk-size warning.
- `npm run lint` — the overlay must not ADD new errors beyond the known baseline
  (8 errors + 2 warnings). Use real types, avoid new `no-explicit-any` where feasible
  (a single localized cast for `window.__lenisDebug` is acceptable).

## Capture protocol (user, on a real phone — the decisive step)
1. Implementer runs `npm run dev`; note the LAN URL Vite prints (e.g.
   `http://192.168.x.x:5173`). Phone must be on the same Wi‑Fi.
2. On the phone open `http://<LAN-IP>:5173/?debug=scroll`.
3. Reproduce in at least two spots (hero, and the reading room / a long section):
   flick hard to build momentum, let it visibly coast/decay, then (a) just TAP, and
   separately (b) swipe the OPPOSITE direction. Do each a few times.
4. Read the frozen table at the glitch frame; screenshot it. Optionally attach a
   remote inspector (iOS: Safari → Develop → device; Android: `chrome://inspect`) and
   copy the `console.table` output.
5. Report back the values at/around the highlighted glitch frame — specifically
   whether `scrollY`, `vvH/clientH`, `rawP`, and `smP` were continuous or stepped,
   and what Lenis `isScrolling/velocity/direction` showed.

## Phase 2 — Fix (planned AFTER data returns; do not implement yet)
Map the captured glitch frame to exactly one branch:
- **A (viewport denominator jumped, scrollY continuous)** → stabilize the framer
  progress denominator against URL-bar resize: e.g. derive progress from a
  `visualViewport`-compensated / once-captured reference height, or pin the layout so
  `clientHeight` does not move on URL-bar toggle. **Math-only, no feel change** —
  preferred if it matches.
- **B (scrollY itself stepped / rubber-banded at touch)** → either re-seat the
  smoother on `touchstart` (snap `useSmoothed` output to its current target so there
  is no stale catch-up) — small; or adopt Lenis `syncTouch` so momentum is owned by
  one model — **FEEL CHANGE, requires explicit user approval** and hero-timing re-check.
- **C (only `smP` diverged)** → re-seat `useSmoothed` on `touchstart` and/or shorten
  tau. Small, localized feel dial.
- **D (Lenis model fight)** → unify via `syncTouch` (+ tune `syncTouchLerp` /
  `touchInertiaExponent`). **FEEL CHANGE, requires approval**; also re-verify hero
  hand timing (0→0.46) and the 3→4 plunge.

Any Phase 2 option that changes mobile scroll feel (B via syncTouch, D) must be
confirmed with the user before implementation, because hero hand timing and section
hand-offs are explicitly tuned and must be preserved.

## Cleanup (mandatory)
The overlay, the touch listeners, the `window.__lenisDebug` assignment, and any
temporary file are throwaway. Remove them (or leave strictly behind the disabled
flag only if the user asks) before the fix ships. Re-run `npm run build` +
`npm run lint` after removal to confirm the baseline is unchanged.

## Validation of Phase 1 itself
- Overlay is invisible without `?debug` / the localStorage flag.
- With the flag, it renders, updates per frame, freezes on touchstart, and prints a
  readable table + `console.table`.
- No new build errors; lint baseline unchanged.

## Open decision (carried into Phase 2)
Which candidate (A/B/C/D) the on-device capture confirms. Recommended next question
once data is in: "Did `visualViewport.height`/`clientHeight` change at the glitch
frame while `scrollY` stayed continuous?" — a yes points at the zero-feel-risk fix
(A); a no on both usually means B/D and a feel-affecting change needing approval.

## Notes for the implementer
- Phase 1 requires source edits and running `npm run dev` — use an
  implementation-capable agent (this plan was authored in Plan Mode, which cannot
  edit source or run mutating commands).
- Working tree is currently clean at commit `a021f17`; the instrumentation is
  temporary and should not be committed unless the user explicitly asks.
- Do NOT touch hero hand timing, hero scroll distance, `.hero`/stage `svh` heights,
  or the pointer/hover springs while instrumenting.
