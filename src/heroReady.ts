/*
  Hero GPU warm-up gate (pure, R3F-free so it can live in the eager bundle).

  The three hero canvases (SonicRing, WarpField, SonicExitRing) are React.lazy,
  so they only mount once their chunk resolves — which is right as the loader is
  about to lift. Their WebGL programs/shaders (and WarpField's whole post
  pipeline) therefore compile during/after the reveal, which is exactly the
  hitch you feel the first time you scroll into the warp.

  Each canvas drops a <WarmupProbe/> (see WarmupProbe.tsx) that calls
  signalHeroReady() after it has actually rendered a few frames. The loader
  awaits whenHeroReady() so the curtain only lifts once that GPU work is already
  paid for — behind the loader, where it's invisible.

  NOTE: keep this file free of any @react-three/* import. It's imported eagerly
  by App (the main chunk); pulling R3F/three in here would drag the entire 3D
  graph into the initial bundle and defeat code-splitting.
*/

const TOTAL = 3
let readyCount = 0
let resolved = false
const waiters: Array<() => void> = []

export function signalHeroReady() {
  readyCount += 1
  if (!resolved && readyCount >= TOTAL) {
    resolved = true
    const fns = waiters.splice(0, waiters.length)
    fns.forEach((fn) => fn())
  }
}

// Resolves once all hero canvases have warmed (or immediately if they already
// have). The loader also carries its own MAX-time failsafe, so a canvas that
// errors out can never trap the reveal.
export function whenHeroReady(): Promise<void> {
  if (resolved) return Promise.resolve()
  return new Promise((resolve) => { waiters.push(resolve) })
}
