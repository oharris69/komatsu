/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.komatsu.com/en-us/technology/smart-construction
 * Instance selector: .cardscontainer .cards-container .cards-row
 *   (JS-rendered: empty in the static HTML, 2 cards in the rendered/live DOM)
 * Structure (DA block table, 2 columns, library Cards convention): one row per card
 *   [ image | title heading + description paragraph(s) + "Learn more" CTA link ]
 * Iteration: keyed on the block-level div.card wrapper, never on the repeated
 *   a.card-thumbnail-wrapper anchors (adjacent same-href anchors can be merged by
 *   the importer's inline-element preprocessing).
 * Excluded: section heading h2 / p.card-description above the row (default content).
 * Generated: 2026-10-13
 */
export default function parse(element, { document }) {
  let cards = Array.from(element.querySelectorAll(':scope > .card'));
  if (!cards.length) cards = Array.from(element.querySelectorAll('.card'));

  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('picture') || card.querySelector('img.card-thumbnail, img');
    const titleEl = card.querySelector('.card-title, h1, h2, h3, h4, h5, h6');
    const body = card.querySelector('.card-wrapper') || card;
    const desc = Array.from(body.querySelectorAll('p'))
      .filter((p) => p.textContent.trim() && !p.closest('.button'));

    // CTA: the visible button link (skip the empty overlay anchor next to it)
    const ctaEl = Array.from(card.querySelectorAll('.button a[href], a.cmp-button[href]'))
      .find((a) => a.textContent.trim());

    if (!img && !titleEl && !desc.length) return;

    const textCell = [];
    if (titleEl) {
      const h = document.createElement(/^H[1-6]$/.test(titleEl.tagName) ? titleEl.tagName.toLowerCase() : 'h3');
      h.textContent = titleEl.textContent.trim();
      textCell.push(h);
    }
    textCell.push(...desc);
    if (ctaEl) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaEl.getAttribute('href');
      a.textContent = (ctaEl.querySelector('.cmp-button__buttontext') || ctaEl).textContent.trim();
      p.append(a);
      textCell.push(p);
    }

    cells.push([img ? [img] : '', textCell.length ? textCell : '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
