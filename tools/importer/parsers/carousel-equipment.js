/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-equipment. Base: carousel.
 * Source: https://www.komatsu.com/en-us
 * Instance selector: .tilesmall.horizontal_scroll
 * Structure (DA block table, 2 columns):
 *   one row per slide: [ image | linked label paragraph (+ optional description) ]
 * Iteration: keyed on the inner block wrapper .tiles_content (not the wrapping <a>)
 * so the importer's inline-element merging cannot collapse items.
 * Generated: 2026-10-12
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll('.tiles_column .tiles_content'));
  if (!items.length) items = Array.from(element.querySelectorAll('.tiles_column'));

  const cells = [];

  items.forEach((item) => {
    // Link may live on the wrapping <a> around .tiles_content
    const link = item.querySelector('a[href]') || item.closest('a[href]');
    const href = link ? link.getAttribute('href') : null;
    const img = item.querySelector('picture') || item.querySelector('img.tiles_image, img');
    const titleEl = item.querySelector('.tiles_title, h1, h2, h3, h4, h5, h6');
    const title = titleEl ? titleEl.textContent.trim() : '';
    const desc = Array.from(item.querySelectorAll('.tiles_details p')).filter((p) => p.textContent.trim());

    if (!img && !title) return;

    const imageCell = img ? [img] : '';

    const textCell = [];
    if (title) {
      const p = document.createElement('p');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        p.appendChild(a);
      } else {
        p.textContent = title;
      }
      textCell.push(p);
    }
    textCell.push(...desc);

    cells.push([imageCell, textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-equipment', cells });
  element.replaceWith(block);
}
