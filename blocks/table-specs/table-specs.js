import {
  createUnitSwitch, getUnit, onUnitChange, toUnit,
} from '../../scripts/units.js';

/*
 * Table Specs: machine specifications.
 * Rows:
 *   single cell <h3>  -> tab (tabs render only when there is more than one)
 *   single cell <h4>  -> collapsible group inside the current tab (first group open)
 *   single cell <h5>  -> sub-group title inside the current group
 *   Label | Value | Units -> data row; Units = imperial | metric | empty (always shown)
 *   equipment rows: list content in the Value cell, Label empty or "Equipment", Units per system
 * Every row is filtered by its own Units cell (metric/imperial rows are never paired).
 */

const LABELS = { expand: 'Expand all', collapse: 'Close all' };
let instance = 0;

const el = (tag, className, ...children) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children.filter(Boolean));
  return node;
};

const isEmpty = (cell) => !cell || (!cell.textContent.trim() && !cell.querySelector('img, picture'));

/** heading that is the only content of the row -> { level, node } */
function rowHeading(cells) {
  const filled = cells.filter((c) => !isEmpty(c));
  if (filled.length !== 1) return null;
  const h = filled[0].querySelector('h1, h2, h3, h4, h5, h6');
  if (!h || h.textContent.trim() !== filled[0].textContent.trim()) return null;
  return { level: Number(h.tagName[1]), text: h.textContent.trim() };
}

function parseRow(row) {
  const cells = [...row.children];
  const heading = rowHeading(cells);
  if (heading) return { type: 'heading', ...heading };

  const [first, second, third] = cells;
  // 2 cells where the second is a unit token: rich content | units
  if (cells.length === 2 && toUnit(second.textContent)) {
    return { type: 'rich', node: first, unit: toUnit(second.textContent) };
  }
  if (cells.length === 1) return { type: 'rich', node: first, unit: null };

  const unit = toUnit(third?.textContent);
  const label = first.textContent.trim();
  const listValue = second?.querySelector('ul, ol, h1, h2, h3, h4, h5, h6');
  if (!label || /^equipment$/i.test(label)) {
    return { type: 'rich', node: second, unit };
  }
  if (listValue) {
    return {
      type: 'rich', node: second, unit, title: label,
    };
  }
  return {
    type: 'row', label: first, value: second, unit,
  };
}

/** -> [{ title, groups: [{ title, items: [] }] }] */
function buildModel(block) {
  const tabs = [];
  let tab = null;
  let group = null;
  const ensureTab = () => {
    if (!tab) {
      tab = { title: '', groups: [] };
      tabs.push(tab);
    }
    return tab;
  };
  const ensureGroup = () => {
    if (!group) {
      group = { title: '', items: [] };
      ensureTab().groups.push(group);
    }
    return group;
  };

  [...block.children].forEach((row) => {
    if (isEmpty(row)) return;
    const item = parseRow(row);
    if (item.type === 'heading' && item.level <= 3) {
      tab = { title: item.text, groups: [] };
      tabs.push(tab);
      group = null;
    } else if (item.type === 'heading' && item.level === 4) {
      group = { title: item.text, items: [] };
      ensureTab().groups.push(group);
    } else if (item.type === 'heading') {
      ensureGroup().items.push({ type: 'sub', text: item.text });
    } else {
      ensureGroup().items.push(item);
    }
  });
  return tabs.filter((t) => t.groups.some((g) => g.items.length));
}

function renderItem(item) {
  if (item.type === 'sub') return el('h5', 'table-specs-subtitle', item.text);
  if (item.type === 'rich') {
    const node = el('div', 'table-specs-rich');
    if (item.title) node.append(el('h5', 'table-specs-subtitle', item.title));
    node.append(...item.node.childNodes);
    if (item.unit) node.dataset.unit = item.unit;
    return node;
  }
  const label = el('div', 'table-specs-label', ...item.label.childNodes);
  const value = el('div', 'table-specs-value', ...(item.value ? item.value.childNodes : []));
  const row = el('div', 'table-specs-row', label, value);
  if (item.unit) row.dataset.unit = item.unit;
  return row;
}

