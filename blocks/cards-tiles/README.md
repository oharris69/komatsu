# cards-tiles

Custom **cards** block. Purpose: navigation-tiles.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

| Variation | Option class |
| --- | --- |
| Solid: no-image link tiles on solid brand blue, title + arrow, 6 per row | `solid` |
| Chips: outlined pill links in a wrapping row, text only (category/filter shortcuts) | `chips` |
| Anchors: in-page jump links (one cell: link to #heading-id) in a centered text row; links to ids missing on the page are hidden | `anchors` |

## Universal Editor fields

N/A (Document Authoring project)

## Content model

- 4 rows: image | h2 title linked (5-row instances render as a 1 large + 2x2 mosaic); chips option: one row per chip, one cell: link
- anchors option: one row per jump link, one cell: link to #<heading-id>
