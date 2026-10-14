/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table. Base: table (custom block, blocks/table).
 * Source: komatsu.com article pages, e.g.
 *   https://www.komatsu.com/en-us/blog/2022/choosing-the-right-electric-rope-shovel-for-your-mine
 * Instance selector: #articleRight table
 * Source shape (live DOM, verified): <div class="cmp-text"><table style="..."><tbody><tr><td style="...">
 *   109 mt (120 st) [6]&nbsp;</td>...</tr></tbody></table> - no th/thead, inline styles on table + cells.
 * Output (library convention "Table" / "Table (no header)"; blocks/table/table.js):
 *   one block row per <tr>, one cell per <td>/<th>.
 *   - 'table (no-header)' when the source has no <th>/<thead> (first row is data)
 *   - 'table' otherwise (first row becomes the header)
 *   Rows shorter than the widest row are padded with empty cells.
 * Cell content keeps text + inline formatting only: style/class/width/etc. attributes
 * are stripped, presentational <span>/<font> wrappers unwrapped, &nbsp; normalised.
 * The block is never left inside a <p>: if the source table sits in a paragraph,
 * the paragraph is split around the block.
 * Generated: 2026-10-13
 */

const NBSP = / /g;

function placeOutsideParagraph(block, document) {
  const p = block.parentElement && block.parentElement.closest('p');
  if (!p) return;
  const hasContent = (node) => node.textContent.replace(NBSP, ' ').trim()
    || (node.querySelector && node.querySelector('img, picture, a, video, iframe'));
  const before = document.createRange();
  before.setStart(p, 0);
  before.setEndBefore(block);
  const after = document.createRange();
  after.setStartAfter(block);
  after.setEnd(p, p.childNodes.length);
  const pBefore = document.createElement('p');
  pBefore.append(before.extractContents());
  const pAfter = document.createElement('p');
  pAfter.append(after.extractContents());
  const out = [];
  if (hasContent(pBefore)) out.push(pBefore);
  out.push(block);
  if (hasContent(pAfter)) out.push(pAfter);
  p.replaceWith(...out);
}

function cleanCell(cell, document) {
  // Unwrap presentational wrappers (keep their children).
  cell.querySelectorAll('span, font').forEach((el) => el.replaceWith(...el.childNodes));
  // Strip all attributes except link/image essentials.
  const keep = { A: ['href', 'title'], IMG: ['src', 'alt'] };
  cell.querySelectorAll('*').forEach((el) => {
    const allowed = keep[el.tagName] || [];
    [...el.attributes].forEach((attr) => {
      if (!allowed.includes(attr.name)) el.removeAttribute(attr.name);
    });
  });
  // Normalise &nbsp; and collapse whitespace in text nodes.
  const walker = document.createTreeWalker(cell, 4 /* NodeFilter.SHOW_TEXT */);
  const texts = [];
  while (walker.nextNode()) texts.push(walker.currentNode);
  texts.forEach((t) => {
    t.textContent = t.textContent.replace(NBSP, ' ').replace(/\s+/g, ' ');
  });
  // Trim leading/trailing whitespace of the cell.
  const first = cell.firstChild;
  if (first && first.nodeType === 3) first.textContent = first.textContent.replace(/^\s+/, '');
  const last = cell.lastChild;
  if (last && last.nodeType === 3) last.textContent = last.textContent.replace(/\s+$/, '');
  const nodes = [...cell.childNodes].filter((n) => n.nodeType !== 3 || n.textContent !== '');
  if (!nodes.length || (!cell.textContent.trim() && !cell.querySelector('img, picture'))) return '';
  return nodes;
}

export default function parse(element, { document }) {
  // Nested tables are handled as content of their outer table's cell.
  if (element.parentElement && element.parentElement.closest('table')) return;

  // Rows that belong to this table only (not to a nested table).
  const rows = [...element.querySelectorAll('tr')].filter((tr) => tr.closest('table') === element);
  const hasHeader = !!(
    element.querySelector(':scope > thead')
    || rows.some((tr) => [...tr.children].some((c) => c.tagName === 'TH'))
  );

  const cells = [];
  rows.forEach((tr) => {
    const rowCells = [...tr.children]
      .filter((c) => c.tagName === 'TD' || c.tagName === 'TH')
      .map((c) => cleanCell(c, document));
    if (rowCells.length) cells.push(rowCells);
  });

  if (!cells.length || cells.every((row) => row.every((c) => c === ''))) {
    // Empty table: nothing to author.
    element.remove();
    return;
  }

  // Pad short rows so the block table stays rectangular.
  const width = cells.reduce((max, row) => Math.max(max, row.length), 0);
  cells.forEach((row) => {
    while (row.length < width) row.push('');
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: hasHeader ? 'table' : 'table (no-header)',
    cells,
  });
  element.replaceWith(block);
  placeOutsideParagraph(block, document);
}
