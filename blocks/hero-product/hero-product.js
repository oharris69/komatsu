import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import {
  createUnitSwitch, getUnit, onUnitChange, toUnit,
} from '../../scripts/units.js';

/*
 * Hero Product: equipment model page header.
 * Rows (first cell = key): images | intro | spec (Label | Value | Units) | actions.
 */

const el = (tag, className, ...children) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.append(...children.filter(Boolean));
  return node;
};

function readRows(block) {
  const rows = {
    images: [], intro: null, specs: [], actions: null,
  };
  [...block.children].forEach((row) => {
    const [keyCell, ...cells] = [...row.children];
    if (!keyCell) return;
    const key = keyCell.textContent.trim().toLowerCase();
    if (key === 'images' || key === 'image' || key === 'gallery') {
      cells.forEach((c) => rows.images.push(...c.querySelectorAll('img')));
    } else if (key === 'intro') {
      [rows.intro] = cells;
    } else if (key === 'spec' || key === 'specs') {
      const [labelCell, valueCell, unitCell] = cells;
      const label = labelCell?.textContent.trim();
      if (!label) return;
      rows.specs.push({
        label,
        value: valueCell ? valueCell.innerHTML.trim() : '',
        unit: toUnit(unitCell?.textContent),
      });
    } else if (key === 'actions' || key === 'purchase options') {
      [rows.actions] = cells;
    }
  });
  return rows;
}

function buildGallery(images, name) {
  if (!images.length) return null;
  const alt = (img) => img.alt || name || '';
  const slides = images.map((img, i) => {
    const pic = createOptimizedPicture(img.src, alt(img), i === 0, [
      { media: '(min-width: 900px)', width: '1200' },
      { width: '750' },
    ]);
    moveInstrumentation(img, pic.querySelector('img'));
    const slide = el('li', 'hero-product-slide', pic);
    slide.hidden = i !== 0;
    return slide;
  });
  const stage = el('ul', 'hero-product-stage', ...slides);
  const gallery = el('div', 'hero-product-gallery', stage);
  if (images.length < 2) return gallery;

  const thumbs = images.map((img, i) => {
    const btn = el('button', 'hero-product-thumb', createOptimizedPicture(img.src, '', false, [{ width: '150' }]));
    btn.type = 'button';
    btn.setAttribute('aria-label', `${alt(img) || 'Image'} ${i + 1} / ${images.length}`);
    btn.setAttribute('aria-current', String(i === 0));
    return btn;
  });
  const prev = el('button', 'hero-product-nav hero-product-prev');
  const next = el('button', 'hero-product-nav hero-product-next');
  prev.type = 'button';
  next.type = 'button';
  prev.setAttribute('aria-label', 'Previous image');
  next.setAttribute('aria-label', 'Next image');

  let active = 0;
  const show = (index) => {
    active = (index + images.length) % images.length;
    slides.forEach((s, i) => { s.hidden = i !== active; });
    thumbs.forEach((t, i) => t.setAttribute('aria-current', String(i === active)));
  };
  prev.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));
  thumbs.forEach((t, i) => t.addEventListener('click', () => show(i)));

  stage.after(el('div', 'hero-product-thumbs', prev, ...thumbs.map((t) => el('div', 'hero-product-thumb-item', t)), next));
  return gallery;
}

function buildIntro(cell) {
  if (!cell) return null;
  const intro = el('div', 'hero-product-intro');
  const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
  let seenHeading = false;
  [...cell.children].forEach((child) => {
    if (child === heading) {
      seenHeading = true;
      child.classList.add('hero-product-title');
    } else if (child.tagName === 'P') {
      child.classList.add(seenHeading || !heading ? 'hero-product-subtitle' : 'hero-product-eyebrow');
    }
    intro.append(child);
  });
  return intro;
}

function buildSpecs(specs, block) {
  if (!specs.length) return null;
  const hasBoth = specs.some((s) => s.unit === 'metric') && specs.some((s) => s.unit === 'imperial');
  // no authored Units key on this block: imperial (US) unless the page preference says otherwise
  let unit = getUnit('imperial');
  const list = el('dl', 'hero-product-specs');
  const render = () => {
    list.replaceChildren(...specs.filter((s) => !s.unit || !hasBoth || s.unit === unit).map((s) => {
      const dd = el('dd');
      dd.innerHTML = s.value;
      return el('div', 'hero-product-spec', el('dt', '', s.label), dd);
    }));
    block.dataset.unit = unit;
  };
  render();
  const wrap = el('div', 'hero-product-specs-wrap');
  if (hasBoth) {
    wrap.append(createUnitSwitch({ unit }));
    onUnitChange((u) => {
      if (u === unit) return;
      unit = u;
      render();
    });
  }
  wrap.append(list);
  return wrap;
}

function buildActions(cell) {
  if (!cell) return null;
  const box = el('div', 'hero-product-actions');
  const buttons = el('div', 'hero-product-buttons');
  [...cell.children].forEach((child) => {
    if (child.querySelector('a')) {
      child.querySelectorAll('a').forEach((a) => {
        a.classList.add('button');
        // strong = primary (filled), anything else = secondary (outlined)
        if (a.closest('strong') || a.classList.contains('primary')) a.classList.add('primary');
      });
      buttons.append(child);
    } else if (child.textContent.trim()) {
      child.classList.add('hero-product-actions-title');
      box.append(child);
    }
  });
  if (buttons.children.length) box.append(buttons);
  return box.children.length ? box : null;
}

export default function decorate(block) {
  const rows = readRows(block);
  const intro = buildIntro(rows.intro);
  const name = intro?.querySelector('.hero-product-title')?.textContent.trim();
  const gallery = buildGallery(rows.images, name);
  const info = el(
    'div',
    'hero-product-info',
    intro,
    buildSpecs(rows.specs, block),
    buildActions(rows.actions),
  );
  block.replaceChildren(...[gallery, info].filter(Boolean));
  if (!gallery) block.classList.add('hero-product-no-gallery');
}
