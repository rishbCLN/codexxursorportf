# Portfolio: Replace Placeholder Content With Rishabh Kumar's Real Details

## Goal
This repo is a polished WebGL/Framer‑Motion portfolio template still filled with the
placeholder identity **"Alex Rivera"** (a fictional NYC "Creative Developer & Technical
Director") plus fabricated jobs, clients, awards, and academic papers. Replace all of it
with **Rishabh Kumar's** real identity and real GitHub work, **truthfully**, while keeping
the existing visual/animation system intact.

Source of truth: git remote `github.com/rishbCLN/...`, commit author `rishabh.kumar2024@vitstudent.ac.in`, and the public GitHub profile/repos of `rishbCLN`.

## Locked decisions (from user)
1. **Truthful rebuild** — keep the design, but every claim must be true for a CSE student. No fake employers, clients, awards, "ten years", published papers, or invented metrics.
2. **Rebuild the 3 project device mockups** to depict the real featured projects.
3. **Repurpose the "Reading Room"** section to real content (not fake research papers).
4. **Identity = inferred defaults** (below).

## Identity (use everywhere)
- Display name: **Rishabh Kumar**  · initials **RK**
- Title: truthful, student‑appropriate — e.g. **"Creative developer · CSE @ VIT"** (open to internships & freelance). Do **not** use "Technical Director".
- Location: **India** (no city confirmed).
- GitHub: **https://github.com/rishbCLN**
- Email: **rishabh.kumar2024@vitstudent.ac.in**
- LinkedIn: **none** — remove all LinkedIn links/nodes.

## Featured projects (verified from READMEs)
1. **MeshAlert** — repo `mesh_net` → **device: phone**. Offline **mesh** disaster‑comms app, Flutter/Android (`nearby_connections`, `sqflite`, `provider`); works with no internet/Firebase; has a companion **live survivor map** at `mesh-rescue-website.vercel.app`. It is an early prototype — describe honestly (no usage metrics). Tags: `FLUTTER`, `DART`, `MESH`. Honest "result": `COMPANION LIVE MAP` or `OFFLINE‑FIRST`.
2. **CivicLedger** — repo `civic-issue-reporting` → **device: laptop**. Web3 civic‑accountability dApp: **React + Solidity (Ethereum Sepolia) + IPFS/Pinata + MetaMask + ethers.js**; append‑only immutable civic‑issue records with transparent donations; deployed on Sepolia. README notes it was a **team** project — phrase accordingly. Tags: `REACT`, `SOLIDITY`, `IPFS`. Honest "result": `LIVE ON SEPOLIA`.
3. **Zero‑Dependency CLI Toolkit** — repos `pomo-cli`, `snipvault`, `jsonpeek`, `jsonmock-cli`, `envcheck`, `readmine`, `gitsweep`, `portkill`, `linkcheck-md` (+ curated list `awesome-zero-dependency`) → **device: laptop (terminal mockup)**. A suite of genuinely **zero‑dependency Node.js developer CLIs**. Tags: `NODE.JS`, `CLI`, `ZERO‑DEPS`. Honest "result": `10+ OPEN‑SOURCE TOOLS`. Link target: the GitHub profile or `awesome-zero-dependency`.

Device mix changes from **2 phones + 1 laptop** → **1 phone + 2 laptops**.

---

## Tasks (ordered)

### 1. Metadata & identity
- `index.html`: replace title/description/author/keywords (L8–L11), `canonical` (L13), all `og:*` (L16–L24), all `twitter:*` (L27–L30). Use Rishabh's name, truthful description, India, and the real deployed URL. `og:image`/`twitter:image` point to `alexrivera.dev/social-card.jpg` and `favicon.svg`/`apple-touch-icon.png` (L21,30,33,34) are not in `public/` — either add real assets or drop these tags/links.
- `package.json` L2: `"alex-rivera-portfolio"` → `"rishabh-kumar-portfolio"`.

### 2. Identity strings in `src/App.tsx`
- L1727 wordmark: `aria-label="Alex Rivera home"` → `"Rishabh Kumar home"`, and `A<span>R</span>` → `R<span>K</span>`.
- L1740 menu footer: `NEW YORK / GLOBAL` → `INDIA`; `HELLO@ALEXRIVERA.DEV` → real email.
- L2085 footer mark `AR` → `RK`.
- L2086: `INDEPENDENT CREATIVE DEVELOPER / NEW YORK / WORKING GLOBALLY` → truthful title + `INDIA`.
- L2095: `© 2026 ALEX RIVERA` → `© 2026 RISHABH KUMAR`.
- L2254–2255 hero intro: rewrite "Independent creative developer in New York…" truthfully.
- L2265–2266 hero coords are **NYC** (`40.7128° N / 74.0060° W`) → replace with an India coordinate or remove the coord block.
- L2340 manifesto sub‑line: **"Ten years at the intersection of engineering and design…"** is false → rewrite without the tenure claim (e.g. focus on building expressive, high‑performance work).
- Hero title/slogans (L2271–2280, L2337) and availability (L1728, L2295, L2081) are not false claims — keep, or lightly adjust to "open to internships/freelance".

### 3. Contact channels (two coupled files — counts/order MUST match)
`CONTACT_NODES` in `App.tsx` (L1813–1816) and `NODES` in `ContactConstellation.tsx` (L39–43) are index‑linked by a shared `focus` MotionValue. LinkedIn must go.
- **Default:** reduce to **2 channels — GitHub + Email** in both arrays (same order). In `ContactConstellation.tsx` update `Scene` spacing so two prisms stay centered (e.g. `offsetX = spread * (i - 0.5)` for the non‑compact row) and remove the embedded `siLinkedinPath` (L34–35) if unused.
- Update GitHub handle/href to `github.com/rishbCLN`, email handle/href/`clipboard.writeText` (L1991) and aria (L2072,2075) to the real email, and footer socials (L2088–2090): fix GitHub href, remove the LinkedIn `<a>`, fix `mailto:`.
- Alternative (optional): keep 3 prisms by adding a real third channel (e.g. a "Live demo"/portfolio link) instead of dropping to 2.

### 4. Featured projects data — `src/App.tsx` `projects` (L52–98)
- Replace all 3 entries with MeshAlert / CivicLedger / CLI Toolkit using the verified facts above. Set truthful `type`, `year`, `description`, `tags`, honest `result` (no invented numbers), `platform`, `device` (`phone`/`laptop`/`laptop`), and new `theme` values (`mesh` / `civic` / `cli`).
- **Add a `repo` field** per project. In the `Project` component, replace the hard‑coded `href="https://github.com/alexrivera/example-project"` (L1707) with `project.repo`.
- `image`/`imageAlt` (Unsplash URLs) are used only by an image preloader (L517–534). Either point to real screenshots placed in `public/` or drop the field + its preload usage. Do not keep unrelated stock photos.
- Work heading (L2353–2354 "THREE SYSTEMS. ONE CONTINUOUS FIELD.") — keep or lightly reword.

### 5. Rebuild the 3 device screens — `src/App.tsx` + `src/styles.css`
- Replace `WeatherScreen` / `NoirScreen` / `MemoryScreen` (L1413–1545) with **`MeshScreen`**, **`CivicScreen`**, **`CliScreen`**, and update the `ProjectScreen` switch (L1547–1555) to the new `theme` keys.
  - **MeshScreen (phone):** rescue/survivor map vibe — mesh node graph, peer/hop count, "OFFLINE MESH" status pill, SOS beacon, "no internet" indicator.
  - **CivicScreen (laptop):** civic‑issue feed/map with an append‑only status timeline, wallet‑connected chip, tx‑hash/CID snippets, donation indicator.
  - **CliScreen (laptop):** a terminal window showing real commands (`pomo`, `jsonpeek`, `portkill`, `snipvault`…) with sample output and a "0 dependencies" badge.
- Add matching CSS classes in `styles.css` mirroring the existing `.app-weather` / `.app-noir` / `.app-memory` blocks (and remove the old three). Keep the phone/laptop device frames (`PhoneDevice`/`LaptopDevice`) — only the inner screen content changes. Ensure the two laptop screens read well at the laptop aspect ratio.

### 6. Repurpose the Reading Room — `src/App.tsx` `researchPapers` (L146–217)
- Keep the `ArchivePaper` shape (so `ResearchArchive.tsx`/`drawPaper` work unchanged) but rewrite entries into **real notes/write‑ups** (3–5 items) about the featured projects and Rishabh's engineering approach (e.g. "Why zero‑dependency tools", "Immutable civic records on‑chain", "Offline‑first mesh comms").
  - Change `status` from `PREPRINT/UNDER REVIEW/PUBLISHED/PROCEEDINGS` → honest labels (`BUILD LOG`, `CASE STUDY`, `OPEN SOURCE`, `PROJECT NOTE`).
  - Change `field` to real domains, `id` to e.g. `NOTE‑01`, and rewrite `title/subtitle/abstract/quote/note/keywords`.
- Update the section tag/heading wording (L1199 `03 / WRITTEN INQUIRY`, L1200 `THE READING ROOM.`) to reflect notes/write‑ups if desired.
- Keep the **PDF‑upload** feature (L1207–1226); it's a nice résumé viewer. (No default résumé PDF unless the user provides one.)

### 7. Toolkit — `src/toolkitData.ts` + `src/ToolkitCortex.tsx` (coupled)
- Rewrite `TOOLKIT_CLUSTERS` (L19–72) to Rishabh's real stack. Suggested:
  - **LANGUAGES:** JavaScript, TypeScript, Python, C++, Java, Dart
  - **INTERFACE:** React, Flutter, HTML5, CSS/Sass, Tailwind
  - **3D / MOTION:** Three.js, WebGL, GSAP, Framer *(all genuinely used in this very portfolio)*
  - **SYSTEMS:** Node.js, Vite, Git, Solidity, Ethereum, SQLite
- For **every** `si` slug used, add the matching **named import** (L9–34) AND an entry in the `ICONS` map (L56–81) of `ToolkitCortex.tsx`; remove now‑unused ones (e.g. `siGo`, `siRust`, `siWebgpu`, `siBlender`, `siDocker`, `siGraphql`, `siNextdotjs`). A missing slug won't crash (falls back to `MISSING_ICON`, a purple box) — so **verify visually**.
- Verify each slug exists in installed `simple-icons@16` (check `siDart`, `siFlutter`, `siSolidity`, `siEthereum`, `siSqlite`; **Java** may be `siOpenjdk` or absent — if absent, drop Java or use a text label).

### 8. Remove leftover fabricated data — `src/App.tsx`
These arrays are **defined but never rendered**, yet they sit in the source asserting false claims (Nike/Apple/Google clients, Awwwards, "Technical Direction"): `processPhases` (L100–125), `capabilities` (L139–144), `experience` (L219–252), `recognition` (L300–307), and the unused `technologies` (L281–298). **Delete them.** Optionally also delete their now‑dead CSS in `styles.css` (`.experience-*`, `.recognition-*`, `.capabilities`). Confirm nothing imports them.

---

## Validation
- `npm install`, then **`npm run build`** (`tsc -b && vite build`) must pass; run **`npm run lint`**.
- `npm run dev` and visually verify:
  - Hero (name/coords/intro correct), 3 projects hover → correct device + new mockups, Reading Room renders + PDF upload works, Toolkit orbit shows correct logos (no purple fallback boxes), Contact prisms match the channel count and links are correct, footer identity correct.
  - No new console errors from the WebGL scenes (SceneBoundary/WebGL resilience still OK).
- Final grep to confirm **zero** remaining `alex`/`rivera`/`alexrivera`, NYC coords, fake clients/awards/metrics, or `example-project`.

## Risks / notes
- **Coupled counts:** contact `CONTACT_NODES` ↔ `ContactConstellation NODES` (focus index), and toolkit `toolkitData` slugs ↔ `ToolkitCortex` imports/ICONS. Keep them in sync.
- **Honesty guardrails:** MeshAlert is a prototype; CivicLedger was a team effort. Describe both without overstating. Use no invented traffic/conversion numbers anywhere.
- New project screens require new CSS; test at both phone and laptop aspect ratios and on reduced‑motion.
- Deployment is via existing `vercel.json` (no data migration involved).

## Minor open items (proceed with defaults; confirm later if desired)
- City in India for the hero coordinate/label (default: label "INDIA", drop the lat/long pair).
- Contact = 2 channels (GitHub + Email) vs keeping 3 with a real third link (default: 2).
- Whether to supply a résumé PDF as the Reading Room default (default: none).

> Implementation requires source edits — switch to an implementation‑capable agent (e.g. Code mode) to execute this plan.
