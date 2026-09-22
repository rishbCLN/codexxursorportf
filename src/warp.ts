/* ---------------------------------------------------------------------------
   WARP CORRIDOR — single source of truth for the hyperspace travel model.

   The speeding-star field (SonicRing) and the deep-space encounters (WarpField)
   live on separate transparent canvases, but they must occupy the SAME apparent
   space: identical camera, identical "distance flown down the corridor" as a
   function of scroll. Both layers import these constants + travel() so their
   velocity fields can never drift apart (a fov/speed mismatch is exactly what
   makes 3D objects look pasted onto a backdrop instead of moving through it).
--------------------------------------------------------------------------- */

// Ring has fully stopped, face-on (mirrors STOP in SonicRing/App choreography).
export const WARP_STOP = 0.6

// Shared camera for every hero warp layer.
export const CAM_Z = 6
export const WARP_FOV = 30

// Corridor geometry.
export const TUNNEL = 70 // depth of the warp corridor (world units)
export const WARP_WRAPS = 3 // how many tunnel-lengths stream past across the window

// Depth-travel origin — the scroll progress at which "distance flown" is zero.
// Aligned with the star fade-in so the field is already moving as it appears.
export const WARP_ANCHOR = WARP_STOP + 0.05 // 0.65

// Distance flown down the corridor as a PURE function of scroll progress — no
// ambient/wall-clock drift. Both layers (stars + encounters) derive depth from
// this alone, so when the scroll stops they come to rest together on the same
// frame (a "clean full stop") instead of one coasting while the other freezes.
export function warpScrollTravel(progress: number): number {
  return ((progress - WARP_ANCHOR) / (1 - WARP_ANCHOR)) * TUNNEL * WARP_WRAPS
}
