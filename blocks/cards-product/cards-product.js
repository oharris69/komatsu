import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Cards Product: filterable product listing fed by a DA spreadsheet (products.json).
 * Authored as key | value rows: Products, Specs, Filters, Page size, Units, Labels
 * (+ optional Preset). See README.md for the full data contract.
 */

const LABEL_KEYS = ['viewDetails', 'clearAll', 'loadMore', 'metric', 'imperial', 'itemsPerPage',
  'displaying', 'of', 'items', 'activeFilters', 'noResults', 'filters', 'removeFilter'];
const LABEL_DEFAULTS = ['View details', 'Clear all', 'Load more results', 'Metric', 'Imperial (US)',
  'Items per page', 'Displaying', 'of', 'items', 'Active filters', 'No products were returned.',
  'Filters', 'Remove filter'];
const PAGE_SIZES = [12, 24, 36, 48, 60];
const UNITS = ['metric', 'imperial'];

let instance = 0;

export const slugify = (v) => String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === false || v === null || v === undefined) return;
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  node.append(...children.filter((c) => c !== null && c !== undefined));
  return node;
};

/** "Label: key, A / B: key2" -> [{ key, label: { imperial, metric }, unitDependent }] */
function parseEntries(text) {
  return (text || '').split(',').map((part) => {
    const i = part.lastIndexOf(':');
    if (i < 0) return null;
    const key = part.slice(i + 1).trim().toLowerCase();
    const raw = part.slice(0, i).trim();
    if (!key) return null;
    const [imperial, metric = imperial] = raw.split(' / ').map((s) => s.trim());
    return { key, label: { imperial, metric }, unitDependent: raw.includes(' / ') };
  }).filter(Boolean);
}

function resolveSource(cell) {
  const a = cell.querySelector('a');
  if (!a) return cell.textContent.trim();
  const url = new URL(a.href, window.location.href);
  const own = url.origin === window.location.origin || /\.aem\.(page|live)$/.test(url.hostname);
  return own ? `${url.pathname}${url.search}` : url.href;
}

function readConfig(block) {
  const cfg = {};
  [...block.children].forEach((row) => {
    const [k, v] = row.children;
    if (!k || !v) return;
    const key = k.textContent.trim().toLowerCase();
    if (key === 'products' || key === 'source') cfg.source = resolveSource(v);
    else cfg[key] = v.textContent.trim();
  });
  const custom = (cfg.labels || '').split(',').map((s) => s.trim());
  const labels = {};
  LABEL_KEYS.forEach((k, i) => { labels[k] = custom[i] || LABEL_DEFAULTS[i]; });
  const pageSize = parseInt(cfg['page size'], 10) || PAGE_SIZES[0];
  return {
    source: cfg.source,
    specs: parseEntries(cfg.specs),
    filters: parseEntries(cfg.filters),
    pageSize,
    units: UNITS.includes((cfg.units || '').toLowerCase()) ? cfg.units.toLowerCase() : 'imperial',
    preset: cfg.preset || cfg.filter || '',
    labels,
  };
}

const col = (row, key, unit, unitDependent) => {
  const v = unitDependent ? row[`${key}-${unit}`] ?? row[key] : row[key] ?? row[`${key}-${unit}`];
  return v === undefined || v === null ? '' : String(v).trim();
};

/** multi-value cells are ", " separated (thousands separators like 5,000 stay intact) */
const values = (row, f, unit) => col(row, f.key, unit, f.unitDependent).split(/,\s+/).map((s) => s.trim()).filter(Boolean);

