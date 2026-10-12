import { createOptimizedPicture, decorateIcons, getMetadata } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const OPTION_CLASSES = [];

const SAVED_KEY = 'saved-articles';

/**
 * Build an icon span that decorateIcons() turns into /icons/<name>.svg.
 * @param {string} name
 * @returns {HTMLSpanElement}
 */
function icon(name) {
  const span = document.createElement('span');
  span.className = `icon icon-${name}`;
  return span;
}

/**
 * Create a rail list item with a class and children.
 * @param {string} type
 * @param {...Node} children
 * @returns {HTMLLIElement}
 */
function railItem(type, ...children) {
  const li = document.createElement('li');
  li.className = `columns-article-rail-${type}`;
  li.append(...children);
  return li;
}

/**
 * Date item from the publication-date page metadata.
 * @returns {HTMLLIElement|null}
 */
function buildDate() {
  const value = getMetadata('publication-date');
  if (!value) return null;
  const time = document.createElement('time');
  time.textContent = value;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    const pad = (n) => String(n).padStart(2, '0');
    time.dateTime = `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
  }
  return railItem('date', icon('calendar'), time);
}

/**
 * Tags item from the tags (or keywords) page metadata.
 * Edge Delivery renders the `tags` metadata as one `article:tag` meta per tag.
 * @returns {HTMLLIElement|null}
 */
function buildTags() {
  const articleTags = [...document.head.querySelectorAll('meta[property="article:tag"]')]
    .map((m) => m.content);
  const raw = articleTags.length
    ? articleTags.join(',')
    : getMetadata('tags') || getMetadata('keywords');
  const tags = raw.split(',').map((t) => t.trim()).filter(Boolean);
  if (!tags.length) return null;
  const p = document.createElement('p');
  p.textContent = tags.join(', ');
  return railItem('tags', icon('tag'), p);
}

/**
 * Turn one authored row (photo | details) into an author contact item.
 * Tolerates a missing photo cell, a single combined cell, or extra cells.
 * @param {Element} row
 * @returns {HTMLLIElement|null}
 */
function buildAuthor(row) {
  if (!row.textContent.trim() && !row.querySelector('picture, img')) return null;
  const li = railItem('author');
  moveInstrumentation(row, li);

  const photo = document.createElement('div');
  photo.className = 'columns-article-rail-author-photo';
  const details = document.createElement('div');
  details.className = 'columns-article-rail-author-details';

  [...row.children].forEach((cell) => {
    const pic = cell.querySelector('picture');
    if (pic && !photo.children.length) {
      const holder = pic.parentElement?.tagName === 'P' ? pic.parentElement : pic;
      photo.append(pic);
      if (holder !== pic && !holder.textContent.trim()) holder.remove();
    }
    if (cell.textContent.trim()) {
      while (cell.firstChild) details.append(cell.firstChild);
    }
  });

  // tag the detail lines: contact links by scheme, otherwise name then role
  let textIndex = 0;
  [...details.children].forEach((el) => {
    const href = el.querySelector('a')?.getAttribute('href') || '';
    if (href.startsWith('mailto:')) el.classList.add('columns-article-rail-author-email');
    else if (href.startsWith('tel:')) el.classList.add('columns-article-rail-author-phone');
    else if (el.textContent.trim()) {
      el.classList.add(textIndex === 0 ? 'columns-article-rail-author-name' : 'columns-article-rail-author-role');
      textIndex += 1;
    }
  });

  photo.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    img.closest('picture').replaceWith(optimized);
  });

  if (photo.children.length) li.append(photo);
  else li.classList.add('columns-article-rail-author-no-photo');
  li.append(details);
  return li;
}

function readSaved() {
  try {
    const list = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/**
 * Save/Facebook/LinkedIn actions, generated from the page URL.
 * @returns {HTMLLIElement}
 */
function buildShare() {
  const pageUrl = window.location.href.split('#')[0];
  const path = window.location.pathname;
  const title = getMetadata('og:title') || document.title;

  const save = document.createElement('button');
  save.type = 'button';
  save.className = 'columns-article-rail-action columns-article-rail-save';
  save.title = 'Save';
  save.setAttribute('aria-label', 'Save article');
  save.setAttribute('aria-pressed', String(readSaved().includes(path)));
  save.append(icon('bookmark'));
  save.addEventListener('click', () => {
    const saved = readSaved();
    const isSaved = saved.includes(path);
    const next = isSaved ? saved.filter((p) => p !== path) : [...saved, path];
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable; still reflect the toggle for this view
    }
    save.setAttribute('aria-pressed', String(!isSaved));
  });

  const shareLink = (name, label, href) => {
    const a = document.createElement('a');
    a.className = `columns-article-rail-action columns-article-rail-${name}`;
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = label;
    a.setAttribute('aria-label', label);
    a.append(icon(name));
    return a;
  };

  const encoded = encodeURIComponent(pageUrl);
  const facebook = shareLink('facebook', 'Share to Facebook', `https://www.facebook.com/sharer/sharer.php?u=${encoded}`);
  const linkedin = shareLink('linkedin', 'Share to LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}&title=${encodeURIComponent(title)}`);

  return railItem('share', save, facebook, linkedin);
}

/**
 * Render the read-time label above the section's H1 from read-time metadata.
 * Only fills a gap: skipped when the label already exists or no H1 is present.
 * @param {Element} block
 */
function addReadTime(block) {
  const minutes = getMetadata('read-time');
  const section = block.closest('.section');
  if (!minutes || !section || section.querySelector('.columns-article-rail-read-time')) return;
  const h1 = section.querySelector('.default-content-wrapper h1');
  if (!h1) return;
  const p = document.createElement('p');
  p.className = 'columns-article-rail-read-time';
  const label = document.createElement('span');
  label.textContent = /^\d+$/.test(minutes.trim()) ? `${minutes.trim()} min read` : minutes;
  p.append(icon('clock'), label);
  h1.before(p);
  decorateIcons(p);
}

/**
 * Columns Article Rail: article meta/share sidebar.
 * Content contract: one row per author -> photo | name, role, email (mailto), phone (tel).
 * Date, tags and read time come from page metadata; share actions are generated.
 * @param {Element} block
 */
export default function decorate(block) {
  // eslint-disable-next-line no-unused-vars
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  const list = document.createElement('ul');
  list.className = 'columns-article-rail-list';

  const authors = [...block.children].map(buildAuthor).filter(Boolean);
  [buildDate(), ...authors, buildTags(), buildShare()]
    .filter(Boolean)
    .forEach((item) => list.append(item));

  block.replaceChildren(list);
  decorateIcons(block);
  addReadTime(block);
}
