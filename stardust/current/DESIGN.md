<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-17T15:42:00Z
  mode: descriptive (current state, not a target)
  readArtifacts:
    - https://www.komatsu.com/en-us
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/pages/en-us.json
    - stardust/current/assets/screenshots/en-us.png
  synthesizedInputs: []
  scope: single page (homepage only, user-confirmed) — every token below is home-only evidence
  stardustVersion: 0.29.1
-->
---
name: Komatsu (current state)
description: The live komatsu.com/en-us homepage design system as captured on 2026-10-17
colors:
  komatsu-blue: "#140a9a"
  signal-blue: "#253fc8"
  tag-blue: "#3366cc"
  ink: "#1b232a"
  slate: "#4d545a"
  white: "#ffffff"
  ground: "#fafafa"
  rule: "#ededed"
typography:
  display:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "38px"
    letterSpacing: "normal"
  headline:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "normal"
  title:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
    letterSpacing: "normal"
  news-title:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "normal"
  label:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: "22px"
    letterSpacing: "normal"
  body:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "normal"
  nav:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "normal"
    letterSpacing: "normal"
  button:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "normal"
    letterSpacing: "normal"
  chip:
    fontFamily: "\"Noto Sans\", sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "normal"
    letterSpacing: "normal"
  tag:
    fontFamily: "Roboto"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.4px"
rounded:
  sm: "4px"
  tile-top: "4px 4px 0 0"
  arrow: "8px"
  chip: "20px"
  dot: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  section: "32px"
  header: "82px"
components:
  button-primary:
    backgroundColor: "{colors.komatsu-blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.komatsu-blue}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.rule}"
    textColor: "{colors.komatsu-blue}"
  button-inverse:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "11px 24px"
  button-inverse-hover:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.white}"
  chip-link:
    backgroundColor: "{colors.white}"
    textColor: "{colors.komatsu-blue}"
    typography: "{typography.chip}"
    rounded: "{rounded.sm}"
    padding: "4px 16px"
  tag-topic:
    backgroundColor: "{colors.tag-blue}"
    textColor: "{colors.white}"
    typography: "{typography.tag}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  tag-meta:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
  photo-tile:
    textColor: "{colors.white}"
    typography: "{typography.headline}"
    rounded: "{rounded.sm}"
  nav-link:
    textColor: "{colors.white}"
    typography: "{typography.nav}"
  footer:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
---

# Design System: Komatsu (current state)

## Overview

**Creative North Star: "Komatsu Blue over the Jobsite"**

The homepage is a corporate equipment catalogue that lets photography carry the color. The chrome is restrained: one deep ultramarine (Komatsu Blue) for links, filled buttons and the occasional promo panel; near-black ink for headings; white content panels laid on a barely-grey ground. Everything with saturation beyond that — the yellow machines, the orange safety vests, the lunar campaign scene in the hero — arrives through photographs, not through the palette.

Density is moderate and catalogue-like. Below a full-bleed campaign hero the page stacks discrete, contained modules: an equipment carousel, a 1 + 4 bento of photo tiles, a tabbed technology feature, a split blue promo band, a news grid and a row of four "Get in touch" tiles, then a mega footer. Each module sits on its own white panel; separation comes from 32px gaps and the ground showing through, not from rules or shadows.

Typography is a single humanist sans (Noto Sans) used in bold for titles and regular for everything else, at modest sizes — the hero headline is 32px at desktop and 20px on phones. The system reads as dependable and plain rather than expressive; the campaign voice lives in the hero image and one short line of copy.

