// TEMP DEBUG (throwaway): gate for the touch-during-inertia scroll instrumentation.
// Kept in its own module so ScrollDebugOverlay.tsx exports only a component (no
// react-refresh warning) and App.tsx can share the same gate. Enabled by `?debug`
// in the URL (any value) or a `scrollDebug` localStorage key; off otherwise, so the
// instrumentation cannot ship by accident. Remove with ScrollDebugOverlay.tsx once
// the glitch is diagnosed. See
// .kilo/plans/1790393825061-touch-inertia-glitch-diagnosis.md.
export function scrollDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).has('debug')) return true
    if (window.localStorage.getItem('scrollDebug')) return true
  } catch {
    return false
  }
  return false
}
