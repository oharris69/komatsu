<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-17T16:01:10Z
  mode: target (redesign direction, not current state)
  againstDirection: stardust/direction.md
  readArtifacts:
    - stardust/state.json
    - stardust/current/PRODUCT.md
    - stardust/current/_brand-extraction.json
    - stardust/current/brand-review.html
    - stardust/current/pages/en-us.json
    - stardust/prototypes/en-us-improvements.md
  synthesizedInputs: []
  scope: homepage only (en-us); modernized copy deploys at /en-us/home-modern
  note: Stardust target spec. It does not govern the EDS project's styles/, blocks/ or scripts/; the live site is untouched.
  stardustVersion: 0.29.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- _provenance: inferred — basis: the audience stated in the approved direct plan (unchallenged by the user) plus the captured homepage navigation, carousel and contact tiles. -->

- **Contractors** in construction and quarrying who are choosing machines by category (dozers, excavators, wheel loaders, motor graders and so on) and comparing Komatsu technology such as Smart Construction.
- **Mining operators** evaluating surface and underground equipment (blasthole drills, electric rope shovels, haul trucks, hard-rock and soft-rock underground lines) and Smart Mining.
- **Fleet buyers and owners** who keep machines running: parts ordering through My Komatsu, service and support, dealer locations, quotes.
- **Context:** desktop-first. Visitors are evaluating equipment, parts and services, often on behalf of a company. They want plain facts and a fast route to the right category or contact path, not entertainment. The register is credible, industrial B2B.

## Product Purpose

Komatsu's North American homepage puts a century of heavy-equipment manufacturing and its technology program in front of the people who buy, run and maintain those machines. It routes them in one or two clicks to an equipment category, parts ordering, technology, news, or a direct contact path (contact, quote, My Komatsu, locator).

This direction's scope: a modernized copy of the same homepage, with the same content and IA priorities. It is a confident refresh shown beside the current page in next week's demo, so both versions can be compared.

## Positioning

From the captured copy: Komatsu pairs over a century of manufacturing ("For more than a century, Komatsu has helped build the world beneath our feet") with forward technology: Smart Construction, Smart Mining and Smart Quarry, plus the electrification and teleoperation covered in the news. It makes the full range of construction, mining, forestry and industrial equipment *and* supports owners afterwards with genuine and reman parts through My Komatsu. A neighbour with a narrower line could not claim the breadth, and a newer entrant could not claim the century.

## Operating Context

- Visitors arrive from search, dealer referrals and campaigns. Many then leave the site for transactions: parts and account functions open My Komatsu in a new tab, and the Mining Analytics Platform and Investor relations are off-site.
- Locale `en-us`, with a region selector ("Worldwide US") in the header.

## Capabilities and Constraints

- **Brand-faithful:** the Komatsu palette (Komatsu Blue family, neutral ramp, declared yellow ramp) and Noto Sans are pinned. No new hues, no new type families. Roboto, used only on news tags, is retired in favour of Noto Sans.
- **Legacy content preserved:** every captured heading, paragraph, link label, CTA label, image and news item is kept verbatim. Same section sequence, same content beats (`ia-fidelity: verbatim`). Surface, type, density and composition within a section may change.
- **Existing site untouched:** the modernized homepage is a copy deployed at `/en-us/home-modern` (user answer, Q2) with namespaced blocks. The current `/en-us` homepage and the shared EDS project styles stay as they are.
- **Demo framing:** one canonical direction (no variant fan-out), built so that both versions can be compared side by side.
- **Catalogue breadth:** 21 equipment categories in the carousel; 11 Smart Construction products in the Technology panel.
- **Legal surface:** the footer's required disclosures and legal links are carried through unchanged.

## Brand Commitments

- **Name and mark:** Komatsu wordmark (white variant for dark or photo grounds, blue variant for light grounds) — `stardust/current/assets/logo.svg`; the blue footer variant is referenced at `/content/dam/komatsu/icons/website-app/blue-logo.svg`.
- **Register:** `brand` (inherited).
- **Personality:** confident, industrial, dependable, heritage-led, future-facing, modular-catalogue. This is a confident refresh: clearly modern and more spacious, with a stronger type hierarchy and richer imagery, and instantly recognizable as Komatsu (Q1). Tone stays serious and plain-spoken below the hero.
- **Voice:** sentence case throughout, with short imperative CTAs used verbatim ("Explore more", "Learn more", "Order now", "Request a quote", "Contact us") and product nouns over adjectives.
- **Anti-references:**
  - The Generic-2026-SaaS silhouette: an oversized clamp(72px+) sans hero, solid+outline CTA pair, sticky top nav and serial footer. "Modernize" is the phrase that most often triggers it.
  - Stat-callout trust bars and any invented numbers, customer logos or quotes.
  - Editorial-register vocabulary on a B2B equipment brand (no "dispatches", "journal", "field guide", "atelier" in labels or eyebrows).
  - Cream / paper grounds and the archival-editorial palette family.
  - Hero text on photography without a contrast scrim.
  - Decorative motif kits (stamps, hazard stripes, grain, oversized section numerals).

## Evidence on Hand

- Page record `stardust/current/pages/en-us.json` (30 headings, 78 CTAs, 53 images) and rendered DOM `stardust/current/pages/en-us.html`.
- Full-page capture `stardust/current/assets/screenshots/en-us.png` (1440 x 3985); computed styles `stardust/current/_computed-styles.json`.
- Brand surface `stardust/current/_brand-extraction.json`; review `stardust/current/brand-review.html`; improvements brief `stardust/prototypes/en-us-improvements.md`.
- Reusable media: the Scene7 hero campaign image (lunar haul-truck scene, 21:9 desktop and 3:4 mobile renditions), 21 cut-out equipment-category images, 5 bento photo tiles, the Technology drone-survey photo, the Parts band photo, 5 dated news images (Oct 5, Sep 17, Sep 16, Sep 10, Sep 4, 2026), and 4 Get in touch photo tiles.
- **Absences that must not be fabricated:** no testimonials, customer logos, statistics, pricing or certifications appear on the homepage. Only the homepage was captured; 78 linked pages are out of scope.

## Product Principles

1. **Route to the machine first.** The equipment categories stay directly under the hero. More space must never push them out of reach (holds `ia-fidelity: verbatim`).
2. **Let hierarchy do the modernizing.** The refresh shows in scale, spacing and surface rhythm, not in new content or new colors (expressive restrained → committed, inside the Mode A pins).
3. **Keep owners in view.** Parts, service, locator and My Komatsu keep the homepage weight they have today (IA priorities locked).
4. **Credibility over spectacle.** Every claim on the page comes from captured copy. Where data is absent, show a visible placeholder, never an invented value (tone serious, B2B).
5. **One clear next step per module.** Each section ends in one dominant action and quiet secondary links (density packed → balanced).

## Accessibility & Inclusion

Target WCAG 2.2 AA. Measured text pairs in the pinned palette all pass: track-steel on white is 15.90:1, Komatsu Blue on white 13.64:1, cab-slate on yard-gray 7.04:1, white on survey-blue 5.37:1. Komatsu yellow fails on white (1.55:1) and is restricted to blue or dark grounds. The direction fixes the captured gaps: placeholder alts ("Background Image", "Article Image" x5, "logo", "alt text") and social links named only "opens in a new tab" (improvements #4). Keyboard focus must be visible on every surface.
