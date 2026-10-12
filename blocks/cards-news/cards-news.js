import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = ['related'];

// number of leading items rendered as tall, image-overlay feature cards
const FEATURED_COUNT = 2;

/**
 * Tag the parts of a card body: meta line, title, tag list, standalone link.
 * @param {Element} body
 */
function decorateBody(body) {
  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  [...body.children].forEach((el) => {
    if (el === heading) {
      el.classList.add('cards-news-title');
    } else if (el.tagName === 'UL' || el.tagName === 'OL') {
      el.classList.add('cards-news-tags');
    } else if (el.tagName === 'P' && heading
      // eslint-disable-next-line no-bitwise
      && (el.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      el.classList.add('cards-news-meta');
    }
  });
  return heading?.querySelector('a') || body.querySelector('a:not(.cards-news-tags a)');
}

/**
 * Split a "3 min read | Sep 17, 2026" meta line into read-time and date spans.
 * Leaves the line untouched when there is no separator.
 * @param {Element} meta
 */
function splitMeta(meta) {
  if (!meta || meta.children.length) return;
  const parts = meta.textContent.split('|').map((t) => t.trim()).filter(Boolean);
  if (parts.length !== 2) return;
  const [readTime, date] = parts.map((text, i) => {
    const span = document.createElement('span');
    span.className = i === 0 ? 'cards-news-read-time' : 'cards-news-date';
    span.textContent = text;
    return span;
  });
  meta.replaceChildren(readTime, date);
}

/**
 * Cards News: article teasers in a featured + list arrangement.
 * Content contract: one row per article ->
 *   image | read-time + date paragraph, linked heading, tag list.
 * The first two items render as tall overlay cards; the rest as a compact list.
 * Option `related`: equal-width cards, image stacked above the text.
 * @param {Element} block
 */
export default function decorate(block) {
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    if (!row.children.length && !row.textContent.trim()) return;
    const li = document.createElement('li');
    li.className = 'cards-news-card';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      const pic = div.querySelector('picture');
      if (pic && !div.textContent.trim()) {
        div.className = 'cards-news-card-image';
      } else {
        if (pic) {
          const imageDiv = document.createElement('div');
          imageDiv.className = 'cards-news-card-image';
          const holder = pic.parentElement?.tagName === 'P' ? pic.parentElement : pic;
          imageDiv.append(holder);
          li.prepend(imageDiv);
        }
        div.className = 'cards-news-card-body';
      }
    });

    const body = li.querySelector('.cards-news-card-body');
    if (body && decorateBody(body)?.closest('.cards-news-title')) li.classList.add('cards-news-card-linked');
    if (active.includes('related')) splitMeta(li.querySelector('.cards-news-meta'));
    ul.append(li);
  });

  if (!active.includes('related')) {
    [...ul.children].forEach((li, idx) => {
      li.classList.add(idx < FEATURED_COUNT ? 'cards-news-featured' : 'cards-news-compact');
    });
    if (ul.children.length > FEATURED_COUNT) block.classList.add('cards-news-has-list');
  }

  ul.querySelectorAll('picture > img').forEach((img) => {
    const featured = img.closest('.cards-news-featured');
    let width = featured ? '900' : '300';
    if (active.includes('related')) width = '600';
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  block.replaceChildren(ul);
}
