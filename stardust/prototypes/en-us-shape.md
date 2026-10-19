<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-10-17T16:12:15Z
  page:             en-us
  pageUrl:          https://www.komatsu.com/en-us
  againstDirection: stardust/direction.md (Active 2026-10-17T16:06:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/en-us.json
    - stardust/current/pages/en-us.html
    - stardust/current/_brand-extraction.json
    - stardust/current/assets/screenshots/en-us-thumb.png
    - stardust/current/assets/screenshots/en-us-thumb-2640.png
    - stardust/direction.md
    - stardust/prototypes/en-us-improvements.md
    - DESIGN.md
    - DESIGN.json
    - PRODUCT.md
  stardustVersion:  0.29.1
-->
---
slug: en-us
url: https://www.komatsu.com/en-us
register: brand
surprise: low
dominantDimension: register/product-program-grid
variant: A (N = 1, single canonical direction)
iaFidelity: verbatim
motion: static
deployPath: /en-us/home-modern
---

# Page shape: en-us

> **Brief CONFIRMED by the user (2026-10-19):** "Yes, build it".
> **Open question 2 resolved by the user:** "Use larger versions" — the same
> Komatsu Scene7/AEM delivery assets (same asset IDs) are requested at higher
> resolution via larger named Scene7 presets (e.g. `:photo-3x2-lg` /
> `:photo-3x2-xl`) or the captured preset plus an aspect-preserving
> `?wid=…&hei=…` pair (e.g. hero `:ultrawide-21x9-xl?wid=2880&hei=1234`,
> `:portrait-3x4?wid=900&hei=1200`). Classification: direction-authorized
> (user decision). Never `?wid=` alone on a preset (Scene7 then distorts the
> aspect: `:ultrawide-21x9-xl?wid=2880` returns 2880×822).
> **Other open questions (1, 3, 4, 5, 6):** keep the brief defaults below.

**Deployment note (record only, not a design input).** The approved prototype
becomes a separate EDS page at `/en-us/home-modern` built from namespaced
blocks. Nothing in the existing site changes: `/en-us`, the shared `styles/`,
and the existing `blocks/` stay as they are.

**Tier reading.** `surprise: low` (capped by `ia-fidelity: verbatim`). No
bank move is applied. `low` here means brand-faithful, all five improvements
applied, and full signature preservation: the lunar "Here's to progress"
campaign image, the cut-out equipment rail, the text tabs, the one Komatsu
Blue band and the 4px photo-tile motif. Hierarchy, air and surface rhythm do
the modernizing. The page must not read as a plain type-hero on a flat ground.

## Sections (in render order)

Section sequence and content beats are identical to the capture:
header → hero → equipment rail → routing tiles → Technology tabs → Parts band
→ news → Get in touch → footer. Copy is verbatim unless marked otherwise.
Literal copy and its classification are listed in
`_provenance.voiceClassification`.

1. **header** (system-component role: `header`). Site chrome over the
   hero photo, transparent ground, not sticky, scrolls away with the hero.
   White wordmark `logo.svg` (alt "Komatsu") at the left. Primary nav in
   Button type, Daylight: Products · Services · Technology · Company. Utilities
   at the right, kept as the captured icon set: Search (icon button,
   aria-label "Search", reveals the synthesized Search Input with placeholder
   "Search" and a "Close search" control), Locations (icon, aria-label
   "Locations"), Worldwide US (text and icon), My Account (MyFleet icon, sr-only
   "opens in a new tab"). Hover and active states use a 2px Daylight underline
   at a 6px offset. Focus is a 2px Komatsu Yellow ring, because the header
   sits on a dark photo ground (improvement 5). Below 900px a hamburger
   ("Open navigation menu") opens a slide-in Daylight panel ("Close navigation
   menu") with the blue wordmark, 18px Komatsu Blue labels and focus trapped
   inside the panel.
2. **hero** (role: `campaign-hero`). This is the signature section.
   Full-bleed `<picture>`: Scene7 `:ultrawide-21x9-xl` on desktop, the same
   asset at `:portrait-3x4` below 900px, and the DAM PNG as the fallback.
   Height is `min(700px, 78svh)` on desktop, so the rail's top edge
   still enters the 1440×900 first viewport (iaPriority 1). The headline
   block is **left-anchored in the lower-left** of the 12-column grid (cols
   1–7) and replaces the captured centered stack. It holds the H1 "Here's to
   progress" in Display (39→61px, 700, −0.02em), the lede (body[0]) in Lede
   type at a 60ch max, and one Secondary Button "Explore more". There is no
   second CTA. A directional Photo scrim runs from the lower left (Track
   Steel 0.78 → 0.40 → transparent). It must bring the headline and lede
   area to at least 4.5:1, replacing the captured 0.375 peak (improvement 1).
   Alt text is derived from the captured visual description (improvement 4).
3. **equipment rail** (role: `category-rail`). This is a signature module
   on `daylight`. It holds all 21 captured categories in captured order, as
   cut-out images on white with no card chrome and a Label-type name below
   each. The captured h6 names are demoted to non-heading labels inside the
   link. The visible text stays verbatim, and the change fixes the
   h1→h6 skip. Desktop shows 7 per page (3 pages, captured), with more image
   height than the captured 174px. The row is a CSS scroll-snap track with
   4px square Komatsu Blue arrow buttons ("Previous page" / "Next page") and
   pill dots ("Go to page 1–3"). The active dot is Komatsu Blue. The
   captured 10×10 yellow control is not carried, because yellow is forbidden
   on white (improvement 5). Top padding sits at the 40px floor so the row
   stays at the first-viewport edge. At ≤ 899px the row becomes a swipe
   row with a visible peek of the next item, and the dots are hidden.
4. **routing tiles** (role: `routing-tiles`) on `yard-gray`. This keeps the
   captured 1 + 4 bento: the Equipment lead tile spans 6 cols × 2 rows, and
   Parts, Attachments, Technology and Service and support take 3 cols each
   in a 2×2 grid. All five sit on the shared square-module grid with 24px
   gutters. Each tile is one whole-tile link (Photo Tile component, 4px,
   tile-rest → tile-lift). Its label sits bottom-left in Title type on the
   Photo scrim, replacing the captured raw white-on-photo labels. The
   captured tile H2s are retained because the capture has no section title,
   and verbatim forbids inventing one. Grids reflow to 2 columns at ≤ 899px
   and to 1 column at ≤ 449px.
5. **technology** (signature Tabs) on `daylight`. The H2 "Technology" is
   left-aligned on the grid (captured centered h3, promoted, improvement 3).
   Text tabs (Smart Construction · Smart Mining · Smart Quarry, tablist
   aria-label "Select a tab") sit on a 1px Grade Line rule with a 3px Survey
   Blue active indicator. The panel is a split: copy in cols 1–6, photo in
   cols 7–12 (4px). The copy holds the H3 panel heading in Subtitle type,
   body copy at a 70ch max, and the product links as a **plain two-column
   text-link list** with trailing arrows (11 / 4 / 2 links, all verbatim).
   The chips are retired (improvement 2). Each panel has one Primary Button.
   At ≤ 899px the photo stacks under the copy, the list goes to 1 column,
   and the tablist scrolls horizontally.
6. **parts band** (role: `cta-band`). This is the one Komatsu Blue section
   ground (One Band Rule). It is full-bleed. Copy sits in cols 1–5: one short
   Komatsu Yellow accent rule (a 48×4px horizontal mark above the headline,
   not a side stripe), the H2 "Parts purchasing made easy" in Headline type,
   Daylight, the body copy, and one Inverse Button "Order now" (sr-only
   "opens in a new tab"). Hover fills Komatsu Yellow with Track Steel text,
   and focus is a Yellow ring (improvement 5). The captured Parts photo
   bleeds to the right page edge in cols 7–12 instead of sitting in a boxed
   panel. At ≤ 899px the photo stacks above the copy.
7. **news** ("Dig into the latest") on `yard-gray`. The H2 is left-aligned.
   It keeps the captured asymmetric grid: feature card 1 (Newberry, 6 cols),
   feature card 2 (Powering progress, 3 cols, portrait), and a 3-item list
   (3 cols) with thumbnails. The feature cards are whole-card links with the
   H3 in Title type on the Photo scrim. The meta line reads "3 min read ·
   Oct 5, 2026" plus topic tags as inline Meta text, middot-separated, with no
   pills, no Roboto, and a 2-line clamp. The full tag list stays in markup
   (improvement 2). The list items use an H3 in Subtitle type and a meta line
   (read time · date). Their tags stay in markup but visually hidden, as in
   the capture. Dates keep the captured aria-label "Published on …". One
   Primary Button "Read more news" closes the module. News image alts are
   empty because the headline sits adjacent (improvement 4).
8. **get in touch** (role: `contact-router`) on `daylight`. The H2 "Get in
   touch" is left-aligned (captured centered title, promoted). It holds four
   equal Photo Tiles (3 cols each) on the same column lines as the bento:
   Contact us · Request a quote · My Komatsu · Find a location, with H3
   labels in Title type on the scrim. There is no extra button. The tile is
   the action (iaPriority 4). Grids reflow to 2 × 2 at ≤ 899px and to 1 column
   at ≤ 449px.
9. **footer** (role: `footer`) on `site-ground` #fafafa, with a 1px Grade
   Line top rule. Four link columns, Discover · Tools · Company · Connect,
   with H2 headings in Label type and links in Cab Slate with the captured →
   glyph. The brand block holds the blue wordmark (alt "Komatsu"), the
   one-line description, "Global corporate website", and three social icon
   links with destination names (improvement 4). The legal row is a wrapped
   inline list of all 10 captured links, followed by the copyright line.
   Columns reflow 4 → 2 → 1. They do not collapse to accordions, so the
   legal surface stays visible.

## Layout strategy

- **Grid:** a 12-column fluid content grid with 24px gutters. Outer margins
  are 24 / 32 / 48px (mobile / tablet / desktop). Module content inherits
  the captured 1920px cap, and the shell stays fluid. Running text is bounded
  by measure (lede 60ch, body 70ch), not by container width.
- **Rhythm:** balanced tier. Section padding is 64 / 48 / 32px, with a
  desktop band of 40–64px because the hard floor fired (7 modules). The rail
  uses the 40px floor on top to hold iaPriority 1. Each headline sits 24px
  (mobile) to 32px (desktop) above its module content.
- **Square-module discipline:** the bento, news and contact tiles share
  the same 12-column lines (6 / 3 / 3 splits), so the page reads as one
  engineered system. This is the low-teeth translation of the rolled
  "Cross-stitch sampler" craft.
- **Surfaces (top → bottom):** photo (header + hero) → daylight (rail) →
  yard-gray (tiles) → daylight (Technology) → komatsu-blue (Parts) →
  yard-gray (news) → daylight (Get in touch) → site-ground (footer). The
  daylight / yard-gray alternation counts as one light-neutral substrate, a
  tonal step only. See `_provenance.substrateTransitions`.
- **Type:** 1.25 scale only. Display is for the H1 only. Headline is for
  every section H2. Title is for tile and feature-card labels. Subtitle is
  for panel H3s and list headlines. The Hero Outranks Rule holds at every
  width: 39 vs 31px at 390 and 61 vs 39px at 1440.
- **Breakpoints:** 449 / 899 / 1279 (captured). Desktop-first. Grids reflow
  4/3 → 2 at ≤ 899px and → 1 at ≤ 449px. The hero switches to the 3:4
  rendition at ≤ 899px, with the headline block kept bottom-left.
- **Static:** no entrance motion, autoplay or parallax. The only
  transitions are 200ms ease-out hover and focus state changes (motion
  register `kinetic-grid` is selected but not applied). `prefers-reduced-motion`
  removes smooth scrolling from the rail and tabs.

## Key states

- **Default:** the Smart Construction tab is active, the rail is at page 1
  ("Previous page" disabled), and the header search is collapsed.
- **No-JS:** all three tab panels render stacked under their H3s, the rail
  stays a native horizontal scroll row (arrows hidden, dots hidden), and the
  search button links to the site search. Nothing is hidden without a path
  to it.
- **Image failure:** the hero falls back to the DAM PNG
  (`…/brand/campaigns/Screenshot%202026-07-30%20103344.png`). The headline
  block keeps a Track Steel ground behind the scrim, so the H1 stays legible
  if the photo fails.
- **Loading / Error / Empty:** N/A (static page, all content captured).

## Interaction model

- **Header:** the nav links go to their captured hrefs. "Company" (captured
  `href="#"`, a megamenu trigger whose panel was not captured) renders as a
  nav item that does not navigate (see Open questions). Search expands an
  inline 48px input, and "Close search" collapses it. "My Account" and the
  "My Komatsu" links open in a new tab, with the captured sr-only suffix.
- **Rail:** the arrows scroll one page (7 items desktop) with
  `scroll-snap-type: x mandatory`. The dots jump to a page. Each category
  is one link to its captured `/en-us/products/equipment/<slug>` URL.
  Keyboard: Tab moves through the items, and the arrows are buttons.
- **Tabs:** this follows the WAI-ARIA tabs pattern (`role=tablist` / `tab` /
  `tabpanel`, arrow keys plus Home and End) with a small
  progressive-enhancement script. There is no transition on panel swap.
- **Tiles and cards:** each one is a single link with a focus-visible ring
  around the whole tile. The ring is 2px Boom Blue on light sections and
  2px Komatsu Yellow inside the Parts band.
- **Parts band:** "Order now" goes to `https://mykomatsu.komatsu/`
  (new tab).
- **Footer:** the social links open in a new tab with destination names.
  The legal links keep their captured hrefs.

## Data attributes

```
header[data-section="header"][data-intent="navigate"][data-layout="overlay-transparent"][data-system-component="header"]
section[data-section="hero"][data-intent="primary-action"][data-layout="full-bleed-lower-left"][data-items="1"][data-system-component="campaign-hero"]
section[data-section="equipment-rail"][data-intent="route-category"][data-layout="scroll-rail-7"][data-items="21"][data-system-component="category-rail"]
section[data-section="routing-tiles"][data-intent="route-offer"][data-layout="bento-1-4"][data-items="5"][data-system-component="routing-tiles"]
section[data-section="technology"][data-intent="explore"][data-layout="tabs-split-6-6"][data-items="3"]
section[data-section="parts-band"][data-intent="conversion"][data-layout="band-split-5-7"][data-items="1"][data-system-component="cta-band"]
section[data-section="news"][data-intent="editorial-feed"][data-layout="feature-2-list-3"][data-items="5"]
section[data-section="get-in-touch"][data-intent="contact"][data-layout="grid-4"][data-items="4"][data-system-component="contact-router"]
footer[data-section="footer"][data-intent="navigate"][data-layout="mega-4-col-brand"][data-system-component="footer"]
```

Surface hook: each section also carries `data-surface="photo|daylight|yard-gray|komatsu-blue|site-ground"`.

## Unsourced content (placeholder list)

(none). Every heading, paragraph, label, link, date, read time, tag and
image comes from `pages/en-us.json` or the rendered DOM `pages/en-us.html`.
The Smart Mining and Smart Quarry panel copy, links and images were in
hidden tab panels, so they are read from `en-us.html`. No stats, quotes,
logos or prices are added. The direction-authorized rewrites (alts, social
accessible names) are listed in `_provenance.voiceClassification`. They are
not placeholders.

## Open questions for craft

1. **"Learn More" casing.** The Smart Mining and Smart Quarry panels capture
   "Learn More" (capital M), while Smart Construction has "Learn more". This
   is kept verbatim (legacy-content-preserved) and flagged for the brand
   team, together with the "Explore more / Learn more / Read more news"
   sibling inconsistency.
2. **Rail image density.** The captured rail URLs use the `:photo-3x2-sm`
   preset (260×174). Displayed larger, they will be soft at 2× density.
   The default is the captured URL. Swapping to the same asset's
   `:photo-3x2-md` preset needs sign-off because it is not the captured URL.
3. **"Company" nav.** The megamenu panel was not captured. The option is to
   render it as a non-navigating item, or to point it to `/en-us/about`
   (the footer "About us" target). The default is the first, to avoid
   inventing IA.
4. **"Privacy notice for California residents"** is in the footer legal
   row of the rendered DOM and visible in the screenshot, but absent from
   `en-us.json` body/ctas. It is included from `en-us.html`.
5. **Parts band image alt.** The captured value is "alt text", and no
   description of the image was captured. It is rendered as decorative
   (`alt=""`) because the adjacent copy carries the meaning. The brand team
   may supply a descriptive alt at migrate.
6. **Copyright year.** The source authors `{{YEAR}} Komatsu America Corp. All
   rights reserved.`, so the year is a runtime token. The prototype renders
   the captured output "2026". Deploy should keep the year dynamic.

## Provenance (`_provenance`)

Propagates into `en-us-proposed.html`'s provenance block at render.

```yaml
_provenance:
  surprise: low            # capped: direction.md § Movements ia-fidelity verbatim
  surpriseMoves: []        # low tier applies no bank move
  improvementsApplied:     # stardust/prototypes/en-us-improvements.md, all 5
    - item: 1 (hierarchy · T-hierarchy, T-scale, hero scrim)
      sections: [hero, technology, parts-band, news, get-in-touch]
      how: 1.25 scale; Display H1 39→61 outranks Headline H2 31→39 at every width; hero block lower-left over directional scrim ≥ 4.5:1; single "Explore more"
    - item: 2 (CTA noise · T-font-fork, T-cta-siblings)
      sections: [technology, news]
      how: 11 + 4 + 2 chip-links → two-column text-link lists; 9 Roboto tag pills → inline Meta text, 2-line clamp, full list in markup; one action per module; labels verbatim, sibling inconsistency flagged (Open question 1)
    - item: 3 (boxed-panel stack)
      sections: [all body sections]
      how: full-width sections, 64/48/32 padding, daylight/yard-gray alternation, single Komatsu Blue band, left-aligned headlines on the shared grid
    - item: 4 (a11y · T-img-alt-generic, T-link-a11y)
      sections: [header, hero, news, parts-band, footer]
      how: hero alt from captured visual; news alts empty (headline adjacent); logos "Komatsu"; social links "Komatsu on Facebook/Instagram/YouTube (opens in a new tab)"; parts image decorative
    - item: 5 (dormant yellow · T-yellow-dormant)
      sections: [header, hero, parts-band]
      how: yellow focus rings on photo/blue grounds; inverse-button hover fill (Track Steel text); one 48×4 accent rule on the Parts band; never on white; ≤ 2 per viewport; captured yellow carousel control → Komatsu Blue dot

  capturedSourceLineage:
    - section: header
      origin: "site-wide system-component (carried from DESIGN.json#extensions.systemComponentRoles.header + pages/en-us.json#ctas[0..6] + en-us.html header.experiencefragment.header-xf; _brand-extraction.json#systemComponents is empty for this 1-page crawl, so chrome is lifted from the page record and #voice.navItems / #voice.utilityNav)"
    - section: hero
      origin: "campaign-hero (from _brand-extraction.json#voice.heroImage + #voice.heroHeadline/heroSubcopy/primaryCTALabel; pages/en-us.json#media.imgs[11], #ctas[7]; #motifs.patterns[hero-with-image])"
    - section: equipment-rail
      origin: "category-rail (from pages/en-us.json#ctas[8..14] + #media.imgs[12..32]; en-us.html h6 × 21; #motifs.patterns[product-carousel])"
    - section: routing-tiles
      origin: "routing-tiles (from pages/en-us.json#headings[h2 Equipment..Service and support] + #ctas[15..19] + #media.imgs[33..37]; #motifs.patterns[bento-tile-grid])"
    - section: technology
      origin: "tabbed-feature (from pages/en-us.json#headings[h3 Technology, h2 Smart Construction] + #body[1..4] + #ctas[20..32] + #media.imgs[38]; Smart Mining / Smart Quarry panels from en-us.html hidden tabpanels; #motifs.patterns[tabbed-feature])"
    - section: parts-band
      origin: "cta-band (from pages/en-us.json#headings[h2 Parts purchasing made easy] + #body[5] + #ctas[33] + #media.imgs[39]; #motifs.patterns[split-promo-band])"
    - section: news
      origin: "news-grid (from pages/en-us.json#headings[h2 Dig into the latest, h3 × 5] + #ctas[34..39] + #media.imgs[40..44]; en-us.html aria-label 'Published on …'; #motifs.patterns[news-grid])"
    - section: get-in-touch
      origin: "contact-router (from pages/en-us.json#body['Get in touch'] + #headings[h2 Contact us..Find a location] + #ctas[40..43] + #media.imgs[45..48]; #motifs.patterns[image-tile-cta-row])"
    - section: footer
      origin: "site-wide system-component (carried from DESIGN.json#extensions.systemComponentRoles.footer + pages/en-us.json#headings[h6 × 4] + #ctas[44..77] + #body[footer] + #media.imgs[49..52]; en-us.html legal row; #motifs.patterns[footer-mega])"

  antiTemplatePass:
    - pattern: page silhouette (hero → module stack)
      defaultReflex: hero-then-bands silhouette
      alternatives: [single-substrate band stack in new tokens, document-shape re-sequence (refused under verbatim), tonal-rhythm stack on one square-module grid with one saturated break]
      picked: tonal-rhythm stack on one square-module grid with one saturated break
      rationale: "Captured order is locked (DESIGN.json#iaPriorities[4], mutability locked); the silhouette is the brand's own, so differentiation is in rhythm — shared 6/3/3 column lines, daylight/yard-gray step, the One Band."
    - pattern: hero composition
      defaultReflex: centered-stack hero (captured) / two-button CTA pair
      alternatives: [centered stack re-tokenized (captured-shape mirror), lower-left anchored block on full-bleed photo with directional scrim, split text-panel beside a cropped photo]
      picked: lower-left anchored block on full-bleed photo with directional scrim
      rationale: "Keeps the lunar campaign image whole at its captured position (_brand-extraction.json#voice.heroImage); the split crops the signature; improvements #1 names lower-left + ≥ 4.5:1; one CTA only (#voice.primaryCTALabel)."
      reference: "Volvo CE US homepage (direction.md § Anchor references) — section-distributed CTAs, no hero CTA stack"
    - pattern: equipment carousel
      defaultReflex: carded product carousel / 5-up image-card grid as category nav
      alternatives: [captured carousel mirror-translated, chrome-less cut-out rail with taller images and Label names, full 21-item static index (McMaster-style ledger)]
      picked: chrome-less cut-out rail with taller images and Label names
      rationale: "Rail shape kept because it IS the brand signature (DESIGN.md § Equipment rail; yellow machines on white) and iaPriority 1 is locked; the 21-item index would push routing tiles out of the first two viewports."
      reference: "McMaster-Carr (plain functional labels), direction.md § Anchor references"
    - pattern: routing tiles (bento)
      defaultReflex: 5-up equal image-card grid
      alternatives: [5 equal tiles in one row, 1 lead + 2×2 on the square-module grid with scrimmed Title labels, lead tile + 4-row text ledger with thumbnails]
      picked: 1 lead + 2×2 on the square-module grid with scrimmed Title labels
      rationale: "DESIGN.json#iaPriorities[1] preserveAs 'lead tile + equal secondary tiles; all five destinations' (locked); the ledger would drop 4 captured photo positions (image-reuse contract)."
    - pattern: Technology tabbed feature
      defaultReflex: pill tabs + bordered chip-button cluster
      alternatives: [captured chips re-tokenized, text tabs on a rule + split panel with two-column text-link list, three stacked program accordions]
      picked: text tabs on a rule + split panel with two-column text-link list
      rationale: "Captured 12 bordered targets in one panel (improvements #2); accordions change the captured tab beat; the text-link list follows Liebherr's product-program grid (direction.md anchors)."
      reference: "Liebherr US — product program as simple text-link grid"
    - pattern: Parts CTA band
      defaultReflex: centered headline + button full-bleed CTA band
      alternatives: [captured boxed blue panel + photo, full-bleed blue band with copy left and photo bleeding to the page edge, photo full-bleed with blue overlay card]
      picked: full-bleed blue band with copy left and photo bleeding to the page edge
      rationale: "Keeps the captured split (#motifs.patterns[split-promo-band]) and the One Band Rule; a blue overlay on photo muddies the band and the Yellow-on-Blue accent."
    - pattern: news grid
      defaultReflex: 3-up equal cards with pill tags
      alternatives: [equal 3-up / 5-up cards, captured asymmetric 2 features + 3-item list with tags as Meta, single lead story + 4-item list]
      picked: captured asymmetric 2 features + 3-item list with tags as Meta
      rationale: "Verbatim beats: both captured features (Newberry, Powering progress) stay featured; the single-lead option demotes one. Tags → Meta per improvements #2."
    - pattern: Get in touch tiles
      defaultReflex: 4-up equal photo-card row
      alternatives: [4 equal photo tiles (captured), 4 arrow text rows, 4 photo tiles locked to the bento column lines with scrimmed H3 labels]
      picked: 4 photo tiles locked to the bento column lines with scrimmed H3 labels
      rationale: "Default reach justified: DESIGN.json#iaPriorities[3] 'four paths at equal weight' (locked) + image-reuse contract (4 captured photos); differentiation is grid alignment and legibility, not shape."
    - pattern: header utilities
      defaultReflex: nav-icon glyphs (search / account) in a typographic register
      alternatives: [icon-only utilities, text-only utilities, captured icon set with accessible names + visible "Worldwide US"]
      picked: captured icon set with accessible names + visible "Worldwide US"
      rationale: "Icons are captured brand chrome (pages/en-us.json#media.imgs[1..3] Location / MyFleet SVGs; aria-labels 'Search', 'Locations'); kept, not added."
    - pattern: footer
      defaultReflex: serial footer / accordion-collapsed footer
      alternatives: [captured 4 columns + brand block, accordion columns on mobile, 4 columns + brand block with wrapped inline legal row]
      picked: 4 columns + brand block with wrapped inline legal row
      rationale: "#motifs.patterns[footer-mega]; legal disclosures carried verbatim and visible (systemComponentRoles.footer constraint) — accordions would hide them."

  substrateTransitions:
    default: light-neutral (daylight #ffffff / yard-gray #f4f5f5 tonal alternation; site-ground #fafafa footer — one ground family, tonal step only, per DESIGN.md § Layout)
    exceptions:
      - section: header + hero
        substrate: photographic (lunar campaign image under Track Steel scrim)
        purpose: "carries the 'Here's to progress' campaign signature at its captured position"
      - section: parts-band
        substrate: komatsu-blue #140a9a
        purpose: "the single saturated rhythm break that marks the parts-ordering conversion moment (One Band Rule)"
    note: "2 exceptions — within the Discipline 4 cap; no substrate-keyed document-shape at surprise low."

  signatureElements:
    - kind: signature hero visual (campaign photograph; heroMedium null)
      capturedSource: "_brand-extraction.json#voice.heroImage — s7d9.scene7.com/is/image/komatsu/Screenshot%202026-07-30%20103344 (:ultrawide-21x9-xl / :portrait-3x4)"
      mechanism: "full-bleed <picture> at hero position, lower-left headline block, directional Track Steel scrim ≥ 4.5:1"
      fallback: "DAM PNG fallbackUrl; Track Steel ground behind the headline block if the image fails"
    - kind: signature module (equipment rail of cut-outs on white)
      capturedSource: "#motifs.patterns[product-carousel]; DESIGN.md § Equipment rail (signature)"
      mechanism: "scroll-snap rail, 21 items, no card chrome, square blue arrows + pill dots"
      fallback: "native horizontal scroll without JS; arrows/dots hidden"
    - kind: signature module (text tabs)
      capturedSource: "#motifs.patterns[tabbed-feature]; DESIGN.md § Tabs (signature)"
      mechanism: "ARIA tabs, 3px Survey Blue indicator on Grade Line rule"
      fallback: "no-JS: three panels stacked under their H3s"
    - kind: site-wide motif (4px corners + photo tiles with scrimmed labels; one Komatsu Blue band)
      capturedSource: "#motifs.borderRadius.primary 4px (113 occurrences); #motifs.shadows[0]; #motifs.patterns[bento-tile-grid, image-tile-cta-row, split-promo-band]"
      mechanism: "rounded.sm on every tile/image/button; tile-rest → tile-lift; band once"
      fallback: "n/a (static CSS)"
```

### Heading hierarchy (Discipline 5)

H1 × 1: "Here's to progress" (hero). H2 per section: the routing-tile
labels (captured H2s, since the section has no captured title), "Technology",
"Parts purchasing made easy", "Dig into the latest", "Get in touch", and the
footer column headings. H3 children: the 3 tab-panel headings, the 5 news
headlines, and the 4 contact-tile labels. Rail names are not headings
(the captured h6 skip is fixed).

```yaml
  voiceClassification:   # continues _provenance; source = pages/en-us.json unless noted
    - section: header
      classification: captured-verbatim
      copy: ["Products", "Services", "Technology", "Company", "Worldwide US", "My Account", "opens in a new tab", "Search", "Close search", "Locations", "Open navigation menu", "Close navigation menu"]
      source: "#ctas[0..6]; en-us.html aria-labels + search placeholder"
    - section: header
      classification: direction-authorized rewrite
      copy: ["Komatsu"]   # logo alt, was "Company Logo" / "logo"
      source: "improvements #4"
    - section: hero
      classification: captured-verbatim
      copy: ["Here's to progress", "For more than a century, Komatsu has helped build the world beneath our feet. Now, we're helping imagine how people could one day build beyond it.", "Explore more"]
      source: "#headings[0], #body[0], #ctas[7]"
    - section: hero
      classification: direction-authorized rewrite
      copy: ["Komatsu haul trucks on a lunar surface with Earth rising behind"]   # alt, was "Background Image"
      source: "_brand-extraction.json#voice.heroImage.visual; improvements #4"
    - section: equipment-rail
      classification: captured-verbatim
      copy: ["Blasthole drills", "Crushing", "Dozers", "Draglines", "Electric rope shovels", "Entry development", "Excavators", "Forestry", "Forklifts", "Hard rock continuous miners", "Industrial minerals equipment", "Longwall", "Machine tools", "Motor graders", "Room and pillar", "Shaft sinking equipment", "Trucks", "Underground hard rock bolters", "Underground hard rock drills", "Underground hard rock haulage", "Wheel loaders", "Previous page", "Next page", "Go to page 1", "Go to page 2", "Go to page 3"]
      source: "en-us.html h6 × 21 + carousel aria-labels; image alts verbatim from #media.imgs[12..32]"
    - section: routing-tiles
      classification: captured-verbatim
      copy: ["Equipment", "Parts", "Attachments", "Technology", "Service and support"]
      source: "#headings h2; image alts verbatim from #media.imgs[33..37]"
    - section: technology
      classification: captured-verbatim
      copy: ["Technology", "Select a tab", "Smart Construction", "Smart Mining", "Smart Quarry",
             "Our industry is on the cusp of rapid change and innovation — where advanced automation and integrated technologies intersect. Use these Smart Construction solutions to harness technology for accurate data, comprehensive reporting and remote capabilities.",
             "3D Machine Guidance", "3D Machine Guidance Flex", "Base / rover", "Dashboard", "Design", "Drone", "Field", "Fleet", "Intelligent Machine Control", "Office", "Remote", "Learn more",
             "See how our smart mining approach delivers Customer Success Programs that drive more value for your operations. Whether your needs begin at the task, process or enterprise optimization level, we equip you with the technology, scalable solutions and flexible support you need to meet your business goals.",
             "Drilling and blasting", "Loading and haulage", "Asset management", "Modular ecosystem", "Learn More",
             "Let Smart Quarry consultants do the heavy mental lifting for you. With minimal impact to your day and operation, Smart Quarry will assess the needs of your job site and recommend the best fleet to help meet your current and future production goals. Using expertise in digital solutions, Smart Quarry will help connect you with the right tools to better understand, track and optimize your mobile equipment. Together, this can result in a lower unit cost for improved bottom line.",
             "Site", "Study", "Learn More"]
      source: "#headings, #body[1..4], #ctas[20..32]; Smart Mining / Smart Quarry panels + images (alts 'Smart mining', 'Smart Quarry') from en-us.html; SC photo alt 'Smart Construction drone flying'"
    - section: parts-band
      classification: captured-verbatim
      copy: ["Parts purchasing made easy", "Order Komatsu Genuine and Reman parts through My Komatsu, with options to pick up at your Komatsu dealer or direct delivery.", "Order now", "opens in a new tab"]
      source: "#headings, #body[5], #ctas[33]"
    - section: parts-band
      classification: direction-authorized rewrite
      copy: [""]   # decorative alt, was "alt text"
      source: "improvements #4 (no captured description; Open question 5)"
    - section: news
      classification: captured-verbatim
      copy: ["Dig into the latest", "3 min read",
             "Oct 5, 2026", "Komatsu’s Newberry facility celebrates 25 years of manufacturing, teamwork and continuous improvement", "Press release", "Construction", "Company",
             "Sep 17, 2026", "Powering progress responsibly: Inside Komatsu electrification", "Operational efficiency", "Smart Construction", "Forestry", "Discover Komatsu", "Underground hard rock mining", "Surface mining", "Underground soft rock mining", "Blog",
             "Sep 16, 2026", "Komatsu launches “The future you build starts here” campaign", "Career development", "Distributors",
             "Sep 10, 2026", "Komatsu celebrates grand opening of new Edmonton parts distribution center", "Parts",
             "Sep 4, 2026", "Redefining presence: How teleoperation is changing work in heavy industry", "Innovation and technology",
             "Published on Oct 5, 2026 (… per item)", "Read more news"]
      source: "#headings h3 × 5, #ctas[34..39] labels (date, read time, tags), en-us.html aria-labels"
    - section: news
      classification: direction-authorized rewrite
      copy: ["" ]   # 5 news image alts, were "Article Image"; headline adjacent
      source: "improvements #4"
    - section: news
      classification: direction-authorized chrome
      copy: ["·"]   # middot separator in Meta lines (DESIGN.md § Chips / Meta)
      source: "DESIGN.json#extensions.componentStyle.tags"
    - section: get-in-touch
      classification: captured-verbatim
      copy: ["Get in touch", "Contact us", "Request a quote", "My Komatsu", "Find a location"]
      source: "#body['Get in touch'], #headings h2 × 4; image alts verbatim from #media.imgs[45..48]"
    - section: footer
      classification: captured-verbatim
      copy: ["Discover", "Tools", "Company", "Connect", "Equipment", "Parts", "Services and support", "Industries", "Technology", "Request a quote", "Komatsu locator", "My Komatsu", "Competitive comparison tool", "Mining Analytics Platform", "About us", "Careers", "Case studies", "Commitment to society", "Merchandise", "Newsroom", "Investor relations", "Contact us", "Social media channels", "Customer / dealer portals", "Suppliers", "opens in a new tab", "→",
             "Komatsu is a leading manufacturer of construction, mining, forestry, and industrial heavy equipment.", "Global corporate website",
             "Cookie policy", "Privacy statement", "Terms of use", "Transparency in coverage", "Modular Mining legal notices", "California Supply Chain Transparency Act", "California Voluntary Carbon Market Disclosures Act", "Privacy notice for California residents", "Fighting Against Forced Labour and Child Labour in Supply Chains Act (Canada)", "Sitemap",
             "2026 Komatsu America Corp. All rights reserved."]
      source: "#headings h6 × 4, #ctas[44..77], #body[footer]; 'Privacy notice for California residents' from en-us.html (Open question 4)"
    - section: footer
      classification: direction-authorized rewrite
      copy: ["Komatsu", "Komatsu on Facebook (opens in a new tab)", "Komatsu on Instagram (opens in a new tab)", "Komatsu on YouTube (opens in a new tab)"]
      source: "improvements #4 (logo alt; social names from captured hrefs facebook.com/KomatsuLtd, instagram.com/komatsuglobal, youtube.com/c/komatsu)"

  unsourcedContent: []   # mirrors § Unsourced content
```
