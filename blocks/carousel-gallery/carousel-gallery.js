import { createOptimizedPicture } from '../../scripts/aem.js';

/*
 * Carousel Gallery
 * One block row per slide: image | caption (caption optional).
 * Single slide visible, prev/next buttons, dot indicators, swipe via scroll-snap.
 * No autoplay.
 */

let instanceCount = 0;

function getCurrentIndex(block) {
  return Number(block.dataset.activeSlide || 0);
}

function updateActive(block, index) {
  const slides = block.querySelectorAll('.carousel-gallery-slide');
  const dots = block.querySelectorAll('.carousel-gallery-indicator button');
  block.dataset.activeSlide = index;

  slides.forEach((slide, i) => {
    const isActive = i === index;
    slide.setAttribute('aria-hidden', String(!isActive));
    slide.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((el) => {
      if (isActive) el.removeAttribute('tabindex');
      else el.setAttribute('tabindex', '-1');
    });
  });

  dots.forEach((dot, i) => {
    if (i === index) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });

  const prev = block.querySelector('.carousel-gallery-prev');
  const next = block.querySelector('.carousel-gallery-next');
  if (prev) prev.disabled = index === 0;
  if (next) next.disabled = index === slides.length - 1;
}

function showSlide(block, index) {
  const slides = block.querySelectorAll('.carousel-gallery-slide');
  if (!slides.length) return;
  const target = Math.max(0, Math.min(index, slides.length - 1));
  const track = block.querySelector('.carousel-gallery-slides');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  track.scrollTo({
    left: slides[target].offsetLeft - track.offsetLeft,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
  updateActive(block, target);
}

function buildSlide(row, index, total) {
  const li = document.createElement('li');
  li.className = 'carousel-gallery-slide';
  li.setAttribute('role', 'group');
  li.setAttribute('aria-roledescription', 'slide');
  li.setAttribute('aria-label', `${index + 1} of ${total}`);

  const figure = document.createElement('figure');
  figure.className = 'carousel-gallery-figure';

  const cells = [...row.children];
  const imageCell = cells.find((cell) => cell.querySelector('picture, img')) || cells[0];
  const captionCells = cells.filter((cell) => cell !== imageCell && cell.textContent.trim());

  const media = document.createElement('div');
  media.className = 'carousel-gallery-image';
  const img = imageCell?.querySelector('img');
  if (img) {
    const picture = createOptimizedPicture(img.src, img.alt || '', index === 0, [{ width: '1200' }]);
    media.append(picture);
  } else if (imageCell) {
    while (imageCell.firstChild) media.append(imageCell.firstChild);
  }
  figure.append(media);

  // Text in the image cell (besides the picture) is treated as caption too.
  if (imageCell && img) {
    const extra = [...imageCell.children].filter((el) => !el.querySelector('picture, img') && el.tagName !== 'PICTURE' && el.textContent.trim());
    if (extra.length) {
      const holder = document.createElement('div');
      extra.forEach((el) => holder.append(el));
      captionCells.unshift(holder);
    }
  }

  if (captionCells.length) {
    const caption = document.createElement('figcaption');
    caption.className = 'carousel-gallery-caption';
    captionCells.forEach((cell) => {
      while (cell.firstChild) caption.append(cell.firstChild);
    });
    figure.append(caption);
  }

  li.append(figure);
  return li;
}

export default function decorate(block) {
  instanceCount += 1;
  const id = `carousel-gallery-${instanceCount}`;
  const rows = [...block.children].filter((row) => row.textContent.trim() || row.querySelector('picture, img'));
  const total = rows.length;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (!block.hasAttribute('aria-label')) block.setAttribute('aria-label', 'Image gallery');

  const container = document.createElement('div');
  container.className = 'carousel-gallery-slides-container';

  const track = document.createElement('ul');
  track.className = 'carousel-gallery-slides';
  track.id = `${id}-slides`;
  track.setAttribute('aria-live', 'polite');
  rows.forEach((row, i) => track.append(buildSlide(row, i, total)));
  container.append(track);

  block.replaceChildren(container);

  if (total < 2) {
    block.classList.add('carousel-gallery-single');
    return;
  }

  const controls = document.createElement('div');
  controls.className = 'carousel-gallery-controls';

  const makeArrow = (cls, label) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = cls;
    btn.setAttribute('aria-controls', `${id}-slides`);
    btn.setAttribute('aria-label', label);
    return btn;
  };
  const prev = makeArrow('carousel-gallery-prev', 'Previous slide');
  const next = makeArrow('carousel-gallery-next', 'Next slide');

  const indicators = document.createElement('ol');
  indicators.className = 'carousel-gallery-indicators';
  indicators.setAttribute('aria-label', 'Choose slide to display');
  for (let i = 0; i < total; i += 1) {
    const li = document.createElement('li');
    li.className = 'carousel-gallery-indicator';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-controls', `${id}-slides`);
    btn.setAttribute('aria-label', `Show slide ${i + 1} of ${total}`);
    btn.addEventListener('click', () => showSlide(block, i));
    li.append(btn);
    indicators.append(li);
  }

  controls.append(prev, indicators, next);
  block.append(controls);

  prev.addEventListener('click', () => showSlide(block, getCurrentIndex(block) - 1));
  next.addEventListener('click', () => showSlide(block, getCurrentIndex(block) + 1));

  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      showSlide(block, getCurrentIndex(block) - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      showSlide(block, getCurrentIndex(block) + 1);
    }
  });

  // Keep state in sync when the user swipes/scrolls (scroll-snap).
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const slides = [...track.children];
        updateActive(block, slides.indexOf(entry.target));
      }
    });
  }, { root: track, threshold: 0.6 });
  [...track.children].forEach((slide) => observer.observe(slide));

  updateActive(block, 0);
}
