import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

// compact: content-height category banner (blue fallback bg, regular-weight title)
const OPTION_CLASSES = ['compact'];

/**
 * Hero Banner: full-bleed background image with centered heading, text and CTA.
 * Content contract:
 *   Row 1: background image
 *   Row 2: heading, paragraph(s), CTA link
 * Tolerates the rows arriving in either order, or a single row holding everything.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const rows = [...block.children];
  const picture = block.querySelector('picture');

  const media = document.createElement('div');
  media.className = 'hero-banner-media';
  const content = document.createElement('div');
  content.className = 'hero-banner-content';

  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, true, [
        { media: '(min-width: 1200px)', width: '2400' },
        { media: '(min-width: 600px)', width: '1600' },
        { width: '900' },
      ]);
      moveInstrumentation(img, optimized.querySelector('img'));
      const holder = picture.parentElement?.tagName === 'P' ? picture.parentElement : picture;
      holder.replaceWith(optimized);
      media.append(optimized);
    }
  }

  rows.forEach((row) => {
    [...row.children].forEach((cell) => {
      // skip cells that only held the image
      if (!cell.textContent.trim() && !cell.querySelector('a, h1, h2, h3, h4, h5, h6')) return;
      moveInstrumentation(cell, content);
      while (cell.firstChild) content.append(cell.firstChild);
    });
  });

  // last paragraph link(s) are CTAs
  content.querySelectorAll('a').forEach((a) => {
    const p = a.closest('p');
    if (p && p.textContent.trim() === a.textContent.trim()) {
      p.classList.add('button-container');
      a.classList.add('button');
    }
  });

  block.replaceChildren(...(media.children.length ? [media] : []), content);
}
