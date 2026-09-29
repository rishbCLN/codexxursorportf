# Motion pass: static section heads + tags

## Goal
Add restrained, on-scroll entrance motion to the last UI fragments that lack any
motion engineering — the three static section **heads** (work, principles,
technology) and the four static numbered **section-tags** — by REUSING the
reveal vocabulary already in `App.tsx` (the rising line-mask used by hero + project
titles). No new generic per-section fades, no new libraries.

## Scope (user-confirmed)
"Cohesive heads + subtle tags": rising line-mask reveal on the 3 static heads;
a small staggered fade-rise on the static tags. Grouped so the tag leads and the
head lines follow as one orchestrated moment per section.

Out of scope: split-type wiring on the hero title (already documented at
`App.tsx:2203`), header wordmark/availability entrance, per-card hover
micro-interactions, and any WebGL/scene changes.

## Current state (verified)
Already animated (DO NOT TOUCH):
- Hero intro, WebGL scenes, marquee, project cards/titles, research reading-room
  (scroll-driven `domOpacity`/`headY`), principle cards, contact masks/foot.
- Research section-tag `App.tsx:1099` (rides scroll `domOpacity`/`headY`).
- Contact section-tag `App.tsx:1906` (wrapped in `<Reveal>`).

Static (TARGETS):
- Work head `<p>` — `App.tsx:2293`.
- Principles head `<h2>` + intro `<p>` — `App.tsx:1240-1241`.
- Technology head `<h2>` — `App.tsx:1306`.
- Static tags: about `App.tsx:2274`, work `App.tsx:2292`, principles
  `App.tsx:1239`, toolkit `App.tsx:1305`.

Reusable, already-defined in `App.tsx`:
- `lineReveal` (`:1591`): `hidden {y:'115%', blur(10px), opacity:0}` -> `visible {...0}`.
- `softReveal` (`:1595`): `hidden {opacity:0, y:22, blur(9px)}` -> `visible {...0}`.
- Global CSS `.line-mask { display:block; overflow:hidden; padding-bottom:.04em }`
  and `.line-inner { display:block; will-change:transform,filter,opacity }`
  (`styles.css:203-204`) — not scoped, safe to reuse inside the head elements
  (font-size cascades from each head selector).

## New shared variants (add near the other head variants, ~`App.tsx:1591`)
```ts
// Container: orchestrates tag -> head lines as one staggered group.
const headStagger: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.05, staggerChildren: 0.12 } },
}
// Numbered tag: quiet fade-rise (the "subtle tag").
const tagReveal: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}
```
Ease to match the file: `[0.16, 1, 0.3, 1]`. Tag duration ~0.6s; head lines ~1.0s.

## Tasks (ordered)

1. **Add `headStagger` + `tagReveal` variants** near `App.tsx:1591`
   (`lineReveal`/`softReveal` already there).

2. **Work head — `App.tsx:2290-2294`.** Make `.work-heading` the stagger parent
   and split the lede `<p>` into two masked lines. Keep it a `<p>` so
   `.work-heading p` styling (right-aligned) still applies.
   ```tsx
   <section className="work" id="work">
     <motion.div
       className="work-heading"
       initial="hidden" whileInView="visible"
       viewport={{ once: true, margin: '0px 0px -12% 0px' }}
       variants={headStagger}
     >
       <motion.div className="section-tag" variants={tagReveal}
         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
         <span>02</span> / FEATURED PROJECTS
       </motion.div>
       <p>
         {['THREE SYSTEMS.', 'ONE CONTINUOUS FIELD.'].map((line, i) => (
           <span className="line-mask" key={line}>
             <motion.span className="line-inner" variants={lineReveal}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}>
               {line}
             </motion.span>
           </span>
         ))}
       </p>
     </motion.div>
     {/* ...project-field unchanged... */}
   </section>
   ```

3. **Principles head — `App.tsx:1238-1242`.** Make `.principles-sticky` the
   stagger parent (parent carries NO transform — only orchestration — so `position:sticky`
   is unaffected). Tag -> 3 masked h2 lines (3rd keeps the serif `<i>WORK.</i>`) ->
   intro `<p>` via `softReveal`.
   ```tsx
   <motion.div
     className="principles-sticky"
     initial="hidden" whileInView="visible"
     viewport={{ once: true, margin: '0px 0px -12% 0px' }}
     variants={headStagger}
   >
     <motion.div className="section-tag" variants={tagReveal}
       transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
       <span>04</span> / PRINCIPLES
     </motion.div>
     <h2>
       <span className="line-mask"><motion.span className="line-inner" variants={lineReveal}
         transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>THE RULES</motion.span></span>
       <span className="line-mask"><motion.span className="line-inner" variants={lineReveal}
         transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}>BEHIND THE</motion.span></span>
       <span className="line-mask"><motion.span className="line-inner" variants={lineReveal}
         transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}><i>WORK.</i></motion.span></span>
     </h2>
     <motion.p variants={softReveal}
       transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
       Not trends. Not a style guide. Four durable ideas that shape every technical and creative decision.
     </motion.p>
   </motion.div>
   ```
   Note: `.principles-sticky h2` sets `display` via default block; `.line-mask`
   children render as stacked block lines — confirm the `<br/>`-driven 3-line
   layout is preserved (it now comes from the three block masks, so the old
   `<br/>`s are removed).

