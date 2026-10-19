# EDS conversion log

## 2026-10-19 — en-us-proposed.html → /en-us/home-modern (stardust:deploy Steps 1–9 + Local QA)

**Source:** `stardust/prototypes/en-us-proposed.html` (approved 2026-10-19T16:10Z, "Approve and deploy";
provenance cites `stardust/direction.md` active 2026-10-17T16:06Z; fidelity refined; copy captured-verbatim).
**Target:** `content/en-us/home-modern.plain.html` — a SEPARATE demo copy beside the live `/en-us`.
**Schema:** `stardust/eds-schema/home-modern.json` (section-schema.mjs against the prototype served on :8791).
**Runtime contract:** `stardust/runtime-contract.json` (older boilerplate vintage: `p.button-container`,
bare links buttonized, `template` metadata → body class).

### Hard constraints (user) that override Steps 3/4/6

- No existing file is modified. Foundation work is page-scoped: every token and override lives in
  `styles/home-modern.css` under `body.home-modern` (metadata `template: home-modern`), pulled in by
  `@import url('../../styles/home-modern.css')` at the top of every `hm-*` block stylesheet. No `:root`,
  no unscoped selector, no head.html / scripts / styles.css / komatsu.css edit.
- Tokens are renamed `--hm-*` so nothing inherited by the shared header/footer (which read
  `--body-font-family`, `--link-color`, …) changes on this page.
- Fonts: the site's self-hosted Noto Sans variable (wght 100–900, `styles/fonts.css`) is reused; no font
  files, no head lines. The prototype's intermediate wght positions (760/700/680/640/600/590) render on it.
- Step 6 (chrome) skipped: the shared `/nav` + `/footer` fragments and blocks stay; no nav/footer metadata.

### Step 1 — section list

`home-modern: hero, equipment-rail, routing-tiles, technology, parts-band, news, get-in-touch`
(+ site chrome header/footer, kept shared).

Fingerprint (#90, `stardust/.work/deploy/fingerprint.json`): rail dots / tabs = JS state only; news
`P.meta` differs feature vs list (structural — reproduced by position); contact tile 3 carries the
new-tab hint (reproduced for external links). Positional variants not flagged by the probe but reproduced:
bento lead tile (first tile spans 6×2), news feature 2 is portrait (span 3), news items 3–5 are the list.

### Step 2 — triage + names (LOCKED)

| Section | D1 block? | Block / content | D11 pattern | Decode tier |
|---|---|---|---|---|
| hero | yes — bespoke cinematic composition (full-bleed photo, directional scrim, lower-left copy) | `hm-hero` | hero | template-slotted |
| equipment-rail | yes — 21 repeating units + paging controls | `hm-rail` | carousel/cards | reconstructive |
| routing-tiles | yes — 5 repeating photo tiles | `hm-tiles` (bento, default) | cards | reconstructive |
| technology | yes — interactive tabs | head = default content (h2) + `hm-tech` | tabs (label \| panel per row) | reconstructive |
| parts-band | yes (🟡 D1 justified) — bespoke split band: copy on Komatsu Blue + photo bleeding to the page edge, accent rule | `hm-band` | (none — bespoke) | template-slotted |
| news | yes — 5 repeating stories, positional layout | head (h2) + `hm-news` + CTA (default content) | cards | reconstructive |
| get-in-touch | yes — 4 repeating photo tiles; SAME pattern as routing-tiles | head (h2) + `hm-tiles contact` (variant) | cards | reconstructive |

Same-pattern collapse: routing-tiles and get-in-touch are one block (`hm-tiles`) + variant `contact`
(4-up equal tiles, H3 labels). `hm-touch` was not created.

Section heads ("Technology", "Dig into the latest", "Get in touch") and the trailing "Read more news" CTA
are DEFAULT CONTENT, styled in place via `.hm-*-container .default-content-wrapper` (no reabsorption).
No section-metadata is authored on this page (blocks paint their own sections; section grounds/padding
key off `.hm-*-container`).

### Encode decisions

- Metadata: Title `Komatsu | Here's to progress`; Description = captured page description;
  `template: home-modern`; `Robots: noindex, nofollow` (demo copy, avoid duplicate-content indexing).
- Exactly one `<h1>` (hero). Tiles labels H2 (captured), contact labels H3, tech panel subtitles H3,
  news titles H3.
- Images: authored `<img>` with the larger komatsu.com renditions the user approved (Scene7 named
  presets / `?wid&hei`, AEM `cq5dam.web.1280.1280` / `cq5dam.thumbnail.319.319` renditions). The site's
  uploader rehosts source-host images into DA at upload time, so these external URLs are the authored form.
  Hero carries TWO images (desktop `:ultrawide-21x9-xl?wid=2880&hei=1234`, mobile
  `:portrait-3x4?wid=900&hei=1200`) — the art direction the prototype's `<picture><source media>` did;
  the block shows one per breakpoint and eager-loads only the visible one.
- Links: root-relative only where the page exists in this site's content tree (`/en-us`,
  `/en-us/products/equipment/dozers`, `/en-us/products/equipment/excavators`,
  `/en-us/technology/smart-construction`, `/en-us/newsroom/2026/komatsu-newberry-facility-celebrates-25-years`);
  every other target stays absolute `https://www.komatsu.com/en-us/...`; `https://mykomatsu.komatsu/`
  external.
