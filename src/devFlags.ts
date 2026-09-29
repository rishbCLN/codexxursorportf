// DEV-only tooling gate for the r3f-perf HUD and the leva panel. Kept in its
// own module (no React exports) so the components that use it can be the sole
// export of their files and never trip react-refresh's "only-export-components"
// rule — same pattern as scrollDebug.ts.
//
// Enabled by `?perf` in the URL (any value) or a `perfHud` localStorage key.
// This is *in addition* to the build-time `import.meta.env.DEV` guard at each
// call site: the dev libraries (r3f-perf, leva) are only ever imported through
// a dynamic import inside a `DEV` branch, so they are dead-code-eliminated from
// the production bundle and can never ship, flag or no flag.
export function perfHudEnabled(): boolean {
  if (!import.meta.env.DEV) return false
  if (typeof window === 'undefined') return false
  try {
    if (new URLSearchParams(window.location.search).has('perf')) return true
    if (window.localStorage.getItem('perfHud')) return true
  } catch {
    return false
  }
  return false
}
