<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-17T16:06:00Z
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
    - stardust/current/brand-review.html
    - stardust/current/pages/en-us.json
    - stardust/current/_computed-styles.json
    - https://www.volvoce.com/united-states/en-us/
    - https://www.liebherr.com/en-us/
    - https://www.mcmaster.com/
  synthesizedInputs: []
  researchTier: websearch (degraded — WebFetch only; 3 of 7 fetches retrieved)
  stardustVersion: 0.29.1
-->
---
title: "use stardust to modernize the homepage from a copy, so we have 2 versions to compare in next weeks demo"
resolvedAt: 2026-10-17T16:06:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

# Active direction (2026-10-17T16:06:00Z)

## Phrase

> use stardust to modernize the homepage from a copy, so we have 2 versions to compare in next weeks demo

## Restatement

Keep komatsu.com/en-us exactly as it is, and build a modernized copy of the homepage at `/en-us/home-modern` so the current and refreshed versions can be compared side by side in next week's demo. The copy is a confident refresh. It stays inside the Komatsu brand (Komatsu Blue palette and Noto Sans pinned) and keeps the same content, section order and IA priorities. It moves expression from restrained to committed: a real type hierarchy, more spacious balanced density, richer and larger imagery, and fewer competing actions. It must still read as Komatsu at a glance and stay serious, credible industrial B2B.

## Movements

- **register** — `brand` (inherited from `current/PRODUCT.md`)
- **expressive axis** — `restrained` → `committed` (Q1: "Confident refresh")
- **tone** — `serious` (pinned: credible, industrial B2B)
- **density** — `packed` → `balanced` — `density: balanced (from approved plan)`
- **distinctiveness** — `familiar` → `distinctive`
- **audience** — contractors, mining operators, fleet buyers; desktop-first; evaluating equipment, parts and services (inferred, stated in plan, unchallenged)
- **ia-fidelity** — `verbatim (from approved plan constraint "same content and IA priorities")`: same section sequence and content beats. Surface, type, density and composition within a section may change.
- **constraints** — `brand-faithful` (palette + Noto Sans pinned), `legacy-content-preserved`, `existing-site-untouched` (the modernized copy deploys at `/en-us/home-modern` with namespaced blocks)

## Gaps and questions

1. **Q:** How far should the modernized copy move (expressive axis)?
   **A:** "Confident refresh" — clearly modern and more spacious, with a stronger type hierarchy and richer imagery, and instantly recognizable as Komatsu. → expressive `restrained` → `committed`.

2. **Q:** Where should the modernized copy live so the two versions can be compared?
   **A:** `/en-us/home-modern` (deployment constraint; recorded in PRODUCT.md § Capabilities and Constraints).

## Anchor references

Agent-sourced (Mode B; the user named none). Research tier was degraded: WebFetch only, since WebSearch and refero MCP were unavailable, so candidate URLs were fetched directly. Of 7 fetches, 3 retrieved: epiroc.com returned 403, cat.com timed out, maersk.com hit a header overflow, abb.com timed out.

- **Volvo Construction Equipment (US)** — https://www.volvoce.com/united-states/en-us/ — *primary anchor* for mood and density: generous section spacing, sentence-case headings, a uniform product-category tile grid, CTAs distributed per section. Tag: off-toolbox.
- **Liebherr (US)** — https://www.liebherr.com/en-us/ — keeps the brand yellow out of the chrome and lets the logo and product photography carry identity; the product program is a simple text-link grid. Supports the reserved Komatsu Yellow and chips → text links. Tag: off-toolbox.
- **McMaster-Carr** — https://www.mcmaster.com/ — out-of-category, same industrial register: catalog-first, functional category labels, no hero spectacle, hierarchy through spacing and weight. Supports plain labels on the equipment rail. Tag: off-toolbox.

References inform strategy, composition and rhythm only. Under Mode A no reference palette or type was ported.

## Anti-references

