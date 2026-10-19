# Journal — Komatsu redesign

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## 2026-10-17T15:50:00Z — Extract (brand-surface-extraction, seed, brand-review, state-and-report) — homepage brand surface, current-state docs, review and state

**Prompt:** Finish the stardust extract (Phases 3 to 6) for a single-page capture of https://www.komatsu.com/en-us, as the first step of "modernize the homepage". The crawl, computed-style census and vision check were already done.

**Decisions:**
- Scope stays homepage-only (user choice). Every "cross-page" aggregate is the home page's own. System-component and repeated-heading detection were skipped because both need 3 or more pages, and the outputs say so.
- Logo: took the header `<img>` logo.svg (white wordmark), even though its 5:1 aspect is outside the locator chain's 0.5 to 3.0 guard. The steps after it would have picked a social card or a favicon. The blue footer wordmark was seen but not captured.
- Palette roles: background #ffffff (its cluster includes the #fafafa page ground), primary #140a9a, text-primary #1b232a, accent #253fc8 (outlines and hover only), text-secondary #4d545a, accent-1 #3366cc (tags), border #ededed, accent-2 #000000. Dropped by the 8-color cap: #d9d9d9, rgba(20,10,154,.3), #ffc82f.
- heroImage = the Scene7 hero `<img>` (1440 x 700). heroMedium = null: the hero has an empty video slot and no motion asset.
- Register `brand`. Tone guessed as `aspirational` (a heuristic).
- In the brand review, `--accent` falls back to `--primary` because no saturated palette color sits 60 degrees or more away in hue. `--primary-dark` is #140a9a darkened by 30%.
- state.json: `flow: redesign`, `flowSource: user-phrase` ("modernize the homepage"), pageCap 1, totalDiscovered 1.

**Artifacts touched:**
- stardust/current/_brand-extraction.json — created
- stardust/current/PRODUCT.md — created
- stardust/current/DESIGN.md — created
- stardust/current/DESIGN.json — created; cap-probe merged `extensions.breakpoints`
- stardust/current/brand-review.html — created
- stardust/current/assets/logo.svg — created
- stardust/current/assets/fonts/ (Noto Sans normal and italic, Roboto 400, Font Awesome 6 solid) — created
- stardust/state.json — created
- stardust/status.jsonl — updated (crawl end; brand-surface, seed, brand-review, state-and-report start and end)
- stardust/current/pages/en-us.json, en-us.html, _computed-styles.json, _crawl-log.json — read

**Findings worth flagging:**
- Every captured color maps onto the site's own CSS utility ramps (`.bg-primary-10/30/60`, `.bg-neutral-0/60/90`). The site also declares a yellow secondary ramp (secondary-30 #ffc82f), but the homepage paints it on only one element.
- The hero H1 is 32px at 1440 and 20px at 390, which is smaller than the 24px section H2s on phones. The type scale is ad-hoc (32, 24, 22, 20, 18, 16).
- The census sees no gradients because the hero overlay is a `::before` gradient. It was recorded from the CSS rule instead.
- Cap probe: the white module panels are capped at 1920px, the carousel at 1856px, and the shell is fluid. So the page runs edge to edge at every common desktop width.
- The page record's `_provenance.waitMode` is `"slow"`, which is a valid `crawl.mjs --wait` value. But the regex in state-machine.md § Provenance validation, `^(fast|medium|spec|networkidle|domcontentloaded)…$`, has no `slow`. A strict downstream validator would reject this page even though it was rendered live. The page record was not edited.

**Open questions:**
- Should the blue footer logo variant be captured before prototyping?
- Is the `waitMode: slow` mismatch with the provenance-validator regex a plugin spec gap? It affects every page crawled with `--wait slow`.

**Next:** Open stardust/current/brand-review.html to check the extraction, then run `$stardust direct` to set the homepage modernization direction.

---

## 2026-10-17T16:06:30Z — Direct (divergence, improvements, product, design, direction-and-state) — brand-faithful modernized homepage direction for /en-us/home-modern

**Prompt:** Finish stardust direct Phases 2 to 5 for the homepage. The Phase 1 plan was already confirmed: "use stardust to modernize the homepage from a copy, so we have 2 versions to compare in next weeks demo"; Q1 "Confident refresh"; Q2 deploy at /en-us/home-modern.

