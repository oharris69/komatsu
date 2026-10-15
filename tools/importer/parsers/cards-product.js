/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base: cards (custom config block).
 * Source: https://www.komatsu.com/en-us/products/equipment/excavators
 * Instance selector: .equipmentlisting .cmp-equipmentlisting
 *
 * The source listing is rendered client-side from the Commerce feed (sidebar facets,
 * 12 sample tiles, counters, paging). Product data moves to a DA sheet per equipment
 * family (<page path>/products.json), so NO tiles are emitted. Instead the element is
 * replaced by the cards-product CONFIG block (migration-work/cards-product-contract.md,
 * blocks/cards-product/README.md) - 2 columns, key | value rows:
 *   Products  | link to <current page path>/products.json
 *   Specs     | "<Label>: <key>, ..."   from the tile spec labels
 *               (span.label in .cmp-equipmentlisting__item-specs, unit suffix "(m3)", "(HP)" dropped)
 *   Filters   | "<Label>: <key>, <Imperial label> / <Metric label>: <key>, ..."
 *               from the sidebar facet groups (input[name="aggregation"] value = attribute
 *               code, data-label-text = label); the Categories group (input[name="category"])
 *               is not a facet of the sheet and is skipped. *_imperial / *_metric pairs
 *               collapse into one unit-dependent entry (imperial label first).
 *   Page size | data-page-size on div.cmp-equipmentlisting (fallback: selected page-size option, 12)
 *   Units     | imperial (source default unit system)
 *   Labels    | visible UI strings, positional (README order), read from data attributes /
 *               DOM where present, English defaults otherwise.
 * Key mapping (attribute code -> filter key): equipment_type -> equipment-type,
 *   equipment_specialties -> specialties, *_imperial|*_metric suffix dropped
 *   (horsepower_range_* -> horsepower-range, operating_weight_range_* -> operating-weight-range),
 *   otherwise "_" -> "-". Keep in sync with the chips helpers in parsers/cards-tiles.js.
 * The facet option map (name -> value -> label) is stashed on <html data-komatsu-facets>
 *   so the cards-tiles chips parser can still resolve chip hrefs if it runs after this one.
 * Generated: 2026-10-13
 */
const slugify = (v) => String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function filterKey(code) {
  const base = String(code).replace(/_(imperial|metric)$/, '');
  if (base === 'equipment_specialties') return 'specialties';
  return base.replace(/_/g, '-');
}

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

// Commas separate entries in the block config - never let one into a label
const safe = (s) => clean(s).replace(/,/g, '');

function currentPagePath(document, url, params) {
  const candidates = [params && params.originalURL, url];
  try { candidates.push(document.defaultView && document.defaultView.location.href); } catch (e) { /* ignore */ }
  for (const c of candidates) {
    if (!c) continue;
    try {
      const u = new URL(c);
      if (/^https?:$/.test(u.protocol)) return u.pathname.replace(/\.html?$/, '').replace(/\/$/, '');
    } catch (e) { /* ignore */ }
  }
  return '';
}

function readSpecs(element) {
  const seen = new Set();
  const specs = [];
  element.querySelectorAll('.cmp-equipmentlisting__item-specs .label').forEach((l) => {
    // "Bucket capacity (m3)" / "Horsepower (HP)" -> "Bucket capacity" / "Horsepower"
    const label = safe(l.textContent).replace(/\s*\([^)]*\)\s*$/, '').trim();
    const key = slugify(label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    specs.push(`${label}: ${key}`);
  });
  return specs;
}

function readFilters(element) {
  const groups = new Map(); // key -> { imperial, metric, plain }
  element.querySelectorAll('input.cmp-equipmentlisting__checkbox--aggregation[name="aggregation"], input[name="aggregation"]').forEach((input) => {
    const code = input.value;
    const label = safe(input.getAttribute('data-label-text')
      || (input.closest('label') ? input.closest('label').textContent : ''));
    if (!code || !label || code === 'category' || /^categor(y|ies)$/i.test(label)) return;
    const key = filterKey(code);
    const g = groups.get(key) || {};
    const unitMatch = code.match(/_(imperial|metric)$/);
    if (unitMatch) g[unitMatch[1]] = g[unitMatch[1]] || label;
    else g.plain = g.plain || label;
    groups.set(key, g);
  });
  return [...groups.entries()].map(([key, g]) => {
    if (g.imperial && g.metric) return `${g.imperial} / ${g.metric}: ${key}`;
    return `${g.plain || g.imperial || g.metric}: ${key}`;
  });
}

function readFacetOptions(element) {
  const map = {};
  element.querySelectorAll('input.cmp-equipmentlisting__checkbox--aggregation-option[name]').forEach((input) => {
    const label = clean(input.getAttribute('data-label-text')
      || (input.closest('label') ? input.closest('label').textContent : ''));
    if (!label) return;
    map[input.name] = map[input.name] || {};
    map[input.name][input.value] = label;
  });
  return map;
}

