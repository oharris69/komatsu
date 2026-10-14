import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = [];

// paging thresholds used by komatsu.com's equipment strip (viewport width)
const PAGE_SIZES = [
  { maxWidth: 1032, perPage: 4 },
  { maxWidth: 1395, perPage: 5 },
];
const WIDE_PER_PAGE = 7;
const SWIPE_THRESHOLD = 40;

const ARROW_PREV = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="15 18 9 12 15 6"></polyline></svg>';
const ARROW_NEXT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><polyline points="9 18 15 12 9 6"></polyline></svg>';

let carouselId = 0;

function getPerPage() {
  const width = window.innerWidth;
  const match = PAGE_SIZES.find((size) => width <= size.maxWidth);
  return match ? match.perPage : WIDE_PER_PAGE;
}

function createSlide(row, idx, id) {
  const slide = document.createElement('li');
  slide.className = 'carousel-equipment-slide';
  slide.id = `carousel-equipment-${id}-slide-${idx}`;
  moveInstrumentation(row, slide);

  [...row.children].forEach((cell) => {
    const hasPicture = cell.querySelector('picture');
    const hasText = cell.textContent.trim() !== '';
    if (hasPicture && !hasText) cell.className = 'carousel-equipment-slide-image';
    else if (hasPicture) {
      // image and label authored in one cell: split them
      const imageCell = document.createElement('div');
      imageCell.className = 'carousel-equipment-slide-image';
      const pic = cell.querySelector('picture');
      const holder = pic.parentElement?.tagName === 'P' ? pic.parentElement : pic;
      imageCell.append(holder);
      slide.append(imageCell);
      cell.className = 'carousel-equipment-slide-label';
    } else cell.className = 'carousel-equipment-slide-label';
    slide.append(cell);
  });

  // the label is a plain text link, not a CTA: undo decorateButtons() (which runs
  // before blocks load) so long labels wrap instead of widening the slide
  slide.querySelectorAll('.carousel-equipment-slide-label .button-container').forEach((p) => {
    p.classList.remove('button-container');
    if (!p.classList.length) p.removeAttribute('class');
  });
  slide.querySelectorAll('.carousel-equipment-slide-label a.button').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary');
    if (!a.classList.length) a.removeAttribute('class');
  });

  // make the whole tile clickable through the label link
  const link = slide.querySelector('.carousel-equipment-slide-label a');
  if (link) slide.classList.add('carousel-equipment-slide-linked');

  slide.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    const newImg = optimized.querySelector('img');
    moveInstrumentation(img, newImg);
    newImg.decoding = 'async';
    img.closest('picture').replaceWith(optimized);
  });
  return slide;
}

function showPage(block, pageIndex) {
  const track = block.querySelector('.carousel-equipment-track');
  const pages = [...track.children];
  if (!pages.length) return;
  // loops at both ends, like the source
  let page = pageIndex;
  if (page < 0) page = pages.length - 1;
  if (page >= pages.length) page = 0;
  block.dataset.activePage = page;
  track.style.transform = `translateX(-${page * 100}%)`;

  pages.forEach((pg, idx) => {
    const active = idx === page;
    pg.toggleAttribute('inert', !active);
    pg.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  block.querySelectorAll('.carousel-equipment-indicator button').forEach((btn, idx) => {
    if (idx === page) btn.setAttribute('aria-current', 'true');
    else btn.removeAttribute('aria-current');
  });
}

/**
 * (Re)group the slides into pages of `perPage` and rebuild the page dots.
 * Keeps the first slide of the current page in view.
 */
function paginate(block, slides) {
  const perPage = getPerPage();
  if (Number(block.dataset.perPage) === perPage) return;
  const previousPerPage = Number(block.dataset.perPage) || perPage;
  const firstVisible = (Number(block.dataset.activePage) || 0) * previousPerPage;
  block.dataset.perPage = perPage;

  const track = block.querySelector('.carousel-equipment-track');
  const pageCount = Math.ceil(slides.length / perPage);
  const pages = [];
  for (let i = 0; i < pageCount; i += 1) {
    const ul = document.createElement('ul');
    ul.className = 'carousel-equipment-page';
    ul.append(...slides.slice(i * perPage, (i + 1) * perPage));
    pages.push(ul);
  }
  track.replaceChildren(...pages);

  const list = block.querySelector('.carousel-equipment-indicators');
  list.replaceChildren();
  pages.forEach((pg, i) => {
    const li = document.createElement('li');
    li.className = 'carousel-equipment-indicator';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Go to page ${i + 1}`);
    btn.addEventListener('click', () => showPage(block, i));
    li.append(btn);
    list.append(li);
  });

  block.classList.toggle('carousel-equipment-static', pageCount < 2);
  showPage(block, Math.floor(firstVisible / perPage));
}

/**
 * Carousel Equipment: horizontal strip of category tiles (cut-out image + label link),
 * shown a page at a time with prev/next arrows and page dots.
 * Content contract: one row per item -> image | linked label.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));
  carouselId += 1;
  const id = carouselId;
  block.id = `carousel-equipment-${id}`;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');
  block.setAttribute('aria-label', 'Equipment categories');

  const rows = [...block.children].filter((row) => row.children.length || row.textContent.trim());
  const slides = rows.map((row, idx) => createSlide(row, idx, id));

  const viewport = document.createElement('div');
  viewport.className = 'carousel-equipment-viewport';
  const track = document.createElement('div');
  track.className = 'carousel-equipment-track';
  track.id = `carousel-equipment-${id}-track`;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) track.style.transition = 'none';
  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-equipment-prev';
  prev.setAttribute('aria-label', 'Previous page');
  prev.setAttribute('aria-controls', track.id);
  prev.innerHTML = ARROW_PREV;

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-equipment-next';
  next.setAttribute('aria-label', 'Next page');
  next.setAttribute('aria-controls', track.id);
  next.innerHTML = ARROW_NEXT;

  const nav = document.createElement('nav');
  nav.className = 'carousel-equipment-pagination';
  nav.setAttribute('aria-label', 'Carousel pages');
  const indicators = document.createElement('ol');
  indicators.className = 'carousel-equipment-indicators';
  nav.append(indicators);

  block.replaceChildren(viewport, nav, prev, next);
  paginate(block, slides);

  const current = () => Number(block.dataset.activePage) || 0;
  prev.addEventListener('click', () => showPage(block, current() - 1));
  next.addEventListener('click', () => showPage(block, current() + 1));

  let touchX = null;
  track.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const delta = touchX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > SWIPE_THRESHOLD) showPage(block, current() + (delta > 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => paginate(block, slides), 100);
  });
}