- The **Generic-2026-SaaS silhouette** (toolkit § 1): a clamp(72px+) hero, solid+outline CTA pair, sticky nav and serial footer. It is guardrailed because "modernize" is its most common trigger. The impeccable `shape` step takes the slop list as its anti-references.
- **Stat-callout bar** and any fabricated content (no stats, logos, quotes or prices exist on the captured page).
- **Hero text on photography without a scrim**. The captured overlay peaks at 0.375, so the target is a scrim of at least 0.4 and at least 4.5:1.
- **Cream / paper grounds**, the archival-editorial palette family, and editorial-register vocabulary on a B2B equipment brand.
- **Motif kits** (stamps, hazard stripes, grain, numbered section eyebrows, uppercase condensed display).

## Brand signal and mode

- **Signal classification:** `signal-strong`. The palette has 8 distinct clusters (7 excluding white). `type.headingFamily.name` = `type.bodyFamily.name` = "Noto Sans". The scale audit is ad-hoc but has 6 distinct heading sizes.
- **Mode:** **A — brand-faithful** (default; no rebrand trigger: the phrase has no rebrand keyword, no `--rebrand`, and the signal is not absent). Brand-faithful mode is active: palette and type are pinned to the captured brand surface. Pass `--rebrand` to override.
- **Composed with:** Mode B (agent-sourced anchors imply decade and register), Mode C (ground override, reason `brand-faithful`).
- **Mode A+:** considered, **not activated**. The type weaknesses (`T-scale`, `T-hierarchy`) are scale problems, fixed with the pinned face; Noto Sans variable already ships 100–900. No captured color fails contrast (`T-contrast` did not fire; every text pair is ≥ 5.37:1). `T-font-fork` is fixed by consolidating onto the pinned face, not by an upgrade. `brand_adjacent_refinements[]` is empty.
- **Signature preservation:** `heroMedium` is null (no video, canvas or Lottie), and no site-wide motif exists beyond the 4px corners and photo tiles; both are preserved.
- **Image-reuse contract:** every captured image is reused at its semantic position. The hero image has `localPath: null`, so it is reused via the Scene7 public renditions (21:9 desktop, 3:4 mobile). No synthesized placeholders.

## Divergence inputs

```
Divergence (brand-faithful mode):
  decade           ✓ reasoned  → 2025-now          (rolled 1950s; overridden by Volvo CE / Liebherr anchors)
  craft            ✓ rolled    → Cross-stitch sampler  (low teeth: square-module grid discipline only)
  register         ✓ reasoned  → product-program grid  (rolled Tabloid; overridden by Volvo CE + McMaster-Carr)
  ground-family    inherited   → stark-white (brand-native #ffffff; Mode C override of rolled "saturated")
  font deck        inherited   → Noto Sans (brand-inherited; Roboto retired)
  palette          inherited   → 10 brand-native roles from the captured palette + declared ramps
```

- **seed** — `Komatsu|2026-10-17` MD5 `8e07888de5166863319bb8871e73cb17` → `1950s × Cross-stitch sampler × Tabloid × saturated`
- **picked_by** — mixed. decade: `reasoned: Volvo CE + Liebherr`; craft: `deterministic`; register: `reasoned: Volvo CE category grid + McMaster-Carr`; ground: `brand-faithful`.
- **Mode C** — the rolled `saturated` ground loses to the brand's #ffffff ground (override `brand-faithful`). The roll still informs the alt-section surface: Komatsu Blue becomes a full-section ground exactly once (the parts-ordering band), and the light alternation uses `yard-gray` #f4f5f5.
- **font deck** — `brand-inherited` (Noto Sans 400/600/700), `picked_by: user-constraint`.
- **palette** — inherited, `picked_by: user-constraint`. Roles renamed brand-native: komatsu-blue #140a9a · boom-blue #253fc8 · survey-blue #3366cc · track-steel #1b232a · cab-slate #4d545a · grade-line #ededed · daylight #ffffff · yard-gray #f4f5f5 · site-ground #fafafa · komatsu-yellow #ffc82f (reserved). The captured `#000000` (6 icon labels) is not inherited.
- **typography** — committed axis gives a 1.25 ratio: display 39→61px, headline 31→39px, title 20→25px, subtitle/lede 20px, body 16px, meta 12.8px.
- **spacing** — balanced: sectionPadding 64 / 48 / 32px. The hard floor fired (7 modules > 5), so desktop is bounded at 40–64px. `rounded.sm` is 4px (captured mode).
- **anti-toolbox audit** — 0 hits. Generic-SaaS silhouette 0/4; no sticky nav; no stat bar; hero scrim enforced; no cream; brand-native roles; editorial vocabulary guarded. Off-toolbox moves: the machine-yellow reserved mark and the cut-out equipment rail without card chrome. Audit adjustments: literal stitch texture removed; the yellow mark retained but capped at 2 per viewport.
- **brand-faithful inversions** —
  - `#ffffff` is retained as the page ground (daylight). It is the existing Komatsu brand decision, so the impeccable "no pure black/white" rule is inverted per brand-faithful direction.
  - Color tokens are retained in hex format, matching the captured Komatsu surface and site CSS ramps. OKLCH is used for component CSS and canonical values; this is inheritance.
  - Saturated Komatsu Blue `#140a9a` (HSL S 88%) is retained as the primary brand color. The agent-default reflex toward tinted-neutral primaries is inverted per brand-faithful direction.
  - `#ffc82f` Komatsu Yellow is retained as a **reserved color** for marks on Komatsu Blue or dark photo grounds only. The agent default would either spread it across the system or reject it as a third hue; both are wrong here.
