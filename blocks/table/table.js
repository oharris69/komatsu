/*
 * Table Block
 * Block Collection semantics: one block row per table row, one cell per column.
 * The first row becomes <thead> unless the `no-header` option is set.
 * https://www.aem.live/developer/block-collection/table
 */

const OPTION_CLASSES = ['no-header'];

/**
 * @param {Element} block
 */
export default function decorate(block) {
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  const hasHeader = !active.includes('no-header');

  const rows = [...block.children].filter((row) => row.children.length > 0);
  const columnCount = rows.reduce((max, row) => Math.max(max, row.children.length), 0);

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  rows.forEach((row, i) => {
    const isHeaderRow = hasHeader && i === 0;
    const tr = document.createElement('tr');
    const cells = [...row.children];

    cells.forEach((cell, c) => {
      const el = document.createElement(isHeaderRow ? 'th' : 'td');
      if (isHeaderRow) el.setAttribute('scope', 'col');
      // A short row spans the remaining columns instead of leaving a ragged edge.
      if (c === cells.length - 1 && cells.length < columnCount) {
        el.colSpan = columnCount - cells.length + 1;
      }
      while (cell.firstChild) el.append(cell.firstChild);
      tr.append(el);
    });

    (isHeaderRow ? thead : tbody).append(tr);
  });

  if (thead.children.length) table.append(thead);
  table.append(tbody);

  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';
  // Scrollable region must be keyboard reachable.
  wrapper.tabIndex = 0;
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Table');
  wrapper.append(table);

  block.replaceChildren(wrapper);
}