export default function decorate(block) {
  const tabs = buildModel(block);
  instance += 1;
  const id = `table-specs-${instance}`;
  const units = new Set(tabs.flatMap((t) => t.groups.flatMap((g) => g.items.map((i) => i.unit))));
  const hasBoth = units.has('metric') && units.has('imperial');
  let unit = getUnit('imperial');

  // ---- panels ----
  const groupsAll = [];
  const panels = tabs.map((t, ti) => {
    const panel = el('div', 'table-specs-panel');
    panel.id = `${id}-panel-${ti}`;
    t.groups.forEach((g, gi) => {
      const body = el('div', 'table-specs-group-body', ...g.items.map(renderItem));
      if (!g.title) {
        panel.append(el('div', 'table-specs-group table-specs-group-plain', body));
        return;
      }
      const details = el('details', 'table-specs-group', el('summary', 'table-specs-group-title', g.title), body);
      details.open = gi === 0;
      groupsAll.push({ details, panel });
      panel.append(details);
    });
    return panel;
  });

  // ---- tabs ----
  let tablist = null;
  const tabButtons = [];
  let activeTab = 0;
  const toolbar = el('div', 'table-specs-toolbar');
  const toggleAll = el('button', 'table-specs-toggle-all');
  toggleAll.type = 'button';

  const panelGroups = () => groupsAll.filter((g) => g.panel === panels[activeTab]);
  const syncToggleAll = () => {
    const groups = panelGroups();
    toggleAll.hidden = !groups.length;
    const allOpen = groups.length && groups.every((g) => g.details.open);
    toggleAll.textContent = allOpen ? LABELS.collapse : LABELS.expand;
    toggleAll.setAttribute('aria-expanded', String(Boolean(allOpen)));
  };

  const selectTab = (index, focus = false) => {
    activeTab = index;
    panels.forEach((p, i) => { p.hidden = i !== index; });
    tabButtons.forEach((b, i) => {
      b.setAttribute('aria-selected', String(i === index));
      b.tabIndex = i === index ? 0 : -1;
    });
    if (focus) tabButtons[index]?.focus();
    syncToggleAll();
  };

  if (tabs.length > 1) {
    tablist = el('div', 'table-specs-tabs');
    tablist.setAttribute('role', 'tablist');
    tabs.forEach((t, i) => {
      const btn = el('button', 'table-specs-tab', t.title);
      btn.type = 'button';
      btn.id = `${id}-tab-${i}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-controls', panels[i].id);
      panels[i].setAttribute('role', 'tabpanel');
      panels[i].setAttribute('aria-labelledby', btn.id);
      btn.addEventListener('click', () => selectTab(i));
      tabButtons.push(btn);
      tablist.append(btn);
    });
    tablist.addEventListener('keydown', (e) => {
      const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      selectTab((activeTab + step + tabs.length) % tabs.length, true);
    });
  }

  // ---- units ----
  const applyUnit = () => {
    block.dataset.unit = unit;
    block.querySelectorAll('.table-specs-row[data-unit], .table-specs-rich[data-unit]').forEach((n) => {
      n.hidden = n.dataset.unit !== unit;
    });
    // drop groups/sub-titles left without visible rows for this unit
    block.querySelectorAll('.table-specs-group').forEach((g) => {
      g.hidden = !g.querySelector('.table-specs-row:not([hidden]), .table-specs-rich:not([hidden])');
    });
  };
  if (hasBoth) {
    toolbar.append(createUnitSwitch({ unit }));
    onUnitChange((u) => {
      if (u === unit) return;
      unit = u;
      applyUnit();
    });
  }
  toolbar.append(toggleAll);

  toggleAll.addEventListener('click', () => {
    const groups = panelGroups();
    const open = !groups.every((g) => g.details.open);
    groups.forEach((g) => { g.details.open = open; });
    syncToggleAll();
  });
  groupsAll.forEach((g) => g.details.addEventListener('toggle', syncToggleAll));

  block.replaceChildren(...[tablist, toolbar, ...panels].filter(Boolean));
  applyUnit();
  selectTab(0);
}
