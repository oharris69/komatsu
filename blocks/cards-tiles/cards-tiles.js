import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = ['solid', 'chips'];

/**
 * Cards Tiles: linked photo tiles with the title overlaid on the image.
 * Content contract: one row per tile -> image | linked heading.
 * Layout is chosen from the tile count: 5 tiles render as a mosaic
 * (1 large + 2x2); any other count renders as an equal-width grid.
 * Option `solid`: image-less link tiles (one cell: linked title) in a dense
 * equal-width grid; never uses the mosaic layout.
 * Option `chips`: text-only link chips (one cell: link) in a wrapping row;
 * never uses the mosaic/grid layouts.
 * @param {Element} block
 */
export default function decorate(block) {
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.children.length && !row.textContent.trim()) return;
    const li = document.createElement('li');
    li.className = 'cards-tiles-card';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      const pic = div.querySelector('picture');
      if (pic && !div.textContent.trim()) {
        div.className = 'cards-tiles-card-image';
      } else if (pic) {
        // image and text authored in one cell: split
        const imageDiv = document.createElement('div');
        imageDiv.className = 'cards-tiles-card-image';
        const holder = pic.parentElement?.tagName === 'P' ? pic.parentElement : pic;
        imageDiv.append(holder);
        li.prepend(imageDiv);
        div.className = 'cards-tiles-card-body';
      } else {
        div.className = 'cards-tiles-card-body';
      }
    });

    if (li.querySelector('.cards-tiles-card-body a')) li.classList.add('cards-tiles-card-linked');
    ul.append(li);
  });

  const count = ul.children.length;
  const chips = active.includes('chips');
  const solid = active.includes('solid');
  const mosaic = count === 5 && !solid && !chips;
  // photo tiles (default variant) get a layout class; solid/chips style off their option class
  if (!solid && !chips) block.classList.add(mosaic ? 'cards-tiles-mosaic' : 'cards-tiles-grid');

  ul.querySelectorAll('picture > img').forEach((img, idx) => {
    const wide = idx === 0 && mosaic;
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: wide ? '1200' : '750' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
