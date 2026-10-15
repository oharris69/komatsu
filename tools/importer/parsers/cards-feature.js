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
 * equipment-model-detail (2026-10-15), see parseFeatures / parseOutlined below:
 *   .featuresandbenefits .features-and-benefits -> default "cards-feature" [ image | H3 + full text
 *     from data-fulltext ("Read more" toggles dropped) ]
 *   .cardscontainer .cards-container (noImage)  -> "cards-feature (outlined)" [ H3 + p + link ]
 * Generated: 2026-10-13
 */
const fClean = (s) => String(s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();

// Features grid (equipment-model-detail): .features-and-benefits > .features-and-benefits__cards
//   > .features-and-benefits__card > picture + h3 + p.fab-text[data-fulltext] (+ button.fab-inline-toggle)
// Output: default cards-feature rows [ image | H3 + full description paragraph ] (Cards, 2 columns).
function parseFeatures(element, document) {
  const cards = Array.from(element.querySelectorAll('.features-and-benefits__card'));
  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('picture') || card.querySelector('img');
    const titleEl = card.querySelector('h1, h2, h3, h4, h5, h6');
    const textEls = Array.from(card.querySelectorAll('p'))
      .filter((p) => !p.closest('button') && (p.getAttribute('data-fulltext') || p.textContent.trim()));
    if (!img && !titleEl && !textEls.length) return;

    const textCell = [];
    if (titleEl && fClean(titleEl.textContent)) {
      const h = document.createElement('h3');
      h.textContent = fClean(titleEl.textContent);
      textCell.push(h);
    }
    textEls.forEach((src) => {
      // data-fulltext = untruncated copy (visible text can be cut to "... Read more")
      const full = fClean(src.getAttribute('data-fulltext'));
      const p = document.createElement('p');
      if (full) {
        p.textContent = full;
      } else {
        const c = src.cloneNode(true);
        c.querySelectorAll('button, .fab-inline-toggle').forEach((b) => b.remove());
        p.textContent = fClean(c.textContent).replace(/\s*(\.{3}|…)?\s*Read more$/i, '');
      }
      if (p.textContent) textCell.push(p);
    });
    cells.push([img ? [img] : '', textCell.length ? textCell : '']);
  });
  return cells;
}

// Outlined text-only cards (equipment-model-detail "Support you can count on"):
//   .cards-container.noImage > .cards-row > .card > a.card-thumbnail-wrapper[href]
//     > .card-wrapper > h5.card-title + p + .button > span.cmp-button "Learn more"
// Iteration is keyed on the block-level .card-wrapper (never the wrapping anchors);
// the link is read off the wrapper anchor. Output (Cards "no images", 1 column):
//   [ H3 + paragraph(s) + link ]
function parseOutlined(element, document) {
  let bodies = Array.from(element.querySelectorAll('.card .card-wrapper'));
  if (!bodies.length) bodies = Array.from(element.querySelectorAll('.card'));
  const cells = [];
  bodies.forEach((body) => {
    const titleEl = body.querySelector('.card-title, h1, h2, h3, h4, h5, h6');
    const desc = Array.from(body.querySelectorAll('p'))
      .filter((p) => fClean(p.textContent) && !p.closest('.button'));
    const wrapLink = body.closest('a[href]') || body.querySelector('a[href]');
    const btn = body.querySelector('.button .cmp-button__buttontext, .button a, .button');
    if (!titleEl && !desc.length) return;

    const cell = [];
    if (titleEl) {
      const h = document.createElement('h3');
      h.textContent = fClean(titleEl.textContent);
      cell.push(h);
    }
    desc.forEach((d) => {
      const p = document.createElement('p');
      p.textContent = fClean(d.textContent);
      cell.push(p);
    });
    const href = wrapLink ? wrapLink.getAttribute('href') : '';
    if (href) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = fClean(btn && btn.textContent) || 'Learn more';
      p.append(a);
      cell.push(p);
    }
    cells.push([cell]);
  });
  return cells;
}

export default function parse(element, { document }) {
  if (element.classList.contains('features-and-benefits') || element.querySelector(':scope > .features-and-benefits__cards')) {
    const cells = parseFeatures(element, document);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
    element.replaceWith(block);
    return;
  }

  // Model pages: the instance is the whole .cards-container; text-only cards -> outlined
  if (element.classList.contains('cards-container')
    && (element.classList.contains('noImage') || !element.querySelector('.card img, .card picture'))) {
    const cells = parseOutlined(element, document);
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature (outlined)', cells });
    element.replaceWith(block);
    return;
  }

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
