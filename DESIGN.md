<!-- stardust:provenance
  writtenBy: stardust:direct
  writtenAt: 2026-10-17T16:05:00Z
  mode: target (redesign direction, not current state)
  againstDirection: stardust/direction.md
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
    - stardust/current/brand-review.html
    - stardust/prototypes/en-us-improvements.md
    - PRODUCT.md
  synthesizedInputs:
    - typography sizes (1.25 modular scale for the committed expressive axis; family and weights inherited)
    - spacing.section-* (balanced density tier, from the approved plan)
    - input component (no input captured; synthesized from tokens)
  scope: site-level system for the modernized homepage copy (/en-us/home-modern). Stardust target spec only; it does not edit the EDS project's styles/brand.css or blocks/.
  stardustVersion: 0.29.1
-->
---
name: Komatsu — modernized homepage
description: Confident, brand-faithful refresh of komatsu.com/en-us — Komatsu Blue, Noto Sans, a real type hierarchy and balanced industrial rhythm
colors:
  komatsu-blue: "#140a9a"
  boom-blue: "#253fc8"
  survey-blue: "#3366cc"
  track-steel: "#1b232a"
  cab-slate: "#4d545a"
  grade-line: "#ededed"
  daylight: "#ffffff"
  yard-gray: "#f4f5f5"
  site-ground: "#fafafa"
  komatsu-yellow: "#ffc82f"