function readLabels(element) {
  const text = (sel) => {
    const n = element.querySelector(sel);
    return n ? safe(n.textContent) : '';
  };
  const data = (name) => safe(element.getAttribute(name));

  // "Items per page" = label text without the <select> options
  let itemsPerPage = '';
  const ippLabel = element.querySelector('.cmp-equipmentlisting__items-label');
  if (ippLabel) {
    const c = ippLabel.cloneNode(true);
    c.querySelectorAll('select').forEach((s) => s.remove());
    itemsPerPage = safe(c.textContent);
  }

  // "Displaying <start>- <end> of <total> items" -> the three text fragments
  let counter = [];
  const countP = element.querySelector('.cmp-equipmentlisting__items-count');
  if (countP) {
    counter = [...countP.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => safe(n.textContent).replace(/^[-–]\s*/, '').trim())
      .filter(Boolean);
  }
  const [displaying, of, items] = counter.length === 3 ? counter : [];

  const values = [
    data('data-item-button-text') || text('.cmp-equipmentlisting__item-action'),
    data('data-clear-chip-text'),
    text('.cmp-equipmentlisting__load-more'),
    text('.cmp-metricimperialconverter__text-metric'),
    text('.cmp-metricimperialconverter__text-imperial'),
    itemsPerPage,
    displaying,
    of,
    items,
    text('.cmp-equipmentlisting__chips-label'),
    data('data-default-error-msg-text'),
  ];
  const defaults = ['View details', 'Clear all', 'Load more results', 'Metric', 'Imperial (US)',
    'Items per page', 'Displaying', 'of', 'items', 'Active filters', 'No products were returned.'];
  return defaults.map((d, i) => values[i] || d);
}

// Related products (equipment-model-detail): div.relatedproducts > div > div.related-products
//   > div.related-products_container > div.product-card > a[href] > div.product-card__wrapper
//     > img + div.product-card__content > h5.product-card__title (model)
//       + ul > li.product-card__description-specs > span.product-card__description-lable (sic) + value
//       + button "View details"  (button nested in <a>: invalid, flattened on re-parse - never used)
// Model names are read from the h5.product-card__title headings in document order (one per
// card; headings are not affected by the anchor/button flattening).
// Output (project config-block contract, not the library Cards rows - tiles are rendered
// from the family sheet; cards-product "related" option, 2 columns key | value):
//   Products | link to /<lang>/products/equipment/<family>/products.json (family = path segment after /equipment/)
//   Models   | related model names, comma-separated, display order
//   Specs    | "<Label>: <key>, ..." from the card spec labels (unit suffix dropped), same as the family listing
//   Units    | imperial
function parseRelated(element, document, url, params) {
  const pagePath = currentPagePath(document, url, params);
  const m = pagePath.match(/^(.*?\/equipment\/[^/]+)/);
  if (!m) {
    element.replaceWith(...element.childNodes);
    return;
  }
  const productsPath = `${m[1]}/products.json`;

  let titles = Array.from(element.querySelectorAll('.product-card__title'));
  if (!titles.length) titles = Array.from(element.querySelectorAll('.product-card h1, .product-card h2, .product-card h3, .product-card h4, .product-card h5, .product-card h6'));
  const models = [];
  titles.forEach((title) => {
    const name = safe(title.textContent);
    if (name && !models.includes(name)) models.push(name);
  });
  if (!models.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const seen = new Set();
  const specs = [];
  element.querySelectorAll('.product-card__description-lable, .product-card__description-label').forEach((l) => {
    const label = safe(l.textContent).replace(/\s*\([^)]*\)\s*$/, '').trim();
    const key = slugify(label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    specs.push(`${label}: ${key}`);
  });

  const productsLink = document.createElement('a');
  productsLink.href = productsPath;
  productsLink.textContent = productsPath;

  const cells = [['Products', productsLink], ['Models', models.join(', ')]];
  if (specs.length) cells.push(['Specs', specs.join(', ')]);
  cells.push(['Units', 'imperial']);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product (related)', cells });
  element.replaceWith(block);
}

export default function parse(element, { document, url, params }) {
  if (element.classList.contains('relatedproducts') || element.querySelector(':scope .related-products')) {
    parseRelated(element, document, url, params);
    return;
  }
  const pagePath = currentPagePath(document, url, params);
  if (!pagePath) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Let the chips parser resolve facet values even after this element is gone
  const facets = readFacetOptions(element);
  if (Object.keys(facets).length) {
    try { document.documentElement.setAttribute('data-komatsu-facets', JSON.stringify(facets)); } catch (e) { /* ignore */ }
  }

  const productsPath = `${pagePath}/products.json`;
  const productsLink = document.createElement('a');
  productsLink.href = productsPath;
  productsLink.textContent = productsPath;

  const specs = readSpecs(element);
  const filters = readFilters(element);

  let pageSize = parseInt(element.getAttribute('data-page-size'), 10);
  if (!pageSize) {
    const opt = element.querySelector('.cmp-equipmentlisting__items-select option[selected], .cmp-equipmentlisting__items-select option');
    pageSize = parseInt(opt ? opt.value : '', 10) || 12;
  }

  const cells = [['Products', productsLink]];
  if (specs.length) cells.push(['Specs', specs.join(', ')]);
  if (filters.length) cells.push(['Filters', filters.join(', ')]);
  cells.push(['Page size', String(pageSize)]);
  cells.push(['Units', 'imperial']);
  cells.push(['Labels', readLabels(element).join(', ')]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