**Decisions:**
- Brand signal `signal-strong`, so Mode A (brand-faithful) with no rebrand trigger. Composed with Mode B (agent-sourced anchors) and Mode C (ground override, `brand-faithful`). Mode A+ considered and not activated: no evidenced face or color weakness.
- Research tier degraded to WebFetch only (no WebSearch or refero). 3 anchors retrieved: Volvo CE (primary), Liebherr, McMaster-Carr (out-of-category). epiroc, cat, maersk and abb fetches failed.
- Seed `Komatsu|2026-10-17` → 1950s × Cross-stitch sampler × Tabloid × saturated. Decade overridden to 2025-now and register to product-program grid (both reasoned from anchors). Craft kept at low teeth (grid discipline only). Ground goes to brand white; the saturated roll becomes the single Komatsu Blue band.
- Palette inherited with brand-native roles (komatsu-blue, boom-blue, survey-blue, track-steel, cab-slate, grade-line, daylight, yard-gray, site-ground, komatsu-yellow reserved). #000000 dropped. Roboto retired.
- Type: 1.25 scale (display 39→61, headline 31→39, title 20→25, body 16). Density balanced 64/48/32. Radius 4px.
- ia-fidelity verbatim. 5 iaPriorities, all `locked`. Motion register `kinetic-grid` selected, not applied (static render).
- N = 1 canonical direction. impeccable sequence recorded for prototype: detect --json → shape → distill → typeset → colorize → critique → polish.