- **motion** — register `kinetic-grid` is *selected* (personality trait `modular-catalogue`) but **not applied**. No motion was requested, so the canonical prototype renders static.
- **iaPriorities** (all `mutability: locked`):
  1. Equipment-category rail immediately after the hero.
  2. Routing tiles (Equipment / Parts / Attachments / Technology / Service and support).
  3. Parts "Order now" band.
  4. Get in touch with four equal paths.
  5. Section sequence verbatim.

## Improvements brief

`stardust/prototypes/en-us-improvements.md`, 5 items:
1. Hierarchy and scale (`T-hierarchy`, `T-scale`), plus the centered hero with an under-strength scrim.
2. CTA noise: 11 chip-links, 9 Roboto tag pills, three "see more" phrasings (`T-font-fork`, `T-cta-siblings`).
3. The 2010s boxed-panel stack at a uniform 32px.
4. Placeholder alts and unnamed social links (`T-img-alt-generic`, `T-link-a11y`).
5. Dormant Komatsu yellow (`T-yellow-dormant`).

## Command sequence (proposed)

1. `$stardust direct` (this command — direction and target spec written)
2. `$stardust prototype en-us` renders `stardust/prototypes/en-us-proposed.html` (one canonical direction, N = 1, surprise budget `low` under verbatim) and runs the impeccable anti-default "modernise it" sequence (`impeccable-command-map.md` § Common sequences):
   1. `$impeccable detect --json` — baseline slop scan
   2. `$impeccable shape` — brief anchored on the improvements list; anti-references = the slop list above
   3. `$impeccable distill` — one dominant action per module; chips → text links; tags → meta
   4. `$impeccable typeset` — 1.25 scale, Hero Outranks rule
   5. `$impeccable colorize` — section surface rhythm, One Band rule, reserved yellow
   6. `$impeccable critique` — verify the refresh landed without slop or IA drift
   7. `$impeccable polish` — final pass
3. `$stardust deploy` — convert the approved prototype into namespaced EDS blocks and publish at `/en-us/home-modern`. The existing `/en-us` page and shared project styles stay untouched.

## User confirmation

> Plan confirmed by the user at the Phase 1 gate (Q1 "Confident refresh", Q2 `/en-us/home-modern`). One canonical direction; no variant fan-out (N = 1).

## Assumptions defaulted in

- Audience was inferred from the captured homepage and stated in the plan, and the user did not challenge it.
- Research ran at a degraded tier (WebFetch only). The anchors are real retrieved pages but carry no token systems.
- The blue footer wordmark (`blue-logo.svg`) was not captured. The prototype references its public URL.
- CTA sibling phrasings ("Explore more" / "Learn more" / "Read more news") are kept verbatim under legacy-content-preserved and flagged for the brand team, not unified.

## Pages in scope

- `en-us` (the 1 extracted page), rendered as a copy for `/en-us/home-modern`