**Key Characteristics:**
- One brand blue (#140a9a) carrying links, filled CTAs and promo panels; a brighter blue (#253fc8) only as button outlines and hover fills.
- Photography-led color; the UI palette itself is blue, ink, slate and white.
- Small, consistent 4px corners on buttons, tiles and images; 20px only on tag chips.
- Near-flat surfaces: one hairline tile shadow, no gradients except the hero darkening overlay.
- Sentence-case headings, no uppercase, no letter-spacing.

## Colors

A cool, low-chroma chrome palette anchored by a single deep ultramarine, with the warmth of the brand coming from yellow machinery in photographs.

### Primary
- **Komatsu Blue** (#140a9a): the brand's working color. Link text across the page (carousel labels, Technology heading link, footer links), outline-button text, the filled "Learn more" / "Read more news" buttons and the solid "Parts purchasing made easy" promo panel. 151 element uses on the home page, the most of any saturated color.

### Secondary
- **Signal Blue** (#253fc8): never a resting fill. It is the 2px border of outline buttons and chip-links, and the hover background of filled and inverse buttons — the color the interface turns when you touch it.

### Tertiary
- **Tag Blue** (#3366cc): small pill tags on news cards (topic chips) and the active underline in navigation and tabs.

### Neutral
- **Ink** (#1b232a): headings and body text on light panels (carousel labels, section titles, news headlines).
- **Slate** (#4d545a): footer column headings, the footer brand paragraph and legal copy; also the fill of the "3 min read" meta chips.
- **White** (#ffffff): content panels, outline-button fill, all text on photographs and on the blue promo band.
- **Ground** (#fafafa): the page and footer background showing between white panels.
- **Rule** (#ededed): hairline dividers (mobile navigation, tab rule) and the hover fill of outline buttons.

### Named Rules
**The One Blue Rule.** Komatsu Blue is the only saturated color at rest in the chrome; Signal Blue appears only as an outline or a hover state.

**The Photographs Carry the Yellow Rule.** The site CSS declares a yellow secondary ramp (secondary-30 #ffc82f), but on the homepage it paints a single carousel control; the machine yellow that identifies Komatsu equipment otherwise exists only in imagery. The palette tokens above map onto the site's own declared ramps (primary-10 / 30 / 60, neutral-0 / 60 / 90).

## Typography

**Display Font:** Noto Sans (with sans-serif)
**Body Font:** Noto Sans (with sans-serif)
**Label/Mono Font:** Roboto, for news topic tags only

**Character:** One humanist sans at a narrow weight range (400 / 600 / 700) gives a neutral, legible corporate voice; hierarchy comes from weight more than size.

### Hierarchy
- **Display** (700, 32px, 38px line-height; 20px / 24px on a 390px phone): the hero headline only, white over the photo.
- **Headline** (700, 24px, 28px): section titles ("Smart Construction", "Dig into the latest", "Get in touch") and the labels on photo tiles.
- **Title** (600, 24px, 32px): the centered "Technology" tab-group heading.
- **News title** (400, 20px, 28px; list items 18px / 22px): article headlines on news cards — regular weight, not bold.
- **Body** (400, 16px, 24px for the hero lede; 22px elsewhere): every paragraph; the lede is a single centered sentence.
- **Label** (700, 16px, 22px): equipment-carousel names and footer column headings.

### Named Rules
**The Weight-Not-Size Rule.** Headline and title both sit at 24px; the distinction between levels is carried by weight (700 vs 600 vs 400) rather than by a size ramp. Observed sizes 32 / 24 / 22 / 20 / 18 / 16px follow no modular ratio.

**The Sentence-Case Rule.** No heading on the page is uppercase (0 of 30) and no heading uses letter-spacing.

## Layout

The page is a vertical stack of full-width bands. The header (82px tall at 1440, 44px at 390) is positioned absolutely over a full-bleed hero photo (1440 x 700 at desktop; 390 x 302 on phones) whose copy is centered: headline, one-sentence lede, one outline button. Below it, every module sits on a white panel over the #fafafa ground; panels open with 32px of top padding and are separated by 32px.

Module rhythm, top to bottom: a 7-up equipment carousel with arrow buttons and dots; a bento of one large photo tile beside a 2 x 2 grid of smaller tiles; a centered "Technology" heading over three tabs, with copy and chip-links on the left and a photo on the right; a split promo band (solid blue panel left, photo right); "Dig into the latest" with two tall overlay news cards plus a three-item list; a row of four equal photo tiles; then the footer with four link columns, a brand block and a legal link row.

Spacing is broadly on a 4px grid (4, 8, 16, 20, 24, 32px are the common paddings) with a declared 1px unit token (`--spacing-base-unit: 0.0625rem`) and some off-grid values (11px button padding, 7px, 15px). The site CSS switches layout at max-width 449px, 899px and 1279px most often. Content-cap model (cap probe at 2560px, recorded in `DESIGN.json` `extensions.breakpoints`): the page shell, header and footer are fluid; the white module panels stop growing at 1920px (max-width), and the equipment carousel list at 1856px. At every common desktop width the layout therefore runs edge to edge.

## Elevation & Depth

Depth is almost entirely tonal: white panels on a #fafafa ground, and photographs darkened by a top-down gradient overlay where text sits on them. The only resting shadow is a hairline under photo tiles; the filled button gains a two-layer shadow on hover.

### Shadow Vocabulary
- **Tile hairline** (`box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 2px 0px`): photo tiles at rest (23 elements, starting with the bento grid).
- **Button hover lift** (`box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 2px 0px, rgba(0, 0, 0, 0.15) 0px 1px 3px 1px`): filled primary button on hover only.

### Named Rules
**The Flat-Panel Rule.** Panels and buttons are flat at rest; elevation appears only as a hairline under imagery or as a hover response.

## Shapes

Small, uniform corners. Buttons, chip-links, photo tiles and product images all use a gentle 4px radius (113 elements); news feature images round only their top corners (4px 4px 0 0). Tag chips on news cards are the one rounded-pill form (20px). Carousel pagination dots are circles (50%) and carousel arrows are small 8px-rounded squares in Komatsu Blue. Buttons are never pill-shaped. Borders are 2px and appear on outline buttons; dividers are 1px #ededed.

## Components

### Buttons
- **Shape:** gently squared corners (4px), 2px outline where outlined.
- **Primary:** filled Komatsu Blue with white text, 11px 24px padding, 16px regular weight ("Learn more", "Read more news").
- **Hover / Focus:** primary turns Signal Blue and lifts with a two-layer shadow; secondary fills with Rule grey; inverse fills with Signal Blue.
- **Secondary:** white fill, Komatsu Blue text, 2px Signal Blue outline ("Explore more" in the hero).
- **Inverse:** transparent with a 2px white outline and white text, used on the blue promo band ("Order now").

### Chips
- **Style:** chip-links are miniature secondary buttons (white, 2px Signal Blue outline, Komatsu Blue 14px text, 4px 16px padding), eleven of them listing Smart Construction products.
- **Tags:** news topic tags are Tag Blue pills (20px radius) with white 12px Roboto text; read-time meta chips are Slate.

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** full-bleed photograph with a white label in the lower left (24px bold); panels behind modules are white.
- **Shadow Strategy:** tile hairline (see Elevation & Depth).
- **Border:** none.

### Navigation
- **Style:** white 16px semibold links (Products, Services, Technology, Company) centered in a transparent header over the hero, logo left, icon utilities right (search, Locations, Worldwide US, My Account). On phones the nav collapses to a side panel with 18px semibold items and #ededed dividers.

### Equipment Carousel (signature)
Seven cut-out machine images per view on white, each with a bold 16px ink label, flanked by small Komatsu Blue arrow buttons and three pagination dots (active Komatsu Blue, inactive translucent blue).

### Bento Photo Grid (signature)
One large tile (Equipment) beside a 2 x 2 grid (Parts, Attachments, Technology, Service and support): full-bleed industrial photography, white bold labels, 4px corners, hairline shadow.

## Do's and Don'ts

### Do:
- **Do** keep Komatsu Blue (#140a9a) as the single resting brand color for links, filled buttons and promo panels.
- **Do** use 4px corners on buttons, tiles and images; reserve 20px for tag chips.
- **Do** outline secondary actions with a 2px Signal Blue (#253fc8) border on white.
- **Do** set headings in sentence case, Noto Sans, weight 600 to 700.
- **Do** let photography supply warm color; place white text on photos only over the darkening overlay.

### Don't:
- **Don't** use pill-shaped buttons; the incumbent buttons are squared at 4px.
- **Don't** add resting shadows heavier than the tile hairline (0 1px 2px rgba(0,0,0,0.16)).
- **Don't** uppercase or letter-space headings; none on the incumbent page are.
- **Don't** introduce decorative gradients; the only gradient is the hero's darkening overlay.
