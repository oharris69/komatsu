/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-specs. Base: table (custom block, blocks/table-specs).
 * Follows the library Table convention (rows of data cells, 3 columns) with the project
 * contract's heading rows for tabs / groups / sub-groups (migration-work/model-detail-contract.md).
 * Source: https://www.komatsu.com/en-us/products/equipment/dozers/crawler-dozers/d71exi-24
 *   (coverage: d475a-8, d65px-18-wh)
 * Instance selector: .machinespecs .cmp-machinespecs
 * Source shape (live DOM verified):
 *   .cmp-tabs > h3 "Specifications"                       -> lifted to H2 default content by cleanup
 *   ol.cmp-tabs__tablist > li[role=tab]                   tab labels (Full specs, Standard / Optional equipment)
 *   .cmp-tabs__tabpanel (one per tab, same order)
 *     full specs: .cmp-machinespecs__tools (unit switch, Expand all / Close all) -> dropped
 *       .cmp-accordion__item > h3.cmp-accordion__header .cmp-accordion__title  (group)
 *         .cmp-accordion__panel: li.cmp-machinespecs__specs[data-unit] > span label + span value
 *           and nested sub-groups: p.cmp-machinespecs__child-char (title) + ul > li.cmp-machinespecs__specs
 *     equipment: .cmp-machinespecs__toggle-container (switch) -> dropped
 *       .cmp-machinespecs__equipment-list[data-unit=IMPERIAL|METRIC] > .cmp-machinespecs__category-name
 *         (ul / p / ul ... list content, one copy per unit system)
 * Output, 3 columns, rows in order:
 *   [<h3>tab</h3>]  [<h4>group</h4>]  [<h5>sub-group</h5>]   (padded to 3 cells)
 *   Label | Value | Units                       (data rows; label without trailing ':')
 *   '' | equipment list content | Units         (equipment tabs, one row per unit copy)
 * Units: data-unit on the row (set by the page JS, authoritative) -> imperial | metric;
 *   rows without it are neutral (empty) unless the label carries a unit suffix
 *   ((mm), (kg), (m³), (kW) ... -> metric; (in), (ft), (lbs), (yd³), (HP) ... -> imperial).
 *   Equipment lists without data-unit: first copy = imperial, second = metric.
 * Sub-groups are emitted where they occur (document order), so nested markup like
 *   <li><ul><p class="cmp-machinespecs__child-char"> is handled.
 * Generated: 2026-10-15
 */