**Artifacts touched:**
- stardust/prototypes/en-us-improvements.md — created
- PRODUCT.md — created (project root; stardust target spec)
- DESIGN.md — created (project root; Stitch frontmatter + 8 sections)
- DESIGN.json — created (project root; schemaVersion 2)
- stardust/direction.md — created
- stardust/state.json — updated (direction block; en-us extracted → directed)
- stardust/status.jsonl — updated (direct phases start/end)
- stardust/current/* — read

**Findings worth flagging:**
- The project-root PRODUCT.md, DESIGN.md and DESIGN.json are stardust target specs only. The EDS project's styles/, blocks/, scripts/ and content/ were not touched, and deploy must namespace the blocks for /en-us/home-modern.
- `ledger.mjs` does not know the `direct` skill or its phases. Lines were written with a warning (phases used: divergence, improvements, product, design, direction-and-state).
- The hero image has `localPath: null`, so the prototype must reuse the Scene7 renditions by URL.
- Komatsu Yellow fails on white (1.55:1). It is reserved to blue or dark grounds (8.80:1 on #140a9a).

**Open questions:**
- Should the blue footer wordmark be captured locally before prototype? The prototype currently references its public URL.
- Should the brand team unify the CTA sibling phrasings? They are kept verbatim under legacy-content-preserved.

**Next:** `$stardust prototype en-us` — render the canonical modernized homepage against DESIGN.md and the improvements brief.

---

## render — en-us-proposed.html authored by impeccable craft (2026-10-19)

**Skill:** stardust:prototype Phases 2 → 2.7 (2.8 skipped: static, no motion). Brief `stardust/prototypes/en-us-shape.md` CONFIRMED by the user ("Yes, build it"). Open question 2 resolved: "Use larger versions", so the same Scene7/AEM asset IDs are used at higher resolution (larger named presets, or preset + aspect-preserving wid&hei). Oversized DAM originals use their `cq5dam.web.1280` / `thumbnail.319` renditions. Other open questions use the brief defaults.

**What happened:**
- **Phase 2 render:** impeccable craft (new-work flow, brief-pinned, no seed roll) wrote `stardust/prototypes/en-us-proposed.html` (≈112 KB, 9 landmarks and sections). Detector `[]`. The finish reviewer ran 2 rounds: 5 fixes resolved and 2 partial (no seed key because the direction is user-pinned; the Parts banner has no larger rendition).
- **Contract:** `:root` is complete and first; data attributes are on all 9 sections; provenance is the first child of head; favicon is a data URI; no external CSS/JS (Noto Sans woff2 via a relative path); 0 placeholders. Type ratios are 1.563 at every step. Anti-toolbox: 0 hits, recorded in `DESIGN.json.extensions.divergence.prototype_audits`. Disciplines: 6 bypassed (Mode A Noto Sans); 7 uses wght at 760/680/640/590/500; 8 `refined`; 9 copy-cadence bypass scoped to the proposed file.
- **Phase 2.5–2.6 critique + audit:** critique scored 25/32 (dual-agent) and audit 15/20. They found 2 P1s: news-feature meta contrast at 2.39:1 and inactive rail dots at 1.91:1. Harden fixed both (≥9.5:1 and 7.5:1), plus 9 P2s. Polish fixed one regression: mobile "Company" was invisible in the panel. Three overlay hits were dismissed as brand-faithful or false positives. Vision gate: pass.
- **Phase 2.7 adapt:** no overflow at any of 320–1920px; the mobile-nav audit passes at 360px; the burger CSS source order is OK. Validation at 1440, 768 and 390: 0 console errors, 0 failed requests, landmarks OK, no heading skips, every image has alt, "Explore more" is keyboard-reachable.

**Artifacts touched:**
- `stardust/prototypes/en-us-proposed.html`: created.
- `stardust/prototypes/en-us-shape.md`: confirmation and decisions added.
- `DESIGN.json`: the `extensions.divergence.prototype_audits` and `font_deck.notes` fields only.
- `stardust/validation/en-us-proposed/`: screenshots and `report.json`.
- `.impeccable/critique/`: snapshot.
- `stardust/state.json`: en-us moved directed → prototyped.

**Open (advisory P2/P3):**
- Parts "Order now" ghost button (it follows DESIGN.md button-inverse).
- Scene7 serves JPEG; WebP is about 60% smaller.
- News thumbnails are PNG.
- Spacing-token literals.
- Text-only 200% zoom header at 1280.
- News-list headline wrap.
- Rail shows 6 per page instead of 7 (deviation recorded).

**Next:** the user reviews and approves (`$stardust prototype en-us` approval), then `$stardust deploy` to `/en-us/home-modern`.

## iterate + approval — en-us approved (2026-10-19)

- **Iterate:** the user said "Solid white button". impeccable `bolder` changed the Parts band "Order now" to a filled Daylight button with Komatsu Blue text. Contrast: text 13.64:1; hover (Komatsu Yellow, Track Steel text) 10.27:1; hover fill against the band 8.80:1; yellow focus ring against the band 8.80:1. This is recorded as a page-level, direction-authorized deviation in `_provenance.directionAuthorizedDeviations` and `DESIGN.json.extensions.componentStyle.pageLevelDeviations`. It is not a system change. Validation at 1440, 768 and 390 is clean, and the screenshots in `stardust/validation/en-us-proposed/` were refreshed.
- **Approval:** the user said "Approve and deploy".
  - The provenance cites the active direction (2026-10-17T16:06:00Z).
  - Fold-back is a no-op because ia-fidelity is verbatim.
  - State moved en-us prototyped → approved.

**Next:** `$stardust deploy` to `/en-us/home-modern` with namespaced blocks. The existing `/en-us` page stays untouched.

## deploy (runtime-probe → local-qa) — en-us-proposed.html converted to /en-us/home-modern (2026-10-19)

- **runtime-probe:** `stardust/runtime-contract.json` written. This runtime is an older boilerplate: it buttonizes bare links, uses `p.button-container`, and turns metadata `template` into a body class. The header overlay only switches on for `.hero-banner`.
- **1-audit / 2-decide / 2b-section:** 7 sections. The fingerprint is in `.work/deploy/fingerprint.json`. Schema: `stardust/eds-schema/home-modern.json`. Names locked in `stardust/eds-conversion-log.md`: hm-hero, hm-rail, hm-tiles (+ `contact` variant, so routing tiles and Get in touch share one block), hm-tech, hm-band, hm-news. Section heads and "Read more news" are default content.
- **3-foundation (page-scoped, by user constraint):** `styles/home-modern.css` scopes everything under `body.home-modern`, with `--hm-*` tokens. Every hm- block imports it. No existing file changed. Fonts reuse the site's Noto Sans variable.
- **6-chrome:** the shared header/footer are kept. The header overlay is repeated under `body.home-modern`, and the non-home breadcrumb is hidden on this page only.
- **7/8/9:** 6 blocks were built. `content/en-us/home-modern.plain.html` was written: one h1, Robots noindex/nofollow, larger komatsu.com renditions, and root-relative links only to the 5 local pages.
- **local-qa:**
  - davids-model-lint: 0 🔴 / 0 🟡.
  - block-roundtrip: closed, EW 75/75.
  - EW simulate: 0 dead.
  - qa-gate: PASS 32/0/0 on the served page.
  - Token grep: clean.
  - Lint: clean.
  - Regression: 3 existing pages load clean.
  - Visual check: 1440 and 390 match the prototype. Two fixes came out of it: italic `<em>` CTA and meta separators.
- **Handoff:** run. 1 page, 8 sections, 0 img srcs localised; the image srcs are external komatsu.com URLs and the uploader rehosts them.

**Next:** the user uploads/previews from the UI. Step 10 (reconcile on the deployed URL, CLS) has not run.