4. **Technology head — `App.tsx:1304-1307`.** Make `.toolkit-head` the stagger
   parent (it is `position:absolute; pointer-events:none` over the canvas —
   unaffected by the orchestration). Tag -> 2 masked h2 lines (2nd keeps `<i>`).
   ```tsx
   <motion.div
     className="toolkit-head"
     initial="hidden" whileInView="visible"
     viewport={{ once: true, margin: '0px 0px -12% 0px' }}
     variants={headStagger}
   >
     <motion.div className="section-tag" variants={tagReveal}
       transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
       <span>05</span> / TOOLKIT
     </motion.div>
     <h2>
       <span className="line-mask"><motion.span className="line-inner" variants={lineReveal}
         transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>TOOLS, CHOSEN</motion.span></span>
       <span className="line-mask"><motion.span className="line-inner" variants={lineReveal}
         transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}><i>WITH INTENTION.</i></motion.span></span>
     </h2>
   </motion.div>
   ```
   `pointer-events:none` on `.toolkit-head` is inherited by the motion element —
   keep it (add `style`/class as before); it does not block the reveal.

5. **About tag (standalone) — `App.tsx:2274`.** No head to group with (the
   statement copy already animates via `<Reveal>`), so wrap just the tag:
   ```tsx
   <motion.div className="section-tag"
     initial="hidden" whileInView="visible"
     viewport={{ once: true, margin: '0px 0px -10% 0px' }}
     variants={tagReveal}
     transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
     <span>01</span> / MANIFESTO
   </motion.div>
   ```

6. **Leave research (`:1099`) and contact (`:1906`) tags untouched** — already
   animated; wrapping them again would double-drive opacity.

## Reduced motion
The codebase intentionally keeps the full animated experience for everyone
(`reduced = false` in Contact/Research; `@media (prefers-reduced-motion)` in
`styles.css:1031` only disables native scroll-behavior + the process/brain
transforms). These new reveals are `once`, gentle, and consistent with the
existing un-gated `Reveal`/project-title reveals, so DO NOT add reduced-motion
gating here — match the established pattern.

## Validation
1. `npm run build` (runs `tsc -b && vite build`) — must pass with zero NEW TS
   errors. (Pre-existing lint errors in App.tsx/ResearchArchive.tsx are unrelated;
   do not introduce new ones.)
2. `npm run lint` — confirm no NEW warnings/errors from the edits.
3. `npm run dev` and visually verify:
   - Work / principles / technology heads rise line-by-line once on scroll-in;
     tag leads, head follows.
   - No horizontal clipping of glyphs on the masked lines — the display type has
     heavy negative letter-spacing and serif italics. If edges clip, add small
     horizontal padding to these `.line-mask` instances (mirror the hero
     `.hero-line` treatment) rather than removing `overflow:hidden`.
   - Principles head still sticks (`position:sticky` intact — parent carries no
     transform).
   - Toolkit head stays correctly positioned over the canvas and remains
     non-interactive (`pointer-events:none`).
   - Work lede stays right-aligned.
   - Mobile (<=600px) layout unaffected; reveals still fire.

## Risks / notes
- `overflow:hidden` masks can clip negative-letter-spacing / serif-italic glyphs
  horizontally — verify per task 3/4; fix with horizontal padding on the mask.
- `.principles-sticky` is sticky: keep orchestration on the parent transform-free
  (container variant has no `y`/`opacity`), only children translate.
- Do not touch the already-animated research/contact tags (double-animation bug).
- Keep all easing at `[0.16, 1, 0.3, 1]` and reuse `lineReveal`/`softReveal` so
  the new motion reads as the same language as the hero and project titles — one
  cohesive vocabulary, not a new effect.

## Files touched
- `src/App.tsx` — add 2 variants; wrap/split 3 heads + 4 tags (tasks 1-5).
- `src/styles.css` — only if task-3/4 clipping needs horizontal mask padding.
