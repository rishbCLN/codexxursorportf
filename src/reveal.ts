/*
  Loader -> hero reveal bridge (pure, R3F-free — safe for the eager bundle).

  The loader owns the exit choreography (the banded clouds curtain). At the exact
  frame the curtain begins to part, it calls triggerReveal(). The hero DOM intro
  (title lines, standfirst, corner marks, CTA/foot) subscribes via useRevealed()
  and plays its entrance in lock-step with the curtain lifting — instead of the
  old mount-time delays, which now finish behind a longer loader and leave the
  hero looking static on hand-off.

  This is a one-shot latch: once revealed it never flips back, and late
  subscribers (e.g. a lazy chunk that mounts after the fact) read the resolved
  value immediately. Keep this file free of any @react-three/* import so it never
  drags the 3D graph into the initial chunk.
*/

import { useSyncExternalStore } from 'react'

let revealed = false
const listeners = new Set<() => void>()

// Fired by the loader as the curtain starts to part. Idempotent.
export function triggerReveal() {
  if (revealed) return
  revealed = true
  listeners.forEach((fn) => fn())
}

// Escape hatch for non-React callers / tests.
export function isRevealed() {
  return revealed
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

function getSnapshot() {
  return revealed
}

// React hook: re-renders the subscriber once the reveal latches.
export function useRevealed() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