- CTAs: "Explore more" `<em>` (secondary skin), "Learn more/Learn More", "Order now", "Read more news"
  `<strong>` (primary; the band reskins its primary to the approved solid-white inverse). Tile labels,
  rail names, tech link lists and news titles are plain links (not buttons).
- News: one row per story — picture | read time `<p>`, date `<p>`, title `<h3><a>`, tags `<ul>`. Layout is
  positional (1 landscape feature, 1 portrait feature, 3 list items; list tags visually hidden as in the
  prototype).
- Tech: one row per tab — tab label `<p>` | panel (h3, p, link `<ul>`, CTA, picture). The label is
  authored (the prototype shows it twice: tab + H3), so decorate() adds no words.

### Deliberate drops / generated chrome (recorded, not accidents)

- `<time datetime aria-label="Published on …">` in news meta: not authorable in DA; the date is plain text.
- Rail/tab/link-list arrows and the "·" meta separators are CSS `content` (chrome, empty alt), as in the
  prototype. Rail paging buttons ("Previous page", "Next page", "Go to page N") and the tablist label
  ("Select a tab") are aria-label chrome generated by block JS (captured strings; not visible text).
- External links (`mykomatsu.komatsu`) get `target=_blank rel=noopener` plus the prototype's hidden
  "opens in a new tab" announcement (sr-only inside the band CTA; `hidden` + `aria-describedby` on the
  contact tile) — a11y chrome tied to the behaviour the block adds.
- Prototype site header/footer, skip link, search disclosure: not converted (shared chrome kept).

### Chrome decision (Step 6 replaced)

Shared `/nav` + `/footer` fragments and the existing `header`/`footer` blocks are kept unchanged. The
transparent-over-hero look matters for the campaign hero, and the header block already has that mode
(`header.header-overlay`) but only switches it on when the first section holds `.hero-banner`. So
`home-modern.css` repeats the same declarations under `body.home-modern > header` (absolute, transparent,
z-index 100). It also hides `body.home-modern > nav.breadcrumb`: the header block adds a URL breadcrumb
("Home > Here's to progress") on every non-home path, the live `/en-us` shows none, and on this page it
would sit under the transparent header as a white strip. Both rules apply only when the page
carries `template: home-modern`; no other page is affected.

### Final block inventory

