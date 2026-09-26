# Hero scroll fixes + remove scroll-apple

## Goal
Fix three reported issues on the portfolio (`D:\codexxursorportf`, Vite + React 19 + R3F):

1. Remove the metallic "eaten apple" scroll-progress indicator (it looks bad). Keep the thin 2px amber top progress bar.
2. Mobile: scrolling **up** causes a "teleport"/jump to a far section (scroll miscalculation).
3. Desktop: the hero **flickers** when you scroll back **up** into it.

## Root-cause analysis (issues 2 & 3 share one cause)
The hero is the **only** heavy WebGL section that conditionally mounts/unmounts its scenes:

- `src/App.tsx:2049` — `const heroInView = useInView(heroRef, { margin: '200px 0px 200px 0px' })`
- `src/App.tsx:2216` — `{heroInView && ( <SonicRing/> <WarpField/> <SonicExitRing/> )}`
- Scenes also receive `active={heroInView}` (`App.tsx:2220/2226/2232`), which drives `frameloop={active ? 'always' : 'demand'}` (e.g. `src/SonicRing.tsx:294`).

When the hero scrolls >200px out of view the three `<Canvas>` contexts **unmount**; scrolling back up **remounts** them, recompiling shaders / rebuilding env maps. That is exactly the failure the project's own hook documents:

- `src/useNearViewport.ts:121-145` (`useLatchedScene`): *"We deliberately never unmount these scenes: re-mounting them while scrolling back up meant recompiling shaders ... each of those stalls froze the main thread long enough that queued wheel/touch momentum applied in one lurch — the 'teleport to a far section' bug."*

Every other heavy section already uses `useLatchedScene` (mount-once + visibility-gated `frameloop`): ResearchArchive (`App.tsx:979,1072,1078`), ToolkitCortex (`App.tsx:1264,1281,1287`), ContactConstellation (`App.tsx:1867,1948,1954`). The hero was left on the legacy `useInView` mount/unmount pattern.

**Fix:** convert the hero to the same latched pattern. Remount stall disappears → no desktop flicker (#3); no main-thread lurch → no mobile teleport (#2). This is consistent with the rest of the codebase, not a new mechanism.

`HeroHandsScene` (`App.tsx:198`) is DOM/CSS (imgs + motion divs), not a Canvas, so the hero holds exactly 3 WebGL contexts.

## Decisions (resolved)
- Keep the thin top progress bar (`.progress`, `App.tsx:2150`, `styles.css:60`) and its spring (`App.tsx:2015`). Remove only the apple. (Confirmed by user.)
- Fix #2 and #3 by latching the hero scenes (mount-once, idle `frameloop` off-screen) rather than widening the unmount margin (a wider margin only defers the remount stall; it does not remove it).

## Tasks (ordered, all in `src/`)

### A. Remove the scroll apple (issue 1)
1. `src/App.tsx:26` — delete `import ScrollApple from './ScrollApple'`.
2. `src/App.tsx:2149` — delete the `<ScrollApple />` line. **Keep** line 2150 `<motion.div className="progress" style={{ scaleX: progress }} />`.
3. (Optional tidy) `src/App.tsx:2098` — update the comment that references `ScrollApple`.
4. Delete file `src/ScrollApple.tsx` (only referenced from `App.tsx`; verified via repo search).
5. `src/styles.css` — remove now-dead rules:
   - Lines 61-66: `.scroll-apple`, `.silver-apple`, `.metal-apple-shine`, `.metal-stem`, `.metal-leaf`, `.metal-leaf-vein`.
   - Lines 860-861 (mobile block): `.scroll-apple { opacity:.94 }`, `.silver-apple { ... }`.
   - **Keep** line 60 `.progress`. Do **not** touch `.laptop-pro` `--metal-*` custom properties (`styles.css:326,334`) — unrelated to the apple.

### B. Latch the hero WebGL scenes (issues 2 & 3)
6. `src/App.tsx:2049` — replace the `heroInView` line with a latched-scene gate:
   ```tsx
   const [heroSceneRef, heroMounted, heroVisible] = useLatchedScene<HTMLElement>()
   ```
   (`useLatchedScene` is already imported at `App.tsx:29`.)
7. Merge the latch ref with the existing `heroRef` (still needed for `useScroll` at `App.tsx:2019`). Add near the hero refs:
   ```tsx
   const setHeroRefs = useCallback((node: HTMLElement | null) => {
     heroRef.current = node
     ;(heroSceneRef as React.MutableRefObject<HTMLElement | null>).current = node
   }, [heroSceneRef])
   ```
   Then change the section tag `src/App.tsx:2153` from `ref={heroRef}` to `ref={setHeroRefs}`.
   - Ensure `useCallback` is imported from `react` (add to the existing React import if missing).
   - Callback refs run during commit before effects, so `useSceneVisibility`'s observer (`useNearViewport.ts:88`) sees the node on first mount. `useScroll` also keeps working via `heroRef.current`.
8. `src/App.tsx:2216` — change the mount gate `{heroInView && (` to `{heroMounted && (`.
9. `src/App.tsx:2220,2226,2232` — change each `active={heroInView}` to `active={heroVisible}`.
10. Update the stale comment `src/App.tsx:2043-2048` to describe latched mount + visibility-gated frameloop (scenes no longer unmount).

## Risks & mitigations
- **WebGL context budget (mobile).** Latching keeps the hero's 3 contexts alive for the whole session (idle via `frameloop='demand'` when off-screen). Other latched sections add ~3 more. During validation, watch the console for *"Too many active WebGL contexts; oldest context will be lost."* on a real phone. If it appears, fallback options (in order): (a) reduce the hero to fewer canvases, (b) release/restore contexts explicitly, (c) as a last resort keep unmount behavior on mobile only — but note that mobile is where the teleport is worst, so prefer (a)/(b).
- **First frame after re-entry.** With `frameloop='demand'` while off-screen, the first visible frame may be one step stale before `heroVisible` flips to `'always'`. This is the exact tradeoff already accepted by the other three sections; acceptable.
- **Secondary mobile hypothesis (URL-bar resize).** If a residual jump remains on mobile *after* the latch fix, investigate the mobile chrome show/hide resize interacting with the `1200svh` hero (`styles.css:866`) and framer `useScroll` recompute. The layout already uses stable `svh` units (correct choice); do not switch to `dvh` (it resizes with chrome and would reintroduce jitter). Treat this as a follow-up only if testing shows the latch fix alone is insufficient.

## Validation
Run from `D:\codexxursorportf`:
- `npm run build` (`tsc -b && vite build`) — must pass with no TS errors.
- `npm run lint` (`eslint .`) — must pass (watch for unused `heroRef`/import warnings after edits).
- `npm run dev` and verify manually:
  - Apple gone; thin amber bar at top still fills on scroll.
  - **Desktop:** scroll down past the hero into MANIFESTO, then back up into the hero — no flicker/black flash on re-entry.
  - **Mobile (real device preferred; or DevTools device mode + 4x CPU throttle):** scroll down several sections, then scroll up — no teleport/jump; scroll position tracks smoothly.
  - Console: no new errors and no WebGL context-limit warnings.

## Out of scope
- Redesigning hero visuals or changing the number/among of hero scenes.
- Reworking mobile viewport/`svh` handling (only if the URL-bar hypothesis is confirmed after the latch fix).

## Notes for implementer
- This requires source edits (`App.tsx`, `styles.css`, delete `ScrollApple.tsx`); switch to an implementation-capable agent.
- Line numbers are from the current reading and may shift as edits are applied; match on surrounding code.
