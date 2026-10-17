<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-17T15:46:00Z
  mode: descriptive (current state, not a target)
  readArtifacts:
    - https://www.komatsu.com/en-us
    - stardust/current/pages/en-us.json
    - stardust/current/_brand-extraction.json
    - stardust/current/_crawl-log.json
  synthesizedInputs: []
  scope: single page (homepage only, user-confirmed)
  stardustVersion: 0.29.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — basis: the page title, the footer company line and the navigation/utility labels on the captured homepage._

- **Equipment buyers and fleet operators** in construction, mining, forestry and industrial work, evaluating machines by category (the homepage carousel lists blasthole drills, dozers, excavators, haul trucks, wheel loaders, forestry, forklifts and underground mining equipment). Their job on the homepage is to find the right category or request a quote.
- **Existing owners** who need parts and service: "Parts purchasing made easy" routes to ordering through My Komatsu; "Service and support", "Find a location" and the Komatsu locator serve the same group.
- **Dealers, customers and suppliers** reaching portals (footer: "Customer / dealer portals", "Suppliers").
- Secondary audiences named by the footer: job seekers (Careers), investors (Investor relations), press (Newsroom).

## Product Purpose

The site is Komatsu's North American corporate and product site (footer: "2026 Komatsu America Corp. All rights reserved."). The homepage presents the brand campaign, routes visitors into the equipment, parts, attachments, technology and service catalogues, promotes online parts ordering through My Komatsu, surfaces recent news, and offers four direct contact paths (Contact us, Request a quote, My Komatsu, Find a location).

Success on the homepage, as its structure implies (_provenance: inferred): a visitor reaches the right equipment category, a quote request, a parts order, or a dealer location in one or two clicks.

## Positioning

In the site's own words:

- Hero: "Here's to progress" — "For more than a century, Komatsu has helped build the world beneath our feet. Now, we're helping imagine how people could one day build beyond it."
- Meta description: "Creating value through manufacturing and technology innovation to empower a sustainable future where people, businesses and our planet thrive together"
- Footer: "Komatsu is a leading manufacturer of construction, mining, forestry, and industrial heavy equipment."

The distinguishing claims on the page are century-long manufacturing heritage paired with technology (Smart Construction, Smart Mining, Smart Quarry; teleoperation and electrification in the news).

## Capabilities and Constraints

- **Catalogue breadth:** the equipment carousel links to 21 equipment categories; the Technology tabs list 11 Smart Construction products (3D Machine Guidance, 3D Machine Guidance Flex, Base / rover, Dashboard, Design, Drone, Field, Fleet, Intelligent Machine Control, Office, Remote).
- **Transactions happen elsewhere:** parts ordering and account functions open My Komatsu (https://mykomatsu.komatsu/) in a new tab; the Mining Analytics Platform and Investor relations also leave the site.
- **Platform as observed:** Adobe Experience Manager markup (experience fragments, `/etc.clientlibs/` client libraries), Scene7 dynamic-media image renditions, OneTrust cookie consent, Adobe Launch, Google Analytics, Microsoft Clarity and Qualtrics intercepts.
- **Locale:** `en-us`, with a "Worldwide US" region selector in the header.
- **Legal surface:** the footer carries required disclosures (California Supply Chain Transparency Act, California Voluntary Carbon Market Disclosures Act, Canada's Fighting Against Forced Labour and Child Labour in Supply Chains Act, Modular Mining legal notices, Transparency in coverage, privacy and cookie policies).

## Brand Commitments

- **Name and mark:** Komatsu; wordmark logo (white version in the header, blue version in the footer) — `stardust/current/assets/logo.svg`.
- **Register:** `brand` — a marketing homepage with a campaign hero and CTA above the fold, promotional bands and news, no authentication needed to view it; catalogue navigation is present but serves discovery.
- **Observed personality** (_provenance: inferred): dependable, industrial, heritage-proud and future-facing; plain and functional below the hero. Tone guess: aspirational (heuristic).
- **Voice as captured:** sentence-case, short imperative CTAs ("Explore more", "Learn more", "Order now", "Request a quote", "Contact us"); section titles as plain invitations ("Dig into the latest", "Get in touch", "Parts purchasing made easy").
- **Anti-references:** none stated on the site; none inferred.

## Evidence on Hand

- Page record: `stardust/current/pages/en-us.json` (30 headings, 78 CTAs, 53 images) and the settled rendered DOM `stardust/current/pages/en-us.html`.
- Full-page screenshot: `stardust/current/assets/screenshots/en-us.png` (1440 x 3985).
- Computed-style census at 1440 and 390: `stardust/current/_computed-styles.json`.
- Brand surface: `stardust/current/_brand-extraction.json`; crawl log incl. vision check: `stardust/current/_crawl-log.json`.
- Logo `stardust/current/assets/logo.svg`; favicon `stardust/current/assets/favicon.ico`; fonts (Noto Sans normal/italic, Roboto 400, Font Awesome 6 solid) under `stardust/current/assets/fonts/`.
- Real content available for reuse: hero campaign copy and image (Scene7 `Screenshot 2026-07-30 103344`), 21 equipment-category images with model-specific alt text, five dated news items (Oct 5, Sep 17, Sep 16, Sep 10, Sep 4, 2026).
- **Absences future work must not fabricate:** no testimonials, customer logos, statistics, pricing or certifications appear on the homepage. Only the homepage was captured; 78 linked internal pages are uncaptured by scope (`_crawl-log.json#captureGaps`).

## Product Principles

_provenance: inferred — basis: the homepage's module order and its CTA targets._

1. **Route to the machine fast.** The equipment catalogue sits directly under the hero, ahead of any story.
2. **Ownership continues after the sale.** Parts, service, locator and My Komatsu get as much homepage weight as new equipment.
3. **Heritage justifies the future.** Century-long manufacturing is the credential for technology and automation claims.
4. **Every module ends in a concrete next step** — a category, a quote, an order, a location.

## Accessibility & Inclusion

No product-specific standard was established. Observed on the captured page: external links carry a visually hidden "opens in a new tab" suffix (three social links have no other accessible text); 12 of 53 images have empty alt text (mostly decorative header/utility icons); several images carry placeholder alts ("logo", "Article Image" x5, "Background Image", "alt text").