| Block | Tier | Rows | Notes |
|---|---|---|---|
| `hm-hero` | template-slotted | 1 (images \| copy) | 2 art-directed images, visible one eager + fetchpriority high |
| `hm-rail` | reconstructive | 21 (picture \| label link) | card-as-link (EW6), scroll-snap, arrows + dots paging |
| `hm-tiles` | reconstructive | 5 / 4 (picture \| heading link) | default = bento (lead 6×2), variant `contact` = 4-up |
| `hm-tech` | reconstructive | 3 (label \| panel) | ARIA tabs on role=tab divs (EW7), 2-col link list |
| `hm-band` | template-slotted | 1 (copy \| picture) | Komatsu Blue band, accent rule, solid-white inverse CTA |
| `hm-news` | reconstructive | 5 (picture \| meta, title, tags) | positional: feature, portrait feature, 3-item list |

Page foundation: `styles/home-modern.css` (tokens `--hm-*`, header overlay, breadcrumb hide, section
scaffold reset, grounds/rhythm per `.hm-*-container`, section-head type, button skin, sr-only, EW edit-mode
repaint, reduced motion) — every selector starts `body.home-modern`.

Global rules neutralised (only under `body.home-modern`): komatsu.css `main > .section` margin and
1900px/52px inner column; styles.css `main > .section` margin/min-height, `@media (max-width:1024px) main
.section {padding:0}`; komatsu.css centred `.default-content-wrapper > h2`; `main a.button` Komatsu skin;
styles.css `a::after` icon-font chevron (reset inside tile/news/link-list anchors); global `main picture`
position/overflow (set per block); `main p/ul/li` margins + list padding (set per block). The runtime
keeps the authored `<em>` around `a.button.secondary` → the page skin sets `font-style: normal`.

### Gates (2026-10-19)

- davids-model-lint: PASS — 0 🔴, 0 🟡.
- block-roundtrip (`--ew` default, 6 blocks, `--map` to the prototype sections): ✓ closed, 0 structural 🔴;
  EW editable 75/75, dead 0, duplicated 0. Advisories: hero IMG COUNT 2 vs 1 (intentional art direction);
  news list-item tags authored as `<ul>` vs the prototype's comma string (same words, 🟡 MISSING/EXTRA BODY).
- ew-editability-probe `--simulate-editor`: 75/75 editable; editDrift 0 and block Δh 0 on every block;
  `drift` column 1 on hm-band only.
- qa-gate (local render, `--schema`, `--design DESIGN.json`, `--full-bleed hm-hero,hm-band`): PASS 32/0/0
  (cap 1920 holds at 2560).
- Token completeness: every `var(--hm-*)` in `blocks/hm-*/*.css` + `styles/home-modern.css` is defined;
  no non-`--hm-` custom property referenced.
- ESLint + stylelint clean on all new files.
- Regression: `/content/en-us`, `/content/en-us/products/equipment/excavators`,
  `/content/en-us/products/equipment/dozers/crawler-dozers/d71exi-24` render, all blocks `loaded`, 0
  pageerrors, 0 broken images (the only console error, `/placeholders.json` 404, predates this work and
  shows on every page). `git diff --stat` touches only `stardust/status.jsonl` (ledger).

### Site-specific notes for the next person

- The local dev server only consumes a metadata block written on ONE line (no whitespace between rows).
  It keeps key case, so `template`/`robots` are authored lowercase (`getMetadata('template')` reads
  `meta[name="template"]`). Locally `<title>` falls back to the h1; the real pipeline uses Title.
- The dev server cannot render the enveloped `<body><main>` form that the gates read. Pre-handoff QA
  ran on `stardust/.work/deploy/make-preview.mjs` (head.html + metadata → head), and post-handoff on
  `http://localhost:3000/content/en-us/home-modern`.
- Playwright could not be symlinked into the project (sandbox refuses links that point outside it). Probes
  import it by absolute path from the stardust plugin tree; plugin scripts resolve their own.
- Open (advisory): `<time>`/"Published on" a11y label lost on news dates; hm-band reports `drift` 1 in the EW probe
  (likely the sr-only new-tab hint appended inside the CTA link; editDrift 0); WebP/format params on Scene7 deferred
  (prototype audit P2); the local `<title>` quirk above.
