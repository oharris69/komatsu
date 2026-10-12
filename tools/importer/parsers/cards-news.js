/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards.
 * Sources: https://www.komatsu.com/en-us (homepage), komatsu.com article pages
 * Instance selectors:
 *   homepage: .relatedarticle .grid.masonry          -> default block (cards-news)
 *   article:  div.relatedarticle div.limit > div.grid -> related variant (cards-news (related))
 *   The variant is chosen from the grid: .masonry keeps the default; any other
 *   related-article grid is emitted as "cards-news (related)" -> class "cards-news related".
 * Structure (DA block table, 2 columns):
 *   one row per article: [ image |
 *     meta paragraph (read time + date), linked heading, tag list ]
 * Excluded: .related_button ("Read more news") is default content - it is kept
 *   after the block rather than inside it.
 * Iteration: keyed on the block wrapper .tile > .item (not the wrapping <a>);
 *   the article href is read from the item or its wrapping <a>.
 *   Hidden tiles (.tile.d-none) are skipped defensively (cleanup normally removes them).
 * Generated: 2026-10-12
 */
export default function parse(element, { document }) {
  let items = Array.from(element.querySelectorAll(':scope > .tile:not(.d-none) > .item'));
  if (!items.length) {
    items = Array.from(element.querySelectorAll('.tile:not(.d-none) .item'));
  }
  if (!items.length) items = Array.from(element.querySelectorAll(':scope > .tile:not(.d-none)'));
  items = items.filter((item) => !item.closest('.d-none'));

  // Homepage masonry grid -> default block; article related grid -> related variant
  const isRelated = !element.classList.contains('masonry');
  const blockName = isRelated ? 'cards-news (related)' : 'cards-news';

  // Default content button that lives inside the grid - preserve outside the block
  const relatedButton = element.querySelector(':scope > .related_button, .related_button');

  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a[href]') || item.closest('a[href]');
    const href = link ? link.getAttribute('href') : null;
    const img = item.querySelector('.image picture') || item.querySelector('.image img');
    const headingEl = item.querySelector('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6')
      || item.querySelector('h1, h2, h3, h4, h5, h6');
    const title = headingEl ? headingEl.textContent.trim() : '';

    // Meta: read time + date
    const readTimeEl = item.querySelector('.pretitle p');
    const readTime = readTimeEl ? readTimeEl.textContent.replace(/\s+/g, ' ').trim() : '';
    const dateEl = item.querySelector('.article-date');
    const date = dateEl ? dateEl.textContent.trim() : '';

    const tags = Array.from(item.querySelectorAll('.content ul li'))
      .map((li) => li.textContent.trim())
      .filter(Boolean);

    if (!img && !title) return;

    const imageCell = img ? [img] : '';

    const textNodes = [];
    const metaParts = [readTime, date].filter(Boolean);
    if (metaParts.length) {
      const p = document.createElement('p');
      p.textContent = metaParts.join(' | ');
      textNodes.push(p);
    }
    if (title) {
      const h = document.createElement(headingEl.tagName.toLowerCase());
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = title;
        h.appendChild(a);
      } else {
        h.textContent = title;
      }
      textNodes.push(h);
    }
    if (tags.length) {
      const ul = document.createElement('ul');
      tags.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        ul.appendChild(li);
      });
      textNodes.push(ul);
    }

    cells.push([imageCell, textNodes.length ? textNodes : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });

  if (relatedButton) {
    const btnLink = relatedButton.querySelector('a[href]');
    if (btnLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = btnLink.getAttribute('href');
      a.textContent = btnLink.textContent.replace(/\s+/g, ' ').trim();
      p.appendChild(a);
      element.replaceWith(block, p);
      return;
    }
  }
  element.replaceWith(block);
}
