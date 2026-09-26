# Residual Identity Cleanup (post-rebuild)

## Context
The three prior plans are implemented and committed (`git log` HEAD = `1107843 feat: add portfolio application…`, working tree clean):
- `1790393825061-portfolio-real-content.md` — Alex Rivera → Rishabh Kumar rebuild.
- `1790393825061-hero-scroll-and-apple-fixes.md` — scroll-apple removed, hero latched.
- `1789055782852-fix-section-four-scroll-playback.md` — brain scroll playback.

A verification sweep confirms the real work landed: `index.html`, `package.json`, hero identity/coords (`12.9692° N / 79.1559° E`, Vellore/VIT), `projects`, `CONTACT_NODES` (GitHub + Email, 2 nodes), `researchPapers` (NOTE-01…), `toolkitData.ts`, and `ScrollApple.tsx` (deleted) are all correct. `useLatchedScene` is wired into the hero (`App.tsx:2051`).

Two harmless leftovers remain — no runtime impact, but they still say "Alex Rivera" / "LinkedIn".

## Tasks (source edits → use an implementation-capable agent, e.g. Code mode)

1. **`package-lock.json` (lines 2 and 8)** — rename to match `package.json`:
   - `"name": "alex-rivera-portfolio"` → `"name": "rishabh-kumar-portfolio"` in **both** places (root `name` and `packages."".name`).
   - Do not hand-edit anything else in the lockfile. Preferred: run `npm install` so npm rewrites the name and keeps the lockfile internally consistent; if editing by hand, change only those two `name` strings.

2. **`src/ContactConstellation.tsx` (comment block, lines 12–19)** — the code now has only 2 nodes (`NODES` = github, gmail; `App.tsx:1727-1728`), but the header comment still says "three levitating crystal prisms" and "(GitHub / LinkedIn / Gmail)":
   - Line 12: "three levitating crystal prisms" → "two levitating crystal prisms".
   - Line 14: "(GitHub / LinkedIn / Gmail)" → "(GitHub / Gmail)".
   - Comment-only change; do not touch the `NODES` array or `Scene` spacing (already correct for 2 nodes).

## Validation
Run from `D:\codexxursorportf`:
- `npm run build` (`tsc -b && vite build`) — must pass, no TS errors.
- `npm run lint` (`eslint .`) — must pass.
- Grep to confirm zero remaining matches (case-insensitive) for `alex`, `rivera`, `linkedin` across `src/`, `index.html`, `package.json`, `package-lock.json`.

## Out of scope
- Any visual/behavioral change. This is a naming/comment sweep only.
