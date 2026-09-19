# Fix Section 4 Scroll Playback

## Goal
Make section 4 reliably scrub the 120-frame brain sequence as the user scrolls, in both directions, while keeping the full-screen sticky presentation and allowing normal exit after the sequence. Do not intercept or cancel wheel, touch, or keyboard scrolling.

## Confirmed Context
- The displayed media is a WebP frame sequence (`brain-001.webp` through `brain-120.webp`) painted to a canvas, not `brain-sculpture.mp4`.
- The current worktree uses a `400svh` section with a `100svh` sticky stage and `useScroll({ offset: ['start start', 'end end'] })`.
- The first brain frame is visible, but the sequence appears frozen while the viewport remains in the long sticky section.
- Other page animations work, and the requested behavior is scroll-controlled playback.
- `App.tsx` and `styles.css` contain staged and unstaged versions of different playback models. The implementation must keep the native sticky-scroll model and must not restore the staged global scroll gate.

## Root Cause To Address
Frame selection currently listens to the smoothed `sceneProgress` spring rather than raw `scrollYProgress`, while frame availability and canvas painting are handled by separate asynchronous effects. This provides no single reliable contract that each scroll position updates the requested frame and paints it once loaded. Because the section intentionally spans four viewports, a static frame makes normal sticky travel look like the mouse is trapped.

## Implementation Plan
1. In `src/App.tsx`, keep `scrollYProgress` as the authoritative value for frame index and phase selection.
   - Subscribe `useMotionValueEvent` to `scrollYProgress`, not `sceneProgress`.
   - On every change, clamp progress to `0..1`, store the requested frame index, draw the closest loaded frame, and update the phase from the same raw value.
   - Keep `sceneProgress` only for decorative scale, translation, and copy opacity transforms.

2. Make frame initialization deterministic.
   - Load frame 0 first with high priority and draw it immediately after successful decode.
   - Start loading the remaining frames after the first frame is ready.
   - Mark each frame loaded inside its individual completion handler and redraw when that frame is the current request.
   - Retain nearest-loaded-frame fallback so slow or failed individual requests never blank the canvas.
   - Do not make playback wait for all 120 frames to finish loading.

3. Harden canvas painting without changing the visual design.
   - Make `drawFrame` always record the requested index before checking frame readiness.
   - Size the canvas from its rendered bounds and device pixel ratio before drawing.
   - Redraw the current requested frame when the canvas size changes; use `ResizeObserver` on the canvas/stage rather than relying only on `window.resize`.
   - Keep the existing cover crop and frame order unless visual testing exposes a crop regression.
   - Optionally keep frame 0 as a poster `<img>` under the canvas until the first successful canvas draw, then hide it. This fallback should be added only if deterministic first-frame drawing still flashes blank during throttled testing.

4. Preserve native sticky scrolling in `src/styles.css`.
   - Keep `.process-section` at `400svh` and `.process-stage` sticky at `top: 0` with `100svh` height.
   - Do not add `wheel`, `touchmove`, or keyboard listeners that call `preventDefault`, `window.scrollTo`, or a `process-gated` class.
   - Keep the existing `['start start', 'end end']` offset because it correctly maps progress over the sticky travel distance.
   - Add a small on-screen progress cue only if needed during implementation debugging, then remove it before completion.

5. Handle reduced motion explicitly rather than letting it resemble a bug.
   - Preserve a static representative frame and one-viewport section when `prefers-reduced-motion: reduce` is active.
   - Verify the normal browser path is not receiving reduced motion unexpectedly.
   - If product intent is that manual scroll scrubbing should still work under reduced motion, treat that as a separate behavior change; it is out of scope for this bug fix.

6. Keep the implementation snapshot coherent.
   - Ensure the final working versions of `src/App.tsx` and `src/styles.css` both use the native sticky-scroll design.
   - Do not restore the index's older custom wheel gate or pair its one-viewport CSS with the canvas code.
   - Leave `brain-sculpture.mp4` unused; switching media formats is unnecessary for this fix.

## Validation
1. Run `npm run lint`, `npm run build`, and `git diff --check`.
2. In Chrome or Edge on the local Vite server, reload with cache disabled and verify:
   - Entering section 4 shows frame 1 without a blank canvas.
   - Slow scrolling visibly advances the brain and phase text through all four phases.
   - Reverse scrolling reverses the sequence.
   - Continued scrolling after the last frame exits section 4 naturally.
   - Scrolling upward from below reaches frame 1 and exits naturally.
3. Test a fast wheel, Page Down, scrollbar drag, and trackpad input. The displayed frame must catch up to raw section progress without requiring an extra scroll event.
4. Throttle network and CPU, reach section 4 before all frames load, and confirm loaded frames continue advancing while missing frames use the nearest available frame.
5. Block one middle frame request and confirm playback continues past it.
6. Test at approximately `1440x900`, `1024x768`, and `390x844`.
7. Enable reduced motion and confirm the intentional static fallback does not create a long sticky trap.

## Acceptance Criteria
- Section 4 visibly progresses on the first scroll movement through it.
- Frame progress and phase text correspond to raw section scroll position.
- No global input interception or forced scroll positioning exists for section 4.
- The user can leave the section normally at either boundary.
- Slow loading or one failed frame cannot freeze the entire sequence.
