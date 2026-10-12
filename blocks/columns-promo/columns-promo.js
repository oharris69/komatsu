import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = [];

/**
 * Columns Promo: split promo banner — text panel (heading, text, CTA) beside a photo.
 * Content contract: 1 row -> heading + paragraph + CTA | image.
 * Either column order is accepted; the image column is detected, not assumed.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  block.classList.add(`columns-promo-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    row.classList.add('columns-promo-row');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const onlyImage = pic && !col.textContent.trim();
      if (onlyImage) {
        col.classList.add('columns-promo-img-col');
        const img = pic.querySelector('img');
        if (img) {
          const optimized = createOptimizedPicture(img.src, img.alt, false, [
            { media: '(min-width: 900px)', width: '1600' },
            { width: '900' },
          ]);
          moveInstrumentation(img, optimized.querySelector('img'));
          pic.replaceWith(optimized);
        }
      } else {
        col.classList.add('columns-promo-text-col');
        col.querySelectorAll('p').forEach((p) => {
          const a = p.querySelector('a');
          if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
            p.classList.add('button-container');
            a.classList.add('button');
          }
        });
      }
    });
    if (row.querySelector('.columns-promo-img-col') && row.firstElementChild?.classList.contains('columns-promo-img-col')) {
      row.classList.add('columns-promo-image-first');
    }
  });
}
