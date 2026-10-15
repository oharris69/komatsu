# hero-banner

Custom **hero** block. Purpose: brand-hero.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

| Variation | Option class |
| --- | --- |
| Compact | `compact` |

## Universal Editor fields

N/A (Document Authoring project)

## Content model

- Row 1: background image | Row 2: h1, paragraph, CTA link

## Notes

- `compact`: content-height category banner (source `div.herocomponent` without `large_hero`, e.g. `.blue_bg.hero-max-width` on equipment category and model pages). 52px vertical padding, `#140a9a` fallback background behind the photo, regular-weight (400) title, 782px content width.
- Default (no option): homepage `large_hero` - 700px tall (content-height on mobile), bold (700) title, 1340px content width.
- Both render white centered text over the photo with the source dark gradient overlay and a white/blue outlined CTA.
