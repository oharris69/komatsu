# cards-product

Custom **cards** block. Purpose: product-listing.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row, one cell of content.

## Supported variations

| Variation | Option class |
| --- | --- |
| Related: only the models listed in a Models row, as a centred row of tiles (282px tiles from 900px, 2 per row from 450px, stacked below); no filters, toolbar, paging or unit switch | `related` |

## Universal Editor fields

N/A (Document Authoring project)

## Configuration (key | value rows)

| Key | Value (example) |
| --- | --- |
| Products | `/en-us/products/equipment/excavators/products.json` (link or text) |
| Specs | `Bucket capacity: bucket-capacity, Horsepower: horsepower, Operating weight: operating-weight` |
| Filters | `Equipment type: equipment-type, Horsepower range (HP) / Horsepower range (kW): horsepower-range, ...` |
| Page size | `12` |
| Units | `imperial` or `metric` (default unit system) |
| Labels | optional, positional, comma-separated: View details, Clear all, Load more results, Metric, Imperial (US), Items per page, Displaying, of, items, Active filters, No products were returned., Filter results, Remove filter |
| Preset | optional query string applied when the URL has no filter params, e.g. `equipment-type=small-excavators` |

- A filter label written as `Imperial label / Metric label` makes that facet unit-dependent: it reads the
  `<key>-imperial` / `<key>-metric` columns and shows the buckets of the active unit.
- Spec values always read `<key>-imperial` / `<key>-metric` (fallback: `<key>`); values include the unit.

## Layout

- Below 1200px the filters live in an off-canvas drawer opened by the "Filter results" button; a backdrop click or
  Escape closes it. From 1200px the sidebar is inline (220px). Grid: 1 column, 2 from 600px, 3 from 900px.
- Active filters show as removable chips followed by a "Clear all" chip. The Metric | Imperial switch is two
  buttons with a CSS-drawn track (`.cards-product-units[data-unit]`); clicking the track flips the unit.
- Units use the shared page preference (`scripts/units.js`): the block starts from the stored choice (else the
  authored `Units` value), its switch calls `setUnit()`, and it re-renders when any block on the page (hero-product,
  table-specs) switches units. Unit-dependent facet selections are cleared on a unit change, as before.

## Product sheet (`{ data: [ ... ] }`)

Columns: `model`, `description` (optional), `link`, `image`, `image-alt`, `<spec>-imperial`, `<spec>-metric`,
`<filter>` or `<filter>-imperial` / `<filter>-metric`. Multi-value cells are separated by comma + space
(`IMC, Demolition`); a comma without a space (`5,000-25,000`) is kept as one value. Rows render in sheet order.

## URL presets

`?<filter>=<slug>`, slug = lowercased value with runs of non-alphanumerics replaced by `-` and leading/trailing
`-` trimmed (`Small excavators` -> `small-excavators`, `>900` -> `900`). Different params AND together; repeated
params OR within a group. The block keeps the URL in sync via `history.replaceState`.

## Option: related

| Key | Value (example) |
| --- | --- |
| Products | `/en-us/products/equipment/dozers/products.json` |
| Models | `D71PXi-24, D71EX-24, D71PX-24` (display order; models missing from the sheet are skipped) |
| Specs | `Blade capacity (yd³) / Blade capacity (m³): blade-capacity, Horsepower (HP) / Horsepower (kW): horsepower, ...` |
| Units | `imperial` |

Renders only the listed models with the listing tile markup, as a centred, wrapping row like the source
"Related products" module (tiles up to 282px wide from 900px, 2 per row from 450px, stacked below; no carousel). No sidebar, toolbar, paging or unit switch: spec rows follow the shared
page unit preference. "Related products" H2 is default content above the block.
