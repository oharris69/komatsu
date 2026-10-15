import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = ['outlined'];

/**
 * Cards Feature: a small, centered set of feature cards — image on top,
 * then title, text and an outlined CTA.
 * Content contract: one row per card -> image | heading + paragraph(s) + CTA link.
 * Image and text authored in a single cell are split automatically.
 * Option `outlined`: text-only bordered cards (one cell: heading + paragraph + CTA link);
 * the CTA renders as the filled (primary) button.
 * @param {Element} block
 */
export default function decorate(block) {
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  const outlined = active.includes('outlined');

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.children.length && !row.textContent.trim()) return;
    const li = document.createElement('li');
    li.className = 'cards-feature-card';
    moveInstrumentation(row, li);

    const image = document.createElement('div');
    image.className = 'cards-feature-card-image';
    const body = document.createElement('div');
    body.className = 'cards-feature-card-body';

    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && !cell.textContent.trim()) {
        while (cell.firstChild) image.append(cell.firstChild);
        return;
      }
      if (pic && !image.children.length) {
        const holder = pic.parentElement?.tagName === 'P' && !pic.parentElement.textContent.trim()
          ? pic.parentElement : pic;
        image.append(holder);
      }
      while (cell.firstChild) body.append(cell.firstChild);
    });

    body.querySelectorAll('p').forEach((p) => {
      const a = p.querySelector('a');
      if (a && p.children.length === 1 && p.textContent.trim() === a.textContent.trim()) {
        p.classList.add('button-container');
        a.classList.add('button');
        if (outlined) a.classList.add('primary');
      }
    });

    if (image.children.length) li.append(image);
    else li.classList.add('cards-feature-card-no-image');
    li.append(body);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
