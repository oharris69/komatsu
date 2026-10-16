# table-specs

Custom **table** block. Purpose: specifications.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)

## Content model

- Single block, rows in order
- single-cell <h3> row = tab (Full specs, Standard equipment, Optional equipment; tabs render only when more than one)
- single-cell <h4> row = collapsible group in the current tab (all closed initially as on komatsu.com; Expand all / Close all)
- single-cell <h5> row = sub-group title
- data row: Label | Value | Units (imperial, metric or empty = always shown)
- equipment rows: Label empty or 'Equipment' | list content (bullets, sub-headings, footnotes) | Units
- each row is filtered by its own Units cell (no metric/imperial pairing)
- 'Specifications' H2 is default content above the block
- follows the shared unit preference (scripts/units.js)
- section style: white-container