const clean = (s) => String(s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

const METRIC_RE = /\((?:mm|cm|m|km|cm²|cm2|m²|m2|m³|m3|kg|t|tonnes?|kw|kn|kpa|mpa|kg\/cm²|kg\/cm2|l|ltr|liters?|litres?|l\/min|ltr\/min|km\/h|kmh|°c)\)\s*:?\s*$/i;
const IMPERIAL_RE = /\((?:in|ft|ft2|ft²|ft3|ft³|yd|yd²|yd³|yd3|lb|lbs|lbs\.|tons?|hp|psi|lbf|us gal|u\.s\. gal|gal|gpm|us gpm|u\.s\. gal\/min|mph|°f)\)\s*:?\s*$/i;

function unitOf(el, label) {
  const attr = clean(el && el.getAttribute('data-unit')).toLowerCase();
  if (attr === 'metric' || attr === 'imperial') return attr;
  if (attr === 'neutral') return '';
  if (label && METRIC_RE.test(label)) return 'metric';
  if (label && IMPERIAL_RE.test(label)) return 'imperial';
  return '';
}

function heading(document, tag, text) {
  const h = document.createElement(tag);
  h.textContent = text;
  return h;
}

// Label / value of a spec <li>. Live DOM: <span>Label:</span> <span>Value</span>. The importer's
// html2md preprocessing unwraps class-less spans before the transform runs, leaving separate
// text nodes ("Label:", "Value"); when even those are merged, split at the label's colon.
function splitSpec(li) {
  const spans = [...li.children].filter((c) => c.tagName === 'SPAN');
  if (spans.length >= 2) return [spans[0].textContent, spans.slice(1).map((s) => s.textContent).join(' ')];
  const parts = [...li.childNodes].map((n) => clean(n.textContent)).filter(Boolean);
  if (parts.length >= 2) return [parts[0], parts.slice(1).join(' ')];
  const text = clean(li.textContent);
  const m = text.match(/^(.*?\S):\s+(.*)$/);
  return m ? [m[1], m[2]] : [text, ''];
}

function specRow(li) {
  const [rawLabel, rawValue] = splitSpec(li);
  const label = clean(rawLabel).replace(/\s*:\s*$/, '');
  const value = clean(rawValue);
  if (!label && !value) return null;
  return [label, value, unitOf(li, label)];
}

function parseSpecsPanel(panel, document, cells) {
  let items = [...panel.querySelectorAll('.cmp-accordion__item')];
  if (!items.length) items = [...panel.querySelectorAll('.cmp-accordion')];
  if (!items.length) items = [panel];
  items.forEach((item) => {
    const titleEl = item.querySelector('.cmp-accordion__title')
      || item.querySelector('.cmp-accordion__header, .cmp-accordion__button');
    const title = clean(titleEl && titleEl.textContent).replace(/\s*[+−-]\s*$/, '');
    const body = item.querySelector('.cmp-accordion__panel') || item;
    const rows = [];
    body.querySelectorAll('p.cmp-machinespecs__child-char, li.cmp-machinespecs__specs').forEach((n) => {
      if (n.tagName === 'P') {
        const t = clean(n.textContent);
        if (t) rows.push([heading(document, 'h5', t), '', '']);
        return;
      }
      const row = specRow(n);
      if (row) rows.push(row);
    });
    if (!rows.length) return;
    if (title) cells.push([heading(document, 'h4', title), '', '']);
    cells.push(...rows);
  });
}

function parseEquipmentPanel(panel, document, cells) {
  const lists = [...panel.querySelectorAll('.cmp-machinespecs__equipment-list')];
  const fallbackUnits = lists.length === 2 ? ['imperial', 'metric'] : [];
  lists.forEach((list, i) => {
    const content = list.querySelector('.cmp-machinespecs__category-name') || list;
    const nodes = [...content.childNodes].filter((n) => n.nodeType === 1 || clean(n.textContent));
    if (!nodes.length || !clean(content.textContent)) return;
    const unit = unitOf(list, '') || fallbackUnits[i] || '';
    cells.push(['', nodes, unit]);
  });
}

export default function parse(element, { document }) {
  const tabsRoot = element.querySelector('.cmp-tabs') || element;
  const tabLabels = [...tabsRoot.querySelectorAll('.cmp-tabs__tablist [role="tab"], .cmp-tabs__tablist > li')]
    .filter((li, i, arr) => arr.indexOf(li) === i)
    .map((li) => clean(li.textContent));
  let panels = [...tabsRoot.querySelectorAll('.cmp-tabs__tabpanel')];
  if (!panels.length) panels = [...tabsRoot.querySelectorAll('[role="tabpanel"]')];
  if (!panels.length) panels = [tabsRoot];

  const cells = [];
  panels.forEach((panel, i) => {
    const panelCells = [];
    if (panel.querySelector('.cmp-machinespecs__equipment-list')) {
      parseEquipmentPanel(panel, document, panelCells);
    } else {
      parseSpecsPanel(panel, document, panelCells);
    }
    if (!panelCells.length) return;
    const label = tabLabels[i] || clean(panel.getAttribute('aria-label'));
    if (label) cells.push([heading(document, 'h3', label), '', '']);
    cells.push(...panelCells);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-specs', cells });
  element.replaceWith(block);
}
