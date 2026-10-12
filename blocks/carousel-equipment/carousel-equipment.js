import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = [];

let carouselId = 0;

/**
 * Number of slides visible at once — read from the CSS custom property so
 * layout and paging stay in sync across breakpoints.
 */
function getPerView(block) {
  const value = parseInt(getComputedStyle(block).getPropertyValue('--carousel-equipment-per-view'), 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function getPageCount(block) {
  const slides = block.querySelectorAll('.carousel-equipment-slide');
  return Math.max(1, Math.ceil(slides.length / getPerView(block)));
}

function updateControls(block) {
  const track = block.querySelector('.carousel-equipment-slides');
  const slides = [...block.querySelectorAll('.carousel-equipment-slide')];
  if (!track || !slides.length) return;

  // step between slides includes the flex gap; dividing by the bare slide width
  // drifts further with every slide and mis-reports the visible range on long strips
  const pitch = (slides.length > 1
    ? slides[1].offsetLeft - slides[0].offsetLeft
    : slides[0].getBoundingClientRect().width) || 1;
  const firstVisible = Math.round(track.scrollLeft / pitch);
  const perView = getPerView(block);
  const pages = getPageCount(block);
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  const page = atEnd ? pages - 1 : Math.min(pages - 1, Math.floor(firstVisible / perView));
  block.dataset.activePage = page;

  slides.forEach((slide, idx) => {
    const visible = idx >= firstVisible && idx < firstVisible + perView;
    slide.setAttribute('aria-hidden', !visible);
    slide.querySelectorAll('a').forEach((a) => {
      if (visible) a.removeAttribute('tabindex');
      else a.setAttribute('tabindex', '-1');
    });
  });

  block.querySelectorAll('.carousel-equipment-indicator button').forEach((btn, idx) => {
    if (idx === page) btn.setAttribute('aria-current', 'true');
    else btn.removeAttribute('aria-current');
  });

  const prev = block.querySelector('.carousel-equipment-prev');
  const next = block.querySelector('.carousel-equipment-next');
  if (prev) prev.disabled = track.scrollLeft <= 1;
  if (next) next.disabled = atEnd;
}

function buildIndicators(block) {
  const list = block.querySelector('.carousel-equipment-indicators');
  if (!list) return;
  const pages = getPageCount(block);
  if (list.children.length === pages) return;
  list.replaceChildren();
  for (let i = 0; i < pages; i += 1) {
    const li = document.createElement('li');
    li.className = 'carousel-equipment-indicator';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Show page ${i + 1} of ${pages}`);
    btn.addEventListener('click', () => {
      // eslint-disable-next-line no-use-before-define
      showPage(block, i);
    });
    li.append(btn);
    list.append(li);
  }
  list.parentElement.hidden = pages < 2;
  block.classList.toggle('carousel-equipment-static', pages < 2);
}

function showPage(block, pageIndex) {
  const track = block.querySelector('.carousel-equipment-slides');
  const slides = block.querySelectorAll('.carousel-equipment-slide');
  const pages = getPageCount(block);
  let page = pageIndex;
  if (page < 0) page = 0;
  if (page >= pages) page = pages - 1;
  const target = slides[Math.min(page * getPerView(block), slides.length - 1)];
  if (!target) return;
  track.scrollTo({ left: target.offsetLeft - track.firstElementChild.offsetLeft, behavior: 'smooth' });
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
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });
  return slide;
}

/**
 * Carousel Equipment: horizontal strip of category tiles (cut-out image + label link),
 * several visible at once, with prev/next arrows and page indicator dots.
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

  const rows = [...block.children].filter((row) => row.children.length || row.textContent.trim());

  const viewport = document.createElement('div');
  viewport.className = 'carousel-equipment-viewport';

  const track = document.createElement('ul');
  track.className = 'carousel-equipment-slides';
  rows.forEach((row, idx) => {
    track.append(createSlide(row, idx, id));
    row.remove();
  });

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-equipment-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.setAttribute('aria-controls', block.id);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-equipment-next';
  next.setAttribute('aria-label', 'Next');
  next.setAttribute('aria-controls', block.id);

  viewport.append(prev, track, next);

  const nav = document.createElement('nav');
  nav.className = 'carousel-equipment-pagination';
  nav.setAttribute('aria-label', 'Carousel pages');
  const indicators = document.createElement('ol');
  indicators.className = 'carousel-equipment-indicators';
  nav.append(indicators);

  block.replaceChildren(viewport, nav);

  prev.addEventListener('click', () => showPage(block, parseInt(block.dataset.activePage || '0', 10) - 1));
  next.addEventListener('click', () => showPage(block, parseInt(block.dataset.activePage || '0', 10) + 1));

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateControls(block);
      ticking = false;
    });
  }, { passive: true });

  const refresh = () => {
    buildIndicators(block);
    updateControls(block);
  };
  if (window.ResizeObserver) new ResizeObserver(refresh).observe(block);
  else window.addEventListener('resize', refresh);
  requestAnimationFrame(refresh);
}
