# hero-product

Custom **hero** block. Purpose: product-detail-header.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)

## Content model

- Key | value rows (first cell = key, case-insensitive). images | all gallery pictures in one cell (first = main, alt = model)
- intro | eyebrow <p> (family), <h1> model, <p> subtitle
- spec | Label | Value | Units (imperial, metric or empty = always shown), one row per quick spec
- actions | <p> 'Purchase options', <strong><a> primary CTA, <em><a> secondary CTA. Section style: white-container. Follows the shared unit preference (scripts/units.js).