export default async function decorate(block) {
  const cfg = readConfig(block);
  const { labels: L } = cfg;
  instance += 1;
  const id = `cards-product-${instance}`;

  const state = {
    unit: cfg.units,
    perPage: cfg.pageSize,
    visible: cfg.pageSize,
    selected: new Map(cfg.filters.map((f) => [f.key, new Set()])),
  };
  let products = [];
  const tileCache = new Map();

  // ---- skeleton ----
  const facets = el('div', { class: 'cards-product-facets' });
  const clearAll = el('button', { type: 'button', class: 'cards-product-clear' }, L.clearAll);
  const sidebar = el('aside', { class: 'cards-product-sidebar', id: `${id}-filters`, 'aria-label': L.filters }, facets, clearAll);
  const filtersToggle = el('button', {
    type: 'button', class: 'cards-product-filters-toggle', 'aria-expanded': 'false', 'aria-controls': sidebar.id,
  }, L.filters);

  const count = el('p', { class: 'cards-product-count', role: 'status', 'aria-live': 'polite' });
  const activeList = el('ul', { class: 'cards-product-active-list' });
  const active = el('div', { class: 'cards-product-active' }, el('span', { class: 'cards-product-active-label' }, L.activeFilters), activeList);
  const unitButtons = UNITS.map((u) => el('button', {
    type: 'button', class: 'cards-product-unit', 'data-unit': u, 'aria-pressed': String(u === state.unit),
  }, L[u]));
  const units = el('div', { class: 'cards-product-units', role: 'group' }, ...unitButtons);
  const toolbar = el('div', { class: 'cards-product-toolbar' }, count, active, units);

  const grid = el('ul', { class: 'cards-product-grid' });
  const message = el('p', { class: 'cards-product-message', hidden: true }, L.noResults);

  const select = el('select', { id: `${id}-per-page`, class: 'cards-product-per-page' });
  [...new Set([...PAGE_SIZES, cfg.pageSize])].sort((a, b) => a - b)
    .forEach((n) => select.append(el('option', { value: n, selected: n === cfg.pageSize }, String(n))));
  const loadMore = el('button', { type: 'button', class: 'cards-product-load-more' }, L.loadMore);
  const countBottom = el('p', { class: 'cards-product-count', 'aria-hidden': 'true' });
  const pager = el(
    'div',
    { class: 'cards-product-pager' },
    el('div', { class: 'cards-product-per-page-wrap' }, select, el('label', { for: select.id }, L.itemsPerPage)),
    loadMore,
    countBottom,
  );

  const results = el('div', { class: 'cards-product-results' }, toolbar, grid, message, pager);
  block.replaceChildren(el('div', { class: 'cards-product-layout' }, filtersToggle, sidebar, results));

  // ---- data helpers ----
  const matches = (row) => cfg.filters.every((f) => {
    const sel = state.selected.get(f.key);
    return !sel.size || values(row, f, state.unit).some((v) => sel.has(slugify(v)));
  });

  const optionsFor = (f) => {
    const seen = new Map();
    products.forEach((row) => values(row, f, state.unit).forEach((v) => {
      if (!seen.has(slugify(v))) seen.set(slugify(v), v);
    }));
    return seen;
  };

  const syncUrl = () => {
    const url = new URL(window.location.href);
    cfg.filters.forEach((f) => {
      url.searchParams.delete(f.key);
      state.selected.get(f.key).forEach((s) => url.searchParams.append(f.key, s));
    });
    window.history.replaceState(window.history.state, '', url);
  };

  const buildTile = (row) => {
    const link = row.link || row.path || '';
    const model = row.model || '';
    const heading = el('h3', { class: 'cards-product-title' }, link ? el('a', { href: link }, model) : model);
    const media = el('div', { class: 'cards-product-image' });
    if (row.image) media.append(createOptimizedPicture(row.image, row['image-alt'] || model, false, [{ width: '750' }]));
    const specs = el('dl', { class: 'cards-product-specs' });
    const body = el(
      'div',
      { class: 'cards-product-body' },
      heading,
      row.description ? el('p', { class: 'cards-product-description' }, row.description) : null,
      specs,
      el('span', { class: 'cards-product-cta', 'aria-hidden': 'true' }, L.viewDetails),
    );
    const li = el('li', { class: `cards-product-card${link ? ' cards-product-card-linked' : ''}` }, media, body);
    return { li, specs };
  };

  const tileFor = (row) => {
    if (!tileCache.has(row)) tileCache.set(row, buildTile(row));
    const tile = tileCache.get(row);
    if (tile.unit !== state.unit) {
      tile.specs.replaceChildren(...cfg.specs.map((s) => {
        const v = col(row, s.key, state.unit, true);
        return v ? el('div', {}, el('dt', {}, s.label[state.unit]), el('dd', {}, v)) : null;
      }).filter(Boolean));
      tile.unit = state.unit;
    }
    return tile.li;
  };

  // ---- rendering ----
  const renderFacets = () => {
    facets.replaceChildren(...cfg.filters.map((f) => {
      const opts = optionsFor(f);
      if (!opts.size) return null;
      const sel = state.selected.get(f.key);
      const items = [...opts].map(([slug, label]) => {
        const input = el('input', {
          type: 'checkbox', name: f.key, value: slug, checked: sel.has(slug), id: `${id}-${f.key}-${slug}`,
        });
        return el('li', {}, input, el('label', { for: input.id }, label));
      });
      const name = f.label[state.unit];
      return el(
        'details',
        { class: 'cards-product-facet', open: true },
        el('summary', {}, name),
        el('fieldset', {}, el('legend', { class: 'cards-product-sr' }, name), el('ul', {}, ...items)),
      );
    }).filter(Boolean));
  };

  const renderResults = () => {
    const list = products.filter(matches);
    const shown = list.slice(0, state.visible);
    grid.replaceChildren(...shown.map(tileFor));
    message.hidden = list.length > 0;
    const text = list.length
      ? `${L.displaying} 1-${shown.length} ${L.of} ${list.length} ${L.items}`
      : `${L.displaying} 0 ${L.of} 0 ${L.items}`;
    count.textContent = text;
    countBottom.textContent = text;
    loadMore.hidden = shown.length >= list.length;

    const chips = [];
    cfg.filters.forEach((f) => {
      const opts = optionsFor(f);
      state.selected.get(f.key).forEach((slug) => {
        const label = opts.get(slug) || slug;
        chips.push(el('li', {}, el('button', {
          type: 'button', class: 'cards-product-chip', 'data-key': f.key, 'data-slug': slug, 'aria-label': `${L.removeFilter}: ${label}`,
        }, label)));
      });
    });
    activeList.replaceChildren(...chips);
    active.hidden = !chips.length;
    clearAll.disabled = !chips.length;
  };

  const update = ({ facetsToo = false } = {}) => {
    state.visible = state.perPage;
    if (facetsToo) renderFacets();
    renderResults();
    syncUrl();
  };

  // ---- events ----
  facets.addEventListener('change', (e) => {
    const { name, value, checked } = e.target;
    if (!state.selected.has(name)) return;
    state.selected.get(name)[checked ? 'add' : 'delete'](value);
    update();
  });
  activeList.addEventListener('click', (e) => {
    const chip = e.target.closest('.cards-product-chip');
    if (!chip) return;
    state.selected.get(chip.dataset.key).delete(chip.dataset.slug);
    update({ facetsToo: true });
  });
  clearAll.addEventListener('click', () => {
    state.selected.forEach((s) => s.clear());
    update({ facetsToo: true });
  });
  units.addEventListener('click', (e) => {
    const btn = e.target.closest('.cards-product-unit');
    if (!btn || btn.dataset.unit === state.unit) return;
    state.unit = btn.dataset.unit;
    unitButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    // unit-dependent facets have different buckets per unit: drop their selections
    cfg.filters.filter((f) => f.unitDependent).forEach((f) => state.selected.get(f.key).clear());
    update({ facetsToo: true });
  });
  select.addEventListener('change', () => {
    state.perPage = parseInt(select.value, 10);
    state.visible = state.perPage;
    renderResults();
  });
  loadMore.addEventListener('click', () => {
    state.visible += state.perPage;
    renderResults();
  });
  filtersToggle.addEventListener('click', () => {
    const open = filtersToggle.getAttribute('aria-expanded') !== 'true';
    filtersToggle.setAttribute('aria-expanded', String(open));
    sidebar.classList.toggle('is-open', open);
  });

  // ---- initial state: URL params, else authored preset ----
  const params = new URLSearchParams(window.location.search);
  const fromUrl = cfg.filters.some((f) => params.has(f.key));
  const initial = fromUrl ? params : new URLSearchParams(cfg.preset);
  cfg.filters.forEach((f) => initial.getAll(f.key)
    .forEach((v) => state.selected.get(f.key).add(slugify(v))));

  // ---- load ----
  try {
    if (!cfg.source) throw new Error('cards-product: no Products source configured');
    let resp = await fetch(cfg.source);
    // local preview serves documents under /content
    if (!resp.ok && cfg.source.startsWith('/') && !cfg.source.startsWith('/content/')) {
      resp = await fetch(`/content${cfg.source}`);
    }
    if (!resp.ok) throw new Error(`cards-product: ${resp.status} ${cfg.source}`);
    const json = await resp.json();
    products = (json.data || json[json[':names']?.[0]]?.data || []).filter((r) => r.model);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    products = [];
  }
  // drop preset/URL values that match no option for the active unit
  cfg.filters.forEach((f) => {
    const opts = optionsFor(f);
    const sel = state.selected.get(f.key);
    [...sel].filter((s) => !opts.has(s)).forEach((s) => sel.delete(s));
  });
  renderFacets();
  renderResults();
}
