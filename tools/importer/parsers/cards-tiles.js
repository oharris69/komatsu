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
 * Generated: 2026-10-12
 */
export default function parse(element, { document }) {
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
