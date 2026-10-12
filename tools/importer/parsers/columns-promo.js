/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo. Base: columns.
 * Source: https://www.komatsu.com/en-us
 * Instance selector: .cmp-experiencefragment--parts-promo .promoblock
 * Structure (DA block table): one row, 2 columns: [ text panel (h2, paragraph, CTA) | image ]
 * Generated: 2026-10-12
 */
export default function parse(element, { document }) {
  const textCol = element.querySelector('.promo_block--col.content, .promo_block--text');
  const imageCol = element.querySelector('.promo_block--col.image, .promo_block--img');

  const scope = textCol || element;
  const heading = scope.querySelector('h1, h2, h3, h4, h5, h6');
  const paragraphs = Array.from(scope.querySelectorAll('p')).filter((p) => p.textContent.trim() && !p.closest('.button'));
  const ctas = Array.from(scope.querySelectorAll('.button a, a.cmp-button'))
    .filter((a, i, arr) => arr.indexOf(a) === i);

  const image = (imageCol && (imageCol.querySelector('picture') || imageCol.querySelector('img')))
    || element.querySelector('picture, img');

  if (!heading && !paragraphs.length && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const textCell = [];
  if (heading) textCell.push(heading);
  textCell.push(...paragraphs);
  ctas.forEach((a) => {
    // Drop screen-reader-only helper text ("opens in a new tab")
    const label = a.querySelector('.cmp-button__buttontext');
    const text = (label ? label.textContent : a.textContent).trim();
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = text;
    p.appendChild(link);
    textCell.push(p);
  });

  const imageCell = image ? [image] : '';

  // Preserve source column order (text first, image second)
  const cells = [[textCell, imageCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
