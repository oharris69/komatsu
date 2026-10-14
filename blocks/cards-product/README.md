# cards-product

Custom **cards** block. Purpose: product-listing.

## Authoring (Document Authoring)

Model: `standalone`

Single block table of key | value config rows (keys case-insensitive, any order). See "Configuration" below.

## Supported variations

No variations.

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
| Labels | optional, positional, comma-separated: View details, Clear all, Load more results, Metric, Imperial (US), Items per page, Displaying, of, items, Active filters, No products were returned., Filters, Remove filter |
| Preset | optional query string applied when the URL has no filter params, e.g. `equipment-type=small-excavators` |

- A filter label written as `Imperial label / Metric label` makes that facet unit-dependent: it reads the
  `<key>-imperial` / `<key>-metric` columns and shows the buckets of the active unit.
- Spec values always read `<key>-imperial` / `<key>-metric` (fallback: `<key>`); values include the unit.

## Product sheet (`{ data: [ ... ] }`)

Columns: `model`, `description` (optional), `link`, `image`, `image-alt`, `<spec>-imperial`, `<spec>-metric`,
`<filter>` or `<filter>-imperial` / `<filter>-metric`. Multi-value cells are separated by comma + space
(`IMC, Demolition`); a comma without a space (`5,000-25,000`) is kept as one value. Rows render in sheet order.

## URL presets

`?<filter>=<slug>`, slug = lowercased value with runs of non-alphanumerics replaced by `-` and leading/trailing
`-` trimmed (`Small excavators` -> `small-excavators`, `>900` -> `900`). Different params AND together; repeated
params OR within a group. The block keeps the URL in sync via `history.replaceState`.