typography:
  display:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "clamp(2.441rem, 1.5rem + 3.4vw, 3.815rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "clamp(1.953rem, 1.4rem + 1.6vw, 2.441rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1rem + 0.9vw, 1.563rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  subtitle:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  lede:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "normal"
  button:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
  meta:
    fontFamily: "\"Noto Sans\", system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  none: "0px"
  sm: "4px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
  "16": "64px"
  "24": "96px"
  gutter: "24px"
  section-desktop: "64px"
  section-tablet: "48px"
  section-mobile: "32px"
components:
  button-primary:
    backgroundColor: "{colors.komatsu-blue}"
    textColor: "{colors.daylight}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.boom-blue}"
    textColor: "{colors.daylight}"
  button-secondary:
    backgroundColor: "{colors.daylight}"
    textColor: "{colors.komatsu-blue}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.grade-line}"
    textColor: "{colors.komatsu-blue}"
  button-inverse:
    backgroundColor: "{colors.komatsu-blue}"
    textColor: "{colors.daylight}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 22px"
  button-inverse-hover:
    backgroundColor: "{colors.komatsu-yellow}"
    textColor: "{colors.track-steel}"
  link:
    textColor: "{colors.komatsu-blue}"
    typography: "{typography.body}"
  card:
    backgroundColor: "{colors.track-steel}"
    textColor: "{colors.daylight}"
    typography: "{typography.title}"
    rounded: "{rounded.sm}"
  badge:
    textColor: "{colors.cab-slate}"
    typography: "{typography.meta}"
  input:
    backgroundColor: "{colors.daylight}"
    textColor: "{colors.track-steel}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    height: "48px"
---

# Design System: Komatsu — modernized homepage

## Overview

**Creative North Star: "The Machine in Daylight"**

Komatsu's yellow machines already carry the color. The system's job is to give them room and a clear order of importance. The refresh keeps every pinned element of the brand: one deep ultramarine (Komatsu Blue) for action and the one saturated band, a single humanist sans (Noto Sans), 4px corners and photography-led color. What modernizes it is hierarchy and air. A display headline that clearly outranks section titles at every width, full-width sections on a 64 / 48 / 32px rhythm in place of boxed panels on a grey ground, and one dominant action per module turn a dense corporate stack into a confident, readable equipment homepage.

Density is balanced, not airy. The page still routes a contractor, a mine operator or a fleet owner to the right machine, part or contact in one or two clicks, and the equipment categories still sit directly under the hero. Surfaces alternate between `daylight` white and a cool `yard-gray`, and the Komatsu Blue band is the single saturated rhythm break. Komatsu yellow, declared in the brand's own CSS but dormant on the current page, returns as a reserved mark that appears only on blue or dark photographic grounds.

The tone is serious and credible: industrial B2B, no spectacle. There is no oversized SaaS hero, no stat bars, no decorative motif kit, no cream grounds. Imagery is reused at the same semantic position it holds today, at a larger and more confident scale.

**Key Characteristics:**
- Komatsu Blue (#140a9a) carries filled actions, links and the one saturated band. Boom Blue (#253fc8) is for outlines, hover and focus on light grounds.
- A real 1.25 modular scale: display 39→61px, headline 31→39px, title 20→25px, body 16px. The hero H1 outranks every H2 at every width.
- Full-width sections at 64 / 48 / 32px vertical padding, alternating `daylight` and `yard-gray`. No boxed panels on a grey ground.
- One dominant action per module. Secondary routes are quiet text links, not bordered chips.
- Photography leads: hero full-bleed under a directional scrim, the equipment rail of cut-outs on white, photo tiles with legible scrimmed labels.
- Komatsu Yellow (#ffc82f) is a reserved mark, used only on Komatsu Blue or dark photo grounds and never on white.
- Single family: Noto Sans 400 / 600 / 700. Roboto is retired.

## Colors

The palette is the captured Komatsu palette, renamed to brand-native roles. It is a saturated ultramarine family, a cool steel neutral ramp and one reserved industrial yellow.

### Primary
- **Komatsu Blue** (#140a9a / oklch(32.3% 0.206 268.4)): the brand's voice color. It fills primary buttons, colors links and in-text actions, and is the ground of the single saturated band (the parts-ordering promo). Contrast: 13.64:1 against `daylight`, 12.49:1 against `yard-gray`.

### Secondary
- **Boom Blue** (#253fc8 / oklch(44.9% 0.212 267.6)): the working blue. It draws the 2px outline of secondary buttons, the hover fill of primary buttons and the focus ring on light grounds (8.00:1 on white). It is never a large surface.

### Tertiary
- **Survey Blue** (#3366cc / oklch(53.2% 0.168 262.3)): the active-state blue. It marks the active tab indicator and current-page states (5.37:1 on white, so it passes for text and non-text). It is not used for tag pills; tags are now meta text.
- **Komatsu Yellow** (#ffc82f / oklch(85.9% 0.165 86.9)): reserved. It is the yellow of the machines and comes from the site's declared secondary ramp (secondary-30). Uses: the focus ring on Komatsu Blue and dark photo grounds (8.80:1 on #140a9a), the inverse-button hover fill with Track Steel text (10.27:1), and one accent rule on the saturated band.

### Neutral
- **Track Steel** (#1b232a / oklch(25.1% 0.018 245.0)): headings and body text (15.90:1 on white). Its tint is also used for scrims and shadow color.
- **Cab Slate** (#4d545a / oklch(44.2% 0.013 243.9)): secondary text, meta (dates, read time, topics), footer column copy (7.69:1 on white, 7.04:1 on yard-gray).
- **Grade Line** (#ededed / oklch(94.6% 0 0)): hairline dividers, the tab rule and the secondary-button hover fill. Not for text.
- **Daylight** (#ffffff): the page ground and the default section surface.
- **Yard Gray** (#f4f5f5 / oklch(96.9% 0.001 197.1)): the alternating section surface, from the declared neutral-80 step. Cool neutral, not cream (R−B = 0).
- **Site Ground** (#fafafa / oklch(98.5% 0 0)): the footer surface, as captured.

### Named Rules
**The One Band Rule.** Komatsu Blue appears as a full section ground once per page, on the parts-ordering band. Every other section is `daylight` or `yard-gray`. The saturated band is the rhythm break, and it stops working if repeated.

**The Yellow Stays on Blue Rule.** Komatsu Yellow is used only on Komatsu Blue or on dark photographic grounds, at most twice per viewport, and never as text and never on white (1.55:1 fails). In the photography the yellow is the machine. In the chrome it is a signal.

**The No Black Rule.** Pure #000000, captured on six header icon labels, is not inherited. Track Steel replaces it everywhere.

## Typography

**Display Font:** Noto Sans (with system-ui, sans-serif)
**Body Font:** Noto Sans (with system-ui, sans-serif)
**Label/Mono Font:** none. Roboto, captured only on news tags, is retired (improvements #2).

**Character:** One humanist sans used three ways. Bold for headlines that now carry real scale, semibold for actions and meta, regular for reading. The modern feel comes from the scale and from tight negative tracking on display sizes, not from a second face.

### Hierarchy
The scale is 1.25 (major third) on a 16px base: 12.8 · 16 · 20 · 25 · 31.25 · 39.06 · 48.83 · 61.04.

- **Display** (700, clamp 39→61px, 1.05, −0.02em): the hero headline only. One per page.
- **Headline** (700, clamp 31→39px, 1.15, −0.01em): section titles. Left-aligned on the content grid.
- **Title** (700, clamp 20→25px, 1.25): photo-tile labels, panel headings, featured news headlines.
- **Subtitle** (600, 20px, 1.35): tab-panel headings and list news headlines.
- **Lede** (400, 20px, 1.5, max 60ch): the one-sentence hero lede and section intros.
- **Body** (400, 16px, 1.5, max 70ch): all running copy.
- **Label** (700, 16px, 1.375): equipment-category names and footer column headings.
- **Button** (600, 16px, 1.25): every button and the primary nav.
- **Meta** (600, 12.8px, 1.4, +0.01em, sentence case): read time, dates and topic tags on news.

### Named Rules
**The Hero Outranks Rule.** At every width the display size is at least 1.25x the headline size (39 vs 31 at 390, 61 vs 39 at 1440). A section title must never read larger than the hero headline (`T-hierarchy`).

**The Sentence Case Rule.** 0% of captured headings are uppercase, and that holds here. There are no uppercase eyebrows and no condensed display.

**The One Family Rule.** Noto Sans only. Weights 400 / 600 / 700. Italic only for inline citation, never for display accents.

## Layout

The spatial model is full-width sections on a 12-column content grid. Content runs inside a fluid container with 24px gutters and outer margins of 24px (mobile), 32px (tablet) and 48px (desktop). Module content inherits the captured 1920px cap, and the shell stays fluid (see DESIGN.json `extensions.breakpoints`). Running text is bounded by measure (60–70ch), not by container width.

Vertical rhythm follows the **balanced** density tier: section padding is 64px desktop, 48px tablet and 32px mobile. Inside sections the 4px-based scale applies (8 / 12 / 16 / 24 / 32 / 48). The headline sits 24px (mobile) to 32px (desktop) above its module content. Sections alternate `daylight` and `yard-gray` surfaces, and the single Komatsu Blue band breaks the rhythm once. The homepage's seven modules make it a multi-section brand page, so section padding is bounded at 40–64px desktop. 64px is the ceiling, not a starting point.

Tiles, images and cards snap to one square-module grid with equal 24px gutters. The bento, news and contact tiles share the same column lines, so the page reads as one engineered system rather than separate widgets.

Responsive: desktop-first. At ≤ 899px grids reflow from 4 or 3 columns to 2. At ≤ 449px they reflow to 1, and the equipment rail becomes a horizontal swipe row with visible overflow. These breakpoints follow the captured media-query frequency (449 / 899 / 1279).

## Elevation & Depth

Depth comes mostly from tonal layering: alternating surfaces, the saturated band, and photography under scrims. Shadows are minimal and steel-tinted, never pure black. Tiles rest flat with the captured hairline and lift slightly on hover.

### Shadow Vocabulary
- **Tile rest** (`box-shadow: 0 1px 2px oklch(25.1% 0.018 245 / 0.16)`): photo tiles and cards at rest. This is the captured `--wrap-shadow`, re-tinted to Track Steel.
- **Tile lift** (`box-shadow: 0 6px 16px oklch(25.1% 0.018 245 / 0.18)`): photo tiles and cards on hover or focus-within.
- **Action lift** (`box-shadow: 0 1px 3px oklch(25.1% 0.018 245 / 0.30)`): primary button hover. This is the captured hover shadow, re-tinted.
- **Photo scrim** (`linear-gradient(to top, oklch(25.1% 0.018 245 / 0.78) 0%, oklch(25.1% 0.018 245 / 0.40) 45%, transparent 75%)`): under any text set on photography. It must bring the text area to ≥ 4.5:1. For the hero it runs directionally from the lower left.

### Named Rules
**The Scrim Before Type Rule.** Text never sits on raw photography. Every overlaid label or headline gets a scrim of at least 0.4 opacity under the text area.

## Shapes

Corners stay at the captured 4px on buttons, tiles, cards, images and inputs. Pill radius is used only for carousel pagination dots. The captured 20px tag-pill radius is retired along with the pills themselves. Borders are 2px Boom Blue on outline actions and 1px Grade Line for dividers. There are no side-stripe accents, no clipped corners and no decorative silhouettes. The machines in the photography supply the shape language.

## Components

### Buttons
Plain and solid. Actions read as part of the machine, not as decoration.
- **Shape:** 4px corners (`rounded.sm`).
- **Primary:** Komatsu Blue fill, Daylight text, 600 16px, padding 12px 24px. One per module, at most.
- **Hover / Focus:** hover fills Boom Blue with the action-lift shadow over 200ms ease-out. Focus-visible on light grounds is a 2px Boom Blue outline at 2px offset. On blue or dark grounds it is a 2px Komatsu Yellow outline.
- **Secondary:** Daylight fill, Komatsu Blue text, 2px Boom Blue border (padding 10px 22px, so it matches the primary's outer size). Hover fills Grade Line. Used for the hero's single action on photography.
- **Inverse:** on the Komatsu Blue band. Transparent, Daylight text, 2px Daylight border. Hover fills Komatsu Yellow with Track Steel text.

### Links
- **Text link:** Komatsu Blue, no underline at rest, underline (2px, 3px offset) on hover and focus. Secondary routes such as the Smart Construction product list are text links with a trailing arrow glyph, set in body type in a two-column list. They are never bordered chips.

### Chips / Meta
- **Style:** topic tags, read time and dates are inline Meta text (Cab Slate, 600 12.8px) separated by a middot, with no fill and no pill. They clamp to two lines on feature cards, and the full list stays in markup.

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** photography. Labels sit bottom-left on the photo scrim in Daylight Title type.
- **Shadow Strategy:** tile rest, then tile lift on hover or focus-within (see Elevation).
- **Border:** none.
- **Internal Padding:** 24px (desktop) and 16px (mobile) around the label.
- **Whole-tile target:** the entire tile is one link, with a visible focus ring around the whole tile.

### Inputs / Fields
- **Style:** Daylight fill, 1px Cab Slate border (7.69:1), 4px corners, 48px tall, body type. This is synthesized: no input was captured, but the header search will need one.
- **Focus:** 2px Boom Blue outline at 2px offset, with the border unchanged.
- **Error / Disabled:** not defined. No form exists on the homepage.

### Navigation
- **Style:** the global header sits over the hero photo, with a white wordmark and Daylight nav labels (Button type). It is not sticky; it scrolls away with the hero. Hover and active states use a 2px Daylight underline at 6px offset. Over light surfaces (mobile panel) it uses the blue wordmark and Komatsu Blue labels.
- **Mobile:** a slide-in panel with 18px nav labels, as captured. Focus is trapped in the panel while it is open.

### Tabs (signature)
The Technology module's tabs are text tabs on a 1px Grade Line rule. The active tab is Track Steel 600 with a 3px Survey Blue indicator. Inactive tabs are Cab Slate and turn Track Steel on hover. The panel below holds one subtitle, body copy, the text-link product list, one primary action and the photo.

### Equipment rail (signature)
Cut-out machine images sit directly on Daylight with no card chrome, each with a Label-type name below. The rail scrolls horizontally, with Komatsu Blue square arrow controls (4px) and pill pagination dots. This is the brand's most recognisable module (yellow machines on white), so it is given more image height, not more decoration.

## Do's and Don'ts

### Do:
- **Do** keep the section sequence and every captured content beat exactly as on komatsu.com/en-us (`ia-fidelity: verbatim`).
- **Do** use the 1.25 scale tokens only: display 39→61px, headline 31→39px, title 20→25px, body 16px, meta 12.8px.
- **Do** pad sections 64 / 48 / 32px (desktop / tablet / mobile) and alternate `daylight` and `yard-gray` surfaces.
- **Do** give each module one dominant action and render secondary routes as text links.
- **Do** put a ≥ 0.4 scrim under any text on photography and verify ≥ 4.5:1.
- **Do** reuse captured images at their original semantic position: hero stays hero, rail cut-outs stay in the rail, tiles stay tiles.
- **Do** derive alt text from captured context (the image description, the article's own headline) and name icon links by destination.

### Don't:
- **Don't** build the Generic-2026-SaaS silhouette: no clamp(72px+) hero, no solid+outline CTA pair in the hero, no sticky nav, no serial footer.
- **Don't** add stat bars, customer logos, quotes, prices or any number not in the captured page.
- **Don't** use Komatsu Yellow on white or as text, or more than twice per viewport.
- **Don't** introduce colors outside the captured palette and declared ramps, or any family other than Noto Sans.
- **Don't** use #000000 or cream / paper grounds.
- **Don't** use uppercase headings, condensed display type, numbered section eyebrows, stamps, grain, hazard stripes or other motif-kit decoration.
- **Don't** box modules as white panels on a grey ground. Sections are full-width surfaces.
- **Don't** use editorial-register labels ("dispatches", "journal", "field guide") for B2B equipment content.
