/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tiles. Base: cards.
 * Source: https://www.komatsu.com/en-us
 * Instance selector: .tiles.tilesmall .tile-list
 *   (matches both the 5-tile mosaic and the 4-tile "Get in touch" row)
 * Structure (DA block table, 2 columns):
 *   one row per card: [ image | linked heading (+ optional description) ]
 * Iteration: keyed on the block wrapper .grid > .item (not the wrapping <a>).
 *
 * Solid variant (technology-landing, https://www.komatsu.com/en-us/technology/smart-construction):
 * Instance selector: .tilescolorblocks.tilesmall .tiles_color_blocks
 *   (solid blue link tiles: title + decorative arrow, no images)
 * Structure: block "cards-tiles (solid)", 1 column, one row per tile: [ linked heading ]
 *   The sr-only duplicate of the title and the arrow svg are dropped.
 * Iteration: keyed on the block-level .tiles_column wrapper (not the inner <a>).
 * The homepage path below is unchanged.
 *
 * Chips variant (equipment-category-listing, https://www.komatsu.com/en-us/products/equipment/excavators):
 * Instance selector: div.columncontainer.column-horizontal-center .buttongroup .cmp-container
 *   (outlined category buttons: div.button > a.cmp-button > span.cmp-button__buttontext)
 * Structure: block "cards-tiles (chips)", 1 column, one row per chip: [ link ]
 * Iteration: keyed on the block-level div.button wrapper (not the inner <a>).
 * Hrefs: chips pre-filter the cards-product grid on the same page, so each source
 *   href (?equipment_type=3689, ?equipment_specialties=2275, ...) is resolved to the
 *   facet option LABEL via the sidebar checkboxes in the live DOM
 *   (input.cmp-equipmentlisting__checkbox--aggregation-option name/value -> data-label-text)
 *   and rewritten to ?<filter-key>=<slug> (cards-product URL preset contract).
 *   Broken/unresolvable hrefs fall back to matching the chip text against the
 *   facet option labels ("Demolition excavators" -> specialties "Demolition").
 * Anchors variant (equipment-model-detail, https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71exi-24):
 * Instance selector: .anchorlink .anchor-links  (ul > li > a[href="#<source id>"])
 * Structure: block "cards-tiles (anchors)", 1 column, one row per jump link: [ link ]
 * Hrefs: the source ids (#features, #specifications, #serviceandsupport, #technology,
 *   #infographic, #videos, ...) are rewritten to the EDS id of the target section heading:
 *   the H2 komatsu-cleanup.js lifted in front of the target (or one of its close ancestors),
 *   else the first H1-H3 inside the target, slugified like aem.js toClassName. Links whose
 *   target id is not on the page are dropped (e.g. hidden #videos, removed #threesixty).
 * Generated: 2026-10-12 (solid variant added 2026-10-13, chips variant added 2026-10-13,
 *   anchors variant added 2026-10-15)
 */

// --- chips helpers (keep in sync with parsers/cards-product.js and blocks/cards-product) ---
const chipSlugify = (v) => String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Commerce attribute code -> cards-product filter key
function chipFilterKey(code) {
  const base = String(code).replace(/_(imperial|metric)$/, '');
  if (base === 'equipment_specialties') return 'specialties';
  return base.replace(/_/g, '-');
}

// name -> value -> label, from the listing sidebar (or the map cards-product stashed)
function readFacetOptions(document) {
  const map = {};
  document.querySelectorAll('input.cmp-equipmentlisting__checkbox--aggregation-option[name]').forEach((input) => {
    const label = (input.getAttribute('data-label-text')
      || (input.closest('label') ? input.closest('label').textContent : '')).replace(/\s+/g, ' ').trim();
    if (!label) return;
    map[input.name] = map[input.name] || {};
    map[input.name][input.value] = label;
  });
  if (!Object.keys(map).length) {
    try {
      const stash = document.documentElement.getAttribute('data-komatsu-facets');
      if (stash) return JSON.parse(stash);
    } catch (e) { /* ignore */ }
  }
  return map;
}

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

function rewriteChipHref(rawHref, text, facets, pagePath) {
  // Broken AEM href with an absolute URL glued onto a content path - keep the URL part
  let href = rawHref || '';
  const glued = href.lastIndexOf('http');
  if (glued > 0) href = href.slice(glued);
  let target = null;
  try { target = new URL(href, 'https://www.komatsu.com'); } catch (e) { target = null; }

  const targetPath = target ? target.pathname.replace(/\.html?$/, '').replace(/\/$/, '') : '';
  // Another listing page (resolved via its query) keeps its path; same page -> query only
  let prefix = target && targetPath && pagePath && targetPath !== pagePath ? targetPath : '';

  // 1. Query param -> facet option label
  const pairs = [];
  if (target) {
    target.searchParams.forEach((value, name) => {
      const label = facets[name] && facets[name][value];
      if (label) pairs.push([chipFilterKey(name), chipSlugify(label)]);
    });
  }
  // 2. Fallback: chip text contains a facet option label (longest match wins)
  if (!pairs.length) {
    prefix = ''; // href unusable: the chip filters the listing on this page
    const t = ` ${text.toLowerCase().replace(/\s+/g, ' ')} `;
    let best = null;
    Object.entries(facets).forEach(([name, options]) => {
      Object.values(options).forEach((label) => {
        const l = label.toLowerCase();
        if (t.includes(` ${l} `) && (!best || l.length > best.label.length)) best = { name, label };
      });
    });
    if (best) pairs.push([chipFilterKey(best.name), chipSlugify(best.label)]);
  }
  if (!pairs.length) return rawHref;
  const query = pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `${prefix}?${query}`;
}

function parseChips(element, document, url, params) {
  let buttons = Array.from(element.querySelectorAll(':scope > .button'));
  if (!buttons.length) buttons = Array.from(element.querySelectorAll('.button'));
  const facets = readFacetOptions(document);
  const pagePath = currentPagePath(document, url, params);

  const cells = [];
  const seen = new Set();
  buttons.forEach((btn) => {
    const link = btn.querySelector('a[href]') || btn.closest('a[href]');
    if (!link || seen.has(link)) return;
    seen.add(link);
    const text = (link.querySelector('.cmp-button__buttontext') || link).textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    const a = document.createElement('a');
    a.href = rewriteChipHref(link.getAttribute('href'), text, facets, pagePath);
    a.textContent = text;
    cells.push([a]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles (chips)', cells });
  element.replaceWith(block);
}

function parseSolid(element, document) {
  let columns = Array.from(element.querySelectorAll(':scope > .tiles_column'));
  if (!columns.length) columns = Array.from(element.querySelectorAll('.tiles_column, .tiles_content'));

  const cells = [];
  columns.forEach((col) => {
    const link = col.querySelector('a[href]') || col.closest('a[href]');
    const titleEl = col.querySelector('.tiles_title, h1, h2, h3, h4, h5, h6');
    let title = titleEl ? (titleEl.getAttribute('title') || '').trim() : '';
    if (!title && titleEl) {
      // First text only - skip the visually hidden duplicate (.sr-only)
      const clone = titleEl.cloneNode(true);
      clone.querySelectorAll('.sr-only').forEach((s) => s.remove());
      title = clone.textContent.trim();
    }
    if (!title && link) title = link.textContent.trim();
    if (!title) return;

    const h = document.createElement(titleEl && /^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName.toLowerCase() : 'h3');
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = title;
      h.appendChild(a);
    } else {
      h.textContent = title;
    }
    cells.push([h]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles (solid)', cells });
  element.replaceWith(block);
}

// --- anchors helpers (equipment-model-detail; Cards "no images" convention: 1 column) ---
// Same as aem.js toClassName (EDS heading ids / readBlockConfig keys)
const toClassName = (name) => (typeof name === 'string'
  ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  : '');
// Marker komatsu-cleanup.js puts on section headings it lifts out of model-page blocks
// (removed again in afterTransform, i.e. after all parsers ran).
const LIFTED_HEADING_ATTR = 'data-km-lifted-heading';
const anchorClean = (s) => String(s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

// Heading text of the section that holds the jump-link target element.
function anchorHeading(target) {
  // 1. A section heading lifted by cleanup sits right before the target or one of its
  //    close ancestors (e.g. #specifications = .cmp-tabs inside the lifted .cmp-machinespecs).
  let node = target;
  for (let depth = 0; node && depth < 4; depth += 1) {
    if (node.tagName === 'BODY' || node.classList.contains('aem-Grid')) break;
    let prev = node.previousElementSibling;
    while (prev && prev.tagName === 'HR') prev = prev.previousElementSibling;
    if (prev && /^H[1-6]$/.test(prev.tagName) && prev.hasAttribute(LIFTED_HEADING_ATTR)) {
      return anchorClean(prev.textContent);
    }
    node = node.parentElement;
  }
  // 2. Otherwise the first H1-H3 inside the target (infographic title promoted to h2 by
  //    cleanup, carousel title "Videos" emitted as h2 by the carousel-gallery parser).
  const inner = [...target.querySelectorAll('h1, h2, h3')].find((h) => anchorClean(h.textContent));
  return inner ? anchorClean(inner.textContent) : '';
}

function parseAnchors(element, document) {
  let items = Array.from(element.querySelectorAll(':scope > ul > li'));
  if (!items.length) items = Array.from(element.querySelectorAll('li'));

  const cells = [];
  items.forEach((li) => {
    const link = li.querySelector('a[href]');
    if (!link) return;
    const text = anchorClean(link.textContent);
    const raw = link.getAttribute('href') || '';
    if (!text || !raw.startsWith('#') || raw.length < 2) return;
    let id = raw.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { /* keep raw */ }
    const target = document.getElementById(id);
    if (!target || target.closest('header, footer')) return; // target not on this page: drop
    const slug = toClassName(anchorHeading(target));
    if (!slug) return;
    const a = document.createElement('a');
    a.href = `#${slug}`;
    a.textContent = text;
    cells.push([a]);
  });

  if (!cells.length) {
    element.remove();
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles (anchors)', cells });
  element.replaceWith(block);
}

export default function parse(element, { document, url, params }) {
  // In-page jump links (equipment-model-detail): div.anchorlink > div.anchor-links > ul > li > a[href^="#"]
  if (element.classList.contains('anchor-links') || element.closest('.anchorlink')) {
    parseAnchors(element, document);
    return;
  }
  if (element.classList.contains('tiles_color_blocks') || element.querySelector(':scope > .tiles_column')) {
    parseSolid(element, document);
    return;
  }
  // Category chips: AEM button group (absent from homepage / technology-landing tiles)
  if (element.closest('.buttongroup') && element.querySelector('.button a.cmp-button')) {
    parseChips(element, document, url, params);
    return;
  }

  let items = Array.from(element.querySelectorAll(':scope > .grid > .item'));
  if (!items.length) items = Array.from(element.querySelectorAll('.grid .item, :scope > .item'));
  if (!items.length) items = Array.from(element.querySelectorAll(':scope > .grid'));

  const cells = [];

  items.forEach((item) => {
    // Link may live inside the item or on a wrapping <a>
    const link = item.querySelector('a[href]') || item.closest('a[href]');
    const href = link ? link.getAttribute('href') : null;
    // Content image only - skip the decorative arrow svg inside p.arrow
    const img = item.querySelector(':scope picture') || item.querySelector('img:not(.arrow img)');
    const titleEl = item.querySelector('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6')
      || item.querySelector('h1, h2, h3, h4, h5, h6');
    const title = titleEl ? titleEl.textContent.trim() : '';
    const desc = Array.from(item.querySelectorAll('.content p:not(.arrow)')).filter((p) => p.textContent.trim());

    if (!img && !title) return;

    const imageCell = img ? [img] : '';

    const textCell = [];
    if (title) {
      const h = document.createElement(titleEl.tagName.toLowerCase());
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        h.appendChild(a);
      } else {
        h.textContent = title;
      }
      textCell.push(h);
    }
    textCell.push(...desc);

    cells.push([imageCell, textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles', cells });
  element.replaceWith(block);
}
