<!--
_provenance:
  writtenBy: stardust:direct
  writtenAt: 2026-10-17T16:00:30Z
  againstDirection: stardust/direction.md (active direction resolved 2026-10-17)
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/brand-review.html
    - stardust/current/pages/en-us.json
    - stardust/current/_computed-styles.json
    - stardust/current/assets/screenshots/en-us.png
    - stardust/.work/extract/sections-measure.json
  synthesizedInputs: []
  auditReuse: none (no stardust/audit/ for komatsu.com)
  stardustVersion: 0.29.1
-->

# Improvements — en-us

The brief for the single canonical direction (variant A, N = 1). Each item is a
gap between the captured homepage and a competent 2026 execution of the same
Komatsu brand. Every fix holds the Mode A pins (palette, Noto Sans), the
image-reuse contract and `ia-fidelity: verbatim`: the same sections in the same
order, the same content beats and the same CTA labels. Only surface, type,
density and composition within a section may change.

1. **[ia-clutter · hierarchy]** The hero headline barely outranks the section
   titles. H1 "Here's to progress" is 32px/700 against 24px/700 H2s at 1440
   (1.33x). At 390 the H1 drops to 20px while the H2s stay at 24px, so the hero
   reads smaller than "Dig into the latest" (`T-hierarchy`). The step ratios
   below the H1 are 1.091 / 1.1 / 1.111 / 1.125, an ad-hoc scale with six sizes
   (32, 24, 22, 20, 18, 16) that no ratio explains (`T-scale`). The hero uses the
   centered headline + lede + single outline CTA pattern. Its overlay
   (`linear-gradient(0deg, transparent, rgba(0,0,0,.75))` at opacity .5) peaks
   at an effective 0.375 black, below the 0.4 scrim floor.
   *Fix:* Adopt the 1.25 modular scale from DESIGN.md. Hero display runs 39px at
   390 to 61px at 1440 and section headlines 31px to 39px, so the H1 always
   outranks the H2 at every width. Left-anchor the hero headline block in the
   lower-left of the full-bleed photo, over a directional scrim that brings the
   headline area to at least 4.5:1. Keep the one "Explore more" CTA.

2. **[ia-clutter · CTA noise]** Small bordered actions crowd two modules. The
   Technology panel shows 11 chip-links (2px `#253fc8` border, 4px 16px
   padding, 14px), each drawn as a button, next to the filled "Learn more". That
   makes 12 bordered targets in one panel. The "Powering progress responsibly"
   news card carries 9 topic tags (`#3366cc` 20px-radius pills) set in Roboto
   9pt, the only non-Noto text on the page (`T-font-fork`). The page also uses
   three phrasings for "see more" in one scroll: "Explore more", "Learn more"
   and "Read more news" (`T-cta-siblings`).
   *Fix:* Each module gets one filled or outlined action. The 11 Smart
   Construction links become a plain two-column text-link list in Noto Sans
   (all 11 kept, verbatim). Topic tags become quiet inline meta text in the
   `meta` type role: no pill fill, no Roboto, clamped to two lines on feature
   cards, with the full list kept in markup. CTA labels stay verbatim
   (legacy-content-preserved). Their sibling inconsistency is noted for the
   brand team, not rewritten here.

3. **[dated-pattern · density]** The page is a 2010s AEM boxed-panel stack.
   Every module sits on its own white `.columncontainer-main.white-container`
   panel on a `#fafafa` ground. They are separated only by 32px
   (`.pdding-top--medium` / `.margin-bottom--medium`; spacing.sectionPadding
   32px), so carousel, bento, Technology, news and contact all carry the same
   visual weight. The only rhythm break is the solid `#140a9a` Parts band.
   *Fix:* Use full-width sections with balanced section padding (64 / 48 / 32px
   desktop / tablet / mobile). Alternate the `daylight` (#ffffff) and
   `yard-gray` (#f4f5f5) surfaces instead of boxing panels. Keep the Komatsu
   Blue Parts band as the one saturated rhythm break. Each section opens with a
   left-aligned headline on the shared content grid, replacing the centered
   module titles ("Technology", "Dig into the latest", "Get in touch").

4. **[accessibility]** Images and icon links carry placeholder names. The hero
   image alt is "Background Image". Five news images are "Article Image". One
   mobile logo is "logo" and one image is "alt text" (`T-img-alt-generic`). The
   three footer social links (Facebook, Instagram, YouTube) expose only the
   visually hidden "opens in a new tab" suffix, so screen readers announce no
   destination (`T-link-a11y`).
   *Fix:* Derive alts from captured context only, never invented. Hero: the
   captured visual description (Komatsu haul trucks on a lunar surface with
   Earth rising behind). News images: alt equals the article's own headline,
   or empty when the headline sits adjacent. Logos: "Komatsu". Social links get
   accessible names "Komatsu on Facebook / Instagram / YouTube (opens in a new
   tab)".

5. **[missed-opportunity]** Komatsu yellow is declared but dormant. The site
   CSS ships a full secondary ramp around `#ffc82f` (secondary-30), but the
   homepage computes it on one 10x10px carousel control (`T-yellow-dormant`).
   The brand's most recognisable color, the yellow of the machines, appears
   only inside photographs (equipment carousel cut-outs, bento Equipment and
   Parts tiles).
   *Fix:* Reserve `komatsu-yellow` (#ffc82f) for small marks on `komatsu-blue`
   or dark photo grounds only: focus rings (8.80:1 on #140a9a), the
   inverse-button hover fill with `track-steel` text (10.27:1), and one
   accent rule on the Parts band. Never use it on white (1.55:1, fails), never
   as body text, and at most two instances per viewport.
